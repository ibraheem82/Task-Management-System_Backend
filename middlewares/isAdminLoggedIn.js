import Admin from '../models/admin.model.js';
import verifyToken from "../utils/verifyToken.js";
const isAdminLoggedIn = async (req, res, next) => {
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];
  const verifiedToken = verifyToken(token); 
    console.log(verifiedToken)
  if (verifiedToken) {
    try {
      const user = await Admin.findById(verifiedToken.id).select(
        "username email role"
      );
      req.userAuth = user;
      next();
    } catch (error) {
       next(error);
    }

  } else {
    const err = new Error("Token expired/invalid");
    next(err);
  }
};

export default isAdminLoggedIn;