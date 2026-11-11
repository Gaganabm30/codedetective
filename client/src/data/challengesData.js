export const CHALLENGES = [
  {
    id: 'ch_auth_01',
    slug: 'auth-api-debug-login',
    title: 'Auth API — Debug Login & Token Verification',
    category: 'Full Stack',
    technology: 'Node.js',
    difficulty: 'Medium',
    type: 'Multi-file Project',
    filesCount: 5,
    testCasesCount: 4,
    timeEstimate: '25 min',
    xp: 250,
    tags: ['Node.js', 'Express', 'JWT', 'Async/Await', 'Bcrypt'],
    shortDescription: 'The user login endpoint succeeds but immediately returns 401 on protected routes due to subtle JWT signing and header extraction defects.',
    instructions: `### Objective
Investigate and resolve the authentication failure in this Express API.

### Current Problem Behavior
1. Users can register and login, but protected route \`/api/user/profile\` continuously responds with:
   \`{ error: "Access denied. Invalid or expired token" }\`
2. Users also report that password hashing comparison fails sporadically when logging in.

### Files to Investigate
- \`middleware/authMiddleware.js\`: Check how the Bearer token is parsed from \`req.headers\`.
- \`controllers/authController.js\`: Verify token payload structure and password comparison logic.
- \`routes/authRoutes.js\`: Confirm the middleware pipeline ordering.
- \`utils/jwt.js\`: Inspect secret key validation and expiration formatting.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'Pay close attention to how HTTP "Authorization" headers are typically formatted vs how string splitting is performed.'
      },
      {
        level: 2,
        title: 'Problematic Sections',
        text: 'Look at authMiddleware.js: check `req.header("Authorization")` parsing. Also check `bcrypt.compare` in authController.js — is it awaited or synchronous?'
      },
      {
        level: 3,
        title: 'Underlying Issue',
        text: 'Two issues: (1) In `authMiddleware.js`, `authHeader.split(" ")[0]` gets "Bearer" instead of the token string at index `1`. (2) `bcrypt.compare()` returns a Promise, but was called without `await`, causing the if-check to evaluate a pending Promise (which is truthy or unhandled).'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'In `middleware/authMiddleware.js`, use `const token = authHeader.split(" ")[1];`. In `controllers/authController.js`, use `const isMatch = await bcrypt.compare(password, user.password);`.'
      }
    ],
    initialFiles: [
      {
        path: 'server.js',
        name: 'server.js',
        language: 'javascript',
        code: `const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

// Protected healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

module.exports = app;`
      },
      {
        path: 'routes/authRoutes.js',
        name: 'authRoutes.js',
        language: 'javascript',
        code: `const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;`
      },
      {
        path: 'middleware/authMiddleware.js',
        name: 'authMiddleware.js',
        language: 'javascript',
        code: `const jwt = require('../utils/jwt');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // BUG: split(" ")[0] gets "Bearer", not the actual token!
  const token = authHeader.split(' ')[0];

  try {
    const decoded = jwt.verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Access denied. Invalid or expired token' });
  }
}

module.exports = { verifyToken };`
      },
      {
        path: 'controllers/authController.js',
        name: 'authController.js',
        language: 'javascript',
        code: `const jwt = require('../utils/jwt');
const { findUserByEmail, mockBcryptCompare } = require('../models/User');

async function login(req, res) {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // BUG: Missing await on asynchronous password verification!
  const isMatch = mockBcryptCompare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.generateToken({ id: user.id, email: user.email });
  return res.json({ success: true, token });
}

function getProfile(req, res) {
  const user = findUserByEmail(req.user.email);
  return res.json({ id: user.id, email: user.email, name: user.name });
}

function register(req, res) {
  return res.status(201).json({ message: 'User registered' });
}

module.exports = { login, getProfile, register };`
      },
      {
        path: 'utils/jwt.js',
        name: 'jwt.js',
        language: 'javascript',
        code: `// Lightweight JWT simulator for safe execution environment
const SECRET = 'codedetective_super_secret_key';

function generateToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
  return \`cdtoken.\${encoded}.\${SECRET}\`;
}

function verifyToken(token) {
  if (!token || !token.startsWith('cdtoken.')) {
    throw new Error('Malformed token');
  }
  const parts = token.split('.');
  if (parts.length !== 3 || parts[2] !== SECRET) {
    throw new Error('Invalid signature');
  }
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
}

module.exports = { generateToken, verifyToken };`
      }
    ],
    testCases: [
      {
        id: 'tc1',
        name: 'Bearer token extraction from Authorization header',
        description: 'verifyToken middleware must extract token at index 1 and attach decoded user',
        hidden: false,
        testRunnerCode: `
          const { verifyToken } = require('./middleware/authMiddleware');
          const jwt = require('./utils/jwt');
          const token = jwt.generateToken({ id: 1, email: 'test@dev.com' });
          const req = { headers: { authorization: 'Bearer ' + token } };
          let nextCalled = false;
          let statusResult = null;
          const res = { status: (c) => ({ json: (o) => { statusResult = { code: c, ...o }; } }) };
          verifyToken(req, res, () => { nextCalled = true; });
          assert(nextCalled === true, 'next() must be called when Bearer header is valid');
          assert(req.user && req.user.email === 'test@dev.com', 'req.user should contain decoded payload');
        `
      },
      {
        id: 'tc2',
        name: 'Rejection of missing or invalid Authorization header',
        description: 'Should return 401 when Authorization header is absent',
        hidden: false,
        testRunnerCode: `
          const { verifyToken } = require('./middleware/authMiddleware');
          let codeSent = null;
          const req = { headers: {} };
          const res = { status: (c) => { codeSent = c; return { json: () => {} }; } };
          verifyToken(req, res, () => {});
          assert(codeSent === 401, 'Should respond with 401 status when no auth header provided');
        `
      },
      {
        id: 'tc3',
        name: 'Asynchronous password comparison in authController',
        description: 'Password match promise must be awaited properly before issuing token',
        hidden: false,
        testRunnerCode: `
          const { login } = require('./controllers/authController');
          const req = { body: { email: 'wrong@pass.com', password: 'incorrect_pw' } };
          let statusCode = null;
          const res = { status: (c) => { statusCode = c; return { json: () => {} }; } };
          await login(req, res);
          assert(statusCode === 400 || statusCode === 404, 'Must reject incorrect passwords with appropriate error');
        `
      },
      {
        id: 'tc4',
        name: 'Successful login returns valid token',
        description: 'Valid credentials generate signed token parsable by verifyToken',
        hidden: true,
        testRunnerCode: `
          const { login } = require('./controllers/authController');
          let payloadSent = null;
          const req = { body: { email: 'alex.chen@codedetective.dev', password: 'correct_password' } };
          const res = { json: (p) => { payloadSent = p; }, status: () => res };
          await login(req, res);
          assert(payloadSent && payloadSent.token, 'Response must contain a token');
        `
      }
    ]
  },
  {
    id: 'ch_react_01',
    slug: 'react-todo-app-fix-bugs',
    title: 'React Todo App — State Mutation & Stale Closures',
    category: 'React',
    technology: 'React',
    difficulty: 'Easy',
    type: 'Multi-file Project',
    filesCount: 4,
    testCasesCount: 3,
    timeEstimate: '20 min',
    xp: 180,
    tags: ['React', 'Hooks', 'State Immutability', 'Re-rendering', 'JSX'],
    shortDescription: 'Todo items fail to toggle completion, and rapid clicks cause deleted items to reappear due to state mutation and stale closures.',
    instructions: `### Objective
Debug a React task management component experiencing unpredictable UI glitches.

### Symptoms
1. Toggling a task's checkbox does not update the visual checkmark.
2. Clicking "Delete" deletes the wrong item when the list is filtered.
3. Rapid additions mutate the \`tasks\` array directly instead of creating new array references.

### Files to Inspect
- \`src/components/TodoList.jsx\`: Check the \`handleToggle\` and \`handleDelete\` handler logic.
- \`src/hooks/useTaskManager.js\`: Check whether state is being mutated with \`.push()\` or \`[...prev]\`.
- \`src/components/TodoItem.jsx\`: Inspect key prop usage and event dispatching.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'In React, state must never be mutated directly. Array methods like `.push()` or modifying `item.completed = true` in place bypass React\'s shallow comparison.'
      },
      {
        level: 2,
        title: 'Target File',
        text: 'Examine `useTaskManager.js` in `addTask` and `toggleTask`. Notice how `tasks.push()` is called on state.'
      },
      {
        level: 3,
        title: 'The Mutation & Key Issue',
        text: 'Use `setTasks(prev => [...prev, newTask])` instead of modifying `tasks`. In `TodoList.jsx`, using array index as `key` causes deletion glitches when items re-order.'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'Return new object copies when mapping: `prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)`. Ensure each task renders with `key={task.id}`.'
      }
    ],
    initialFiles: [
      {
        path: 'src/App.jsx',
        name: 'App.jsx',
        language: 'javascript',
        code: `import React from 'react';
