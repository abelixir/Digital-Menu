import { useEffect, useState } from 'react'
import api, { API_BASE_URL } from '../lib/api'

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0))

export default function Menu() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu', {
          params: { available: true },
        })

        setItems(Array.isArray(response.data.data) ? response.data.data : [])
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load the menu right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Customer menu</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900 md:text-4xl">Explore the menu</h1>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl bg-stone-200" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-stone-600">
          No menu items are available right now. Please check back soon.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item._id} className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="h-52 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50">
                {item.image ? (
                  <img
                    src={`${API_BASE_URL}${item.image}`}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl">🍽️</div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-stone-900">{item.name}</h2>
                    <p className="mt-1 inline-flex rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
                      {item.category?.name || 'General'}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-orange-600">{formatPrice(item.price)}</span>
                </div>

                <p className="mt-4 text-sm leading-6 text-stone-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
