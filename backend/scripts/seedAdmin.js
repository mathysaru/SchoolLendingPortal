require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI missing in .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.env.ADMIN_EMAIL || 'admin@hotmail.com';
    const pass = process.env.ADMIN_PASS || 'admin123';
    let u = await User.findOne({ email });
    if (u) {
      console.log('Admin already exists:', email);
    } else {
      const hash = await bcrypt.hash(pass, 10);
      u = await User.create({ name: 'Admin', email, passwordHash: hash, role: 'admin' });
      console.log('Created admin user:', email, 'password:', pass);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
