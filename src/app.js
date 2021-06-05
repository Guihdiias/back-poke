const express = require("express")
const PokemonController = require('./pokemon/controller')

const routes = express.Router();

routes.get('/pokemon/:pokemonName', PokemonController.getPokemonByName);

module.exports = routes;
