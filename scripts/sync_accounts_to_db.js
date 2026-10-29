const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const csvPath = path.join(__dirname, '..', 'public', 'caculus_500_accounts.csv');

if (!fs.existsSync(dbPath)) {
  console.error('db.json not found at', dbPath);
  process.exit(1);
}
if (!fs.existsSync(csvPath)) {
  console.error('CSV not found at', csvPath);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const csv = fs.readFileSync(csvPath, 'utf8');
const lines = csv.trim().split('\n').map(l => l.trim()).filter(Boolean);

const accountsMap = new Map();
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',');
  const email = parts[0]?.trim();
  const password = parts[1]?.trim();
  const studentId = parts[2]?.trim();
  if (email) {
    accountsMap.set(email.toLowerCase(), { password, studentId });
  }
}

console.log('Loaded accounts from CSV:', accountsMap.size);

let updatedCount = 0;
for (const user of db.users) {
  const emailLower = user.email.toLowerCase();
  if (accountsMap.has(emailLower)) {
    const acc = accountsMap.get(emailLower);
    user.passwordPlain = acc.password;
    user.studentId = acc.studentId;
    user.passwordHash = bcrypt.hashSync(acc.password, 8);
    user.isVip = true;
    user.role = 'student';
    updatedCount++;
  } else if (emailLower === 'admin@caculus.edu.vn') {
    user.passwordPlain = 'admin123';
    user.passwordHash = bcrypt.hashSync('admin123', 8);
    user.role = 'admin';
    user.isVip = true;
  } else if (emailLower === 'student@caculus.edu.vn') {
    user.passwordPlain = 'student123';
    user.passwordHash = bcrypt.hashSync('student123', 8);
    user.role = 'student';
    user.isVip = true;
  }
}

// Preserve existing exams, questions, submissions
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
const usersPath = path.join(__dirname, '..', 'data', 'users.json');
fs.writeFileSync(usersPath, JSON.stringify(db.users, null, 2), 'utf8');
console.log('Successfully updated', updatedCount, 'student accounts in db.json and users.json!');
