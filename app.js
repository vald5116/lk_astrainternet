var 
 needle = require('needle'),
 cheerio = require('cheerio'),
 config = require('./config'),
 telegram = require('./telegram.js');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;


var lk = {
	auth : (user) =>{
		console.log(`Пытаюсь авторизоваться User^${config[user].account}`);
		needle.get(`${config.url}/auth/login`,{"user_agent":"Mozilla/5.0 (Linux; Android 8.1.0; Redmi 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 Mobile Safari/537.36"}, //Заходим на страницу авториза
		  function(err, resp, body) {
		  	var $ = cheerio.load(body);		//Получаем страницу
			config[user]['_token'] = $("input[name=_token]").val(); //Получаем возможно изменяемый токен на странице
			needle.post(`${config.url}/auth/login`, config[user],{"user_agent":"Mozilla/5.0 (Linux; Android 8.1.0; Redmi 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 Mobile Safari/537.36"}, //Авторизуем пользователя 
			  function(err, resp, body) {
			  	if (resp.cookies) {
			  		telegram.send_msg(`✅ Авторизация успешна User#${config[user].account}`);
			  		console.log(`Авторизация успешна User^${config[user].account}`);
			  		config[user]['cookies'] = resp.cookies;
			  		lk.check(user,1);
			  	} else console.log('Fвторизоваться не получилось');
		  	}); 
		});

	},
	check : (user,st=0) =>{
		needle.get(`${config.url}`, {cookies:config[user].cookies,"user_agent":"Mozilla/5.0 (Linux; Android 8.1.0; Redmi 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 Mobile Safari/537.36"}, //Переходим на главную
		  function(err, resp, body) {
		  	console.log('У меня все хорошо я работаю!');
		  	if (resp.statusCode==302) lk.auth(user);
		  	else{
		  		$ = cheerio.load(body);	//Получаем страницу
		  		var sum = Number($(".money").text().replace(/\D+/g,"").slice(0,-2)+'.'+$(".money").text().replace(/\D+/g,"").substr($(".money").text().replace(/\D+/g,"").length - 2)) //Находим наш баланс
		  		var ost = $(".main_desktop .leftkb").text() //Находим наш баланс
				console.log(`Баланс: ${sum}`)
				console.log(`Остаток трафика: ${ost}`)
				if (st==1) telegram.send_msg(`📝 #${config[user].account} Баланс: ${sum}, Остаток трафика: ${ost}`);
				if (sum<401) telegram.send_msg(`💸 #${config[user].account} Баланс: ${sum}, Нужно пополнить!`);
				if (ost.split(' ')[1]=='мб') {
					console.log('mb');
					if (Number(ost.split(' ')[0])<=150) {
						telegram.send_msg(`⛔️ #${config[user].account} Заканчивается трафик Баланс: ${sum}, Остаток трафика: ${ost}`);
						lk.test(user)
					}
				}else if(ost.split(' ')[1]==''){

				}
			}
		});
	},	
	test : (user) =>{
		console.log('test');
		console.log('________________________________________')
		needle.get(`${config.url}/get_buttons?ajax=true`, {cookies:config[user].cookies,"user_agent":"Mozilla/5.0 (Linux; Android 8.1.0; Redmi 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 Mobile Safari/537.36"}, //Переходим на главную
		  async function(err, resp, body) {
		  	if (resp.statusCode==302) lk.auth(user);
		  	else{
		  		telegram.send_msg(`⚠️ #${config[user].account} Пытаюсь активаровать!`);
		  		$ = cheerio.load(body.modals);	//Получаем страницу
				// console.log('________________________________________')
				// console.log($(".service_form").serialize().split('&').length)
				// console.log('________________________________________')
				var id = 0,data={};
				for (var i = 0; i < $(".service_form").serialize().split('&').length; i++) {
					if ($(".service_form").serialize().split('&')[i].split('=')[0]=='id') id+=1;
					if (id==2) {
						// console.log(id);
						// console.log($(".service_form").serialize().split('&')[i].split('='));
						data[$(".service_form").serialize().split('&')[i].split('=')[0]]= await $(".service_form").serialize().split('&')[i].split('=')[1]}
				}
				console.log(data)
				needle.post(`${config.url}/service/button_on`, data, {timeout : 60000,cookies:config[user].cookies,"user_agent":"Mozilla/5.0 (Linux; Android 8.1.0; Redmi 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 Mobile Safari/537.36"}, (err, resp, body) => { 
					console.log('________________________________________')
					console.log(body)
					console.log('________________________________________')
					if(body){
						if (body.status=='success') {
							telegram.send_msg(`✅ #${config[user].account} У меня удалось активировать!`);
						} else {
							telegram.send_msg(`🚫 #${config[user].account} Не удалось активировать!`);
						}
					}
				});
			}
		});
	},
	getRandomInt : (min,max) => {
		var timer = Math.floor(Math.random() * (max - min)) + min;
		return timer;
	}
};



// lk.check('account');

function start(user){
	setInterval(function () {
		lk.check(user);
	}, lk.getRandomInt(90000,180000));//3-5 минут
}

// lk.getRandomInt(36000,63000)//0,6-1,05 минут

if (config.accounts.length!=0) {	
	for (var i = config.accounts.length - 1; i >= 0; i--) {
		start(config.accounts[i])
	}
} else {
	console.log("У вас нет не одного аккаунта добавьте его в config")
}