const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const generateToken = async () => {
    await connectDB();

    const user = await User.findOne({ email: 'demo@example.com' });

    if (!user) {
        console.log('User not found');
        process.exit(1);
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    console.log('RESET_TOKEN:' + resetToken);
    process.exit(0);
};

generateToken();
