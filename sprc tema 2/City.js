var mongoose = require('mongoose')

var citySchema = new mongoose.Schema({
    idTara: {
        type: mongoose.ObjectId,
        required: true,
    },
    nume: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    lon: {
        type: Number,
        required: true,
    }
})

citySchema.index({ idTara: 1, nume: 1 }, { unique: true })

module.exports = mongoose.model("Cities", citySchema)