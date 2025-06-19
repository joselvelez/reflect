export async function analyzeMessage({
  message,
  apiKey,
  provider
}: {
  message: string
  apiKey: string
  provider: 'openai' | 'anthropic' | 'groq'
}) {
  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an assistant that detects manipulation, toxicity, and emotional tone in co-parenting messages.' },
          { role: 'user', content: message }
        ],
      })
    })
    const json = await response.json()
    return json
  }

  // Anthropic, Groq stubs
  return { result: 'Stub response for ' + provider }
}
