import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (isConnected) return console.log(`DB connected already`);
    try {
        await mongoose.connect(process.env.MONGODB_URL || "", {
            dbName: "Brocella"
        })
        isConnected = true;
        console.log(`DB connected`);
    } catch (error) {
        console.error(error);
    }

}