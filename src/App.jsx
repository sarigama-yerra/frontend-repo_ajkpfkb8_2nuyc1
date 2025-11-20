import { useEffect, useMemo, useState } from 'react'
import AuthForm from './components/AuthForm'
import PostComposer from './components/PostComposer'
import Feed from './components/Feed'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null)
  const [me, setMe] = useState(null)

  useEffect(()=>{
    const t = localStorage.getItem('token')
    if (!t) return
    fetch(`${baseUrl}/auth/me`, { headers: { 'Authorization': `Bearer ${t}` } })
      .then(res => res.ok ? res.json() : null)
      .then(data => setMe(data))
      .catch(()=>{})
  }, [token])

  const handleAuthed = (tok) => {
    setToken(tok)
    fetch(`${baseUrl}/auth/me`, { headers: { 'Authorization': `Bearer ${tok}` } })
      .then(res => res.json()).then(setMe)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setMe(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600"></div>
            <span className="font-semibold text-slate-900">Bluebook</span>
          </div>
          {me ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden sm:inline text-slate-600">Hi, {me.full_name || me.username}</span>
              <button onClick={logout} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white">Log out</button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2 space-y-4">
          {!me ? (
            <AuthForm baseUrl={baseUrl} onAuthed={handleAuthed} />
          ) : (
            <>
              <PostComposer baseUrl={baseUrl} onPost={()=>{}} />
              <Feed baseUrl={baseUrl} />
            </>
          )}
        </section>
        <aside className="space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <h3 className="font-semibold text-slate-900 mb-2">About</h3>
            <p className="text-sm text-slate-600">A lightweight social app with login, signup, posting, and likes. Backed by a live database.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
            API: <span className="text-slate-900">{baseUrl}</span>
          </div>
        </aside>
      </main>

      <footer className="border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-8 text-slate-500 text-sm">Bluebook demo • FastAPI + MongoDB + React</div>
      </footer>
    </div>
  )
}

export default App
