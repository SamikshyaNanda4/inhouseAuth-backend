import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {db} from "../dist/db.js"
import {users} from "../dist/schema.js"
import {eq} from "drizzle-orm"


const router=express.Router()
const JWT_SECRET=process.env.JWT_SECRET

export const authMiddleware=async(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    try{
        const decoded=jwt.verify(authHeader.split(" ")[1],JWT_SECRET);
        const result=await db.select().from(users).where(eq(users.id,decoded.id))
        if(!result[0]){
            return res.status(401).json({
                message:"Invalid Token"
            })
        }
        req.user=result[0];
        next();
    }catch{
        res.status(401).json({
            message:"Invalid token"
        })
    }
}