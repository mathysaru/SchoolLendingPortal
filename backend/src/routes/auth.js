const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student','staff','admin').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Signup
router.post('/signup', async (req,res)=>{
  try{
    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(value.password, 10);
    const user = await User.create({ name: value.name, email: value.email, passwordHash: hash, role: value.role || 'student' });

    const token = jwt.sign({ id: user._id.toString(), role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  }catch(err){
    console.error('Signup error', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login
router.post('/login', async (req,res)=>{
  try{
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(value.password, user.passwordHash || '');
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id.toString(), role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  }catch(err){
    console.error('Login error', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
