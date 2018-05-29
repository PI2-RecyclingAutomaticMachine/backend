import winston from 'winston';

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta',
  },
};

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  levels: config.levels,
  format: winston.format.combine(
    winston.format(info => info)(),
    winston.format.colorize(),
    winston.format.simple(),
  ),
});

export default logger;
