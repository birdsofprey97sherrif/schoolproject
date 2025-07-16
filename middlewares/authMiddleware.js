// import the jwt 
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const auth = (req,res,next)=>{
    const authHeader = req.headers.authorization
    // get actual header from the token
    const token = authHeader && authHeader.split(' ')[1]

    // check if we have token 
    if (!token) return res.status(404).json({message:"No token provided"})
        try {
            // verify the token using the secret key 
            const decode = jwt.verify(token,JWT_SECRET)
            // we attach the payload to the request object 
            // this is a logged in user 
            req.user =decode
            // proceed to the next route/function
            next()
        } catch (error) {
            res.status(500).json({message:error.message})
        }
}

//midleware to authorize accsess based on the user role
// accepts any number of allowed roles (eg 'admin','teacher')
//....params accepts any number of arguments and auto matically puts them into an array

const authorizeRoles = (...allowedRoles)=>{
    return(req,res,next)=>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({message:"Access denied: Insufficient Permissions.."})
        }
        next()
    }
}
module.exports = {auth,authorizeRoles}