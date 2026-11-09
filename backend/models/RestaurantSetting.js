import mongoose from 'mongoose'

const restaurantSettingSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      default: 'Digital Menu',
      trim: true,
    },
    restaurantDescription: {
      type: String,
      default: 'Fresh, thoughtfully prepared dishes served with warm hospitality.',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const RestaurantSetting = mongoose.model('RestaurantSetting', restaurantSettingSchema)

export default RestaurantSetting
