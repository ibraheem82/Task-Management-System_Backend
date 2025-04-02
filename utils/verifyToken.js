import jsonwebtoken from "jsonwebtoken";

function verifyToken(token) {
  try {
    // Attempt to verify and decode the token
    const decodedPayload = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET
    );
    
    
    return decodedPayload;
  } catch (err) {
  return false
  }
}

export default verifyToken;