const validator = require('validator');
const isEmpty = require('is-empty');
const { checkEmpty, trimInput } = require('./helpers');

// age, gender, and preference are going to be dropdowns. Need to make sure that an option is selected for age and gender.
// Only need to check if biography is empty. Should be required.
module.exports = (data) => {
    const errors = {};
    const fields = ['age', 'gender', 'biography'];
    
    checkEmpty(data, errors, fields);
    trimInput(data, fields);

    if (!validator.isLength(data.biography, { min: 10, max: 300 })) {
        errors.biography = 'biography must be between 10 and 300 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}