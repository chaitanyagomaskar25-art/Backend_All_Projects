import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Mongo db connected")
  } catch (error) {
    console.log("Mongo db connect failed", error)
    process.exit(1)
  }
}

export default connectDB