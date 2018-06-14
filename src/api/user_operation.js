import { Router } from 'express';
import _ from 'lodash';

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
    const pointsForA = a.bottle.material === 'plastico' ? 1 : 2;
    const pointsForB = b.bottle.material === 'plastico' ? 1 : 2;
    const firstPoints = pointsForA * a.count;
    const secondPoints = pointsForB * b.count;
    return firstPoints + secondPoints;
  });
}

async function emitNewOperation({ id, name, cpf }, operation) {
  const points = await getPoints(operation);
  logger.debug(`New operation(${points}) for ${name}(${cpf})`);
  io.sockets.emit('operation', { id, operation });
}

function countBottles(bottles) {
  const groupedBottles = _.countBy(bottles);

  return _.map(groupedBottles, (count, id) => {
    const bottle = { id, count };
    return bottle;
  });
}

export default () => {
  const router = Router({ mergeParams: true });

  router.param('operation', (req, _res, next, id) => {
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
      let { bottles } = body;
      const operation = await Operation.save({});

      bottles = countBottles(bottles);

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
