import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

const defaultRestaurant = {
  restaurantName: 'Digital Menu',
  restaurantDescription: 'Fresh, thoughtfully prepared dishes served with warm hospitality.',
}

export default function Home() {
  const [restaurant, setRestaurant] = useState(defaultRestaurant)

  useEffect(() => {
    const fetchRestaurantSettings = async () => {
      try {
        const response = await api.get('/settings')
        const settings = response.data?.data

        if (settings) {
          setRestaurant({
            restaurantName: settings.restaurantName || defaultRestaurant.restaurantName,
            restaurantDescription:
              settings.restaurantDescription || defaultRestaurant.restaurantDescription,
          })
        }
      } catch (error) {
        console.error('Unable to load restaurant settings:', error)
      }
    }

    fetchRestaurantSettings()
  }, [])

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 text-white shadow-soft md:p-12">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-50">
            Welcome to {restaurant.restaurantName}
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
            {restaurant.restaurantName}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-orange-50 md:text-lg">
            {restaurant.restaurantDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
