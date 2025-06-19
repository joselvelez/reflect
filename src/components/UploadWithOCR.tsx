'use client'

import { useState } from 'react'

export default function UploadWithOCR({ onExtract }: { onExtract: (text: string) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [fileUrl, setFileUrl] = useState('')

  const handleUpload = async () => {
    if (!file) return
    const form = new FormData()
    form.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form,
    })

    if (!res.ok) {
      alert('Upload failed')
      return
    }

    const data = await res.json()
    setText(data.extractedText)
    setFileUrl(data.fileUrl)
    onExtract(data.extractedText) // 🔥 updates parent form
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload & Extract
      </button>

      {fileUrl && <img src={fileUrl} alt="Uploaded" className="max-w-xs border" />}

      {text && (
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            onExtract(e.target.value)
          }}
          className="w-full border p-2"
          rows={6}
        />
      )}
    </div>
  )
}
