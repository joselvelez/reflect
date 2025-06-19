export async function getMessages() {
  const res = await fetch('/api/messages')
  if (!res.ok) throw new Error('Failed to fetch messages')
  return res.json()
}

export async function getMessage(id: string) {
  const res = await fetch(`/api/messages/${id}`)
  if (!res.ok) throw new Error('Failed to fetch message')
  return res.json()
}

export async function createMessage(data: { content: string; type: string; tags?: string[] }) {
  const res = await fetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to create message')
  return res.json()
}

export async function analyzeMessage(messageId: string) {
  const res = await fetch('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ messageId }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to analyze message')
  return res.json()
}

export async function getUser() {
  const res = await fetch('/api/auth/me')
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}