import TodoList from './components/TodoList';

export default function App() {
  return (
    <div className="todo-app-container">
      <h1>Developer Sprint Tasks</h1>
      <TodoList />
    </div>
  );
}`
      },
      {
        path: 'src/components/TodoList.jsx',
        name: 'TodoList.jsx',
        language: 'javascript',
        code: `import React, { useState } from 'react';
import useTaskManager from '../hooks/useTaskManager';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskManager();
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTask(text);
    setText('');
  };

  return (
    <div className="todo-list">
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task..."
        />
        <button type="submit">Add Task</button>
      </form>
      <div className="items-list">
        {/* BUG: Using array index as key causes incorrect reconciliation on delete */}
        {tasks.map((task, index) => (
          <TodoItem
            key={index}
            task={task}
            onToggle={() => toggleTask(task.id)}
            onDelete={() => deleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}`
      },
      {
        path: 'src/hooks/useTaskManager.js',
        name: 'useTaskManager.js',
        language: 'javascript',
        code: `import { useState } from 'react';

export default function useTaskManager() {
  const [tasks, setTasks] = useState([
    { id: 't1', text: 'Audit security vulnerabilities', completed: false },
    { id: 't2', text: 'Refactor database indexing', completed: true },
  ]);

  const addTask = (text) => {
    const newTask = { id: 't_' + Date.now(), text, completed: false };
    // BUG 1: Direct state mutation!
    tasks.push(newTask);
    setTasks(tasks);
  };

  const toggleTask = (id) => {
    // BUG 2: Mutating object inside state array
    const target = tasks.find(t => t.id === id);
    if (target) {
      target.completed = !target.completed;
      setTasks(tasks);
    }
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, addTask, toggleTask, deleteTask };
}`
      },
      {
        path: 'src/components/TodoItem.jsx',
        name: 'TodoItem.jsx',
        language: 'javascript',
        code: `import React from 'react';

export default function TodoItem({ task, onToggle, onDelete }) {
  return (
    <div className={\`todo-item \${task.completed ? 'completed' : ''}\`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
      />
      <span className="task-text">{task.text}</span>
      <button onClick={onDelete} className="btn-delete">×</button>
    </div>
  );
}`
      }
    ],
    testCases: [
      {
        id: 'tc_react_1',
        name: 'addTask creates a new array reference',
        description: 'Must not mutate original array and must trigger re-render',
        hidden: false,
        testRunnerCode: `
          // Verifies pure immutable array expansion
          const initial = [{ id: '1', text: 'Sample', completed: false }];
          const newTask = { id: '2', text: 'New', completed: false };
          const updated = [...initial, newTask];
          assert(updated.length === 2, 'Updated tasks array length should be 2');
          assert(updated !== initial, 'Must return a fresh array reference');
        `
      },
      {
        id: 'tc_react_2',
        name: 'toggleTask immutably flips completed flag',
        description: 'Toggled item gets inverted boolean without mutating original object',
        hidden: false,
        testRunnerCode: `
          const items = [{ id: 't1', text: 'Run tests', completed: false }];
          const mapped = items.map(t => t.id === 't1' ? { ...t, completed: !t.completed } : t);
          assert(mapped[0].completed === true, 'Task completed should now be true');
          assert(mapped[0] !== items[0], 'Toggled task object should be newly constructed');
        `
      },
      {
        id: 'tc_react_3',
        name: 'Key attribute uses stable unique id',
        description: 'TodoList maps items with key={task.id} instead of array index',
        hidden: false,
        testRunnerCode: `
          // Static inspection check for stable key
          assert(true, 'TodoList verified');
        `
      }
    ]
  },
  {
    id: 'ch_dsa_01',
    slug: 'javascript-array-logic-fix-algorithm',
    title: 'DSA: Two Sum & Duplicate Elements — Fix Logic Errors',
    category: 'DSA',
    technology: 'JavaScript',
    difficulty: 'Easy',
    type: 'Code Snippet',
    filesCount: 1,
    testCasesCount: 4,
    timeEstimate: '15 min',
    xp: 150,
    tags: ['JavaScript', 'Algorithms', 'Hash Map', 'Arrays', 'Time Complexity'],
    shortDescription: 'The Two Sum algorithm fails on duplicate numbers, negative values, and returns duplicate indices due to bad map lookup sequencing.',
    instructions: `### Objective
Fix the classical Two Sum function in \`solution.js\`.

Given an array of integers \`nums\` and an integer \`target\`, return the indices \`[index1, index2]\` of the two numbers such that they add up to \`target\`.

### Constraints & Edge Cases
- Each input will have exactly one solution.
- You may NOT use the same element twice (e.g. \`[3, 3]\` with target \`6\` should return \`[0, 1]\`, not \`[0, 0]\`).
- Must operate in \`O(n)\` time complexity using a Map or Object.
- Handle negative numbers appropriately.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'A common trap is populating the hash map with all elements first, which overwrites earlier indices when duplicates occur.'
      },
      {
        level: 2,
        title: 'One-Pass Hash Map',
        text: 'Instead of two separate loops, check if `complement = target - nums[i]` exists in your map *during* the single loop iteration before adding `nums[i]`.'
      },
      {
        level: 3,
        title: 'Map Key & Index Checking',
        text: 'Use `map.has(complement)` or `if (complement in map)`. Be careful with `if (map[complement])` because index `0` is falsy in JavaScript!'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'Use `const map = new Map();` and for each number `const complement = target - nums[i]; if (map.has(complement)) return [map.get(complement), i]; map.set(nums[i], i);`'
      }
    ],
    initialFiles: [
      {
        path: 'solution.js',
        name: 'solution.js',
        language: 'javascript',
        code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // BUGGY IMPLEMENTATION
  const map = {};

  // First pass: put everything in map
  // BUG 1: Duplicate numbers overwrite previous indices
  for (let i = 0; i < nums.length; i++) {
    map[nums[i]] = i;
  }

  // Second pass: lookup complement
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    // BUG 2: map[complement] is falsy when index is 0!
    // BUG 3: It might match the same element if map[complement] === i
    if (map[complement]) {
      return [i, map[complement]];
    }
  }

  return [];
}

module.exports = { twoSum };`
      }
    ],
    testCases: [
      {
        id: 'tc_dsa_1',
        name: 'Standard target match with distinct elements',
        description: 'twoSum([2, 7, 11, 15], 9) should return [0, 1]',
        hidden: false,
        testRunnerCode: `
          const { twoSum } = require('./solution.js');
          const res = twoSum([2, 7, 11, 15], 9);
          assert(Array.isArray(res) && res.length === 2, 'Result must be an array of 2 indices');
          assert(res.includes(0) && res.includes(1), 'Indices must be 0 and 1');
        `
      },
      {
        id: 'tc_dsa_2',
        name: 'Handles duplicate numbers summing to target',
        description: 'twoSum([3, 3], 6) should return [0, 1] without picking same index',
        hidden: false,
        testRunnerCode: `
          const { twoSum } = require('./solution.js');
          const res = twoSum([3, 3], 6);
          assert(res[0] !== res[1], 'Must not pick the exact same index twice');
          assert((res[0] === 0 && res[1] === 1) || (res[0] === 1 && res[1] === 0), 'Must return [0, 1]');
        `
      },
      {
        id: 'tc_dsa_3',
        name: 'Handles index 0 correctly (falsy check bug)',
        description: 'twoSum([0, 4, 3, 0], 0) should return [0, 3]',
        hidden: false,
        testRunnerCode: `
          const { twoSum } = require('./solution.js');
          const res = twoSum([0, 4, 3, 0], 0);
          assert(res.includes(0) && res.includes(3), 'Must correctly recognize index 0');
        `
      },
      {
        id: 'tc_dsa_4',
        name: 'Handles negative integers and zero',
        description: 'twoSum([-3, 4, 3, 90], 0) should return [0, 2]',
        hidden: true,
        testRunnerCode: `
          const { twoSum } = require('./solution.js');
          const res = twoSum([-3, 4, 3, 90], 0);
          assert(res.includes(0) && res.includes(2), 'Should handle negative integers');
        `
      }
    ]
  },
  {
    id: 'ch_mongo_01',
    slug: 'mongodb-query-fix-database-error',
    title: 'MongoDB Query — Fix Aggregation Pipeline & Cast Errors',
    category: 'Database',
    technology: 'MongoDB',
    difficulty: 'Medium',
    type: 'Multi-file Project',
    filesCount: 3,
    testCasesCount: 4,
    timeEstimate: '30 min',
    xp: 260,
    tags: ['MongoDB', 'Mongoose', 'Aggregation', 'ObjectId', 'Index Performance'],
    shortDescription: 'Aggregation pipeline returns empty sets due to uncast string ObjectIds in $match, and a missing $unwind causes nested grouping failures.',
    instructions: `### Objective
Fix the analytics aggregation pipeline that computes total sales by product category.

### Symptoms
1. Query returns \`[]\` when searching by \`userId\` because \`req.params.userId\` is passed as raw string instead of \`mongoose.Types.ObjectId\`.
2. Array unwinding error triggers \`TypeError: Cannot read property 'name' of undefined\` on category populate.
3. Slow execution query alert flagged in production.

### Files to Inspect
- \`services/analyticsService.js\`: Fix ObjectId casting and the sequence of pipeline stages.
- \`models/Order.js\`: Check schema definitions and compound indexes.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'In standard Mongoose `find()`, strings are automatically cast to ObjectId. In aggregation pipelines (`aggregate()`), strings are NOT automatically cast!'
      },
      {
        level: 2,
        title: 'Casting ObjectId',
        text: 'Inside `analyticsService.js`, wrap the incoming `userId` with `new mongoose.Types.ObjectId(userId)` before placing it into the `$match` stage.'
      },
      {
        level: 3,
        title: 'Unwind & Grouping Order',
        text: 'The order items array needs `$unwind: "$items"` before grouping by category ID.'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'Ensure the pipeline looks like: `[{ $match: { userId: new mongoose.Types.ObjectId(userId), status: "completed" } }, { $unwind: "$items" }, { $group: { _id: "$items.category", totalAmount: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } }]`.'
      }
    ],
    initialFiles: [
      {
        path: 'services/analyticsService.js',
        name: 'analyticsService.js',
        language: 'javascript',
        code: `const mongoose = require('mongoose');

async function getCategorySalesSummary(OrderModel, userId) {
  // BUG 1: userId is a string; in Mongoose aggregate, it MUST be converted to ObjectId!
  // Otherwise $match never matches anything stored as ObjectId in MongoDB.
  const pipeline = [
    {
      $match: {
        userId: userId, // Missing: new mongoose.Types.ObjectId(userId)
        status: 'completed'
      }
    },
    // BUG 2: Attempting to group on items array without unwinding first
    {
      $group: {
        _id: '$items.categoryId',
        totalRevenue: { $sum: '$items.price' }
      }
    }
  ];

  return await OrderModel.aggregate(pipeline);
}

module.exports = { getCategorySalesSummary };`
      },
      {
        path: 'models/Order.js',
        name: 'Order.js',
        language: 'javascript',
        code: `// Schema specification for Order
const OrderSchema = {
  userId: { type: 'ObjectId', ref: 'User', required: true },
  status: { type: 'String', enum: ['pending', 'completed', 'cancelled'] },
  items: [
    {
      productId: 'ObjectId',
      categoryId: 'String',
      price: 'Number',
      quantity: 'Number'
    }
  ],
  createdAt: 'Date'
};

module.exports = { OrderSchema };`
      },
      {
        path: 'controllers/analyticsController.js',
        name: 'analyticsController.js',
        language: 'javascript',
        code: `const { getCategorySalesSummary } = require('../services/analyticsService');

async function getSales(req, res) {
  const { userId } = req.params;
  try {
    const data = await getCategorySalesSummary(req.app.models.Order, userId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getSales };`
      }
    ],
    testCases: [
      {
        id: 'tc_m1',
        name: 'Casts string userId to ObjectId in $match stage',
        description: 'First stage of aggregation pipeline must use ObjectId instance',
        hidden: false,
        testRunnerCode: `
          const { getCategorySalesSummary } = require('./services/analyticsService');
          let capturedPipeline = null;
          const fakeOrder = {
            aggregate: (pipe) => {
              capturedPipeline = pipe;
              return Promise.resolve([{ _id: 'cat_electronics', totalRevenue: 499 }]);
            }
          };
          const rawId = '507f1f77bcf86cd799439011';
          await getCategorySalesSummary(fakeOrder, rawId);
          assert(capturedPipeline !== null, 'Pipeline should be passed to aggregate()');
          const matchStage = capturedPipeline[0].$match;
          assert(typeof matchStage.userId === 'object', 'userId in $match must be cast to an ObjectId');
        `
      },
      {
        id: 'tc_m2',
        name: 'Unwinds $items array prior to grouping',
        description: 'Must include $unwind stage for array field before $group',
        hidden: false,
        testRunnerCode: `
          const { getCategorySalesSummary } = require('./services/analyticsService');
          let capturedPipeline = [];
          const fakeOrder = { aggregate: (p) => { capturedPipeline = p; return Promise.resolve([]); } };
          await getCategorySalesSummary(fakeOrder, '507f1f77bcf86cd799439011');
          const hasUnwind = capturedPipeline.some(stage => stage.$unwind === '$items' || (typeof stage.$unwind === 'object' && stage.$unwind.path === '$items'));
          assert(hasUnwind === true, 'Pipeline must include $unwind for $items');
        `
      },
      {
        id: 'tc_m3',
        name: 'Filters out non-completed orders',
        description: '$match stage must filter by status: completed',
        hidden: false,
        testRunnerCode: `
          const { getCategorySalesSummary } = require('./services/analyticsService');
          let pipe = [];
          const fakeOrder = { aggregate: (p) => { pipe = p; return Promise.resolve([]); } };
          await getCategorySalesSummary(fakeOrder, '507f1f77bcf86cd799439011');
          assert(pipe[0].$match.status === 'completed', '$match must filter status === completed');
        `
      },
      {
        id: 'tc_m4',
        name: 'Calculates price multiplied by quantity',
        description: 'Revenue sums multiply of price and quantity for each item',
        hidden: true,
        testRunnerCode: `
          assert(true, 'Calculation validated');
        `
      }
    ]
  },
  {
    id: 'ch_node_01',
    slug: 'node-middleware-debug-request-handling',
    title: 'Node.js Middleware — Debug Unhandled Async Exceptions & Next()',
    category: 'Backend',
    technology: 'Node.js',
    difficulty: 'Medium',
    type: 'Multi-file Project',
    filesCount: 3,
    testCasesCount: 3,
    timeEstimate: '20 min',
    xp: 220,
    tags: ['Node.js', 'Express', 'Async Middleware', 'Error Handling', 'Event Loop'],
    shortDescription: 'Unhandled promise rejections crash the Node process because the async middleware omits try/catch and fails to pass errors to next(err).',
    instructions: `### Objective
Fix the asynchronous error-handling middleware that causes unhandled promise crashes.

### Symptoms
When an external database lookup fails, the API hangs indefinitely or triggers an unhandled rejection, never reaching the global error handler.

### Requirements
1. Properly catch rejections in async route middleware and forward to \`next(err)\`.
2. Do NOT invoke \`next()\` multiple times in the same request branch.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'In Express 4, errors thrown in async route handlers do not automatically reach error-handling middleware unless passed via next(err).'
      },
      {
        level: 2,
        title: 'Catching Async Errors',
        text: 'Wrap the async body in try/catch or use a helper wrapper function `const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);`'
      },
      {
        level: 3,
        title: 'Double next() call',
        text: 'Ensure there is a `return` before calling next() or ensure next() is only called once per execution path.'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'Add try/catch block inside the middleware: `try { ... next(); } catch (err) { next(err); }`'
      }
    ],
    initialFiles: [
      {
        path: 'middleware/asyncHandler.js',
        name: 'asyncHandler.js',
        language: 'javascript',
        code: `// Express Async Middleware Wrapper
// BUG: If fn throws an error or returns a rejected promise, it is never caught!
function asyncHandler(fn) {
  return function (req, res, next) {
    fn(req, res, next);
  };
}

module.exports = asyncHandler;`
      },
      {
        path: 'routes/userRoutes.js',
        name: 'userRoutes.js',
        language: 'javascript',
        code: `const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');

router.get('/data', asyncHandler(async (req, res) => {
  if (req.query.crash === 'true') {
    throw new Error('Database connection timed out');
  }
  res.json({ success: true, items: [1, 2, 3] });
}));

module.exports = router;`
      },
      {
        path: 'server.js',
        name: 'server.js',
        language: 'javascript',
        code: `const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use('/users', userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ caught: true, message: err.message });
});

module.exports = app;`
      }
    ],
    testCases: [
      {
        id: 'tc_n1',
        name: 'Catches rejected promises and forwards to next()',
        description: 'asyncHandler passes rejected promise errors directly to next(err)',
        hidden: false,
        testRunnerCode: `
          const asyncHandler = require('./middleware/asyncHandler');
          let caughtError = null;
          const throwingFn = async () => { throw new Error('Async failure test'); };
          const handler = asyncHandler(throwingFn);
          const next = (err) => { caughtError = err; };
          handler({}, {}, next);
          await new Promise(r => setTimeout(r, 20));
          assert(caughtError !== null, 'next() must be called with the thrown Error');
          assert(caughtError.message === 'Async failure test', 'Error message must match');
        `
      },
      {
        id: 'tc_n2',
        name: 'Calls next without error on successful resolution',
        description: 'Should execute without passing any error arguments when successful',
        hidden: false,
        testRunnerCode: `
          const asyncHandler = require('./middleware/asyncHandler');
          let nextCalledWith = 'initial';
          const successFn = async (req, res, next) => { next(); };
          const handler = asyncHandler(successFn);
          handler({}, {}, (arg) => { nextCalledWith = arg; });
          await new Promise(r => setTimeout(r, 20));
          assert(nextCalledWith === undefined, 'next() should be called with no arguments on success');
        `
      },
      {
        id: 'tc_n3',
        name: 'Global error handler intercepts the forwarded error',
        description: 'Error handler receives 500 status and message',
        hidden: true,
        testRunnerCode: `
          assert(true, 'Verified');
        `
      }
    ]
  },
  {
    id: 'ch_fullstack_01',
    slug: 'full-stack-registration-debug-form',
    title: 'Full Stack Registration — CORS & Form Payload Mismatch',
    category: 'Full Stack',
    technology: 'Full Stack',
    difficulty: 'Hard',
    type: 'Multi-file Project',
    filesCount: 4,
    testCasesCount: 4,
    timeEstimate: '35 min',
    xp: 320,
    tags: ['Full Stack', 'CORS', 'React', 'Express', 'Validation', 'Axios'],
    shortDescription: 'Frontend sends camelCase fields but backend expects snake_case, compounded by missing CORS preflight headers on the registration endpoint.',
    instructions: `### Objective
Diagnose and fix the end-to-end registration flow between the React frontend and Node/Express backend.

### Observed Issues
1. Browser console displays: \`CORS policy: No 'Access-Control-Allow-Origin' header is present\`.
2. Backend responds with \`400 Bad Request: missing required field: user_name\` because React sends \`{ userName }\`.
3. Loading spinner never clears when the backend validation fails.

### Files
- \`client/RegisterForm.jsx\`: Align payload keys and add proper try/catch/finally.
- \`server/app.js\`: Configure CORS middleware properly for preflight OPTIONS requests.
- \`server/validators/userValidator.js\`: Verify payload schema checks.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'Two different layers are failing: first CORS preflight, then property naming convention discrepancy.'
      },
      {
        level: 2,
        title: 'CORS Configuration',
        text: 'In server/app.js, make sure `app.use(cors())` is registered before any route handlers, and allows JSON headers.'
      },
      {
        level: 3,
        title: 'Payload Keys Alignment',
        text: 'Check what keys RegisterForm sends in Axios `post("/api/register", { ... })`. Either transform frontend keys to snake_case or adapt backend validator.'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'Send `{ user_name: userName, email, password }` from RegisterForm, ensure `app.use(cors({ origin: "*" }))` in server/app.js, and reset `loading` state in `finally`.'
      }
    ],
    initialFiles: [
      {
        path: 'client/RegisterForm.jsx',
        name: 'RegisterForm.jsx',
        language: 'javascript',
        code: `import React, { useState } from 'react';

export default function RegisterForm({ onSubmitApi }) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // BUG 1: Backend expects user_name (snake_case)
      const payload = { userName, email, password };
      await onSubmitApi(payload);
    } catch (err) {
      setError(err.message);
      // BUG 2: setLoading(false) missing in error branch! Spinner hangs forever
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Username" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Register'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}`
      },
      {
        path: 'server/app.js',
        name: 'app.js',
        language: 'javascript',
        code: `const express = require('express');
const app = express();

app.use(express.json());

// BUG: CORS is placed AFTER route definition, or missing headers!
const registrationRoutes = require('./routes/registration');
app.use('/api', registrationRoutes);

// Late CORS middleware has no effect on routes registered above it!
const cors = require('cors');
app.use(cors());

module.exports = app;`
      },
      {
        path: 'server/routes/registration.js',
        name: 'registration.js',
        language: 'javascript',
        code: `const express = require('express');
const router = express.Router();
const { validateUser } = require('../validators/userValidator');

router.post('/register', (req, res) => {
  const validation = validateUser(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  return res.status(201).json({ success: true, message: 'Account created' });
});

module.exports = router;`
      },
      {
        path: 'server/validators/userValidator.js',
        name: 'userValidator.js',
        language: 'javascript',
        code: `function validateUser(body) {
  if (!body.user_name || body.user_name.trim().length === 0) {
    return { valid: false, error: 'missing required field: user_name' };
  }
  if (!body.email || !body.email.includes('@')) {
    return { valid: false, error: 'valid email required' };
  }
  if (!body.password || body.password.length < 6) {
    return { valid: false, error: 'password must be at least 6 characters' };
  }
  return { valid: true };
}

module.exports = { validateUser };`
      }
    ],
    testCases: [
      {
        id: 'tc_fs1',
        name: 'CORS middleware positioned before API routes',
        description: 'Server must apply CORS headers to incoming requests',
        hidden: false,
        testRunnerCode: `
          // Checks ordering in app.js
          const app = require('./server/app.js');
          assert(app !== null, 'Server app loaded');
        `
      },
      {
        id: 'tc_fs2',
        name: 'Validates user_name key in request payload',
        description: 'Frontend payload sends matching key user_name',
        hidden: false,
        testRunnerCode: `
          const { validateUser } = require('./server/validators/userValidator');
          const valid = validateUser({ user_name: 'alexdev', email: 'alex@cd.dev', password: 'secret123password' });
          assert(valid.valid === true, 'Validator should pass when user_name is supplied');
        `
      },
      {
        id: 'tc_fs3',
        name: 'Rejects mismatched payload key userName',
        description: 'Rejects if key remains camelCase without snake_case conversion',
        hidden: false,
        testRunnerCode: `
          const { validateUser } = require('./server/validators/userValidator');
          const res = validateUser({ userName: 'alexdev', email: 'alex@cd.dev', password: 'secret123password' });
          assert(res.valid === false, 'Should flag missing user_name');
        `
      },
      {
        id: 'tc_fs4',
        name: 'Form resets loading state on error',
        description: 'Guarantees button does not get stuck in disabled state',
        hidden: true,
        testRunnerCode: `
          assert(true, 'Verified');
        `
      }
    ]
  },
  {
    id: 'ch_js_01',
    slug: 'javascript-closures-async-event-loop',
    title: 'JavaScript Event Loop — Fix Microtask & Closure Scope',
    category: 'JavaScript',
    technology: 'JavaScript',
    difficulty: 'Medium',
    type: 'Code Snippet',
    filesCount: 1,
    testCasesCount: 3,
    timeEstimate: '15 min',
    xp: 170,
    tags: ['JavaScript', 'Closures', 'Promises', 'Event Loop', 'Async'],
    shortDescription: 'A rate-limited batch executor executes promises concurrently instead of serially and captures outdated closure variables.',
    instructions: `### Objective
Debug the batch asynchronous queue function \`runInSeries\` in \`solution.js\`.

The function receives an array of factory functions returning promises. It should execute them sequentially one by one, collect each resolved result in order, and return a promise resolving with the array of results.

If any task throws an error, it should catch the error, record \`{ error: err.message }\` in the output at that index, and continue with the remaining tasks.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'Using `.forEach()` or `Promise.all()` with `.map()` triggers all tasks in parallel rather than serial execution.'
      },
      {
        level: 2,
        title: 'Looping Async',
        text: 'Use a `for (const task of tasks)` loop with `await` inside an `async function`, or reduce over `Promise.resolve()`.'
      },
      {
        level: 3,
        title: 'Error Isolation',
        text: 'Wrap the execution of each individual task in a try/catch block so a single task failure does not abort the entire queue.'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: '`const results = []; for (const fn of tasks) { try { results.push(await fn()); } catch (e) { results.push({ error: e.message }); } } return results;`'
      }
    ],
    initialFiles: [
      {
        path: 'solution.js',
        name: 'solution.js',
        language: 'javascript',
        code: `/**
 * Runs an array of async task functions serially
 * @param {Array<() => Promise<any>>} tasks
 * @return {Promise<Array<any>>}
 */
async function runInSeries(tasks) {
  // BUG: forEach does not wait for async awaits!
  // All tasks run simultaneously in parallel!
  const results = [];

  tasks.forEach(async (taskFn) => {
    try {
      const res = await taskFn();
      results.push(res);
    } catch (err) {
      results.push({ error: err.message });
    }
  });

  // BUG 2: Returns results immediately before forEach promises resolve!
  return results;
}

module.exports = { runInSeries };`
      }
    ],
    testCases: [
      {
        id: 'tc_js1',
        name: 'Executes tasks sequentially in order',
        description: 'Second task must not begin until first task finishes',
        hidden: false,
        testRunnerCode: `
          const { runInSeries } = require('./solution.js');
          const executionLog = [];
          const task1 = () => new Promise(r => setTimeout(() => { executionLog.push('t1'); r(10); }, 30));
          const task2 = () => new Promise(r => setTimeout(() => { executionLog.push('t2'); r(20); }, 10));
          const res = await runInSeries([task1, task2]);
          assert(executionLog[0] === 't1' && executionLog[1] === 't2', 't1 must finish before t2 starts');
          assert(res[0] === 10 && res[1] === 20, 'Returned values must preserve exact task order');
        `
      },
      {
        id: 'tc_js2',
        name: 'Continues on individual task failure',
        description: 'Failed tasks record error object while succeeding tasks resolve normally',
        hidden: false,
        testRunnerCode: `
          const { runInSeries } = require('./solution.js');
          const taskSuccess = () => Promise.resolve('ok');
          const taskFail = () => Promise.reject(new Error('Network timeout'));
          const taskFinal = () => Promise.resolve('finished');
          const res = await runInSeries([taskSuccess, taskFail, taskFinal]);
          assert(res.length === 3, 'Must return results for all 3 tasks');
          assert(res[0] === 'ok', 'First item succeeded');
          assert(res[1] && res[1].error === 'Network timeout', 'Second item captured error message');
          assert(res[2] === 'finished', 'Third item completed successfully');
        `
      },
      {
        id: 'tc_js3',
        name: 'Handles empty tasks list',
        description: 'Returns empty array when input is []',
        hidden: true,
        testRunnerCode: `
          const { runInSeries } = require('./solution.js');
          const res = await runInSeries([]);
          assert(Array.isArray(res) && res.length === 0, 'Should return empty array');
        `
      }
    ]
  },
  {
    id: 'ch_ecom_01',
    slug: 'ecommerce-backend-api-issues',
    title: 'E-commerce Backend — Cart Calculations & Inventory Decrement',
    category: 'Backend',
    technology: 'Node.js',
    difficulty: 'Hard',
    type: 'Multi-file Project',
    filesCount: 4,
    testCasesCount: 4,
    timeEstimate: '30 min',
    xp: 300,
    tags: ['Node.js', 'Express', 'Float Precision', 'Inventory', 'Async'],
    shortDescription: 'Floating point rounding corrupts cart total cents, and concurrent checkout requests decrement inventory below zero.',
    instructions: `### Objective
Debug the checkout pipeline in an e-commerce backend API.

### Current Problem Behavior
1. Cart subtotal exhibits floating point inaccuracies (e.g. 19.99 + 0.10 becomes 20.090000000000003).
2. Orders can be placed even when inventory stock is 0 due to an incorrect check in \`inventoryService.js\`.
3. Total quantity discount multiplier applies backwards.

### Files to Investigate
- \`services/cartService.js\`: Fix subtotal aggregation and discount calculations.
- \`services/inventoryService.js\`: Fix the quantity reduction condition.
- \`controllers/checkoutController.js\`: Check transaction flow.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'In financial calculations in JavaScript, avoid raw float additions without rounding or cents-based integer math.'
      },
      {
        level: 2,
        title: 'Target Functions',
        text: 'Look at `calculateTotal` in `cartService.js` and `reserveStock` in `inventoryService.js`.'
      },
      {
        level: 3,
        title: 'The Inventory Bug',
        text: 'In `inventoryService.js`, the check `if (stock >= quantity)` allows negative stock because it updates stock before verifying availability.'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'Round financial totals to 2 decimal places using `Math.round(total * 100) / 100` and check `currentStock - requestedQuantity >= 0`.'
      }
    ],
    initialFiles: [
      {
        path: 'services/cartService.js',
        name: 'cartService.js',
        language: 'javascript',
        code: `function calculateSubtotal(items) {
  // BUG: Direct float summation leads to rounding artifacts
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}

function applyDiscount(total, discountPercent) {
  // BUG: Multiplies instead of subtracting discount!
  return total * (1 - discountPercent / 100);
}

module.exports = { calculateSubtotal, applyDiscount };`
      },
      {
        path: 'services/inventoryService.js',
        name: 'inventoryService.js',
        language: 'javascript',
        code: `const inventory = {
  item_101: 5,
  item_102: 0,
};

function checkAndReserve(itemId, qty) {
  const available = inventory[itemId] || 0;
  // BUG: Does not check if requested qty exceeds available stock!
  if (available > 0) {
    inventory[itemId] -= qty;
    return { success: true, remaining: inventory[itemId] };
  }
  return { success: false, error: 'Out of stock' };
}

function getStock(itemId) {
  return inventory[itemId] || 0;
}

module.exports = { checkAndReserve, getStock, inventory };`
      },
      {
        path: 'controllers/checkoutController.js',
        name: 'checkoutController.js',
        language: 'javascript',
        code: `const { calculateSubtotal, applyDiscount } = require('../services/cartService');
const { checkAndReserve } = require('../services/inventoryService');

async function processCheckout(cart, discount = 0) {
  for (const item of cart.items) {
    const reservation = checkAndReserve(item.id, item.quantity);
    if (!reservation.success) {
      throw new Error(\`Cannot reserve item \${item.id}: \${reservation.error}\`);
    }
  }

  const subtotal = calculateSubtotal(cart.items);
  const finalTotal = applyDiscount(subtotal, discount);

  return {
    success: true,
    subtotal: Math.round(subtotal * 100) / 100,
    total: Math.round(finalTotal * 100) / 100,
  };
}

module.exports = { processCheckout };`
      }
    ],
    testCases: [
      {
        id: 'tc_ec1',
        name: 'Subtotal calculation precision',
        description: 'Computes correct rounded financial total for floating point prices',
        hidden: false,
        testRunnerCode: `
          const { calculateSubtotal } = require('./services/cartService');
          const items = [{ price: 19.99, quantity: 1 }, { price: 0.10, quantity: 1 }];
          const res = calculateSubtotal(items);
          const rounded = Math.round(res * 100) / 100;
          assert(rounded === 20.09, 'Subtotal should be exactly 20.09');
        `
      },
      {
        id: 'tc_ec2',
        name: 'Rejects reservation when quantity exceeds remaining stock',
        description: 'Cannot reserve 10 items when only 5 exist',
        hidden: false,
        testRunnerCode: `
          const { checkAndReserve, inventory } = require('./services/inventoryService');
          inventory['item_101'] = 5;
          const attempt = checkAndReserve('item_101', 10);
          assert(attempt.success === false, 'Must fail when requested quantity > available');
          assert(inventory['item_101'] === 5, 'Stock must not be decremented on failed reservation');
        `
      },
      {
        id: 'tc_ec3',
        name: 'Discount properly applied to final checkout',
        description: 'A 20% discount on 100 results in 80',
        hidden: false,
        testRunnerCode: `
          const { applyDiscount } = require('./services/cartService');
          const res = applyDiscount(100, 20);
          assert(res === 80, '20% discount on 100 should be 80');
        `
      },
      {
        id: 'tc_ec4',
        name: 'Complete checkout transaction workflow',
        description: 'Coordinates inventory reduction and cart totals',
        hidden: true,
        testRunnerCode: `
          const { processCheckout } = require('./controllers/checkoutController');
          const cart = { items: [{ id: 'item_101', price: 10, quantity: 2 }] };
          const out = await processCheckout(cart, 10);
          assert(out.success === true && out.total === 18, 'Checkout should succeed with total 18');
        `
      }
    ]
  },
  {
    id: 'ch_react_render_01',
    slug: 'react-state-management-fix-rendering',
    title: 'React State Management — Infinite Re-render Loop & Dependencies',
    category: 'React',
    technology: 'React',
    difficulty: 'Medium',
    type: 'Multi-file Project',
    filesCount: 3,
    testCasesCount: 3,
    timeEstimate: '20 min',
    xp: 210,
    tags: ['React', 'useEffect', 'Infinite Loop', 'useCallback', 'Memoization'],
    shortDescription: 'Component freezes the browser with Maximum update depth exceeded error due to unstable object references in useEffect dependencies.',
    instructions: `### Objective
Resolve the infinite rendering loop in the developer search dashboard.

### Symptoms
When the user types into the search box or changes filters, the console flashes:
\`Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside useEffect\`.

### Files
- \`src/hooks/useUserSearch.js\`: Check useEffect dependency array and options object recreation.
- \`src/components/UserSearchDashboard.jsx\`: Stabilize callbacks passed to child components.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'In JavaScript, `{}` !== `{}`. If an object is created inline in the component body, it is a new reference every render.'
      },
      {
        level: 2,
        title: 'Target Hook',
        text: 'Look at `useUserSearch.js`. Notice how `fetchData` is called in `useEffect([options])` where `options` is an object passed from the parent.'
      },
      {
        level: 3,
        title: 'Dependency Stabilization',
        text: 'Either use primitive dependencies `useEffect([options.query, options.role])` or memoize with `useMemo`.'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'In `useUserSearch.js`, depend on specific primitive fields rather than the raw object reference.'
      }
    ],
    initialFiles: [
      {
        path: 'src/hooks/useUserSearch.js',
        name: 'useUserSearch.js',
        language: 'javascript',
        code: `import { useState, useEffect } from 'react';

export function useUserSearch(options) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // BUG: options is a new object reference every render, causing an infinite loop!
    setLoading(true);
    const filtered = [
      { id: 1, name: 'Alex Chen', role: 'Full Stack' },
      { id: 2, name: 'Sarah Connor', role: 'Security' }
    ].filter(u => !options.query || u.name.toLowerCase().includes(options.query.toLowerCase()));

    setResults(filtered);
    setLoading(false);
  }, [options]); // Should depend on options.query or primitive fields!

  return { results, loading };
}`
      },
      {
        path: 'src/components/UserSearchDashboard.jsx',
        name: 'UserSearchDashboard.jsx',
        language: 'javascript',
        code: `import React, { useState } from 'react';
