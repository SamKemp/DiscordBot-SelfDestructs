const { bot_token, clientId, guildId } = require('./config.json');

const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();
client.menus = new Collection();
client.buttons = new Collection();

// Scan for and register commands
ScanCommands('commands', client.commands, true, false);

// Scan for and register events
ScanEvents('events', client);

// Bot Login
console.log(' ');
client.login(bot_token);

function ScanFor(dir, clientSet) {
	const files = fs.readdirSync('./' + dir).filter(file => file.endsWith('.js'));

	for (const file of files) {
		const item = require('./' + dir + '/' + file);
		// Set a new item in the Collection
		// With the key as the menu name and the value as the exported module
		clientSet.set(item.data.name, item);
	}
}

function ScanCommands(dir, clientSet, devel = true, prod = false) {
	const commands = [];

	const files = fs.readdirSync('./' + dir).filter(file => file.endsWith('.js'));
	
	for (const file of files) {
		const item = require('./' + dir + '/' + file);
		// Set a new item in the Collection
		// With the key as the command name and the value as the exported module
		clientSet.set(item.data.name, item);
		commands.push(item.data.toJSON());
	}

	const rest = new REST({ version: '9' }).setToken(bot_token);

	// Register (/) commands
	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');

			// Development guild commands
			if(devel) {
				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);
			}

			// Production global commands
			if(prod) {
				await rest.put(
					Routes.applicationCommands(clientId),
					{ body: commands },
				);
			}

			console.log('Successfully reloaded application (/) commands.');
		}
		catch (error) {
			console.error(error);
		}
	})();
}

function ScanEvents(dir, client) {
	const files = fs.readdirSync('./' + dir).filter(file => file.endsWith('.js'));

	for (const file of files) {
		const item = require('./' + dir + '/' + file);
		if (item.once) {
			client.once(item.name, (...args) => item.execute(...args));
		}
		else {
			client.on(item.name, (...args) => item.execute(...args));
		}
	}
}