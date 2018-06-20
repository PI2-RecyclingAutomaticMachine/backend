import { Router } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import jwtCheck from 'express-jwt';
import lodash from 'lodash';
// import bcrypt from 'bcrypt';
// import configFile from '../config';
// import { initUserSocket } from './socket'

// const { SALT_ROUNDS } = configFile;

function createToken(user, config) {
  return jwt.sign(lodash.pick(user, 'id'), config.secret);
}

// async function hashPassword(password) {
//   const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
//   return hashedPass;
// }

export default ({ config }) => {
  const router = Router();

  router.param('user', (req, resp, next, id) => {
    req.userDocument = User.get(id);
    next();
  });

  router.get('/', async (_, res) => {
    try {
      res.json(await User.orderBy('name').without('password').run());
    } catch (err) {
      res.status(404).json({ error: err.name });
    }
  });

  router.get('/current-user', jwtCheck({ secret: config.secret }), async ({ user }, res) => {
    try {
      res.json(await User.get(user.id));
    } catch (err) {
      res.status(404).json({ error: err.name });
    }
  });

  router.get('/:user', async ({ userDocument }, res) => {
    try {
      res.json(await userDocument.without('password').getJoin({
        operations: {
          registers: {
            bottle: true,
          },
        },
      }));
    } catch (err) {
      res.status(404).json({ error: err.name });
    }
  });

  router.post('/', async ({ body }, res) => {
    try {
      const userDoc = body.user;
      // const password = await hashPassword(userDoc.password);
      // userDoc.password = password;
      const user = await User.save(userDoc);
      res.json(user);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  });

  router.post('/authenticate', async ({ body }, res) => {
    try {
      if (body.password === null || body.cpf === null) {
        res.status(400).end(); // Status code 400: Bad request
      } else {
        const users = await User.filter({ cpf: body.cpf }).run();
        const user = users[0];
        if (user) {
          // const isEqualPass = await bcrypt.compare(body.password, user.password);
          const isEqualPass = body.password === user.password;
          if (isEqualPass) {
            const token = createToken(user, config);

            // const socketId = body.socketId

            // if (socketId) {
            //   initUserSocket(socketId, user)
            // }

            res.json({ user, token });
          } else {
            res.status(401).json({ error: 'Não foi possível realizar login' });
          }
        } else {
          res.status(401).json({ error: 'Não foi possível realizar login' });
        }
      }
    } catch (err) {
      res.status(404).json({ error: err.name });
    }
  });

  router.put('/:user', async ({ userDocument, body }, res) => {
    try {
      const doc = await userDocument;
      // const { user } = body;
      // if (user.password) {
      //   user.password = await hashPassword(user.password);
      // }
      res.json(await doc.merge(body.user).save());
    } catch (err) {
      res.status(404).json({ error: err.name });
    }
  });

  router.delete('/:user', async ({ userDocument }, res) => {
    try {
      res.json(await userDocument.delete());
    } catch (err) {
      res.status(404).json({ error: err.name });
    }
  });

  router.post('/cpf', async ({ body }, res) => {
    try {
      const { cpf } = body;
      const cpfFilter = doc => doc('cpf').match(cpf);
      res.json((await User.filter(cpfFilter))[0]);
    } catch (err) {
      res.status(404).json({ error: err });
    }
  });

  // router.post('/register_socket',
  //              jwtCheck({secret: config.secret}), async ({ body, user }, res) => {
  //   try {
  //     if (user) {
  //       let userDoc = await User.get(user.id).without('password').execute()
  //       const socketId = body.socketId
  //       if (socketId) {
  //         initUserSocket(socketId, userDoc)
  //       }
  //       res.status(200).json({ success: true })
  //     } else {
  //       res.status(401).json({ success: false })
  //     }
  //   } catch (err) {
  //     console.log(err)
  //     res.status(404).json({ error: err.name })
  //   }
  // })

  return router;
};
