// Require and initialize dependencies, start express app on /:3001
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3001;

// Instantiate middleware, routes
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(routes);

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network');

mongoose.set('debug', true);

app.listen(PORT, () => console.log(`Server instantiated on http://localhost:${PORT}`));