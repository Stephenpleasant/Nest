import { useState } from 'react'
import OrdersHeader from './OrdersHeader'
import OrdersTable from './OrdersTable'
import { useOrders } from './UseOrder'

export default function AgentOrdersPage() {
  const [search, setSearch]   = useState('')
  const [period, setPeriod]   = useState('This month')
  const [sortBy, setSortBy]   = useState('Newest')

  const { orders, loading, error, updateStatus } = useOrders()

  const filtered = orders.filter(o =>
    o.propertyTitle?.toLowerCase().includes(search.toLowerCase()) ||
    o.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    o._id?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">

        <OrdersHeader
          search={search}
          setSearch={setSearch}
          period={period}
          setPeriod={setPeriod}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading && (
          <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
            Loading orders...
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-24 text-red-500 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <OrdersTable orders={filtered} onUpdateStatus={updateStatus} />
        )}

      </div>
    </div>
  )
}