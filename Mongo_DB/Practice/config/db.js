import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo db connected")
    } catch (error) {
               console.log("MongoDB connection failed:", error.message);

    }
}

