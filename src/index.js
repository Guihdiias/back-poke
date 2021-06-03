const express = require("express")
const { json } = require("express")
const cors = require("cors")
const axios = require("axios")
require("dotenv").config()

const app = express()

app.use(json())
app.use(cors())
app.listen(3333)

app.get('/', async (req, res) => {
    res.send('hell world')
})

app.get('/pokemon/:pokemonName', async(req, res) => {

    const { pokemonName } = req.params
    console.log(`${process.env.POKE_URL}/pokemon/${pokemonName}`)
    const pokemonBase = await axios.get(`${process.env.POKE_URL}/pokemon/${pokemonName}`)
    .catch(e => {
        return res.status(e.response.status).json(e.response.data)
    })
    
    const { name, id, stats } = pokemonBase.data;

    res.json({
        name, 
        id,
        stats
    })

})
