const mongoose = require('mongoose');

const RapportSchema = new mongoose.Schema({
    date_de_consultation: { type: Date, required: true },
    modif_de_la_consultation: { type: String, required: true },
    traitement: { type: String, required: true },
    examen_clinique: { type: String, required: true },
    id_animal: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Animal', 
        required: true 
    }
});

const RapportModel = mongoose.model('Rapport', RapportSchema);

module.exports = RapportModel;
