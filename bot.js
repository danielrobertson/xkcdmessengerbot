var PORT = 3000; // Can by overriden by the PORT environment variable

if (!process.env.access_token) {
    console.log("access_token not found!");
    process.exit(1);
}

if (!process.env.verify_token) {
    console.log("verify_token not found!");
    process.exit(1);
}

if (!process.env.PORT) {
    console.log("PORT not set. Defaulting to " + PORT);
}
else {
    PORT = process.env.PORT;
}

var Botkit = require('botkit');
var controller = Botkit.facebookbot({
    access_token: process.env.access_token,
    verify_token: process.env.verify_token,
})

var bot = controller.spawn({ });

// if you are already using Express, you can use your own server instance...
// see "Use BotKit with an Express web server"
controller.setupWebserver(PORT, function(err, webserver) {
    if(err) console.log("error - " + err); 
    controller.createWebhookEndpoints(controller.webserver, bot, function() {
        console.log('This bot is online!!!');
    });
});

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function(bot, message) {
    bot.reply(message, 'Welcome to my app!');
});

// user said hello or hi
controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {
    console.log("Message recieved: "); console.log(message); 
    bot.reply(message, 'Hey there.');
});

// user said cookies
controller.hears(['cookies'], 'message_received', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        convo.say('Did someone say cookies!?!!');
        convo.ask('What is your favorite type of cookie?', function(response, convo) {
            convo.say('Golly, I love ' + response.text + ' too!!!');
            convo.next();
        });
    });
});

controller.on('message_received', function(bot, message) {
    console.log("Generic message received!");
    bot.reply(message, message.text);
});

