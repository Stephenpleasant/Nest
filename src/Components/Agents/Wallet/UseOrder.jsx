import { useState, useEffect } from 'react'

const API_URL = 'https://your-api.com/api/bookings' // 🔁 Replace with your real endpoint

export function useOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token') // your JWT token key

    fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch orders')
        return res.json()
      })
      .then(data => {
        // 🔁 Adjust this to match your API response shape
        // e.g. if your API returns { bookings: [...] } use data.bookings
        setOrders(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token')

    await fetch(`${API_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    setOrders(prev =>
      prev.map(o => o._id === id ? { ...o, status } : o)
    )
  }

  return { orders, loading, error, updateStatus }
}