const mongoose = require('mongoose');
const { database } = require('../config/config');

const connectDB = async () => {
    try {
        await mongoose.connect(database.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
