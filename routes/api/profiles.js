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
router.get('/', (req, res) => {
    Profile
        .find()
        .populate('user')
        .exec((err, profiles) => res.status(200).json(profiles));
});

// Creating and updating profile data. Only creating so far.
router.post('/', (req, res) => {
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
                                // If preference is not specified, default to `bisexual`.
                                if (!req.body.preference) {
                                    req.body.preference = 'bisexual';
                                }
                                // Update profile information.
                                Profile.findOneAndUpdate(
                                    { user: req.user.id },
                                    { $set: { age: req.body.age, gender: req.body.gender, preference: req.body.preference, biography: req.body.biography, tags: req.body.tags } },
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

// Get profiles that match user's preference and are interested in the user's gender AND not blocked.
router.get('/preference', (req, res) => {
    Profile
        .findOne({ user: req.user.id })
        .then(profile => {
            const { preference, gender } = profile;
            const searchCriteria = {};

            if (preference !== 'bisexual') {
                searchCriteria.gender = preference;
            }

            Profile
                .find(searchCriteria)
                .where('preference').equals(gender)
                .populate('user')
                .exec((err, profiles) => {
                    if (err) {
                        return res.status(400).json(err);
                    }
                    const filtered = profiles.filter(user_profile => profile.blocked.indexOf(user_profile.user.id) === -1);
                    res.status(200).json(filtered);
                })
        });
});

// View someone's profile and get added to their history list.
// View someone's profile and they get added to your viewed list.
// If the user profile is blocked, display error message.
router.get('/:id', (req, res) => {
    Profile
        .findOne({ user: req.user.id })
        .then(profile => {
            if (profile.blocked.indexOf(req.params.id) !== -1) {
                return res.status(406).json({ msg: 'requested user is blocked' });
            } else {
                Profile.findOne({ user: req.params.id })
                    .populate('user')
                    .exec((err, profile) => {
                        if (err) {
                            return res.status(400).json(err);
                        }
                        if (!profile) {
                            return res.status(404).json({ msg: 'user not found' });
                        }
                        if (req.user.id !== req.params.id) {
                            profile.history.push(req.user.id);
                            profile.save()
                                .then(() => {
                                    Profile.findOne({ user: req.user.id })
                                        .then(current_user => {
                                            current_user.viewed.push(profile.user);
                                            current_user.save();
                                });
                            });
                        }
            
                        // RESET HISTORY AND VIEWED
                        // profile.history = [];
                        // profile.viewed = [];
                        // profile.save();
            
                        profile = profile.toObject();
            
                        delete profile.user.email;
                        delete profile.user.password;
            
                        return res.status(200).json(profile);
                });
            }
        })
});

// Like/Unlike
router.get('/likes/:id', (req, res) => {
    Profile.findOne({ user: req.params.id })
        .then(profile => {
            if (!profile) {
                return res.status(400).json({ msg: 'user not found' });
            }
            const index = profile.likes.indexOf(req.user.id);
            index === -1 ? profile.likes.push(req.user.id) : profile.likes.splice(index, 1);
            profile.save();
            return res.status(200).json(profile);
        });
});

// Block/Unblock
router.get('/block/:id', (req, res) => {
    Profile
        .findOne({ user: req.user.id })
        .then(profile => {
            const index = profile.blocked.indexOf(req.params.id);
            index === -1 ? profile.blocked.push(req.params.id) : profile.blocked.splice(index, 1);
            profile.save();
            return res.status(200).json(profile);
        })
        .catch(err => console.log(err));
})

module.exports = router;