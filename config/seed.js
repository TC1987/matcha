const User = require('../models/User');
const Profile = require('../models/Profile');

const profileFactory = (user, gender, preference) => {
    const newProfile = new Profile({
        user,
        gender,
        preference,
        biography: 'Hello World'
    });

    newProfile.save(profile => {
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

    newUser.save();
    // newUser.save(user => profileFactory(user.id, gender, preference));
    
}

userFactory('mikey@gmail.com', 'mikey', 'Mikey', 'Jones', 'asdasd', 'male', 'female');
userFactory('adam@gmail.com', 'adam', 'Adam', 'Arg', 'asdasd', 'male', 'female');
userFactory('eric@gmail.com', 'eric', 'Eric', 'Lee', 'asdasd', 'male', 'female');

userFactory('stacy@gmail.com', 'stacy', 'Stacy', 'Smalls', 'asdasd', 'female', 'male');
userFactory('tina@gmail.com', 'tina', 'Tina', 'White', 'asdasd', 'female', 'male');
userFactory('anna@gmail.com', 'anna', 'Anna', 'Bell', 'asdasd', 'female', 'male');