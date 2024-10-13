const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    animaux: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal'
    }]
});

module.exports = mongoose.model('Patient', patientSchema);
