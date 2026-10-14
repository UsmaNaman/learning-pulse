// Create codename pupil accounts for a class, e.g. 10X-01 … 10X-30.
// No names or emails are stored — keep the printed list to match codenames to pupils.
//
// Usage (from the project root):
//   npm run create-class -- --class 10X --count 30
//   npm run create-class -- --class 10X --count 30 --reset   (new passwords for existing accounts too)

const crypto = require('crypto');
const path = require('path');
const { parseArgs } = require('util');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { User } = require('../models');

// No look-alike characters (0/o, 1/l/i) so pupils can type them easily
const PASSWORD_CHARACTERS = 'abcdefghjkmnpqrstuvwxyz23456789';
const PASSWORD_LENGTH = 6;
const MAX_CLASS_SIZE = 99;

const generatePassword = () => Array.from(
  { length: PASSWORD_LENGTH },
  () => PASSWORD_CHARACTERS[crypto.randomInt(PASSWORD_CHARACTERS.length)]
).join('');

const main = async () => {
  const { values } = parseArgs({
    options: {
      class: { type: 'string' },
      count: { type: 'string' },
      reset: { type: 'boolean', default: false }
    }
  });

  const classCode = (values.class || '').toUpperCase();
  const count = Number(values.count);

  if (!/^\d{1,2}[A-Z0-9]{1,4}$/.test(classCode) || !Number.isInteger(count) || count < 1 || count > MAX_CLASS_SIZE) {
    throw new Error('Usage: npm run create-class -- --class 10X --count 30   (class like 10X or 7B, count 1–99)');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  // Pupil accounts have no email, so the email index must allow it to be missing
  await User.syncIndexes();

  const rows = [];
  for (let i = 1; i <= count; i += 1) {
    const username = `${classCode}-${String(i).padStart(2, '0')}`;
    const existing = await User.findOne({ username });

    if (existing && !values.reset) {
      rows.push({ username, password: '(already exists — unchanged)' });
      continue;
    }

    const password = generatePassword();
    if (existing) {
      existing.password = password;
      await existing.save();
    } else {
      await User.create({
        name: username,
        username,
        password,
        role: 'student',
        class: classCode,
        yearGroup: parseInt(classCode, 10)
      });
    }
    rows.push({ username, password });
  }

  console.log(`\nClass ${classCode} — log in at the Learning Pulse login page with these details:\n`);
  console.table(rows);
  console.log('\nKeep this list safe: passwords are stored encrypted and cannot be shown again.');
  console.log('Write each pupil\'s name next to their codename on your own copy — names are not stored in Learning Pulse.');
  console.log('Forgotten password? Re-run with --reset to issue new passwords.\n');
};

main()
  .catch(err => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
