import jwt from "jsonwebtoken";

// ✅ Protect + optional role check
export const protect = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization;

    if (!token)
      return res.status(401).json({ message: "Access denied" });

    try {
      const decoded = jwt.verify(token, "SECRET_KEY");
      req.user = decoded;

      // 🔐 Role check
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access forbidden: insufficient rights" });
      }

      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
