import { useState } from 'react'
import { Clock, CheckCircle, AlertCircle, Phone } from 'lucide-react'

const STATUS_CONFIG = {
  pending:   { icon: Clock,       bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'pending'   },
  confirmed: { icon: CheckCircle, bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  label: 'confirmed' },
  disputed:  { icon: AlertCircle, bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    label: 'disputed'  },
}

export default function OrderRow({ order, last, onUpdateStatus }) {
  const [status, setStatus] = useState(order.status)

  const handleUpdate = async (newStatus) => {
    setStatus(newStatus) // optimistic update
    await onUpdateStatus(order._id || order.id, newStatus)
  }

  const cfg  = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = cfg.icon

  // 🔁 Adjust these field names to match your API response shape
  const title  = order.propertyTitle || order.product || 'Property'
  const image  = order.propertyImage || order.image   || ''
  const txId   = (order._id || order.transactionId || '').toString().slice(-6)
  const date   = order.inspectionDate
    ? new Date(order.inspectionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : order.date || '—'
  const client = order.clientName  || order.client || 'Client'
  const phone  = order.clientPhone || order.phone  || ''
  const amount = order.amount || 0

  return (
    <div className={`grid grid-cols-[2fr_1.2fr_1fr_1.4fr_1fr_1.2fr] items-center px-6 py-4 ${!last ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>

      {/* Product info */}
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={title}
          className="w-12 h-12 rounded-xl object-cover border border-gray-100 bg-gray-100"
          onError={e => { e.target.src = 'https://placehold.co/48x48/e5e7eb/9ca3af?text=?' }}
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">₦{amount.toLocaleString()}</p>
        </div>
      </div>

      {/* Transaction ID */}
      <span className="text-sm font-mono text-gray-500">#{txId}</span>

      {/* Date */}
      <span className="text-sm text-gray-600">{date}</span>

      {/* Client */}
      <div>
        <p className="text-sm font-medium text-gray-800">{client}</p>
        {phone && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Phone size={11} /> {phone}
          </p>
        )}
      </div>

      {/* Status badge */}
      <div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
          <Icon size={12} />
          {cfg.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5">
        {status === 'pending' && (
          <>
            <button
              onClick={() => handleUpdate('confirmed')}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#1a56db' }}
            >
              ✓ Confirm Order
            </button>
            <button
              onClick={() => handleUpdate('disputed')}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95"
            >
              ⊘ Report Dispute
            </button>
          </>
        )}
        {status === 'confirmed' && (
          <span className="text-xs text-green-600 font-semibold px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-center">Order Confirmed</span>
        )}
        {status === 'disputed' && (
          <span className="text-xs text-red-600 font-semibold px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-center">Dispute Reported</span>
        )}
      </div>

    </div>
  )
}