export default function AdminLogin() {
  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Admin access</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">Login</h1>

      <form className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            defaultValue="admin@bistro17.com"
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            defaultValue="password123"
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          Sign in
        </button>
      </form>
    </div>
  )
}
