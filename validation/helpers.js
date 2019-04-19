const isEmpty = require('is-empty');

const checkEmpty = (data, errors, fields) => {
    for (let field of fields) {
        if (isEmpty(data[field])) {
            data[field] = "";
            errors[field] = `${field} is required`;
        }
    }
};

const trimInput = (data, fields) => {
    for (let field of fields) {
        data[field] = data[field].trim();
    }
}

module.exports = {
    checkEmpty,
    trimInput
}