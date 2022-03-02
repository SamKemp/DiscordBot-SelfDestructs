const { clientId, watchChannel, deleteDelay } = require('../config.json');

module.exports = {
	name: 'messageCreate',
	once: false,
	execute(message) {

		// Ignore DM's
		if(!message.guild) return;

		// Ignore self
		if(message.author.id == clientId) return;

		if(message.channel.id == watchChannel) {
			message.delete().catch(console.error);
			message.channel.send(message.content).then(msg => { setTimeout(() => msg.delete(), deleteDelay * 1000) });
		}
	},
};