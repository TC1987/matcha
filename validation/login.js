const validator = require('validator');
const isEmpty = require('is-empty');
const { checkEmpty, doTrim } = require('./helpers');

module.exports = (data) => {
    const errors = {};

    const fields = ['username', 'password'];
    checkEmpty(data, errors, fields);
    doTrim(data, fields);

    return {
        errors,
        isValid: isEmpty(errors)
    }
}