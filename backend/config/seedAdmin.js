import User from '../models/User.js'

export const seedDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@digitalmenu.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin@123'

  const existingAdmin = await User.findOne({ email })

  if (existingAdmin) {
    return existingAdmin
  }

  const admin = await User.create({
    name: 'System Admin',
    email,
    password,
    role: 'admin',
  })

  console.log(`Default admin user created: ${admin.email}`)
  return admin
}
