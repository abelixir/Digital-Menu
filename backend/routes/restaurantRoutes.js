import express from 'express'
import { getRestaurantSettings, updateRestaurantSettings } from '../controllers/restaurantController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getRestaurantSettings)
router.put('/', protect, updateRestaurantSettings)

export default router
