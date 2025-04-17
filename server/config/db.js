import mongoose from "mongoose";

export const connectDb = async()=>
{
     mongoose.connection.on('connected',()=>
    {
        console.log(
            "Connected to mongodb"
        )
    })

    await mongoose.connect(`${process.env.MONGO_URI}/mern-auth`);
}