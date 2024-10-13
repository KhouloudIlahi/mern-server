const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import des modèles
const Medecin = require('./models/Medecin');
const Patient = require('./models/patient');
const Animal = require('./models/Animal');
const Rendezvous = require('./models/Rendezvous');
const Rapport = require('./models/Rapport');

const port = process.env.PORT || 5001;
const uri = "mongodb+srv://veterinaire:pzSMAeIkegc5Y21z@cluster0.d9iqk.mongodb.net/vetau?retryWrites=true&w=majority&appName=Cluster0";



const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Vétérinaire en ligne !');
});


// Connexion à MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1); // Arrête le processus si la connexion échoue
  });


// CRUD pour les Médecins

// 1. Créer un nouveau médecin
app.post('/medecins', async (req, res) => {
  try {
      const { nom, prenom, specialite, telephone, email } = req.body;
      const medecin = await Medecin.create({
          nom,
          prenom,
          specialite,
          telephone,
          email
      });
      res.status(201).json(medecin);
  } catch (error) {
      console.error('Erreur lors de la création du médecin:', error);
      res.status(500).send('Erreur lors de la création du médecin');
  }
});

// 2. Obtenir tous les médecins
app.get('/medecins', async (req, res) => {
  try {
      const medecins = await Medecin.find();
      res.json(medecins);
  } catch (error) {
      console.error('Erreur lors de la récupération des médecins:', error);
      res.status(500).send('Erreur lors de la récupération des médecins');
  }
});

// 3. Obtenir un médecin par son ID
app.get('/medecins/:id', async (req, res) => {
  try {
      const medecin = await Medecin.findById(req.params.id);
      if (!medecin) {
          return res.status(404).send('Médecin non trouvé');
      }
      res.json(medecin);
  } catch (error) {
      console.error('Erreur lors de la récupération du médecin:', error);
      res.status(500).send('Erreur lors de la récupération du médecin');
  }
});

// 4. Mettre à jour un médecin
app.put('/medecins/:id', async (req, res) => {
  try {
      const { nom, prenom, specialite, telephone, email } = req.body;
      const medecin = await Medecin.findByIdAndUpdate(
          req.params.id,
          { nom, prenom, specialite, telephone, email },
          { new: true } // Retourne le document mis à jour
      );

      if (!medecin) {
          return res.status(404).send('Médecin non trouvé');
      }
      res.json(medecin);
  } catch (error) {
      console.error('Erreur lors de la mise à jour du médecin:', error);
      res.status(500).send('Erreur lors de la mise à jour du médecin');
  }
});

// 5. Supprimer un médecin
app.delete('/medecins/:id', async (req, res) => {
  try {
      const medecin = await Medecin.findByIdAndDelete(req.params.id);
      if (!medecin) {
          return res.status(404).send('Médecin non trouvé');
      }
      res.send('Médecin supprimé avec succès');
  } catch (error) {
      console.error('Erreur lors de la suppression du médecin:', error);
      res.status(500).send('Erreur lors de la suppression du médecin');
  }
});


// CRUD pour les Patients

// 1. Créer un nouveau patient
app.post('/patients', async (req, res) => {
  try {
      const { nom, prenom, telephone, email } = req.body;
      const patient = await Patient.create({
          nom,
          prenom,
          telephone,
          email
      });
      res.status(201).json(patient);
  } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
      res.status(500).send('Erreur lors de la création du patient');
  }
});

// 2. Obtenir tous les patients
app.get('/patients', async (req, res) => {
  try {
      const patients = await Patient.find().populate('animaux'); // Popule les animaux associés
      res.json(patients);
  } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
      res.status(500).send('Erreur lors de la récupération des patients');
  }
});

// 3. Obtenir un patient par son ID
app.get('/patients/:id', async (req, res) => {
  try {
      const patient = await Patient.findById(req.params.id).populate('animaux');
      if (!patient) {
          return res.status(404).send('Patient non trouvé');
      }
      res.json(patient);
  } catch (error) {
      console.error('Erreur lors de la récupération du patient:', error);
      res.status(500).send('Erreur lors de la récupération du patient');
  }
});

// 4. Mettre à jour un patient
app.put('/patients/:id', async (req, res) => {
  try {
      const { nom, prenom, telephone, email } = req.body;
      const patient = await Patient.findByIdAndUpdate(
          req.params.id,
          { nom, prenom, telephone, email },
          { new: true } // Retourne le document mis à jour
      );

      if (!patient) {
          return res.status(404).send('Patient non trouvé');
      }
      res.json(patient);
  } catch (error) {
      console.error('Erreur lors de la mise à jour du patient:', error);
      res.status(500).send('Erreur lors de la mise à jour du patient');
  }
});

// 5. Supprimer un patient
app.delete('/patients/:id', async (req, res) => {
  try {
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) {
          return res.status(404).send('Patient non trouvé');
      }
      res.send('Patient supprimé avec succès');
  } catch (error) {
      console.error('Erreur lors de la suppression du patient:', error);
      res.status(500).send('Erreur lors de la suppression du patient');
  }
});


// CRUD pour les Animaux

// 1. Créer un nouvel animal
app.post('/animaux', async (req, res) => {
  try {
      const { nom, type, race, age, patientId } = req.body;
      const animal = await Animal.create({
          nom,
          type,
          race,
          age,
          patient: patientId // Associe l'animal au patient par son ID
      });
      res.status(201).json(animal);
  } catch (error) {
      console.error('Erreur lors de la création de l\'animal:', error);
      res.status(500).send('Erreur lors de la création de l\'animal');
  }
});

