const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGO_URI;

async function testConnection() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Get ClosedUser collection
        const ClosedUser = require('./Model/ClosedUserModel');
        const users = await ClosedUser.find();
        
        console.log('Total closed users:', users.length);
        if (users.length > 0) {
            console.log('First user:', users[0]);
        } else {
            console.log('No closed users found in database');
        }

        // Also check UserModel collection
        const User = require('./Model/UserModel');
        const allUsers = await User.find();
        console.log('Total regular users:', allUsers.length);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

testConnection();
