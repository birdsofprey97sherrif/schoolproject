const {User, Teacher} = require('../models/SchoolDB')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
// register logic 
exports.registerAdmin = async (req,res)=>{
    const {name,email,password,secretKey}=req.body
    //verify admin secret key
    if (secretKey!==process.env.secretKey){
        return res.status(403).json({message:"Unauthorized Account Creation"})
    }
    // check if user exist
    const userExist = await User.findOne({email})
    if (userExist){
        res.json({message:"Email already exist"})
    }
    //hashing password
    const hashedPassword = await bcrypt.hash(password,10)
    const user = new User({
        name,
        email,
        password:hashedPassword,
        role:"admin",
        isActive:true,
        teacher:null,
        parent:null
    })
    const newuser = await user.save()
    res.status(201).json({message:"User created successfully",newuser})

}

// login
exports.login = async (req,res)=>{
    const {email,password}= req.body
    //console.log(email,password)
    // checkthe user by the email 
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message:"Invalid credentials"})
    }
    // check if the user is active 
    if (!user.isActive){
        return res.status(403).json({message:"Your account is deactivated"})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch){
        return res.status(401).json({message:"Invalid credentials"})
    }
    // gennerate token 
    const token = jwt.sign(
        {userId:user._id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
    )
    res.json({message:"login sucessful",
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role

        }
    })
}