// 2. Obtenir tous les animaux
app.get('/animaux', async (req, res) => {
  try {
      const animaux = await Animal.find().populate('patient'); // Popule le champ patient
      res.json(animaux);
  } catch (error) {
      console.error('Erreur lors de la récupération des animaux:', error);
      res.status(500).send('Erreur lors de la récupération des animaux');
  }
});

// 3. Obtenir un animal par son ID
app.get('/animaux/:id', async (req, res) => {
  try {
      const animal = await Animal.findById(req.params.id).populate('patient');
      if (!animal) {
          return res.status(404).send('Animal non trouvé');
      }
      res.json(animal);
  } catch (error) {
      console.error('Erreur lors de la récupération de l\'animal:', error);
      res.status(500).send('Erreur lors de la récupération de l\'animal');
  }
});

// 4. Mettre à jour un animal
app.put('/animaux/:id', async (req, res) => {
  try {
      const { nom, type, race, age, patientId } = req.body;
      const animal = await Animal.findByIdAndUpdate(
          req.params.id,
          { nom, type, race, age, patient: patientId },
          { new: true } // Retourne le document mis à jour
      );

      if (!animal) {
          return res.status(404).send('Animal non trouvé');
      }
      res.json(animal);
  } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'animal:', error);
      res.status(500).send('Erreur lors de la mise à jour de l\'animal');
  }
});

// 5. Supprimer un animal
app.delete('/animaux/:id', async (req, res) => {
  try {
      const animal = await Animal.findByIdAndDelete(req.params.id);
      if (!animal) {
          return res.status(404).send('Animal non trouvé');
      }
      res.send('Animal supprimé avec succès');
  } catch (error) {
      console.error('Erreur lors de la suppression de l\'animal:', error);
      res.status(500).send('Erreur lors de la suppression de l\'animal');
  }
});


// CREATE: Ajouter un rendez-vous
app.post('/rendezvous', async (req, res) => {
  try {
      const rendezvous = await RendezVous.create(req.body);
      res.status(201).json(rendezvous);
  } catch (error) {
      res.status(500).send('Erreur lors de la création du rendez-vous');
  }
});

// READ: Obtenir tous les rendez-vous
app.get('/rendezvous', async (req, res) => {
  try {
      const rendezvous = await RendezVous.find().populate('id_patient'); // Peupler le patient
      res.json(rendezvous);
  } catch (error) {
      res.status(500).send('Erreur lors de la récupération des rendez-vous');
  }
});

// READ: Obtenir un rendez-vous par ID
app.get('/rendezvous/:id', async (req, res) => {
  try {
      const rendezvous = await RendezVous.findById(req.params.id).populate('id_patient');
      if (!rendezvous) return res.status(404).send('Rendez-vous non trouvé');
      res.json(rendezvous);
  } catch (error) {
      res.status(500).send('Erreur lors de la récupération du rendez-vous');
  }
});

// UPDATE: Mettre à jour un rendez-vous par ID
app.put('/rendezvous/:id', async (req, res) => {
  try {
      const rendezvous = await RendezVous.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!rendezvous) return res.status(404).send('Rendez-vous non trouvé');
      res.json(rendezvous);
  } catch (error) {
      res.status(500).send('Erreur lors de la mise à jour du rendez-vous');
  }
});

// DELETE: Supprimer un rendez-vous par ID
app.delete('/rendezvous/:id', async (req, res) => {
  try {
      const rendezvous = await RendezVous.findByIdAndDelete(req.params.id);
      if (!rendezvous) return res.status(404).send('Rendez-vous non trouvé');
      res.json({ message: 'Rendez-vous supprimé' });
  } catch (error) {
      res.status(500).send('Erreur lors de la suppression du rendez-vous');
  }
});
// CRUD pour les Rapports

// Créer un nouveau rapport
app.post('/rapports', async (req, res) => {
  try {
    const rapport = await Rapport.create(req.body);
    res.status(201).json(rapport);
  } catch (error) {
    console.error('Erreur lors de la création du rapport:', error);
    res.status(500).send('Erreur lors de la création du rapport');
  }
});

// Récupérer tous les rapports avec les informations de l'animal
app.get('/rapports', async (req, res) => {
  try {
    const rapports = await Rapport.find().populate('animal'); // Remplit les détails de l'animal
    res.json(rapports);
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports:', error);
    res.status(500).send('Erreur lors de la récupération des rapports');
  }
});

// Récupérer un rapport par ID
app.get('/rapports/:id', async (req, res) => {
  try {
    const rapport = await Rapport.findById(req.params.id).populate('animal');
    if (!rapport) {
      return res.status(404).send('Rapport non trouvé');
    }
    res.json(rapport);
  } catch (error) {
    console.error('Erreur lors de la récupération du rapport:', error);
    res.status(500).send('Erreur lors de la récupération du rapport');
  }
});

// Mettre à jour un rapport par ID
app.put('/rapports/:id', async (req, res) => {
  try {
    const rapport = await Rapport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rapport) {
      return res.status(404).send('Rapport non trouvé');
    }
    res.json(rapport);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rapport:', error);
    res.status(500).send('Erreur lors de la mise à jour du rapport');
  }
});

// Supprimer un rapport par ID
app.delete('/rapports/:id', async (req, res) => {
  try {
    const rapport = await Rapport.findByIdAndDelete(req.params.id);
    if (!rapport) {
      return res.status(404).send('Rapport non trouvé');
    }
    res.send('Rapport supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression du rapport:', error);
    res.status(500).send('Erreur lors de la suppression du rapport');
  }
});


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
