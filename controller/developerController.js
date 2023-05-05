const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Developer = require('../models/Developer');

const register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      Compétences,
      yearsOfExperience,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const developer = new Developer({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      Compétences,
      yearsOfExperience,
    });
    await developer.save();
    const token = jwt.sign({ developerId: developer._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const developer = await Developer.findOne({ email });
    if (!developer) {
      throw new Error('Adresse email ou mot de passe incorrect.');
    }
    const passwordMatch = await bcrypt.compare(password, developer.password);
    if (!passwordMatch) {
      throw new Error('Adresse email ou mot de passe incorrect.');
    }
    const token = jwt.sign({ developerId: developer._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email, Compétences, yearsOfExperience } =
      req.body;
    const developer = await Developer.findById(req.developer._id);
    if (!developer) {
      throw new Error();
    }
    if (developer.email !== email) {
      const existingDeveloper = await Developer.findOne({ email });
      if (existingDeveloper) {
        throw new Error('Cette adresse email est déjà utilisée par un autre développeur.');
      }
    }
    developer.firstName = firstName;
    developer.lastName = lastName;
    developer.email = email;
    developer.Compétences = Compétences;
    developer.yearsOfExperience = yearsOfExperience;
    await developer.save();
    res.json({ message: 'Votre profil a été mis à jour.' });
  }   catch (err) {
    next(err);
  }
};
const createProfile = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      Compétences,
      yearsOfExperience,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const developer = new Developer({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      skills,
      yearsOfExperience,
    });
    await developer.save();
    const token = jwt.sign(
      { developerId: developer._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};
const deleteProfile = async (req, res, next) => {
  try {
    const developer = await Developer.findById(req.developer._id);
    if (!developer) {
      throw new Error();
    }
    await developer.remove();
    res.json({ message: "Votre profil a été supprimé." });
  } catch (err) {
    next(err);
  }
};

