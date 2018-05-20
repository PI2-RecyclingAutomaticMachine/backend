import { thinky, type } from '../db';
import Bottle from './bottle';
import Operation from './operation';

const BottleRegister = thinky.createModel('BottleRegisters', {
  id: type.string(),
  count: type.number().default(0),
});

Bottle.hasMany(BottleRegister, 'registers', 'id', 'bottleId');
BottleRegister.belongsTo(Bottle, 'bottle', 'bottleId', 'id');

Operation.hasMany(BottleRegister, 'registers', 'id', 'operationId');
BottleRegister.belongsTo(Operation, 'operation', 'operationId', 'id');

export default BottleRegister;
