import User from "../models/user.model.js";

const isUser = async (req, res, next) => {
    // Find user
    
    const userId = req?.userAuth?._id; // get the person that is logged in by it id.
    console.log(userId);
    const userFound = await User.findById(userId); 
    if (userFound?.role === 'user') {
        next();
    } else {
        next(new Error('Access Denied, authenticated user only 🔐'));
    }
};

export default isUser;