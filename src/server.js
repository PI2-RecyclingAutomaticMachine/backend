import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import * as db from './db';
import config from './config';
import api from './api';
import * as socket from './api/socket';

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(bodyParser.json({
  limit: '5mb',
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '15mb',
}));

db.init()
  .then((dbObject) => {
    app.use('/api', api({ config, dbObject }));
    socket.init(app);
  });

export default app;