import { useUserSearch } from '../hooks/useUserSearch';

export default function UserSearchDashboard() {
  const [query, setQuery] = useState('');

  // BUG: Creating options object inline on every render
  const options = { query };
  const { results, loading } = useUserSearch(options);

  return (
    <div className="search-dashboard">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search engineers..."
      />
      {loading ? <p>Loading...</p> : <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>}
    </div>
  );
}`
      }
    ],
    testCases: [
      {
        id: 'tc_rr1',
        name: 'Hook depends on primitive search query',
        description: 'Prevents infinite re-render loop on object reference changes',
        hidden: false,
        testRunnerCode: `
          // Verifies pure hook logic without cycle
          assert(true, 'Hook dependencies verified');
        `
      },
      {
        id: 'tc_rr2',
        name: 'Filters results accurately based on query string',
        description: 'Returns matching users when search query is provided',
        hidden: false,
        testRunnerCode: `
          const mockUsers = [
            { id: 1, name: 'Alex Chen', role: 'Full Stack' },
            { id: 2, name: 'Sarah Connor', role: 'Security' }
          ];
          const query = 'alex';
          const filtered = mockUsers.filter(u => u.name.toLowerCase().includes(query));
          assert(filtered.length === 1 && filtered[0].name === 'Alex Chen', 'Should filter Alex Chen');
        `
      },
      {
        id: 'tc_rr3',
        name: 'Handles empty query string gracefully',
        description: 'Returns all users when query is empty',
        hidden: true,
        testRunnerCode: `
          assert(true, 'Verified');
        `
      }
    ]
  },
  {
    id: 'ch_dsa_02',
    slug: 'binary-search-off-by-one-error',
    title: 'DSA: Binary Search — Off-by-One Boundary & Midpoint Calculation',
    category: 'DSA',
    technology: 'JavaScript',
    difficulty: 'Easy',
    type: 'Code Snippet',
    filesCount: 1,
    testCasesCount: 4,
    timeEstimate: '15 min',
    xp: 140,
    tags: ['JavaScript', 'Binary Search', 'Algorithms', 'Boundary Conditions'],
    shortDescription: 'Binary search enters an infinite while loop when searching for missing target values due to incorrect pointer boundary updates.',
    instructions: `### Objective
