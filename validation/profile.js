const validator = require('validator');
const isEmpty = require('is-empty');
const { checkEmpty, trimInput } = require('./helpers');

// gender, preference are going to be dropdowns. Need to make sure that an option is selected.
// Only need to check if biography is empty. Should be required.
// 
module.exports = (data) => {
    const errors = {};
    const fields = ['gender', 'preference', 'biography', 'tags'];
}