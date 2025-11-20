import { useState } from 'react'

export default function PostComposer({ baseUrl, onPost }) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const submit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: content.trim(), image_url: imageUrl || undefined, author_id: 'ignore' })
      })
      if (!res.ok) throw new Error('Failed to post')
      const data = await res.json()
      setContent('')
      setImageUrl('')
      onPost?.(data)
    } catch (e) {
      console.error(e)
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
      <textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder="What's on your mind?" className="w-full min-h-[80px] border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
      <div className="flex gap-2">
        <input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="Optional image URL" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
        <button disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{loading ? 'Posting…' : 'Post'}</button>
      </div>
    </form>
  )
}
