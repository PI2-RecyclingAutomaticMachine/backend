import { thinky, type } from '../db';
import User from './user';

const Operation = thinky.createModel('Operations', {
  id: type.string(),
});

User.hasMany(Operation, 'operations', 'id', 'userId');
Operation.belongsTo(User, 'user', 'userId', 'id');

export default Operation;
