import { ShoppingCart } from 'lucide-react'

export default function Header({ cartCount, onCartClick }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1623588958271-8c019027feed?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxTYW1zdW5nfGVufDB8MHx8fDE3NjM2NzU0NDd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="Samsung" className="h-6 md:h-7" />
          <span className="sr-only">Samsung Shop</span>
        </a>
        <button onClick={onCartClick} className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-800 bg-white shadow-sm">
          <ShoppingCart className="w-5 h-5" />
          <span className="text-sm font-medium">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
