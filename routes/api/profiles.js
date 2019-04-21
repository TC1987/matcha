const express = require('express');
const router = express.Router();
const passport = require('passport');

// Model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Validation
const profileValidation = require('../../validation/profile');
const updateProfileValidation = require('../../validation/update_profile');

router.use(passport.authenticate('jwt', { session: false }), (req, res, next) => {
    User.findById(req.user.id)
        .then(user => {
            if (user && user.verified) {
                next();
            } else {
                return res.status(400).json({ msg: 'not verified' });
            }
        })
        .catch(err => {
            console.log(err);
        })
})

// Retrieve all profiles.
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.find()
        .then(profiles => res.status(200).json(profiles));
});

// Creating and updating profile data. Only creating so far.
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = profileValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    // Check if user with that email already exists.
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user && req.body.email !== req.user.email) {
                return res.status(400).json({ msg: 'email already exists' });
            }

            // Add or update profile information for user.
            Profile.findOne({ user: req.user.id })
            .then(profile => {
                // Already exists, need to update.
                // In both cases, need to make sure that email doesn't already exist.
                if (profile) {
                    console.log('Profile already exists');

                    // Need to validate email, firstname, and lastname.
                    const { errors, isValid } = updateProfileValidation(req.body);

                    if (!isValid) {
                        return res.status(400).json(errors);
                    }

                    // Update user information.
                    User.findOneAndUpdate(
                        { id: req.user.id },
                        { $set: { email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname }},
                        { new: true })
                        .then(() => {
                            if (req.body.tags) {
                                req.body.tags = req.body.tags.split(', ');
                            }
                            // Update profile information.
                            Profile.findOneAndUpdate(
                            { user: req.user.id },
                            { $set: { gender: req.body.gender, preference: req.body.preference, biography: req.body.biography, tags: req.body.tags } },
                            { new: true })
                            .then(profile => res.status(200).json(profile))
                            .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                } else {
                    console.log('Profile doesn\'t exist');
                    req.body.user = req.user.id;
                    return new Profile(req.body).save()
                        .then(profile => res.status(200).json(profile))
                        .catch(err => console.log(err));
                }
            });
        });
});

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'user not found' });
            }
            // Add to history if not logged in user looking at his/her own profile.
            if (req.user.id !== req.params.id) {
                User.find
            }
        })
})

module.exports = router;