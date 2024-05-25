const logger = require('../logger');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`
        ███╗   ███╗ █████╗ ██╗   ██╗  
        ████╗ ████║██╔══██╗██║   ██║  
        ██╔████╔██║███████║██║   ██║  
        ██║╚██╔╝██║██╔══██║╚██╗ ██╔╝  
        ██║ ╚═╝ ██║██║  ██║ ╚████╔╝   
        ╚═╝     ╚═╝╚═╝  ╚═╝  ╚═══╝    
                                                                                     
        `);
        logger.info(`Logged in as ${client.user.tag}`);

        setPresence();

        setInterval(() => {
            setPresence();
        }, 600000);

        async function setPresence() {
            try {
                const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

                await client.user.setPresence({
                    activities: [
                        {
                            name: `MavChen.`,
                            type: 2,
                        },
                    ],
                    status: 'online',
                });
            } catch (error) {
                logger.error(error);
            }
        }
    },
};