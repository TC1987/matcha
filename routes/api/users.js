// #1 Also need to check for existence of username.

const express = require('express');
const router = express.Router();
// const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");
const passport = require('passport');

const registerValidation = require('../../validation/register');
const loginValidation = require('../../validation/login');

const User = require('../../models/User');

// Need to register 'jwt' strategy with actual passport instance.
require('../../config/passport')(passport);

router.get('/', (req, res) => {
    return res.json({ msg: "GET /users successful"});
});

router.post('/login', (req, res) => {
    const { errors, isValid } = loginValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(404).json({ user: "User not found" });
            }

            if (!user.validatePassword(req.body.password)) {
                return res.status(401).json({ password: "Invalid password" });
            }

            return res.status(200).json({ user: user.getJson() });
        })
})

router.post('/register', (req, res) => {
    const { errors, isValid } = registerValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    // #1
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: "Email already exists" });
            }

            const { body } = req;
            const newUser = new User(body);
            
            newUser.hashPassword();
            newUser.generateRegHash();

            return newUser.save()
                .then(() => { res.status(200).json({ user: newUser.getJson() })});
        });
});

// `session: false` because this is an API server. The server does not need to preserve state.
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({ msg: "GET /protected successful" });
})

module.exports = router;