const jwt = require("jsonwebtoken");
const Employer = require("../models/Employer");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const employer = await Employer.findById(decodedToken.employerId);
    if (!employer) {
      throw new Error();
    }
    req.employer = employer;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Vous devez être connecté pour accéder à cette page." });
  }
};
