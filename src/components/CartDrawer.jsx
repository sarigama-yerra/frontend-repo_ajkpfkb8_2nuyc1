export default function CartDrawer({ open, items, onClose, onCheckout }) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  return (
    <div className={`fixed inset-0 z-30 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900">Close</button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-200px)]">
          {items.length === 0 ? (
            <p className="text-slate-600">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex gap-3">
                <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-slate-600">${(item.price * item.quantity).toFixed(2)} · Qty {item.quantity}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 rounded-lg"
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  )
}
