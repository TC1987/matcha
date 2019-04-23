const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { mongoURI } = require('./keys');

mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.info('Connected to MongoDB'))
    .catch(err => console.warn(err));

const profileFactory = (user, gender, preference) => {

    console.log('Called');

    const newProfile = new Profile({
        user,
        gender,
        preference,
        biography: 'Hello World'
    });

    newProfile.save()
        .then(profile => {
            console.log('Profile Saved');
            console.log(profile.user);
        });
}

const userFactory = (email, username, firstname, lastname, password, gender, preference) => {
    const newUser = new User({
        email,
        username,
        firstname,
        lastname,
        password,
        verified: true
    });

    newUser.hashPassword();

    console.log(newUser.password);

    // newUser.save();
    
    newUser.save()
        .then(user => {
            console.log('Saved');
            profileFactory(user.id, gender, preference);
        });
    
}

userFactory('mikey@gmail.com', 'mikey', 'Mikey', 'Jones', 'asdasd', 'male', 'female');
userFactory('adam@gmail.com', 'adam', 'Adam', 'Arg', 'asdasd', 'male', 'female');
userFactory('eric@gmail.com', 'eric', 'Eric', 'Lee', 'asdasd', 'male', 'female');

userFactory('stacy@gmail.com', 'stacy', 'Stacy', 'Smalls', 'asdasd', 'female', 'male');
userFactory('tina@gmail.com', 'tina', 'Tina', 'White', 'asdasd', 'female', 'male');
userFactory('anna@gmail.com', 'anna', 'Anna', 'Bell', 'asdasd', 'female', 'male');