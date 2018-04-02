import prodConfig from './prod.env';
import devConfig from './dev.env';

let env = {}; // eslint-disable-line

if (process.env.NODE_ENV === 'production') {
  env = prodConfig;
} else {
  env = devConfig;
}

export default env;
