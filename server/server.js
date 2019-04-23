const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// import local files
const keys = require('./config/keys');

const app = express();

// connecting mongoose
mongoose.connect(keys.database, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database");
    }
})

app.use(bodyParser.json()); // reading data in the json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

// importing the routes
const user = require('./routes/account');
// use routes
app.use('/api/accounts', user);


app.listen(keys.port, (err) => {
    console.log('Server running on port ' + keys.port);
});