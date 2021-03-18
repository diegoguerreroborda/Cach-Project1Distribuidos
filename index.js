const express = require('express')
const redis = require('redis')
const port = 3000

const app = express()

let cities = []

var client_redis = redis.createClient()

function connectRedis() {
    client_redis.on('connect', function () {
        console.log('client connected to redis')
    });
}

function addCityToRedis(name_city) {
    if (client_redis.exists(name_city,function (err, reply) {
        if (reply == 1) {
            client_redis.incr(name_city);
        } else {
            client_redis.set(name_city, 1, function (err, reply) {
                console.log(reply + ' ' + name_city + ' agregado');
            });
        }
    }));
}

function deleteElements() {
    client_redis.keys('*', function (err, keys) {
        if (err) return console.log(err);
        for (var i = 0; i < keys.length; i++) {
            deleteElement(keys[i])
        }
    });
}

function deleteElement(name_city) {
    client_redis.del(name_city, function (err, reply) {
        console.log(reply + ' ' + name_city + ' eliminado');
    });
}


function showElements() {
    client_redis.keys('*', function (err, keys) {
        for (var i = 0; i < keys.length; i++) {
            let name = keys[i]
            console.log('Llave en el for:  '+name)
            client_redis.get(keys[i], function (error, value) {
                console.log(name + ' valor: ' + value)
            });
        }
    });
}

function returnElements() {
    client_redis.keys('*', function (err, keys) {
        for (var i = 0; i < keys.length; i++) {
            let name = keys[i]
            console.log('Llave en el for:  '+name)
            client_redis.get(keys[i], function (error, value) {
                console.log(name + ' valor: ' + value)
                cities.push({'city': name, 'count': value});
            });
        }
    });
}

app.get('/cities', async (req, res) => {
    await returnElements()
    res.send(cities)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})