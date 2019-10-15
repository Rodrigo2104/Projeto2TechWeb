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
	user: 'root',
	password:'0t0rr1n0l4r1ng0l0g1st4',
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
