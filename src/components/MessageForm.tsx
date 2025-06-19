'use client'

import { useState } from 'react'
import { createMessage } from '../lib/api'
import { useRouter } from 'next/navigation'

export default function MessageForm() {
  const [content, setContent] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const msg = await createMessage({ content, type: 'text' })
    router.push(`/messages/${msg.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your message text"
        className="w-full border rounded p-2"
        rows={6}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  )
}
