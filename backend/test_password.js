const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/autovendaai');
  const user = await User.findOne({ email: 'test@test.com' });
  if (!user) {
    console.log('User not found');
    process.exit(1);
  }
  const isMatch = await user.comparePassword('password123');
  console.log('isMatch:', isMatch);
  process.exit(0);
}

test().catch(console.error);
