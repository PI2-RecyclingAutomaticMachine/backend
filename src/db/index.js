import config from '../config';

const thinky = require('thinky')(config.db);

const { type, r } = thinky;

function init() {
  return new Promise((resolve) => {
    thinky.dbReady().then(() => {
      resolve(thinky);
    });
  });
}

export { init, thinky, type, r };
