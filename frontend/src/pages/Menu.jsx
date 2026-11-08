export default function Menu() {
  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Customer menu</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900 md:text-4xl">Explore the menu</h1>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          ['Signature Pasta', '$18', 'Classic comfort with roasted garlic and herbs.'],
          ['Crispy Chicken Wrap', '$14', 'Fresh greens, crunchy slaw and spicy aioli.'],
          ['Mango Citrus Salad', '$12', 'A bright and refreshing seasonal favorite.'],
          ['Chef Burger', '$16', 'Double patty, cheddar and smoked onion jam.'],
          ['Lemon Herb Salmon', '$24', 'Light, citrusy and perfectly grilled.'],
          ['Warm Brownie', '$9', 'Rich and decadent, served with vanilla cream.'],
        ].map(([name, price, description]) => (
          <div key={name} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-stone-900">{name}</h2>
              <span className="text-lg font-bold text-orange-600">{price}</span>
            </div>
            <p className="mt-3 text-sm text-stone-600">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
