import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectedRoute = async (req,res,next ) => {
    try {
            const token = req.cookies.jwt;

    if(!token) {
        return res.status(401).json({message: "Unauthorized User"});
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if(!decode) {
        return res.status(401).json({message: "Unauthorized User"})
    }

    const user = await User.findById(decode.userId).select('-password'); //-password means we don't want to select password

    if(!user) {
        return res.status(404).json({message: "User Not Found"});
    }

    req.user = user;

    next(); //call the next function after this
    
    } catch(error) {
        console.log("Error in protectedRoute middleware" , error.message);
        res.status(500).json({message: "Internal Server Error"});
    } 
};