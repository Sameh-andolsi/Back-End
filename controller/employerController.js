const Employer = require("../models/employerModel");
const jwt = require("jsonwebtoken");


// Fonction pour enregistrer un nouvel employeur
const register = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const logo = req.body.logo;
  const website = req.body.website;
  const contactEmail = req.body.contactEmail;
  const contactPhone = req.body.contactPhone;
  const createdAt = req.body.createdAt || new Date();

  // Valider les entrées de l'utilisateur
  if (!name || !description || !contactEmail || !contactPhone) {
    return res
      .status(422)
      .json({ message: "Please provide all required information." });
  }

  // Créer un nouvel employeur
  const employer = new Employer({
    name: name,
    description: description,
    logo: logo,
    website: website,
    contactEmail: contactEmail,
    contactPhone: contactPhone,
    createdAt: createdAt,
  });

  employer
    .save()
    .then((result) => {
      // Retourner un token JWT pour l'employeur authentifié
      const token = jwt.sign(
        { email: result.contactEmail, employerId: result._id.toString() },
        "somesupersecretkey",
        { expiresIn: "1h" }
      );
      res.status(201).json({ message: "Employer created!", token: token });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "An error occurred while creating the employer." });
    });
};

// Fonction pour authentifier un employeur existant
const login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Valider les entrées de l'utilisateur
  if (!email || !password) {
    return res
      .status(422)
      .json({ message: "Please provide email and password." });
  }

  // Trouver l'employeur correspondant à l'email fourni
  Employer.findOne({ contactEmail: email })
    .then((employer) => {
      if (!employer) {
        return res.status(401).json({ message: "Authentication failed." });
      }
      // Vérifier le mot de passe de l'employeur
      if (password !== employer.password) {
        return res.status(401).json({ message: "Authentication failed." });
      }
      // Retourner un token JWT pour l'employeur authentifié
      const token = jwt.sign(
        { email: employer.contactEmail, employerId: employer._id.toString() },
        "somesupersecretkey",
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({ message: "Authentication successful!", token: token });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({
          message: "An error occurred while authenticating the employer.",
        });
    });
};



const create = async (req, res, next) => {
  try {
    const employer = new Employer(req.body);
    await employer.save();
    res.status(201).json(employer);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const employer = await Employer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employer) {
      return res.status(404).json({ message: "Entreprise non trouvée." });
    }
    res.json(employer);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: "Entreprise non trouvée." });
    }
    res.json({ message: "Entreprise supprimée avec succès." });
  } catch (err) {
    next(err);
  }
};

const listJobOffers = async (req, res, next) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: "Entreprise non trouvée." });
    }
    const jobOffers = await employer.populate("jobOffers").execPopulate();
    res.json(jobOffers);
  } catch (err) {
    next(err);
  }
};
const publishJobOffer = async (req, res, next) => {
  try {
    const employerId = req.params.id;
    const { title, description, type, location, salary } = req.body;

    // Vérifier que tous les champs nécessaires sont renseignés
    if (!title || !description || !type || !location || !salary) {
      return res
        .status(422)
        .json({ message: "Please provide all required information." });
    }

    // Vérifier que l'employeur existe
    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found." });
    }

    // Créer une nouvelle offre d'emploi
    const newJobOffer = {
      title,
      description,
      type,
      location,
      salary,
      employer: employerId,
    };

    // Ajouter l'offre d'emploi à l'employeur
    employer.jobOffers.push(newJobOffer);
    await employer.save();

    res
      .status(201)
      .json({ message: "Job offer created!", jobOffer: newJobOffer });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, update, remove, listJobOffers, publishJobOffer };
