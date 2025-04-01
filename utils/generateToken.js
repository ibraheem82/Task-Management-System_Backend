import jwt from "jsonwebtoken";

/**
 * Generates a JWT token for a user
 * @param {string} id - The user's ID
 * @returns {string} - The generated JWT token
 */
const generateToken = (id) => {
    const jwtExpiration = parseInt(process.env.JWT_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        expiresIn: jwtExpiration 
    });
};

export default generateToken;