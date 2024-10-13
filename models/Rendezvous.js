const mongoose = require('mongoose');

const RendezVousSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    heure: { type: String, required: true },
    id_patient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', 
        required: true 
    }
});

const RendezVousModel = mongoose.model('RendezVous', RendezVousSchema);

module.exports = RendezVousModel;
