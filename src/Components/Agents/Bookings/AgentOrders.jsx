import { useState, useMemo } from 'react'
import { RefreshCw } from 'lucide-react'
import OrdersHeader from './OrdersHeader'
import OrdersTable from './OrdersTable'
import { useOrders } from './UseOrder'

const BLUE = '#1a56db'
const NAVY = '#0b1a2e'

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: bg }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold" style={{ color, fontFamily: 'Poppins, sans-serif' }}>{value}</p>
        <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// Filter by period
function filterByPeriod(orders, period) {
  if (period === 'All time') return orders
  const now = new Date()
  const start = new Date()
  if (period === 'Today')      start.setHours(0, 0, 0, 0)
  if (period === 'This week')  start.setDate(now.getDate() - now.getDay())
  if (period === 'This month') start.setDate(1), start.setHours(0, 0, 0, 0)
  if (period === 'This year')  start.setMonth(0, 1), start.setHours(0, 0, 0, 0)
  return orders.filter(o => new Date(o.bookedAt || o.date) >= start)
}

// Sort orders
function sortOrders(orders, sortBy) {
  const arr = [...orders]
  if (sortBy === 'Newest')              arr.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
  if (sortBy === 'Oldest')              arr.sort((a, b) => new Date(a.bookedAt) - new Date(b.bookedAt))
  if (sortBy === 'Amount: High to Low') arr.sort((a, b) => b.amount - a.amount)
  if (sortBy === 'Amount: Low to High') arr.sort((a, b) => a.amount - b.amount)
  return arr
}

export default function AgentOrdersPage() {
  const [search,  setSearch]  = useState('')
  const [period,  setPeriod]  = useState('This month')
  const [sortBy,  setSortBy]  = useState('Newest')

  const { orders, loading, error, updateStatus, refetch } = useOrders()

  const processed = useMemo(() => {
    let result = filterByPeriod(orders, period)
    result = result.filter(o =>
      o.propertyTitle?.toLowerCase().includes(search.toLowerCase()) ||
      o.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      o._id?.toLowerCase().includes(search.toLowerCase())
    )
    return sortOrders(result, sortBy)
  }, [orders, period, search, sortBy])

  const stats = useMemo(() => ({
    total:     orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    revenue:   orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + (o.amount || 0), 0),
  }), [orders])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">

        <OrdersHeader
          search={search}   setSearch={setSearch}
          period={period}   setPeriod={setPeriod}
          sortBy={sortBy}   setSortBy={setSortBy}
        />

        {/* Stats row */}
        {!loading && !error && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📋" label="Total Bookings"  value={stats.total}     color={BLUE} bg="#eff6ff" />
            <StatCard icon="⏳" label="Pending"         value={stats.pending}   color="#d97706" bg="#fffbeb" />
            <StatCard icon="✅" label="Confirmed"        value={stats.confirmed} color="#16a34a" bg="#f0fdf4" />
            <StatCard icon="💰" label="Confirmed Revenue" value={`₦${stats.revenue.toLocaleString()}`} color={NAVY} bg="#f8fafc" />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400 text-sm">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            Loading bookings…
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="text-4xl">⚠️</div>
            <p className="text-red-500 text-sm font-medium">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: BLUE }}
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">
                Showing <strong className="text-gray-800">{processed.length}</strong> booking{processed.length !== 1 ? 's' : ''}
                {period !== 'All time' && <span className="text-gray-400"> · {period}</span>}
              </p>
              <button
                onClick={refetch}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-blue-600 transition-colors"
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
            <OrdersTable orders={processed} onUpdateStatus={updateStatus} />
          </>
        )}

      </div>
    </div>
  )
}