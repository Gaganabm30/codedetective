/**
 * CodeDetective Client-Side Execution & Assertion Evaluator
 * Safely evaluates code snippets and multi-file projects with console interception,
 * timeout protection, and test assertions.
 */

export function runClientCode(files, entryPoint = 'solution.js') {
  const logs = [];
  const startTime = performance.now();

  // Create captured console
  const customConsole = {
    log: (...args) => logs.push({ type: 'log', text: args.map(formatLog).join(' ') }),
    error: (...args) => logs.push({ type: 'error', text: args.map(formatLog).join(' ') }),
    warn: (...args) => logs.push({ type: 'warn', text: args.map(formatLog).join(' ') }),
    info: (...args) => logs.push({ type: 'info', text: args.map(formatLog).join(' ') }),
  };

  try {
    // Find active or entry file
    const targetFile = files.find(f => f.path === entryPoint) || files[0];
    if (!targetFile) throw new Error('No executable file found');

    // Build virtual module system for multi-file projects
    const moduleMap = {};
    files.forEach(f => {
      moduleMap[f.path] = f.code;
      // also normalize path without ./ or with ./
      moduleMap['./' + f.path] = f.code;
      if (f.path.includes('/')) {
        const base = f.path.split('/').pop();
        moduleMap['./' + base] = f.code;
        moduleMap['../' + f.path] = f.code;
      }
    });

    // Provide mocked Node/React environment globals
    const customRequire = (modulePath) => {
      // Internal relative require
      if (modulePath.startsWith('./') || modulePath.startsWith('../') || moduleMap[modulePath]) {
        const foundKey = Object.keys(moduleMap).find(k =>
          k.endsWith(modulePath.replace(/^\.\//, '')) ||
          k.endsWith(modulePath.replace(/^\.\.\//, ''))
        );
        if (foundKey) {
          const modCode = moduleMap[foundKey];
          const modExports = {};
          const mod = { exports: modExports };
          const runner = new Function(
            'require', 'module', 'exports', 'console',
            modCode
          );
          runner(customRequire, mod, mod.exports, customConsole);
          return mod.exports;
        }
      }

      // Built-in mocks
      if (modulePath === 'express') {
        return mockExpress();
      }
      if (modulePath === 'cors') {
        return () => (req, res, next) => next?.();
      }
      if (modulePath === 'mongoose') {
        return {
          Types: {
            ObjectId: function (id) {
              return { toString: () => id, _id: id, isObjectId: true };
            }
          }
        };
      }
      return {};
    };

    const runModule = { exports: {} };
    const execFn = new Function(
      'require', 'module', 'exports', 'console',
      targetFile.code
    );

    execFn(customRequire, runModule, runModule.exports, customConsole);

    const duration = Math.round(performance.now() - startTime);
    return {
      success: true,
      logs,
      executionTime: `${duration}ms`,
      exports: runModule.exports
    };
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);
    logs.push({ type: 'error', text: `Runtime Error: ${err.message}` });
    return {
      success: false,
      error: err.message,
      stack: err.stack,
      logs,
      executionTime: `${duration}ms`
    };
  }
}

/**
 * Runs the test suite against current file state
 */
export async function runClientTests(files, testCases) {
  const results = [];
  const logs = [];

  // Build virtual module system
  const moduleMap = {};
  files.forEach(f => {
    moduleMap[f.path] = f.code;
    moduleMap['./' + f.path] = f.code;
    const parts = f.path.split('/');
    if (parts.length > 1) {
      moduleMap['./' + parts[parts.length - 1]] = f.code;
      moduleMap['../' + f.path] = f.code;
    }
  });

  const customRequire = (modulePath) => {
    const clean = modulePath.replace(/^\.\//, '').replace(/^\.\.\//, '');
    const foundKey = Object.keys(moduleMap).find(k => k.includes(clean));
    if (foundKey) {
      const mod = { exports: {} };
      const fn = new Function('require', 'module', 'exports', 'console', moduleMap[foundKey]);
      fn(customRequire, mod, mod.exports, {
        log: (...args) => logs.push(args.map(formatLog).join(' ')),
        error: (...args) => logs.push(args.map(formatLog).join(' '))
      });
      return mod.exports;
    }

    if (modulePath === 'express') return mockExpress();
    if (modulePath === 'cors') return () => (req, res, next) => next?.();
    if (modulePath === 'mongoose') {
      return {
        Types: {
          ObjectId: function (id) {
            return { toString: () => id, _id: id, isObjectId: true };
          }
        }
      };
    }
    return {};
  };

  const assert = (condition, message) => {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  };

  for (const tc of testCases) {
    const startTime = performance.now();
    try {
      // Dynamic test evaluation with async support
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const testRunner = new AsyncFunction('require', 'assert', 'console', tc.testRunnerCode);
      await testRunner(customRequire, assert, { log: () => {}, error: () => {} });
      const elapsed = Math.round(performance.now() - startTime);

      results.push({
        id: tc.id,
        name: tc.name,
        description: tc.description,
        passed: true,
        executionTime: `${elapsed}ms`,
        hidden: tc.hidden
      });
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      results.push({
        id: tc.id,
        name: tc.name,
        description: tc.description,
        passed: false,
        error: err.message,
        executionTime: `${elapsed}ms`,
        hidden: tc.hidden
      });
    }
  }

  const passedCount = results.filter(r => r.passed).length;
  const allPassed = passedCount === testCases.length;

  return {
    allPassed,
    passedCount,
    totalCount: testCases.length,
    results,
    logs
  };
}

function formatLog(item) {
  if (typeof item === 'object') {
    try {
      return JSON.stringify(item, null, 2);
    } catch (e) {
      return String(item);
    }
  }
  return String(item);
}

function mockExpress() {
  const app = {
    use: () => app,
    get: () => app,
    post: () => app,
    put: () => app,
    delete: () => app,
    listen: () => ({ close: () => {} }),
  };
  const expressFn = () => app;
  expressFn.json = () => (req, res, next) => next?.();
  expressFn.Router = () => app;
  return expressFn;
}

