import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json())

app.use("/api/auth",authRoutes)

app.listen(8000,()=>{
    console.log("Server is running in port 8000")
})