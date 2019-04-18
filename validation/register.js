// #1 Need to do proper formatting like lowercasing all emails, uppercasing first character and lowercasing
// rest of firstname and lastname.

const validator = require('validator');
const isEmpty = require('is-empty');
const { checkEmpty, doTrim } = require('./helpers');

module.exports = (data) => {
    const errors = {};

    // Validator only works on strings. Need to convert values from null/undefined to "" if empty.
    const fields = ['email', 'username', 'firstname', 'lastname', 'password'];
    checkEmpty(data, errors, fields);
    doTrim(data, fields);

    if (!validator.isEmail(data.email)) {
        errors.email = "email is invalid";
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "password must be between 6 and 30 characters"
    }
    
    if (!validator.equals(data.password, data.confirm_password)) {
        errors.confirm_passwod = "passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}