const fs = require('fs');
const logger = require('../logger');


function handleEvents(client, eventFiles, path) {
  const interactionEventFile = fs.readdirSync(path).filter(file => file.endsWith('.js') && file.startsWith('interactionCreate'));
  for (const file of eventFiles) {
    const event = require(`../events/${file}`);
    logger.info('Event registered:', event.name);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

module.exports = { handleEvents };
