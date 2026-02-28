const mongoose = require("mongoose");

const connectToDb = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log('Conected to Database')
        })
        .catch((err) => {
            console.error('Error connecting to Database', err)
        })
};

module.exports = connectToDb;