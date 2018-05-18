import { thinky, type } from '../db';

const Bottle = thinky.createModel('Bottles', {
  id: type.string(),
  wheight: type.number(),
  label: type.string(),
  material: type.string().enum('plastico', 'vidro'),
});

export default Bottle;
