const express = require('express');
const router = express.Router();
const passport = require('passport');

const profileValidation = require('../../validation/profile');

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => res.send("Hello World"));

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = 
})

module.exports = router;