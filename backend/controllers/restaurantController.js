import RestaurantSetting from '../models/RestaurantSetting.js'

export const defaultRestaurantSettings = {
  restaurantName: 'Digital Menu',
  restaurantDescription: 'Fresh, thoughtfully prepared dishes served with warm hospitality.',
}

export const getRestaurantSettings = async (req, res, next) => {
  try {
    let settings = await RestaurantSetting.findOne()

    if (!settings) {
      settings = await RestaurantSetting.create(defaultRestaurantSettings)
    }

    res.status(200).json({
      success: true,
      data: settings,
    })
  } catch (error) {
    next(error)
  }
}

export const updateRestaurantSettings = async (req, res, next) => {
  try {
    const { restaurantName, restaurantDescription } = req.body

    let settings = await RestaurantSetting.findOne()

    if (!settings) {
      settings = new RestaurantSetting(defaultRestaurantSettings)
    }

    if (restaurantName !== undefined) {
      settings.restaurantName = String(restaurantName).trim() || defaultRestaurantSettings.restaurantName
    }

    if (restaurantDescription !== undefined) {
      settings.restaurantDescription =
        String(restaurantDescription).trim() || defaultRestaurantSettings.restaurantDescription
    }

    await settings.save()

    res.status(200).json({
      success: true,
      data: settings,
    })
  } catch (error) {
    next(error)
  }
}
