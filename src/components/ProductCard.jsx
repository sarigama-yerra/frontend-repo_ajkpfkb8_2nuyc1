export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square bg-slate-50 overflow-hidden">
        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-2 mt-1 min-h-[36px]">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</p>
            <p className="text-xs text-slate-500">{product.category}</p>
          </div>
          <button onClick={() => onAdd(product)} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}
