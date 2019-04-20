const express = require('express');
const router = express.Router();
const passport = require('passport');

const profileValidation = require('../../validation/profile');

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => res.send("Hello World"));

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = profileValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const profile_data = req.body;
    console.log(profile_data);
    return res.status(200).json({ msg: 'success' });
});

module.exports = router;