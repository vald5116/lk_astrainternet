var request = require('request');
var config = require('./config.js');
var r = request.defaults({'proxy': 'http://45.129.3.232:65535'});
var telegram = {
	send_msg : (msg, chanel = config.telegram.chat_id) => {
		r.post({
			url:'https://api.telegram.org/bot'+config.telegram.token+'/sendmessage',
    	 	json: { chat_id: chanel,  text : msg, parse_mode : "Markdown", "disable_web_page_preview" : true, "disable_notification" : true}
    	});	
	},	
};

module.exports = telegram;