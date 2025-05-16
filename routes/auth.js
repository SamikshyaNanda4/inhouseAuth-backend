import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {db} from "../dist/db.js"
import {users} from "../dist/schema.js"
import {eq} from "drizzle-orm"
//changes made



const router=express.Router()
const JWT_SECRET=process.env.JWT_SECRET

//SignUp
router.post("/sign-up",async(req,res)=>{
    const {name,email,password}=req.body;
    const existing=await db.select().from(users).where(eq(users.email,email));
    if(existing.length>0){
        return res.status(400).json({message:"User alreay Exists!!!"});
    }

    const hashed=await bcrypt.hash(password,10);
    const result=await db.insert(users).values({
        name,
        email,
        password:hashed,
    }).returning()
    const token=jwt.sign({id:result[0].id},JWT_SECRET,{
        expiresIn:"24h"
    })
    res.json({token})
})

//SignIn
router.post("/sign-in",async(req,res)=>{
    const {email,password}=req.body;
    const result=await db.select().from(users).where(eq(users.email,email));
    const user=result[0]
    if(!user) return res.status(400).json({
        message: "Invalid Credential"
    })

    const valid=await bcrypt.compare(password,user.password)
    if(!valid) return res.status(400).json({
        message:"Invalid Credentials"
    })

    const token=jwt.sign({
        id:user.id
    },JWT_SECRET,{
        expiresIn:"24h"
    })

    res.json({token})
})

//Middleware
const authMiddleware=async(req,res,next)=>{
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

///getUser

router.get("/me",authMiddleware,(req,res)=>{
    const {password,...userWithoutPass}=req.user;
    res.json(userWithoutPass)
})

router.put("/me",authMiddleware,async(req,res)=>{
    const {name,description}=req.body;
    await db.update(users)
    .set({name,description})
    .where(eq(users.id,req.user.id))

    const updated=await db.select().from(users).where(eq(users.id,req.user.id))
    const {password,...userWithoutPass}=updated[0];
    res.json(userWithoutPass)
})

export default router;