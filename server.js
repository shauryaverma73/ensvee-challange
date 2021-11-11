const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const mongoose = require('mongoose');

mongoose
    .connect(process.env.DB_LINK)
    .then(conn => {
        console.log('Connected to DB successfully');
    }).catch(err => {
        console.log(err);
        console.log('Error connecting to DB');
    });

app.listen(process.env.PORT, () => {
    console.log('App Running');
});