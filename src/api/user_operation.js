import { Router } from 'express';

import Operation from '../models/operation';
import Bottle from '../models/bottle';
import BottleRegister from '../models/bottle_register';
import { io } from './socket';
import logger from '../lib/logger';

async function registerBottle(bottle, operation) {
  const { count } = bottle;
  const [bottleDocument, bottleRegister] = await Promise.all([
    await Bottle.get(bottle.id),
    await BottleRegister.save({ count }),
  ]);
  await Promise.all([
    await bottleDocument.addRelation('registers', bottleRegister),
    await operation.addRelation('registers', bottleRegister),
  ]);
}

async function getPoints({ id }) {
  const operationDocument = await Operation.get(id).getJoin({
    registers: {
      bottle: true,
    },
  });

  return operationDocument.registers.reduce((a, b) => {
    const firstPoints = a.bottle.wheight * a.count;
    const secondPoints = b.bottle.wheight * b.count;
    return firstPoints + secondPoints;
  });
}

async function emitNewOperation({ id, name, cpf }, operation) {
  const points = await getPoints(operation);
  logger.debug(`New operation(${points}) for ${name}(${cpf})`);
  io.sockets.emit('operation', { id, operation });
}

export default () => {
  const router = Router({ mergeParams: true });

  router.param('operation', (req, _, next, id) => {
    req.operation = Operation.get(id);
    next();
  });

  router.get('/', async ({ userDocument }, res) => {
    try {
      const user = await userDocument.getJoin({
        operations: {
          registers: {
            bottle: true,
          },
        },
      });

      res.json(user.operations);
    } catch (err) {
      res.status(404).json({ result: false, error: err.message });
    }
  });

  router.get('/:operation', async ({ operation }, res) => {
    try {
      const operations = await operation.getJoin({
        user: true,
        registers: {
          bottle: true,
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
      const operation = await Operation.save({});

      await Promise.all(bottles.map(bottle => registerBottle(bottle, operation)));

      userDocument.addRelation('operations', operation);

      emitNewOperation(await userDocument, operation);
      res.send({ result: true });
    } catch (err) {
      res.status(404).json({ result: false, error: err.message });
    }
  });

  return router;
};
