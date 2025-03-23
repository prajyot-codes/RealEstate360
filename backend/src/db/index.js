import mongoose from "mongoose"

const connectDB= async () => {
    try {
        const connectionintance =await mongoose.connect(`${process.env.MONGO_URI}/ESTATEDB`)
        console.log(`MongoDB connected! DB host: ${connectionintance.connection.host} `)
    } catch (error) {
        console.log(`Mongo DB connection error ${error}`);
        process.exit(1);
        
    }
}

export default connectDB;