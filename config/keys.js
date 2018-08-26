// If we deploy this website to Heroku, "process.env.NODE_ENV" will be 
// "production", and if it is on the local machine dev environment, the 
// "process.env.NODE_ENV" will be different.
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./keys_prod');
} else {
  module.exports = require('./keys_dev');
}