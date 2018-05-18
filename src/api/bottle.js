import { Router } from 'express';
import Bottle from '../models/bottle';

export default () => {
  const router = Router();

  router.param('bottle', (req, resp, next, id) => {
    req.bottle = Bottle.get(id);
    next();
  });

  router.get('/', async (_, res) => {
    try {
      res.json(await Bottle);
    } catch (err) {
      res.status(404).json({ error: `${err.name}: ${err.message}` });
    }
  });

  router.get('/:bottle', async ({ bottle }, res) => {
    try {
      res.json(await bottle);
    } catch (err) {
      res.status(404).json({ error: `${err.name}: ${err.message}` });
    }
  });

  router.post('/', async ({ body }, res) => {
    try {
      const bottleDoc = body.bottle;
      const bottle = await Bottle.save(bottleDoc);
      res.json(bottle);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  });

  router.put('/:bottle', async ({ bottle, body }, res) => {
    try {
      const doc = await bottle;
      res.json(await doc.merge(body.bottle).save());
    } catch (err) {
      res.status(404).json({ error: `${err.name}: ${err.message}` });
    }
  });

  router.delete('/:bottle', async ({ bottle }, res) => {
    try {
      res.json(await bottle.delete());
    } catch (err) {
      res.status(404).json({ error: err.name });
    }
  });

  router.post('/label', async ({ body }, res) => {
    try {
      const { label } = body;
      const labelFilter = doc => doc('label').match(label);
      res.json((await Bottle.filter(labelFilter))[0]);
    } catch (err) {
      res.status(404).json({ error: err });
    }
  });

  return router;
};
