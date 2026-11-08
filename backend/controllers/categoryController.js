import Category from '../models/Category.js'

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: categories,
    })
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      })
    }

    const categoryExists = await Category.findOne({ name: name.trim() })

    if (categoryExists) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists.',
      })
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || '',
    })

    res.status(201).json({
      success: true,
      data: category,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    const category = await Category.findById(id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      })
    }

    if (name) category.name = name.trim()
    if (description !== undefined) category.description = description

    const updatedCategory = await category.save()

    res.status(200).json({
      success: true,
      data: updatedCategory,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      })
    }

    await category.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}
