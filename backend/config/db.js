import mongoose from "mongoose";


export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://omkarr:RSvo1234@cluster0.darrqbo.mongodb.net/food-del').then(()=>console.log("DB connected"));
}