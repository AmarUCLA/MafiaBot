const Discord = require('discord.js');
const client = new Discord.Client();

const config = require("./config.json");

client.on('ready', () => {
    console.log("Logged on!");
});

prefix = '$mafiajoin';
prefixLeave = '$mafialeave';


const playerLimit = 6;
let players = [];

client.login(config.discordToken);

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot || !(message.channel.id === config.channelAllowed)) return;

    if (players.length == 0) {
        players.push(message.author);

        message.channel.send(`Mafia Game Started! ${message.author.tag} joined the queue. Use the command $mafiajoin to join the game. The game needs **${playerLimit - players.length}** more players. Use the command $mafialeave to leave the queue.`);
        return;
    }

    players.push(message.author);
    
    if (players.length === playerLimit) {
        message.channel.send(`${message.author.tag} joined the queue. Mafia Game Lobby Full! Sending DMs now!`);
        let randomNumber = Math.floor(Math.random() * players.length);

        for (let i = 0; i < players.length; i++) {
            if (i === randomNumber) {
                players[i].send("You are the Mafia! Your job is to lose the game while convincing others that you are NOT the mafia! If you win the game, you lose. If the players guess that you are the mafia, you lose. If your team loses the game, but you are not guessed as the mafia, you win!")
            } else {
                players[i].send("You are a villager. Your job is to win the game!");
            }
        }

        players.splice(0, players.length);
    } else {
        message.channel.send(`${message.author.tag} joined the queue. Mafia needs ${playerLimit - players.length} more players! Use the command $mafiajoin to join! Use the command $mafialeave to leave the queue.`);
    }
}); 

client.on('message', message => {
    if (!message.content.startsWith(prefixLeave) || message.author.bot || !(message.channel.id === config.channelAllowed)) return;



    for (let i = 0; i < players.length; i++) {
        if (message.author.id == players[i].id) {
            players.splice(i, 1);
            message.channel.send(`${message.author.tag} has left the queue!`);
            return;
        }
    }

    message.channel.send(`${message.author.tag}, you are not in the mafia queue!`);

});