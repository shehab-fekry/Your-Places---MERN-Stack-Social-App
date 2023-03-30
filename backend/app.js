const express = require('express');
const BodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const placesRoutes = require('./routes/places');
const usersRoutes = require('./routes/users');

const app = express();

app.use(BodyParser.json());
app.use(cors());
// allow to access server folders (Uploads/Images) via URL links (check: placeList.js component)
app.use('/uploads/images', express.static(path.join('Uploads', 'Images')));


app.use('/api/places/', placesRoutes)
app.use('/api/users/', usersRoutes)


mongoose.connect('mongodb+srv://shehab-fekry:shehab-fekry@cluster0.exioosn.mongodb.net/YOUR-PLACES?retryWrites=true&w=majority')
.then(result => {
    app.listen(8000);
    console.log('Connected!');
})
.catch(err => console.log('Connection failed to database'))