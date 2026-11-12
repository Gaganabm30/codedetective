/**
 * Gemini AI Debugging Mentor Service
 * Provides pedagogical Socratic debugging assistance using the Gemini API,
 * with resilient fallback to intelligent heuristic mentor guidance when API keys are unconfigured
 * or network requests timeout.
 */

const SYSTEM_INSTRUCTION = `
You are CodeDetective's AI Debugging Mentor, a senior software architect and pedagogical debugging coach.
Your mission is to help developers and students develop their debugging acumen and learn to think like senior engineers.

CRITICAL PEDAGOGICAL RULES:
1. NEVER just dump the complete solution unless explicitly requested at Level 4.
2. Adopt a Socratic, encouraging, and analytical tone.
3. Guide the developer to inspect specific variables, promise resolutions, data structures, or headers.
4. When explaining errors, explain WHY the runtime or assertion failed at the architectural level.
5. Emphasize defensive coding, immutability, proper asynchronous patterns, and edge case coverage.
`;

const CANDIDATE_MODELS = [
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-pro-latest',
];

export async function askMentorAI({ challenge, message, code, context }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && typeof apiKey === 'string' && apiKey.trim().length > 10) {
    const prompt = `
System Context:
Challenge: "${challenge?.title || 'Coding Challenge'}"
Description: ${challenge?.shortDescription || ''}
Current active file: ${context?.currentFile || 'solution.js'}

Code under investigation:
\`\`\`javascript
${code || ''}
\`\`\`

User question or prompt:
"${message}"

Provide a concise, pedagogical response (max 3-4 paragraphs) following your mentoring guidelines.
`;

    for (const model of CANDIDATE_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 600,
              },
            }),
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return reply;
        }
      } catch (err) {
        // Continue to next model or fallback
      }
    }
  }

  // Resilient Heuristic Pedagogical Mentor Response
  return generatePedagogicalFallback(message, challenge, code);
}

export async function getProgressiveHint({ challenge, level, code }) {
  const matchingHint = challenge?.hints?.find(h => h.level === level);
  if (matchingHint) {
    return {
      level,
      title: matchingHint.title,
      text: matchingHint.text,
    };
  }

  return {
    level,
    title: `Level ${level} Diagnostic Guidance`,
    text: `Examine the relationship between inputs and outputs in the failing assertion. Check whether all asynchronous promises are awaited.`,
  };
}

export async function explainErrorAI({ challenge, errorOutput, code }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && typeof apiKey === 'string' && apiKey.trim().length > 10) {
    const prompt = `
Explain this error concisely to a software engineer in training without spoiling the exact solution:
Challenge: ${challenge?.title}
Error output:
${errorOutput}

Code:
${code}
`;

    for (const model of CANDIDATE_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            }),
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return reply;
        }
      } catch (err) {
        // Fallback to next model or default
      }
    }
  }

  return `The error indicates an assertion or type violation during execution. Check if a null/undefined value was accessed, or if an expected property name differs in casing or format. Try logging the inspected object right before the failing assertion!`;
}

function generatePedagogicalFallback(userQuery, challenge, code) {
  const q = (userQuery || '').toLowerCase();

  if (q.includes('explain') || q.includes('error') || q.includes('fail')) {
    return `Let's break down the failure in **${challenge?.title || 'this challenge'}**:

1. Observe what the test asserts: it compares the return value or state against an expected contract.
2. If you see a \`TypeError\` or \`Assertion failed\`, look at the values right before the return statement.
3. Check whether asynchronous calls (\`async/await\` or \`Promises\`) are completing before the assertion evaluates.

Try adding a \`console.log()\` to observe the intermediate state and click **Run Code** to check the terminal!`;
  }

  if (q.includes('where') || q.includes('point') || q.includes('location') || q.includes('line')) {
    return `Here is a diagnostic clue:

Take a look at how external arguments or headers are deconstructed. In JavaScript, common pitfalls include:
- Splitting strings by space and picking index \`0\` instead of \`1\`
- Forgetting \`await\` on an asynchronous function
- Direct state mutation instead of creating immutable copies

Scan the file for any place where an operation modifies an object in-place or neglects promise resolution.`;
  }

  if (q.includes('review') || q.includes('check') || q.includes('fix')) {
    return `To verify whether your fix is solid:

1. Click **"Run Tests"** in the top toolbar to run the full assertion suite against your edited files.
2. Consider edge cases: what happens if the input has duplicate numbers, empty arrays, or unexpected headers?
3. If all test assertions turn green with zero errors, hit **"Submit"** to finalize your solution and earn XP!`;
  }

  return `Good observation! When troubleshooting **${challenge?.title || 'this defect'}**, ask yourself:
- What assumptions does the consumer make about the return format?
- Is state being mutated directly or is a promise left un-awaited?

Try making a focused change, then run the test suite to observe the diff!`;
}
