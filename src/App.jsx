import { useEffect, useMemo, useState } from 'react'
import AuthForm from './components/AuthForm'
import PostComposer from './components/PostComposer'
import Feed from './components/Feed'

function App() {
  // Compute backend URL robustly for both local dev and hosted preview
  const computedBaseUrl = useMemo(() => {
    const envUrl = import.meta.env.VITE_BACKEND_URL
    if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
      return envUrl
    }
    // If running on the hosted preview, derive backend URL by swapping -3000 with -8000 in the host
    if (typeof window !== 'undefined') {
      const { protocol, host } = window.location
      // Example host pattern: ta-xxxx-3000....modal.host -> ta-xxxx-8000....modal.host
      if (host.includes('-3000.')) {
        const backendHost = host.replace('-3000.', '-8000.')
        return `${protocol}//${backendHost}`
      }
    }
    // Fallback for local dev
    return 'http://localhost:8000'
  }, [])

  const baseUrl = computedBaseUrl

  const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null)
  const [me, setMe] = useState(null)

  useEffect(()=>{
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : token
    if (!t) return
    fetch(`${baseUrl}/auth/me`, { headers: { 'Authorization': `Bearer ${t}` } })
      .then(res => res.ok ? res.json() : null)
      .then(data => setMe(data))
      .catch(()=>{})
  }, [token, baseUrl])

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
