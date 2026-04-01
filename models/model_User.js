const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    aadhar: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    pregnancyMonth: { type: Number, required: true, min: 1, max: 9 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
