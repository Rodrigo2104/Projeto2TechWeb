var express = require('express');
var mysql = require('mysql');
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();

var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'evandro',
	password:'888941',
	database:'pokemon'
});




app.get('/', function(req, res){

	connection.query('SELECT * FROM lista_de_pokemons', function(error, results){
	console.log(error);
		res.render('index', {page_title: "Lista de Pokemons", data: results});
	});
		
});

app.post('/selecao', function(req, res){
		
		const sql = "SELECT * FROM lista_de_pokemons WHERE tipo1 IN (?) OR tipo2 IN (?)";

		const values = [req.body.tipo,req.body.tipo];
		connection.query(sql, values, function(error, results, fields){
			if (error) return console.log(error);
			
			res.render('index', {page_title: "Lista de Pokemons", data: results});
			});
		
});

app.post('/cadastro', function(req, res){
		
		const sql = "INSERT INTO users (login,password,name) VALUES (?)";

		const values = [[req.body.login,req.body.password,req.body.name]];
		if (req.body.password === req.body.confirmpassword){
		connection.query(sql, values, function(error, results, fields){
			if (error) return console.log(error);
		});
		res.redirect('/register');
		} else {
			res.redirect('/register');
		}
});
app.get('/register', function(req, res){
	res.sendFile(__dirname + '/register.html');
});

app.post('/login', function(req, res){
		
		const sql = "SELECT * FROM users WHERE login = (?) AND password = (?)";
		const login = req.body.login;
		const password = req.body.password;
		if (login && password){
			const values = [[login],[password]];
			connection.query(sql, values, function(error, results, fields){
				if (error) return console.log(error);
				if (results.length > 0){
					console.log(req.body.login + " logado!");
					res.redirect('/');
				} else {
					console.log("login ou senha incorreto!");
					res.redirect('/register');
				}
			});
		} else {
			console.log("Erro no login!");
			res.redirect('/register');
		}
		
		
});



app.get('/pesquisa', function(req, res){
	res.sendFile(__dirname + '/form.html');
});



app.post('/pesquisa', function(req, res){
	
	P.getPokemonByName(req.body["pokémon"]).then(function(response) {
		res.render('pokemon_informations', {page_title: "Lista de Informações sobre o Pokémon", data: response});
	});
});

app.listen(3000, function(){
	console.log('Servidor rodando na 3000!');
});
