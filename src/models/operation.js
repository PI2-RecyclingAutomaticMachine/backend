import { thinky, type, r } from '../db';
import User from './user';

const Operation = thinky.createModel('Operations', {
  id: type.string(),
  date: type.date().default(r.now()),
});

User.hasMany(Operation, 'operations', 'id', 'userId');
Operation.belongsTo(User, 'user', 'userId', 'id');

export default Operation;
