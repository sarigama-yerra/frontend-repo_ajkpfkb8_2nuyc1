import { useState } from 'react'

export default function AuthForm({ baseUrl, onAuthed }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        const payload = {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          full_name: form.full_name.trim() || undefined,
        }
        const res = await fetch(`${baseUrl}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json().catch(()=>({}))
        if (!res.ok) throw new Error(data?.detail || 'Sign up failed')
        localStorage.setItem('token', data.access_token)
        onAuthed(data.access_token)
      } else {
        // Send JSON to match backend /auth/login (expects username, password)
        const payload = {
          username: form.username.trim(),
          password: form.password,
        }
        const res = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json().catch(()=>({}))
        if (!res.ok) throw new Error(data?.detail || 'Login failed')
        localStorage.setItem('token', data.access_token)
        onAuthed(data.access_token)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <button className="text-blue-600 text-sm hover:underline" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
        </button>
      </div>
      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Username</label>
          <input name="username" value={form.username} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {mode === 'signup' && (
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
        {mode === 'signup' && (
          <div>
            <label className="block text-sm text-slate-600 mb-1">Full name (optional)</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
        <div>
          <label className="block text-sm text-slate-600 mb-1">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-medium transition">
          {loading ? 'Please wait…' : (mode === 'login' ? 'Log in' : 'Sign up')}
        </button>
      </form>
    </div>
  )
}