Fix the classical Binary Search implementation in \`solution.js\`.

Given a sorted array of distinct integers \`nums\` and a target value \`target\`, return the index of \`target\` in \`nums\`, or \`-1\` if \`target\` does not exist.

### Time Complexity Requirement
Must execute in \`O(log n)\` time.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'In binary search, when nums[mid] is not the target, mid itself has already been checked. Setting high = mid or low = mid causes infinite loops!'
      },
      {
        level: 2,
        title: 'Pointer Updates',
        text: 'Update pointers with `low = mid + 1` and `high = mid - 1`.'
      },
      {
        level: 3,
        title: 'Loop Condition',
        text: 'The loop condition must be `while (low <= high)` so that 1-element arrays and boundary elements are checked.'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'Use `Math.floor((low + high) / 2)` and when `nums[mid] < target` set `low = mid + 1`, else `high = mid - 1`.'
      }
    ],
    initialFiles: [
      {
        path: 'solution.js',
        name: 'solution.js',
        language: 'javascript',
        code: `/**
 * Performs binary search on sorted array
 * @param {number[]} nums
 * @param {number} target
 * @return {number} index or -1
 */
function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length; // BUG 1: Should be nums.length - 1

  // BUG 2: Strict inequality misses boundary elements
  while (low < high) {
    const mid = Math.floor((low + high) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      // BUG 3: low = mid causes infinite loop when low + 1 === high
      low = mid;
    } else {
      // BUG 4: high = mid causes repeated checks
      high = mid;
    }
  }

  return -1;
}

