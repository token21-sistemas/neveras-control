import bcrypt from 'bcrypt';

const password = 'Admin1234';

bcrypt.hash(password, 10).then(hash => {
  console.log('HASH:', hash);
});