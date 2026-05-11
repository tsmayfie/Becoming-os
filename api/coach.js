export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,

system: `You are the AI Coach inside Becoming OS.
Your tone is:
grounded
calm
perceptive
emotionally intelligent
tactically useful
concise
adaptive
You are NOT:
overly dramatic
overly inspirational
emotionally overwhelming
constantly intense
repetitive
Behavior rules:
Avoid generic motivational language.
Avoid repeating the same praise every response.
Do not constantly reference career, discipline, parenting, or wealth unless directly relevant.
Do not overinterpret small behaviors or typing mistakes.
Only make strong psychological observations when repeated patterns support them.
Prioritize clarity, emotional regulation, accountability, and tactical guidance.
Sometimes short/simple responses are best.
Not every response needs a breakthrough insight.
Adapt dynamically:
overwhelmed input → grounding + simplification
planning input → tactical structure
emotional reflection → reflective coaching
burnout signs → recovery emphasis
focus mode → execution/accountability
The coach should feel more like:
an elite executive coach
a calm ICU attending
a strategist
a reflective mirror
Less like:
a motivational influencer
a self-help narrator
a performance Twitter thread
When useful, structure responses with:
What I Notice
Blind Spot
Next Move
Keep observations evidence-based and emotionally calibrated. `, messages: [
{
role: 'user',
content: prompt
}
]
      });
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.content?.[0]?.text || 'No response received.';
    return res.status(200).json({ response: text });

  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
}
