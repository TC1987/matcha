const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { mongoURI } = require('./keys');

mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.info('Connected to MongoDB'))
    .catch(err => console.warn(err));

const profileFactory = (user, gender, preference, age) => {

    console.log('Called');

    const newProfile = new Profile({
        user,
        age,
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

const userFactory = (email, username, firstname, lastname, password, gender, preference, age) => {
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
            profileFactory(user.id, gender, preference, age);
        });
    
}

userFactory('mikey@gmail.com', 'mikey', 'Mikey', 'Jones', 'asdasd', 'male', 'female', 5);
userFactory('adam@gmail.com', 'adam', 'Adam', 'Arg', 'asdasd', 'male', 'female', 10);
userFactory('eric@gmail.com', 'eric', 'Eric', 'Lee', 'asdasd', 'male', 'female', 20);

userFactory('stacy@gmail.com', 'stacy', 'Stacy', 'Smalls', 'asdasd', 'female', 'male', 10);
userFactory('tina@gmail.com', 'tina', 'Tina', 'White', 'asdasd', 'female', 'male', 15);
userFactory('anna@gmail.com', 'anna', 'Anna', 'Bell', 'asdasd', 'female', 'male', 20);