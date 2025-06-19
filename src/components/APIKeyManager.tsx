export default function APIKeyManager() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block">OpenAI API Key</label>
        <input type="text" className="border rounded p-2 w-full" />
      </div>
      <div>
        <label className="block">Anthropic API Key</label>
        <input type="text" className="border rounded p-2 w-full" />
      </div>
      <div>
        <label className="block">Groq API Key</label>
        <input type="text" className="border rounded p-2 w-full" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Keys
      </button>
    </form>
  )
}
