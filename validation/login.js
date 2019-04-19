const validator = require('validator');
const isEmpty = require('is-empty');
const { checkEmpty, trimInput } = require('./helpers');

module.exports = (data) => {
    const errors = {};

    const fields = ['username', 'password'];
    checkEmpty(data, errors, fields);
    trimInput(data, fields);

    return {
        errors,
        isValid: isEmpty(errors)
    }
}