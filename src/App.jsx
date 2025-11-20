import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${baseUrl}/products`)
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        setProducts(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id)
      if (exists) {
        return prev.map((p) => p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const checkout = async () => {
    setPlacingOrder(true)
    setOrderStatus(null)
    try {
      const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
      const payload = {
        customer_name: 'Guest',
        customer_email: 'guest@example.com',
        shipping_address: '123 Samsung Street, Seoul',
        items: cart.map((c) => ({
          product_id: c._id,
          title: c.title,
          price: c.price,
          quantity: c.quantity,
          image_url: c.image_url
        })),
        subtotal,
        shipping: 0,
        total: subtotal
      }
      const res = await fetch(`${baseUrl}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Order failed')
      const data = await res.json()
      setOrderStatus({ success: true, order_id: data.order_id })
      setCart([])
      setCartOpen(false)
    } catch (e) {
      setOrderStatus({ success: false, message: e.message })
    } finally {
      setPlacingOrder(false)
    }
  }

  const seed = async () => {
    setLoading(true)
    await fetch(`${baseUrl}/seed`, { method: 'POST' })
    const res = await fetch(`${baseUrl}/products`)
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header cartCount={cart.reduce((a, c) => a + c.quantity, 0)} onCartClick={() => setCartOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Samsung Shop</h1>
          <p className="text-slate-600 mt-2">Discover the latest Galaxy phones, wearables, and audio — powered by a live database.</p>
        </div>

        {orderStatus && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${orderStatus.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {orderStatus.success ? (
              <span>Order placed successfully. ID: {orderStatus.order_id}</span>
            ) : (
              <span>Order failed: {orderStatus.message}</span>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-medium">{error}</p>
            <button onClick={seed} className="mt-3 inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Seed sample products</button>
          </div>
        ) : (
          <>
            {products.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
                <p>No products found. You can load sample Samsung products:</p>
                <button onClick={seed} className="mt-3 inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Seed sample products</button>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onAdd={addToCart} />
              ))}
            </div>
          </>
        )}
      </main>

      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onCheckout={checkout} />

      <footer className="border-t border-slate-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8 text-slate-500 text-sm flex flex-col md:flex-row items-center justify-between gap-2">
          <p>Samsung Shop demo • Built with FastAPI, MongoDB, and React</p>
          <a className="text-blue-600 hover:underline" href="/test">Backend status</a>
        </div>
      </footer>
    </div>
  )
}

export default App
