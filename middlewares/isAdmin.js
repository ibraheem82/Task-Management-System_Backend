import Admin from "../models/admin.model.js";

const isAdmin = async (req, res, next) => {
    
    const userId = req?.userAuth?._id;
    console.log(userId);
    const adminFound = await Admin.findById(userId); 
    if (adminFound?.role === 'admin') {
        next();
    } else {
        next(new Error('Access Denied, admin only 🔐'));
    }
};

export default isAdmin;