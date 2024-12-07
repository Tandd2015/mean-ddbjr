const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
// const mongoURI = 'mongodb://localhost:27017/m-d';
const mongoURI = 'mongodb://127.0.0.1:27017/m-d';

const modelsPath = path.join(__dirname, '../models');

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


fs.readdirSync(modelsPath)
  .filter(file => file.endsWith('.js'))
  .forEach(file => require(path.join(modelsPath, file)));
