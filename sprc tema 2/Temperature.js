var mongoose = require('mongoose')
var tempSchema = new mongoose.Schema({
    valoare: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: new Date(),
        required: true,
    },
    idOras: {
        type: mongoose.ObjectId,
        required: true
    }
})

tempSchema.index({ idOras: 1, timestamp: 1 }, { unique: true })

module.exports = mongoose.model("Temperatures", tempSchema)