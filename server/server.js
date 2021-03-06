require('./config/config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//configuracion global de rutas
app.use(require('./routes/index.js'));




mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {

        if (err) throw err;

        console.log('Base de datos ONLINE');

    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', 3000);
})