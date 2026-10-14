// Create a teacher account. Self-registration only makes students, so this is
// how teacher logins are set up.
//
// Usage (from the project root):
//   npm run create-teacher -- --name "Mr Akram" --email akram@school.org --password "a-long-password"

const path = require('path');
const { parseArgs } = require('util');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { User } = require('../models');

const MIN_PASSWORD_LENGTH = 8;

const main = async () => {
  const { values } = parseArgs({
    options: {
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' }
    }
  });

  if (!values.name || !values.email || !values.password) {
    throw new Error('Usage: npm run create-teacher -- --name "Mr Akram" --email akram@school.org --password "a-long-password"');
  }
  if (!values.email.includes('@')) {
    throw new Error('Please give a valid email address.');
  }
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Teacher passwords must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  if (await User.findOne({ email: values.email })) {
    throw new Error(`An account for ${values.email} already exists.`);
  }

  await User.create({
    name: values.name,
    email: values.email,
    password: values.password,
    role: 'instructor'
  });
  console.log(`Teacher account created for ${values.name} (${values.email}).`);
};

main()
  .catch(err => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
