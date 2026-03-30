const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add name'],
        trim: true
    },
    aadhar: {
        type: String,
        required: [true, 'Please add Aadhar number'],
        unique: true,
        match: [/^\d{12}$/, 'Please add valid 12-digit Aadhar number']
    },
    location: {
        type: String,
        required: [true, 'Please add location'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Please add phone number'],
        match: [/^\d{10}$/, 'Please add valid 10-digit phone number']
    },
    pregnancyMonth: {
        type: Number,
        required: [true, 'Please add pregnancy month'],
        min: 1,
        max: 9
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add valid email']
    },
    password: {
        type: String,
        required: [true, 'Please add password'],
        minlength: 6,
        select: false
    },
    hydrationReminder: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.gen Salt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
