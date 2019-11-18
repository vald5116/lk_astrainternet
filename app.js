var 
 needle = require('needle'),
 cheerio = require('cheerio'),
 config = require('./config');



needle.get(`${config.url}/auth/login`, //Заходим на страницу авториза
	  function(err, resp, body) {
	  	var $ = cheerio.load(body);		//Получаем страницу
  		config.account['_token'] = $("input[name=_token]").val(); //Получаем возможно изменяемый токен на странице
		  needle.post(`${config.url}/auth/login`, config.account, //Авторизуем пользователя 
			  function(err, resp, body) {
			  	needle.get(`${config.url}`, {cookies:resp.cookies}, //Переходим на главную
				  function(err, resp, body) {
				  		$ = cheerio.load(body);	//Получаем страницу
				  		var sum = Number($(".money").text().replace(/\D+/g,"").slice(0,-2)+'.'+$(".money").text().replace(/\D+/g,"").substr($(".money").text().replace(/\D+/g,"").length - 2)) //Находим наш баланс
						console.log(sum)
				});
			}); 

 
	});