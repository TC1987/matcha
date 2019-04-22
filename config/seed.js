const User = require('../models/User');
const Profile = require('../models/Profile');

const userFactory = (email, username, firstname, lastname, password) => {
    const newUser = new User({
        email,
        username,
        firstname,
        lastname,
        password
    });

    newUser.save(user => user.id);
}

const mike = userFactory('mike@gmail.com', 'mike', 'Mike', 'Jones', 'asdasd');
const steve = userFactory('steve@gmail.com', 'steve', 'Steve', 'Smith', 'asdasd');
const eric = userFactory('eric@gmail.com', 'eric', 'Eric', 'Lee', 'asdasd');

const stacy = userFactory('stacy@gmail.com', 'stacy', 'Stacy', 'Smalls', 'asdasd');
const tina = userFactory('tina@gmail.com', 'tina', 'Tina', 'White', 'asdasd');
const anna = userFactory('anna@gmail.com', 'anna', 'Anna', 'Bell', 'asdasd');