export default function AdminDashboard() {
  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Admin dashboard</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900 md:text-4xl">Overview</h1>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          ['Orders today', '142'],
          ['Revenue', '$4,820'],
          ['Avg. prep time', '12 min'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm text-stone-500">{label}</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-stone-600">
        This is a placeholder admin dashboard. You can add menu management, orders, analytics, and inventory here later.
      </div>
    </div>
  )
}
