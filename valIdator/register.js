const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let error = {}

    data.name = !isEmpty(data.name) ? data.name : ' ';
    data.email = !isEmpty(data.email) ? data.email : ' ';
    data.password = !isEmpty(data.password) ? data.password : ' ';

    if (!validator.isLength(data.name, { min: 2, max: 20 })) {
        error.name = "Name must be between 2 and 20 charectors";
    }

    if (!validator.isLength(data.password, { min: 2, max: 20 })) {
        error.password = "password must be between 2 and 20 charectors";
    }

    if (validator.isEmpty(data.name)) {
        error.name = "Name is required"
    }
    if (validator.isEmpty(data.email)) {
        error.email = "email is required"
    }
    if (validator.isEmpty(data.password)) {
        error.password = "password is required"
    }

    return {
        error,
        isEmpty: isEmpty(error)
    }
}