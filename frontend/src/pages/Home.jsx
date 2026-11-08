import { Link } from 'react-router-dom'

const highlights = [
  { label: 'Freshly prepared', value: 'Daily' },
  { label: 'Average delivery', value: '18 min' },
  { label: 'Guest rating', value: '4.9/5' },
]

const popularItems = [
  { name: 'Truffle Pasta', price: '$18', description: 'Creamy parmesan sauce with roasted mushrooms.' },
  { name: 'Crispy Chicken Bowl', price: '$16', description: 'Rice, greens, avocado and signature house drizzle.' },
  { name: 'Sunset Burger', price: '$15', description: 'Chargrilled beef, cheddar and caramelised onion jam.' },
]

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 text-white shadow-soft md:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-50">
              Welcome to Bistro 17
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
              Great food, fast service, memorable moments.
            </h1>
            <p className="mt-4 max-w-xl text-base text-orange-50 md:text-lg">
              Explore our signature dishes, order with ease, and enjoy a smooth dining experience from the first bite to the final check.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                Browse menu
              </Link>
              <Link
                to="/admin/login"
                className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Admin login
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <div className="rounded-[1.5rem] bg-stone-950/20 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-orange-100">Today’s special</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Fire-Grilled Salmon</h2>
              <p className="mt-2 text-sm text-orange-50">
                Lemon herb glaze, seasonal vegetables, and warm garlic rice.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-orange-50">Price</span>
                  <span className="text-lg font-bold text-white">$24</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-orange-50">Prep time</span>
                  <span className="text-lg font-bold text-white">12 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.label} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-stone-900">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Popular picks</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900">Favorites from the kitchen</h2>
          </div>
          <Link to="/menu" className="hidden text-sm font-semibold text-orange-600 hover:text-orange-700 md:inline-flex">
            View full menu →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {popularItems.map((item) => (
            <article key={item.name} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-4xl">
                🍽️
              </div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-stone-900">{item.name}</h3>
                <span className="text-lg font-bold text-orange-600">{item.price}</span>
              </div>
              <p className="mt-3 text-sm text-stone-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
