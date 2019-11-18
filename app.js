var 
 needle = require('needle'),
 cheerio = require('cheerio'),
 config = require('./config');



needle.get(`${config.url}/auth/login`,
	  function(err, resp, body) {
	  	var $ = cheerio.load(body);
  		config.account['_token'] = $("input[name=_token]").val();
		  needle.post(`${config.url}/auth/login`, config.account,
			  function(err, resp, body) {
			  	needle.get(`${config.url}`, {cookies:resp.cookies},
				  function(err, resp, body) {
				  		var $ = cheerio.load(body);
				  		var sum = Number($(".money").text().replace(/\D+/g,"").slice(0,-2)+'.'+$(".money").text().replace(/\D+/g,"").substr($(".money").text().replace(/\D+/g,"").length - 2))
						console.log(sum)
				});
			}); 

 
	});