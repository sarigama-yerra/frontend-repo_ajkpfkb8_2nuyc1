import { useEffect, useState } from 'react'

export default function Feed({ baseUrl }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/posts`, { headers: { 'Authorization': `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to load feed')
      const data = await res.json()
      setPosts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  const toggleLike = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/posts/${id}/like`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to like')
      await load()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-slate-500">Loading feed…</div>
      ) : posts.length === 0 ? (
        <div className="text-slate-500">No posts yet. Be the first to share!</div>
      ) : (
        posts.map((p)=> (
          <article key={p.id} className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div>
                <div className="font-medium text-slate-900">{p.author.full_name || p.author.username}</div>
                <div className="text-xs text-slate-500">{new Date(p.created_at).toLocaleString()}</div>
              </div>
            </div>
            <p className="mt-3 text-slate-800 whitespace-pre-wrap">{p.content}</p>
            {p.image_url && <img src={p.image_url} alt="post" className="mt-3 rounded-lg border border-slate-200" />}
            <div className="mt-3 flex items-center gap-4 text-slate-600 text-sm">
              <button onClick={()=>toggleLike(p.id)} className="hover:text-blue-600">👍 Like ({p.likes})</button>
              <span>💬 {p.comments_count}</span>
            </div>
          </article>
        ))
      )}
    </div>
  )
}
