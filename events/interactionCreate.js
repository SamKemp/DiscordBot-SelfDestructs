const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		// Ignore non commands
		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction);
			}
			catch (err) {
				error(err);
			}
		}
		else if (interaction.isSelectMenu())
		{
			const menu = interaction.client.menus.get(interaction.customId);

			if (!menu) return;

			try {
				await menu.execute(interaction);
			}
			catch (err) {
				error(err);				
			}
		}
		else if (interaction.isButton())
		{
			const button = interaction.client.buttons.get(interaction.customId);

			if (!button) return;

			try {
				await button.execute(interaction);
			}
			catch (err) {
				error(err);				
			}
		}
		else {
			return;
		}
	},
};

async function error(err)
{
	console.error(err);
	try {
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
	catch (newError) {
		await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}