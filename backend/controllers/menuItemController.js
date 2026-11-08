import MenuItem from '../models/MenuItem.js'

export const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, available } = req.query
    const filter = {}

    if (category) {
      filter.category = category
    }

    if (available !== undefined) {
      filter.available = available === 'true'
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const items = await MenuItem.find(filter)
      .populate('category', 'name description')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: items,
    })
  } catch (error) {
    next(error)
  }
}

export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category', 'name description')

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.',
      })
    }

    res.status(200).json({
      success: true,
      data: item,
    })
  } catch (error) {
    next(error)
  }
}

export const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, available } = req.body

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, and price are required.',
      })
    }

    const itemData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      available: available !== undefined ? Boolean(available) : true,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    }

    const item = await MenuItem.create(itemData)

    const populatedItem = await item.populate('category', 'name description')

    res.status(201).json({
      success: true,
      data: populatedItem,
    })
  } catch (error) {
    next(error)
  }
}

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params
    const item = await MenuItem.findById(id)

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.',
      })
    }

    const { name, description, price, category, available } = req.body

    if (name) item.name = name.trim()
    if (description) item.description = description.trim()
    if (price !== undefined) item.price = Number(price)
    if (category) item.category = category
    if (available !== undefined) item.available = Boolean(available)
    if (req.file) item.image = `/uploads/${req.file.filename}`

    const updatedItem = await item.save()
    const populatedItem = await updatedItem.populate('category', 'name description')

    res.status(200).json({
      success: true,
      data: populatedItem,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params
    const item = await MenuItem.findById(id)

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.',
      })
    }

    await item.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}
