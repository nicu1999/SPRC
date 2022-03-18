var express = require('express')
var app = express()
app.use(express.json())
var mongoose = require('mongoose')


async function createCountry(body) {
    var country = await Country.create(body)
    return country._id.valueOf()
}

async function returnCountries() {
    var list = await Country.find();
    return list.map(({ _id, nume, lat, lon }) => { //nu stiu de ce trebuie sa fac asta asa
        id = _id.valueOf()
        return { id, nume, lat, lon }
    })
}

async function createCity({ idTara, nume, lat, lon }) {
    var city = await City.create({ idTara, nume, lat, lon })
    return city._id.valueOf()
}

async function returnCities() {
    var list = await City.find();
    return list.map(({ _id, idTara, nume, lat, lon }) => { //nu stiu de ce trebuie sa fac asta asa
        id = _id.valueOf()
        idTara = idTara.valueOf()
        return { id, idTara, nume, lat, lon }
    })
}

async function returnCitiesbyId(idT) {
    var list = await City.find({ idTara: idT });
    return list.map(({ _id, idTara, nume, lat, lon }) => { //nu stiu de ce trebuie sa fac asta asa
        id = _id.valueOf()
        return { id, idTara, nume, lat, lon }
    })
}

async function createTemperature(body) {
    var temp = await Temperature.create(body)
    return temp._id.valueOf()
}

//start

var url = "mongodb://admin:password@mongo_container:27017"//mongo:27017"
var Country = require("./Country")
var City = require("./City")
var Temperature = require("./Temperature")

mongoose.connect(url)
    .then(() => {
        console.log("connected")
    })
    .catch(() => {
        console.log("err")
    })


app.route('')
    .get((req, res) => {
        res.status(200)
        res.send("Works!")
    })

app.route('/api/countries')
    .post(async (req, res) => {
        console.log("POST /api/countries")
        try {
            var _id = await createCountry(req.body)
            res.status(201)
            console.log("STATUS: ", 201)
            res.send({ id: _id })
            console.log("{id: ", _id, "}")
        } catch (e) {
            console.log(e.message);
            if (e.code === 11000) {
                res.status(409)
                console.log("STATUS: ", 409)
            } else {
                res.status(400)
                console.log("STATUS: ", 400)
            }
            res.send()
        }
        console.log("\n")
    })
    .get(async (req, res) => {
        console.log("GET /api/countries")
        res.status(200)
        console.log("STATUS: ", 200)
        try {
            var list = await returnCountries()
            res.send(list)
            console.log(list)
        } catch (e) {
            console.log(e.message);
            res.send([])
            console.log([])
        }
        console.log("\n")
    })

app.route('/api/countries/([0-9a-f]{24})')
    .put(async (req, res) => {
        try {
            ({ id, nume, lat, lon } = req.body)
            var country = await Country.findById(id)
            if (country == null) {
                throw "Id not found in database"
            }
            country.nume = nume
            country.lat = lat
            country.lon = lon
            await country.save()
            res.status(200)
            res.send()
        } catch (e) {
            res.status(400)
            if (e == "Id not found in database") {
                console.log(e)
                res.status(404)
                res.send()
                return
            }
            console.log(e.message)
            res.send()
        }
    })
    .delete(async (req, res) => {
        try {
            id = req.path.substring('/api/countries/'.length)
            await Country.deleteOne({ _id: id })
            res.status(200)
            res.send()
        } catch (e) {
            console.log(e)
        }
    })

app.route('/api/cities')
    .post(async (req, res) => {
        try {
            //console.log(req.body)
            var _id = await createCity(req.body)
            res.status(201)
            res.send({ id: _id })
        } catch (e) {
            console.log(e.message);
            if (e.code === 11000) {
                res.status(409)
            } else {
                res.status(400)
            }
            res.send()
        }
    })
    .get(async (req, res) => {
        res.status(200)
        try {
            var list = await returnCities()
            res.send(list)
        } catch (e) {
            console.log(e.message);
            res.send([])
        }
    })

app.route('/api/cities/([0-9a-f]{24})')
    .put(async (req, res) => {
        try {
            ({ id, idTara, nume, lat, lon } = req.body)
            var city = await City.findById(id)
            if (city == null) {
                throw "Id not found in database"
            }
            city.idTara = idTara
            city.nume = nume
            city.lat = lat
            city.lon = lon
            await city.save()
            res.status(200)
            res.send()
        } catch (e) {
            res.status(400)
            if (e == "Id not found in database") {
                console.log(e)
                res.status(404)
                res.send()
                return
            }
            console.log(e.message)
            res.send()
        }
    })
    .delete(async (req, res) => {
        try {
            id = req.path.substring('/api/cities/'.length)
            await City.deleteOne({ _id: id })
            res.status(200)
            res.send()
        } catch (e) {
            console.log(e)
        }
    })

app.route('/api/cities/country/([0-9a-f]{24})')
    .get(async (req, res) => {
        id = req.path.substring('/api/cities/country/'.length)
        res.status(200)
        try {
            var list = await returnCitiesbyId(id)
            res.send(list)
        } catch (e) {
            console.log(e.message);
            res.send([])
        }
    })

app.route('/api/temperatures')
    .post(async (req, res) => {
        try {
            var _id = await createTemperature(req.body)
            res.status(201)
            res.send({ id: _id })
        } catch (e) {
            console.log(e.message);
            if (e.code === 11000) {
                res.status(409)
                res.send()
            } else {
                res.status(400)
                res.send()
            }
        }
    })
    .get(async (req, res) => {
        try {
            res.status(501)
            res.send([])
            /*console.log(req.query)
            ({lat,lon,from,until} = req.query)
            res.status(200);
            if(req.query != null) {
                 listCountry = await Country.find({lat, lon}, {nume:0, lat:0, lon:0, __v:0});
                 console.log(listCountry)
                 listTemp = []
                 for (i in listCountry) {
                     list =  await Temperature.find({idOras: listCountry[i]._id}, {idOras: 0, __v:0});
                     listTemp = listTemp.concat(list)
                 }
                 console.log(listTemp)
                 res.send(listTemp)
            } else {
             list = await Temperature.find();
             res.send(list.map(({_id, valoare, timestamp, idOras, __v}) => {
                 id = _id
                 return {id, valoare, timestamp}
             }))
            }*/
        } catch (e) {
            console.log(e)
            res.send([])
        }
    })

app.route('/api/temperatures/cities/([0-9a-f]{24})')
    .get(async (req, res) => {
        try {
            res.status(501)
            res.send([])
        } catch (e) {
        }
    })

app.route('/api/temperatures/countries/([0-9a-f]{24})')
    .get(async (req, res) => {
        try {
            res.status(501)
            res.send()
        } catch (e) {
        }
    })


app.route('/api/temperatures/([0-9a-f]{24})')
    .put(async (req, res) => {
        try {
            ({ id, idOras, valoare } = req.body)
            var temp = await Temperature.findById(id)
            if (temp == null) {
                throw "Id not found in database"
            }
            temp.idOras = idOras
            temp.valoare = valoare
            await temp.save()
            res.status(200)
            res.send()
        } catch (e) {
            res.status(400)
            if (e == "Id not found in database") {
                console.log(e)
                res.status(404)
                res.send()
                return
            }
            console.log(e.message)
            res.send()
        }
    })
    .delete(async (req, res) => {
        try {
            id = req.path.substring('/api/temperatures/'.length)
            await Temperature.deleteOne({ _id: id })
            res.status(200)
            res.send()
        } catch (e) {
            console.log(e)
        }
    })


app.listen(6000, function () {
    console.log('app listening on port 6000')
}) 