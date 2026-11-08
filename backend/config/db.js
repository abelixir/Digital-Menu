import mongoose from 'mongoose'

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI

  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in environment variables.')
  }

  try {
    const conn = await mongoose.connect(mongoURI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    throw error
  }
}
