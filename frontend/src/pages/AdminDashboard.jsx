import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { API_BASE_URL } from '../lib/api'

const initialItemForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  available: true,
}

const initialCategoryForm = {
  name: '',
  description: '',
}

const initialSettingsForm = {
  restaurantName: '',
  restaurantDescription: '',
}

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0))

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [itemForm, setItemForm] = useState(initialItemForm)
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm)
  const [settingsForm, setSettingsForm] = useState(initialSettingsForm)
  const [editingItemId, setEditingItemId] = useState(null)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState({ type: '', message: '' })

  const fetchAllData = async () => {
    try {
      const [menuResponse, categoriesResponse, settingsResponse] = await Promise.all([
        api.get('/menu'),
        api.get('/categories'),
        api.get('/settings'),
      ])

      setMenuItems(Array.isArray(menuResponse.data.data) ? menuResponse.data.data : [])
      setCategories(Array.isArray(categoriesResponse.data.data) ? categoriesResponse.data.data : [])

      const settings = settingsResponse.data?.data || {}
      setSettingsForm({
        restaurantName: settings.restaurantName || '',
        restaurantDescription: settings.restaurantDescription || '',
      })
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Unable to load menu data.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/admin/login', { replace: true })
      return
    }

    fetchAllData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin/login', { replace: true })
  }

  const resetItemForm = () => {
    setItemForm(initialItemForm)
    setEditingItemId(null)
    setImageFile(null)
  }

  const resetCategoryForm = () => {
    setCategoryForm(initialCategoryForm)
    setEditingCategoryId(null)
  }

  const handleItemInputChange = (event) => {
    const { name, value, type, checked } = event.target
    setItemForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCategoryInputChange = (event) => {
    const { name, value } = event.target
    setCategoryForm((current) => ({ ...current, [name]: value }))
  }

  const handleSettingsInputChange = (event) => {
    const { name, value } = event.target
    setSettingsForm((current) => ({ ...current, [name]: value }))
  }

  const handleSettingsSubmit = async (event) => {
    event.preventDefault()
    setAlert({ type: '', message: '' })

    try {
      await api.put('/settings', settingsForm)
      setAlert({ type: 'success', message: 'Restaurant details updated successfully.' })
      await fetchAllData()
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Unable to update restaurant details.',
      })
    }
  }

  const handleItemSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setAlert({ type: '', message: '' })

    const payload = new FormData()
    payload.append('name', itemForm.name.trim())
    payload.append('description', itemForm.description.trim())
    payload.append('price', String(itemForm.price))
    payload.append('category', itemForm.category)
    payload.append('available', String(itemForm.available))

    if (imageFile) {
      payload.append('image', imageFile)
    }

    try {
      if (editingItemId) {
        await api.put(`/menu/${editingItemId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await api.post('/menu', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      setAlert({
        type: 'success',
        message: editingItemId ? 'Menu item updated successfully.' : 'Menu item created successfully.',
      })
      resetItemForm()
      await fetchAllData()
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Unable to save the menu item.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditItem = (item) => {
    setEditingItemId(item._id)
    setItemForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category?._id || item.category || '',
      available: Boolean(item.available),
    })
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteItem = async (itemId) => {
    const confirmed = window.confirm('Delete this menu item?')

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/menu/${itemId}`)
      setAlert({ type: 'success', message: 'Menu item deleted.' })
      if (editingItemId === itemId) {
        resetItemForm()
      }
      await fetchAllData()
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Unable to delete this menu item.',
      })
    }
  }

  const handleCategorySubmit = async (event) => {
    event.preventDefault()
    setAlert({ type: '', message: '' })

    try {
      if (editingCategoryId) {
        await api.put(`/categories/${editingCategoryId}`, categoryForm)
      } else {
        await api.post('/categories', categoryForm)
      }

      setAlert({
        type: 'success',
        message: editingCategoryId ? 'Category updated successfully.' : 'Category created successfully.',
      })
      resetCategoryForm()
      await fetchAllData()
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Unable to save the category.',
      })
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
    })
  }

  const handleDeleteCategory = async (categoryId) => {
    const itemExists = menuItems.some((item) => {
      const currentCategory = item.category
      return currentCategory && (currentCategory._id === categoryId || currentCategory === categoryId)
    })

    if (itemExists) {
      setAlert({
        type: 'error',
        message: 'Please reassign or delete items in this category before removing it.',
      })
      return
    }

    try {
      await api.delete(`/categories/${categoryId}`)
      setAlert({ type: 'success', message: 'Category deleted.' })
      if (editingCategoryId === categoryId) {
        resetCategoryForm()
      }
      await fetchAllData()
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Unable to delete the category.',
      })
    }
  }

  const totalAvailable = menuItems.filter((item) => item.available).length

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-stone-900 md:text-4xl">Menu management</h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-200"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm text-stone-500">Total items</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">{menuItems.length}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm text-stone-500">Available now</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">{totalAvailable}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm text-stone-500">Categories</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">{categories.length}</p>
          </div>
        </div>
      </div>

      {alert.message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            alert.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Restaurant details</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-900">Homepage settings</h2>
          </div>
        </div>

        <form onSubmit={handleSettingsSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="restaurantName" className="mb-2 block text-sm font-medium text-stone-700">
              Restaurant name
            </label>
            <input
              id="restaurantName"
              name="restaurantName"
              value={settingsForm.restaurantName}
              onChange={handleSettingsInputChange}
              placeholder="Enter restaurant name"
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label htmlFor="restaurantDescription" className="mb-2 block text-sm font-medium text-stone-700">
              Short description
            </label>
            <textarea
              id="restaurantDescription"
              name="restaurantDescription"
              rows={4}
              value={settingsForm.restaurantDescription}
              onChange={handleSettingsInputChange}
              placeholder="Describe your restaurant"
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Save homepage details
          </button>
        </form>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Menu item</p>
              <h2 className="mt-2 text-2xl font-bold text-stone-900">
                {editingItemId ? 'Edit item' : 'Add new item'}
              </h2>
            </div>
            {editingItemId && (
              <button
                type="button"
                onClick={resetItemForm}
                className="text-sm font-semibold text-stone-500 transition hover:text-stone-800"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleItemSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-700">
                Item name
              </label>
              <input
                id="name"
                name="name"
                value={itemForm.name}
                onChange={handleItemInputChange}
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                placeholder="e.g. Truffle Pasta"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-stone-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={itemForm.description}
                onChange={handleItemInputChange}
                rows={4}
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                placeholder="Describe the dish and its flavor profile"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-medium text-stone-700">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={itemForm.price}
                  onChange={handleItemInputChange}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  placeholder="19.99"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-medium text-stone-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={itemForm.category}
                  onChange={handleItemInputChange}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-stone-700">Availability</p>
                <p className="text-sm text-stone-500">Visible on the public menu</p>
              </div>
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  name="available"
                  checked={itemForm.available}
                  onChange={handleItemInputChange}
                  className="h-5 w-5 rounded border-stone-300 text-orange-500 focus:ring-orange-400"
                />
                <span className="text-sm font-medium text-stone-700">Available</span>
              </label>
            </div>

            <div>
              <label htmlFor="image" className="mb-2 block text-sm font-medium text-stone-700">
                Image
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files[0])}
                className="block w-full text-sm text-stone-600 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving...' : editingItemId ? 'Update item' : 'Add item'}
            </button>
          </form>
        </section>

        <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Categories</p>
              <h2 className="mt-2 text-2xl font-bold text-stone-900">
                {editingCategoryId ? 'Edit category' : 'Create category'}
              </h2>
            </div>
            {editingCategoryId && (
              <button
                type="button"
                onClick={resetCategoryForm}
                className="text-sm font-semibold text-stone-500 transition hover:text-stone-800"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleCategorySubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="category-name" className="mb-2 block text-sm font-medium text-stone-700">
                Category name
              </label>
              <input
                id="category-name"
                name="name"
                value={categoryForm.name}
                onChange={handleCategoryInputChange}
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                placeholder="e.g. Signature Dishes"
                required
              />
            </div>

            <div>
              <label htmlFor="category-description" className="mb-2 block text-sm font-medium text-stone-700">
                Description
              </label>
              <textarea
                id="category-description"
                name="description"
                value={categoryForm.description}
                onChange={handleCategoryInputChange}
                rows={3}
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                placeholder="Optional category summary"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 font-semibold text-stone-800 transition hover:bg-stone-200"
            >
              {editingCategoryId ? 'Update category' : 'Save category'}
            </button>
          </form>

          <div className="mt-8 space-y-3">
            {categories.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-500">
                No categories yet.
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-stone-900">{category.name}</p>
                    {category.description && <p className="text-sm text-stone-500">{category.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditCategory(category)}
                      className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category._id)}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-soft md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Menu list</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-900">Current offerings</h2>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 h-40 animate-pulse rounded-2xl bg-stone-200" />
        ) : menuItems.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-stone-600">
            No menu items added yet.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {menuItems.map((item) => (
              <div key={item._id} className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50">
                    {item.image ? (
                      <img
                        src={`${API_BASE_URL}${item.image}`}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl">🍽️</div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-stone-900">{item.name}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${
                          item.available
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {item.available ? 'Available' : 'Hidden'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-stone-600">{item.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="rounded-full bg-white px-2 py-1">{item.category?.name || 'Uncategorized'}</span>
                      <span className="rounded-full bg-white px-2 py-1">{formatPrice(item.price)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditItem(item)}
                    className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item._id)}
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
