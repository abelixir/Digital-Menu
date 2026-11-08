import express from 'express'
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemById,
  getMenuItems,
  updateMenuItem,
} from '../controllers/menuItemController.js'
import { protect } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

router.get('/', getMenuItems)
router.get('/:id', getMenuItemById)
router.post('/', protect, upload.single('image'), createMenuItem)
router.put('/:id', protect, upload.single('image'), updateMenuItem)
router.delete('/:id', protect, deleteMenuItem)

export default router
