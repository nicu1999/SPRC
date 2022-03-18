var mongoose = require('mongoose')
var countrySchema = new mongoose.Schema({
    nume: {
        type: String,
        required: true,
        //unique: true
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

countrySchema.index({ nume: 1 }, { unique: true })

module.exports = mongoose.model("Countries", countrySchema)