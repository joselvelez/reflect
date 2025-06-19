'use client'

import { useEffect, useState } from 'react'
import { analyzeMessage, getMessage } from '../lib/api'

export default function MessageDetail({ messageId }: { messageId: string }) {
  const [message, setMessage] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    getMessage(messageId).then(setMessage)
  }, [messageId])

  const handleAnalyze = async () => {
    const result = await analyzeMessage(messageId)
    setAnalysis(result)
  }

  if (!message) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Message:</h2>
      <p className="border p-2">{message.content}</p>

      <button
        onClick={handleAnalyze}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Run AI Analysis
      </button>

      {analysis && (
        <div className="mt-4">
          <h3 className="font-bold">AI Analysis:</h3>
          <pre className="bg-gray-100 p-2">{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
