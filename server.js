const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./config/keys');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

mongoose.connect(config.mongoURI, { useNewUrlParser: true })
    .then(() => console.info('Connected to MongoDB'))
    .catch(err => console.warn(err));
mongoose.set('debug', true);
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    res.json({ msg: "You are on the homepage." });
})

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

app.use('/api/users', users);
app.use('/api/profile', profile);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.info('Server Running'));