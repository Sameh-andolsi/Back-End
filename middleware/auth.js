const jwt = require("jsonwebtoken");
const Developer = require("../models/Developer");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const developer = await Developer.findById(decodedToken.developerId);
    if (!developer) {
      throw new Error();
    }
    req.developer = developer;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Vous devez être connecté pour accéder à cette page." });
  }
};
