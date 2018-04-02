import { thinky, type } from '../db';

const User = thinky.createModel('Users', {
  id: type.string(),
  name: type.string(),
  email: type.string(),
  cpf: type.string(),
  password: type.string(),
});

export default User;
