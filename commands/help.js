const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('A help command, obvs!'),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		let helpText = 'I am a simple music bot!';
		helpText += '\nMy commands are as follows';
		helpText += '\n/help - shows this help command';

		await interaction.reply(helpText);
	},
};