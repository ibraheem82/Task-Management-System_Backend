import User from '../models/user.model.js';
import verifyToken from "../utils/verifyToken.js";


// ** checking if a user is logged in or not.
const isUserLoggedIn = async (req, res, next) => {
  // get token from header
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];
  const verifiedToken = verifyToken(token); 
    console.log(verifiedToken)
  if (verifiedToken) {
    try {
      const user = await User.findById(verifiedToken.id).select(
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

export default isUserLoggedIn;