const axios = require("axios")
require("dotenv").config()
module.exports = {
    async getPokemonByName(req, res) {
        const { pokemonName } = req.params
        const pokemonBase = await axios.get(`${process.env.POKE_URL}/pokemon/${pokemonName}`)
        .catch(e => {
            return res.status(e.response.status).json(e.response.data)
        })
        
        const { name, id, stats } = pokemonBase.data;
        return res.json({
            id,
            name, 
            stats
        })
    }
};