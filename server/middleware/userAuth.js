import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
   
  if (!token) {
    return res.json({ success: false, message: "Invalid" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
     console.log(tokenDecode);
    if (tokenDecode.id) {
      req.body = req.body || {}; // Ensure req.body is initialized
      req.body.userId = tokenDecode.id;
    } else {
     return res.json({ success: false, message: "Invalid Token Login Again" });
    }
    next();
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