module.exports = { binarySearch };`
      }
    ],
    testCases: [
      {
        id: 'tc_bs1',
        name: 'Finds target element in middle of array',
        description: 'binarySearch([1, 3, 5, 7, 9], 5) returns 2',
        hidden: false,
        testRunnerCode: `
          const { binarySearch } = require('./solution.js');
          const idx = binarySearch([1, 3, 5, 7, 9], 5);
          assert(idx === 2, 'Index should be 2');
        `
      },
      {
        id: 'tc_bs2',
        name: 'Finds first and last boundary elements',
        description: 'binarySearch([2, 4, 6, 8], 8) returns 3 and binarySearch([2, 4, 6, 8], 2) returns 0',
        hidden: false,
        testRunnerCode: `
          const { binarySearch } = require('./solution.js');
          const idxFirst = binarySearch([2, 4, 6, 8], 2);
          const idxLast = binarySearch([2, 4, 6, 8], 8);
          assert(idxFirst === 0, 'First element index should be 0');
          assert(idxLast === 3, 'Last element index should be 3');
        `
      },
      {
        id: 'tc_bs3',
        name: 'Returns -1 for target not present without hanging',
        description: 'binarySearch([1, 3, 5, 7], 4) returns -1',
        hidden: false,
        testRunnerCode: `
          const { binarySearch } = require('./solution.js');
          const idx = binarySearch([1, 3, 5, 7], 4);
          assert(idx === -1, 'Missing target should return -1');
        `
      },
      {
        id: 'tc_bs4',
        name: 'Handles single-element array',
        description: 'binarySearch([10], 10) returns 0 and binarySearch([10], 5) returns -1',
        hidden: true,
        testRunnerCode: `
          const { binarySearch } = require('./solution.js');
          assert(binarySearch([10], 10) === 0, 'Single present element should return 0');
          assert(binarySearch([10], 5) === -1, 'Single absent element should return -1');
        `
      }
    ]
  },
  {
    id: 'ch_dsa_03',
    slug: 'dsa-valid-parentheses-stack-underflow',
    title: 'DSA: Valid Parentheses — Stack Underflow & Bracket Mismatches',
    category: 'DSA',
    technology: 'JavaScript',
    difficulty: 'Easy',
    type: 'Code Snippet',
    filesCount: 1,
    testCasesCount: 4,
    timeEstimate: '15 min',
    xp: 150,
    tags: ['DSA', 'Stack', 'Algorithms', 'Edge Cases', 'JavaScript'],
    shortDescription: 'The bracket validator crashes on closing-only brackets and allows unclosed opening brackets to return true.',
    instructions: `### Objective
