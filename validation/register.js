const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // if the name/email/... is empty, it will not passed, so we need to define
  // that if it is empty using our own isEmpty() method in is-empty.js, and set 
  // it too an empty string
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required!";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required!";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required!";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be as least 6 characters";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required!";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Password must match";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}