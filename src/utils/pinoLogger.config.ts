// src/pino-logger.config.ts

import { Params } from 'nestjs-pino';
import { Options } from 'pino-http';

const pinoHttpOptions: Options = {
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: true,
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  serializers: {
    req(req) {
      if (process.env.NODE_ENV === 'production') {
        return {
          id: req.id,
          method: req.method,
          url: req.url,
          query: req.query,
          params: req.params,
          remoteAddress: req.remoteAddress,
          remotePort: req.remotePort,
        };
      }
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: req.headers,
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
    err(err) {
      return {
        message: err.message,
        stack: err.stack,
      };
    },
  },
};

export const pinoLoggerConfig: Params = {
  pinoHttp: pinoHttpOptions,
};
