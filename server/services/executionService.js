import vm from 'node:vm';

/**
 * Isolated Sandboxed Execution Engine for JavaScript challenges.
 * Executes user-submitted code within an isolated VM context with strict timeouts,
 * captured stdouts, and assertion test runners.
 */

export async function executeCodeIsolated(files, entryPoint = 'solution.js') {
  const logs = [];
  const startTime = Date.now();

  const customConsole = {
    log: (...args) => logs.push({ type: 'log', text: args.map(formatLog).join(' ') }),
    error: (...args) => logs.push({ type: 'error', text: args.map(formatLog).join(' ') }),
    warn: (...args) => logs.push({ type: 'warn', text: args.map(formatLog).join(' ') }),
    info: (...args) => logs.push({ type: 'info', text: args.map(formatLog).join(' ') }),
  };

  try {
    const targetFile = files.find(f => f.path === entryPoint) || files[0];
    if (!targetFile) throw new Error('No executable file found');

    const moduleMap = buildModuleMap(files);

    const sandbox = createSecureSandbox(moduleMap, customConsole);
    const context = vm.createContext(sandbox);

    const script = new vm.Script(targetFile.code);
    script.runInContext(context, { timeout: 3000 });

    const elapsed = Date.now() - startTime;
    return {
      success: true,
      logs,
      executionTime: `${elapsed}ms`,
    };
  } catch (err) {
    const elapsed = Date.now() - startTime;
    logs.push({ type: 'error', text: `Execution Exception: ${err.message}` });
    return {
      success: false,
      error: err.message,
      logs,
      executionTime: `${elapsed}ms`,
    };
  }
}

export async function evaluateChallengeTests(files, testCases) {
  const results = [];
  const logs = [];
  const moduleMap = buildModuleMap(files);

  for (const tc of testCases) {
    const startTime = Date.now();
    const customConsole = {
      log: (...args) => logs.push(args.map(formatLog).join(' ')),
      error: (...args) => logs.push(args.map(formatLog).join(' ')),
    };

    try {
      const sandbox = createSecureSandbox(moduleMap, customConsole);
      const context = vm.createContext(sandbox);

      const runnerCode = `
        (async () => {
          ${tc.testRunnerCode}
        })()
      `;

      const script = new vm.Script(runnerCode);
      await script.runInContext(context, { timeout: 3500 });

      const elapsed = Date.now() - startTime;
      results.push({
        id: tc.id,
        name: tc.name,
        description: tc.description,
        passed: true,
        executionTime: `${elapsed}ms`,
        hidden: tc.hidden,
      });
    } catch (err) {
      const elapsed = Date.now() - startTime;
      results.push({
        id: tc.id,
        name: tc.name,
        description: tc.description,
        passed: false,
        error: err.message,
        executionTime: `${elapsed}ms`,
        hidden: tc.hidden,
      });
    }
  }

  const passedCount = results.filter(r => r.passed).length;
  const allPassed = passedCount === testCases.length;

  return {
    allPassed,
    passedCount,
    totalCount: testCases.length,
    score: Math.round((passedCount / (testCases.length || 1)) * 100),
    results,
    logs,
  };
}

function buildModuleMap(files) {
  const map = {};
  files.forEach(f => {
    map[f.path] = f.code;
    map['./' + f.path] = f.code;
    const parts = f.path.split('/');
    if (parts.length > 1) {
      map['./' + parts[parts.length - 1]] = f.code;
      map['../' + f.path] = f.code;
    }
  });
  return map;
}

function createSecureSandbox(moduleMap, customConsole) {
  const moduleCache = {};

  const secureRequire = (modulePath) => {
    const clean = modulePath.replace(/^\.\//, '').replace(/^\.\.\//, '');
    const foundKey = Object.keys(moduleMap).find(k => k.includes(clean));

    if (foundKey) {
      if (moduleCache[foundKey]) return moduleCache[foundKey].exports;
      const mod = { exports: {} };
      moduleCache[foundKey] = mod;

      const innerSandbox = {
        require: secureRequire,
        module: mod,
        exports: mod.exports,
        console: customConsole,
        Buffer,
        setTimeout,
        clearTimeout,
      };
      const innerCtx = vm.createContext(innerSandbox);
      const innerScript = new vm.Script(moduleMap[foundKey]);
      innerScript.runInContext(innerCtx, { timeout: 2500 });
      return mod.exports;
    }

    // Safe simulated standard mocks
    if (modulePath === 'express') {
      const app = {
        use: () => app,
        get: () => app,
        post: () => app,
        put: () => app,
        delete: () => app,
      };
      const exp = () => app;
      exp.json = () => (req, res, next) => next?.();
      exp.Router = () => app;
      return exp;
    }

    if (modulePath === 'cors') {
      return () => (req, res, next) => next?.();
    }

    if (modulePath === 'mongoose') {
      return {
        Types: {
          ObjectId: function (id) {
            return { toString: () => id, _id: id, isObjectId: true };
          },
        },
      };
    }

    return {};
  };

  const assert = (condition, message) => {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  };

  return {
    require: secureRequire,
    assert,
    console: customConsole,
    Buffer,
    setTimeout,
    clearTimeout,
    module: { exports: {} },
    exports: {},
    // Strictly block dangerous hosts
    process: undefined,
    global: undefined,
    eval: undefined,
  };
}

function formatLog(item) {
  if (typeof item === 'object') {
    try {
      return JSON.stringify(item, null, 2);
    } catch {
      return String(item);
    }
  }
  return String(item);
}

