// #1 Also need to check for existence of username.

const express = require('express');
const router = express.Router();
// const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");
const passport = require('passport');
const mailer = require('../../validation/mailer');

const registerValidation = require('../../validation/register');
const loginValidation = require('../../validation/login');

const User = require('../../models/User');

// Need to register 'jwt' strategy with actual passport instance.
require('../../config/passport')(passport);

router.get('/', (req, res) => {
    User.find()
        .then(users => res.status(200).json(users));
});

router.post('/login', (req, res) => {
    const { errors, isValid } = loginValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(404).json({ user: "user not found" });
            }

            if (!user.validatePassword(req.body.password)) {
                return res.status(401).json({ password: "invalid password" });
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
                return res.status(400).json({ email: "email already exists" });
            }

            User.findOne({ username: req.body.username })
                .then(user => {
                    if (user) {
                        return res.status(400).json({ username: "username already exists" });
                    }

                    const { body } = req;
                    const newUser = new User(body);
                    
                    newUser.hashPassword();
                    // newUser.generateRegHash();
        
                    mailer(newUser);
        
                    return newUser.save()
                        .then(() => { res.status(200).json({ user: newUser.getJson() })})
                        .catch(err => console.log(err));
                })
        });
});

// `session: false` because this is an API server. The server does not need to preserve state.
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).json({ msg: "GET /protected successful" });
})

router.get('/verify/:regHash', (req, res) => {
    User.findById(req.params.regHash)
        .then(user => {
            if (!user || user.verified) {
                return res.status(404).json({ msg: "invalid verification link" });
            }
            user.verified = true;
            user.save()
                .then(() => res.status(200).json({ msg: "GET /verify successful" }));
        })
})

module.exports = router;