import seeds from './seeds';
import logger from './lib/logger';

async function seed() {
  const promises = [];

  try {
    seeds.map((s) => {
      s.items.map(i => promises.push((new s.model(i)).save())); // eslint-disable-line new-cap
      return null;
    });
    return Promise.all(promises);
  } catch (err) {
    logger.error(err);
    return err;
  }
}

async function drop() {
  for (const s of seeds) { // eslint-disable-line no-restricted-syntax
    try {
      logger.info(`Dropping ${s.model.getTableName()}...`);
      await s.model.delete(); // eslint-disable-line no-await-in-loop
    } catch (err) {
      logger.error(err);
    }
  }
}

async function main() {
  if (process.argv[2] !== '--no-drop') {
    await drop();
  }
  await seed();
  process.exit(0);
}

main();
