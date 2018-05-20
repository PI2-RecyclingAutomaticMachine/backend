import { Router } from 'express';

import User from '../models/user';
import Operation from '../models/operation';
import Bottle from '../models/bottle';
import BottleRegister from '../models/bottle_register';

async function registerBottle(bottle, operation) {
  const { count } = bottle;
  const [bottleDocument, bottleRegister] = await Promise.all([
    await Bottle.find(bottle.id),
    await BottleRegister.save({ count }),
  ]);
  await Promise.all([
    await bottleDocument.addRelation('registers', bottleRegister),
    await operation.addRelation('registers', bottleRegister),
  ]);
}

export default () => {
  const router = Router({ mergeParams: true });

  router.param('operation', (req, _, next, id) => {
    req.operation = Operation.get(id);
    next();
  });

  router.get('/', async ({ userDocument }, res) => {
    try {
      const { id } = userDocument;
      const user = await User.get(id).getJoin({
        operations: {
          registers: {
            bottles: true,
          },
        },
      });

      res.json(user);
    } catch (err) {
      res.status(404).json({ result: false, error: err.message });
    }
  });

  router.get('/:operation', async ({ operation }, res) => {
    try {
      const { id } = operation;
      const operations = await Operation.get(id).getJoin({
        user: true,
        registers: {
          bottles: true,
        },
      });

      res.json(operations);
    } catch (err) {
      res.status(404).json({ result: false, error: err.message });
    }
  });

  router.post('/', async ({ userDocument, body }, res) => {
    try {
      const { bottles } = body;
      const operation = await Operation.save();

      bottles.map(bottle => registerBottle(bottle, operation));

      userDocument.addRelation('operations', operation);

      res.send({ result: true });
    } catch (err) {
      res.status(404).json({ result: false, error: err.message });
    }
  });

  return router;
};