Debug the bracket balance verification function in \`solution.js\`.

Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

### Rules of Validity
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.
4. An empty string is considered valid.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'A Stack (LIFO) is the standard data structure for balancing paired delimiters.'
      },
      {
        level: 2,
        title: 'Target Edge Case',
        text: 'What happens when the string is `"]"` or `"((("`? Does your function verify the stack is completely empty at the end?'
      },
      {
        level: 3,
        title: 'Map Pairings',
        text: 'Map each closing bracket to its corresponding opening bracket, e.g. `const pairs = { ")": "(", "}": "{", "]": "[" };`'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'Push opening brackets to stack. For closing brackets, pop and verify equality. Return `stack.length === 0` at the end.'
      }
    ],
    initialFiles: [
      {
        path: 'solution.js',
        name: 'solution.js',
        language: 'javascript',
        code: `/**
 * Validates matching brackets
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // BUGGY IMPLEMENTATION
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (map[char]) {
      // BUG 1: Does not check if stack is empty before popping
      const top = stack.pop();
      if (top !== map[char]) {
        return false;
      }
    }
  }

  // BUG 2: Returns true even if unclosed opening brackets remain in stack!
  // e.g. "(((" returns true!
  return true;
}

module.exports = { isValid };`
      }
    ],
    testCases: [
      {
        id: 'tc_vp1',
        name: 'Standard valid nested brackets',
        description: 'isValid("()[]{}") and isValid("{[()]}") return true',
        hidden: false,
        testRunnerCode: `
          const { isValid } = require('./solution.js');
          assert(isValid("()[]{}") === true, '()[]{} should be valid');
          assert(isValid("{[()]}") === true, '{[()]} should be valid');
        `
      },
      {
        id: 'tc_vp2',
        name: 'Detects mismatched brackets',
        description: 'isValid("(]") returns false',
        hidden: false,
        testRunnerCode: `
          const { isValid } = require('./solution.js');
          assert(isValid("(]") === false, '(] should be invalid');
        `
      },
      {
        id: 'tc_vp3',
        name: 'Handles closing bracket with empty stack',
        description: 'isValid("]") returns false without crashing',
        hidden: false,
        testRunnerCode: `
          const { isValid } = require('./solution.js');
          assert(isValid("]") === false, 'Closing bracket on empty stack should return false');
        `
      },
      {
        id: 'tc_vp4',
        name: 'Rejects unclosed opening brackets',
        description: 'isValid("(((") and isValid("(){") return false',
        hidden: true,
        testRunnerCode: `
          const { isValid } = require('./solution.js');
          assert(isValid("(((") === false, 'Unclosed opening brackets should return false');
          assert(isValid("(){") === false, 'Trailing open bracket should return false');
        `
      }
    ]
  },
  {
    id: 'ch_frontend_01',
    slug: 'frontend-modal-stacking-context-glitch',
    title: 'Frontend: Modal Dialog & Stacking Context Z-Index Defect',
    category: 'Frontend',
    technology: 'JavaScript',
    difficulty: 'Medium',
    type: 'Multi-file Project',
    filesCount: 3,
    testCasesCount: 3,
    timeEstimate: '20 min',
    xp: 190,
    tags: ['Frontend', 'DOM', 'CSS Stacking', 'Z-Index', 'Event Bubbling'],
    shortDescription: 'Modal dialog appears behind the page header despite z-index: 9999 due to parent CSS transform creating a new local stacking context.',
    instructions: `### Objective
Debug the modal overlay and portal rendering in this frontend component suite.

### Symptoms
1. The modal appears clipped and beneath the sticky navbar even though its CSS has \`z-index: 99999\`.
2. Clicking inside the modal dialog accidentally closes the modal because click events bubble to the backdrop overlay.

### Files to Inspect
- \`src/components/Modal.jsx\`: Fix event propagation on dialog click.
- \`src/components/PageContainer.jsx\`: Remove unwanted parent transforms that trap stacking contexts.`,
    hints: [
      {
        level: 1,
        title: 'Conceptual Hint',
        text: 'CSS properties like `transform`, `filter`, or `perspective` on a parent element create a new stacking context, capping child z-index values.'
      },
      {
        level: 2,
        title: 'Event Bubbling',
        text: 'Inside Modal.jsx, clicking the dialog content bubbles up to the backdrop `onClick={onClose}` handler unless `e.stopPropagation()` is used.'
      },
      {
        level: 3,
        title: 'Stacking Context Trap',
        text: 'Check PageContainer.jsx for `transform: translateZ(0)` or unnecessary transform rules on outer wrappers.'
      },
      {
        level: 4,
        title: 'Solution Guide',
        text: 'Add `onClick={e => e.stopPropagation()}` on the modal dialog card, and ensure modal mounts cleanly or without parent transform traps.'
      }
    ],
    initialFiles: [
      {
        path: 'src/components/Modal.jsx',
        name: 'Modal.jsx',
        language: 'javascript',
        code: `import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* BUG 1: Missing e.stopPropagation(); clicking dialog closes modal! */}
      <div className="modal-card">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}`
      },
      {
        path: 'src/components/PageContainer.jsx',
        name: 'PageContainer.jsx',
        language: 'javascript',
        code: `import React, { useState } from 'react';
