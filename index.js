const Eris = require("eris-additions")(require("eris"))
const { Client } = require("yuuko")
const config = require("./config.json")
const {google} = require("googleapis")

const bot = new Client({
    allowMention: true,
    caseSensitiveCommands: false,
    caseSensitivePrefix: false,
    ignoreBots: true,
    prefix: config.prefix,
    token: config.token
})

bot.on("ready", () => {
    console.log("Ready!")
})

bot.on("messageCreate", (message) => {
  google.discoverAPI(config.DISCOVERY_URL)
    .then(client => {
      const analyzeRequest = {
        comment: {
          text: message.content,
        },
        requestedAttributes: {
          TOXICITY: {},
        },
      };
    
      client.comments.analyze(
        {
          key: config.API_KEY,
          resource: analyzeRequest,
        },
        (err, response) => {
          if (err) throw err;
          if (response.data.attributeScores.TOXICITY.summaryScore.value > 0.85) {
            let logsChannel = message.guild.channels.find(ch => ch.id === '764748602244857876')
            message.delete()
            message.member.createMessage("Non dire parolacce nel server grazie!")
            logsChannel.createMessage(`Messaggio cancellato in ${message.channel.name}\nContenuto del messaggio: ${message.content}\nAutore: ${message.author.tag}`)
          }
        });
    })
    .catch(err => {
      throw err;
    });
})

bot.connect()
