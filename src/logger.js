const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    errorFile: {
      type: 'file',
      filename: 'error.log',
      layout: {
        type: 'pattern',
        pattern: '[%d] [%p] %m',
        tokens: {
          d: () => new Date().toLocaleString('en-US', { timeZone: 'UTC+02:00' }),
        },
      },
    },
    combinedFile: {
      type: 'file',
      filename: 'combined.log',
      layout: {
        type: 'pattern',
        pattern: '[%d] [%p] %m',
        tokens: {
          d: () => new Date().toLocaleString('en-US', { timeZone: 'UTC+02:00' }),
        },
      },
    },
    warnFile: {
      type: 'file',
      filename: 'warn.log',
      layout: {
        type: 'pattern',
        pattern: '[%d] [%p] %m',
        tokens: {
          d: () => new Date().toLocaleString('en-US', { timeZone: 'UTC+02:00' }),
        },
      },
    },
  },
  categories: {
    default: { appenders: ['console', 'combinedFile'], level: 'info' },
    errorFile: { appenders: ['errorFile'], level: 'error' },
    warnFile: { appenders: ['warnFile'], level: 'warn' },
  },
});

const logger = log4js.getLogger();

module.exports = logger;