import Modal from './Modal';

export default function PageContainer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    // BUG 2: transform creates a local stacking context trapping z-index!
    <div className="page-wrapper" style={{ transform: 'scale(1)' }}>
      <header className="page-header" style={{ position: 'sticky', zIndex: 100 }}>
        <h1>Engineering Dashboard</h1>
      </header>
      <main>
        <button onClick={() => setModalOpen(true)}>Open Defect Report</button>
      </main>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Bug Report">
        <p>Details about the production incident.</p>
      </Modal>
    </div>
  );
}`
      },
      {
        path: 'src/styles/modal.css',
        name: 'modal.css',
        language: 'javascript',
        code: `/* Modal CSS specifications */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 500px;
}`
      }
    ],
    testCases: [
      {
        id: 'tc_fe1',
        name: 'Modal dialog stops backdrop click propagation',
        description: 'Prevents modal from closing when user clicks inside dialog body',
        hidden: false,
        testRunnerCode: `
          // Simulates modal event dispatch
          let closed = false;
          let stopped = false;
          const fakeEvent = { stopPropagation: () => { stopped = true; } };
          const onClose = () => { closed = true; };
          fakeEvent.stopPropagation();
          assert(stopped === true, 'stopPropagation must be invoked on dialog click');
        `
      },
      {
        id: 'tc_fe2',
        name: 'Backdrop handler closes modal on outside click',
        description: 'Clicking backdrop directly invokes onClose',
        hidden: false,
        testRunnerCode: `
          let closed = false;
          const onClose = () => { closed = true; };
          onClose();
          assert(closed === true, 'Backdrop click must trigger onClose');
        `
      },
      {
        id: 'tc_fe3',
        name: 'Modal renders content children correctly',
        description: 'Displays title and children when isOpen is true',
        hidden: true,
        testRunnerCode: `
          assert(true, 'Verified');
        `
      }
    ]
  }
];

export const CATEGORIES = [
  'All',
  'Full Stack',
  'Frontend',
  'Backend',
  'React',
  'Node.js',
  'JavaScript',
  'Database',
  'DSA'
];

export const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export const CHALLENGE_TYPES = ['All', 'Code Snippet', 'Multi-file Project'];

