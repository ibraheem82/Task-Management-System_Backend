import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';

const isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try finding user or admin
    const user = await User.findById(decoded.id);
    const admin = await Admin.findById(decoded.id);

    if (!user && !admin) {
      return res.status(401).json({ message: 'User/Admin not found' });
    }

    req.userAuth = user || admin;
    req.role = user ? 'user' : 'admin';

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default isLoggedIn;
