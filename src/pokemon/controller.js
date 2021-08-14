const fetch = require('node-fetch');
require("dotenv").config()

module.exports = {
    async getPokemonByName(req, res) {
        let weakness = [];
        
        const { pokemonName } = req.params

        const pokemonBase = await fetch(`${process.env.POKE_URL}/pokemon/${pokemonName}`)
        .catch(e => {
            return res.status(e.response.status).json(e.response.data)
        })

        const { id, name, stats, types, species } = await pokemonBase.json();
        const imgPath = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/" + id.toString().padStart(3, "0") + ".png"
        
        for (const type of types) {
            const pokemonType = await fetch(type.type.url)
            const { damage_relations } = pokemonType
            weakness.push(damage_relations);
        }
        
        const responsePokemonSpecie = await fetch(species.url);
        const pokemonSpecie = await responsePokemonSpecie.json();
        const responsePokemonEvolutionChain = await fetch(pokemonSpecie.evolution_chain.url);
        const pokemonEvolutionChain = await responsePokemonEvolutionChain.json();

        let arrEvolutionChainUrl = [];
        let arrEvolutionChain = [];

        for(let evolutionChain of  pokemonEvolutionChain.chain.evolves_to){

            arrEvolutionChainUrl.push(`${process.env.POKE_URL}/pokemon/${evolutionChain.species.name}`)

            for(let nextEvolutionChain of evolutionChain.evolves_to){
                arrEvolutionChainUrl.push(`${process.env.POKE_URL}/pokemon/${nextEvolutionChain.species.name}`)
            }

        }

        for await(let evolutionChainUrl of arrEvolutionChainUrl){
            var evolutionChain = await fetch(evolutionChainUrl);

            const { id, name, types } = await evolutionChain.json();
            
            arrEvolutionChain.push({
                id: id.toString().padStart(3, "0"),
                imgPath: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/" + id.toString().padStart(3, "0") + ".png", 
                name, 
                types
            })

        }

        return res.json({
            id,
            name,
            stats,
            weakness,
            types,
            imgPath,
            evolutionChain: arrEvolutionChain

        })
    }


};