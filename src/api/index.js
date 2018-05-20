import { version } from '../../package.json';
import { Router } from 'express';
import userRouter from './user';
import bottleRouter from './bottle';
import userOperationRouter from './user_operation';
// import config from '../config'
// import jwt from 'express-jwt'

// var jwtCheck = jwt({
//   secret: config.secret
// }).unless({
//   path: [
//     '/api/image-upload',
//     '/api/trwips/',
//     /\/api\/trwips/i,
//     '/api/user/authenticate',
//     /\/api\/user/i,
//     '/api/',
//     '/api'
//   ]
// })

export default ({ config, db }) => {
  const api = Router();

  // Add model routes
  const users = userRouter({ config, db });
  const bottles = bottleRouter({ config, db });
  // api.use('/', jwtCheck)
  api.use('/user', users);
  api.use('/bottle', bottles);
  users.use('/:user/operation', userOperationRouter({ config, db }));

  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
