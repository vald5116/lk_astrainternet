var 
 needle = require('needle'),
 cheerio = require('cheerio'),
 config = require('./config'),
 telegram = require('./telegram.js');



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
		  		var ost = $(".main_desktop .leftkb2").text() //Находим наш баланс
				console.log(resp.statusCode)
				console.log(`Баланс: ${sum}`)
				console.log(`Остаток трафика: ${ost}`)
				telegram.send_msg(`Test-1 Баланс: ${sum}, Остаток трафика: ${ost}`);
		});
	}); 
});


needle.get(`${config.url}`, //Переходим на главную
  function(err, resp, body) {
		console.log(resp.statusCode)
});


function curl(url) {
    return new Promise((resolve, reject) => {
        r.get({ url: url, timeout: 15000 }, (body, res, err) => {
            if (!err && res.statusCode == 200) resolve(JSON.parse(body));
            else resolve(res);
        });
    });
}