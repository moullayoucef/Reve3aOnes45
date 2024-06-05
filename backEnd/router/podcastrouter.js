const express = require("express");
const router = express.Router();
const multer = require("multer");
const Podcast = require("../model/podcast");

// Configuration de Multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/pdcast"); // Répertoire où les fichiers seront sauvegardés
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nom du fichier original
  },
});
const upload = multer({ storage: storage });

// Route pour POST un nouveau podcast
router.post("/podcasts", upload.single("Podcast"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const audio = req.file;
    const newPodcast = new Podcast({
      title,
      description,
      audio: audio.path, // Chemin du fichier audio
    });
    await newPodcast.save();
    res.status(201).json(newPodcast);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route pour GET tous les podcasts
router.get("/podcasts", async (req, res) => {
  try {
    const podcasts = await Podcast.find();
    res.status(200).json(podcasts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route pour DELETE un podcast par son ID
router.delete("/podcasts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPodcast = await Podcast.findByIdAndDelete(id);
    if (!deletedPodcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }
    res.status(200).json({ message: "Podcast deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
