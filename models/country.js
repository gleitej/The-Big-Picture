const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
  country: String,
  countryId: String,
  bodyText: String,
  travelAdvice: String,
  visaInfo: String,
  dateVisited: String,
  id: String,
  countryPhoto: String,
  photos: Array
});

const Countrycontent = mongoose.model('Countrycontent', CountrySchema);

module.exports = Countrycontent;
