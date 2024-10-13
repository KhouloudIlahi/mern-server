const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    race: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    }
});

module.exports = mongoose.model('Animal', animalSchema);
