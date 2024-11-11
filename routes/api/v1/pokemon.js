
const router = require('express').Router()

const { getCollection, ObjectId } = require('../../../db-connection')

const getPokemonCollection = getCollection('PokemonAPI')
const getPokemon = getPokemonCollection('Pokemon')
//const getBadges = getPokemonCollection('Badges')

const pokemonData = [
    { number: 6, name: 'Charizard', types: [ 'Fire', 'Flying' ] },
    { number: 7, name: 'Squirtle', types: [ 'Water' ] },
    { number: 8, name: 'Wartortle', types: [ 'Water' ] },
    { number: 9, name: 'Blastoise', types: [ 'Water' ] }
]

router.get('/', async (_, response) => {
    const collection = await getPokemon()
    const count = await collection.countDocuments()

    const number = Math.floor(Math.random() * count + 1)
    const found = await collection.findOne({ number })

    if (!found) response.send({ error: `Cannot find pokemon number: ${number}`})
    else response.send(found)
})

router.get('/pokemon/:number', async (request, response) => {
    const { number } = request.params // remember number is a string

    const collection = await getPokemon()
    const found = await collection.findOne({ number: parseInt(number) })

    //const found = pokemonData.find(data => data.number.toString() === number)
    if (!found) response.send({ error: `Cannot find pokemon number: ${number}`})
    else response.send(found)
})


router.get('/pokemon/id/:id', async (request, response) => {
    const { id } = request.params

    const collection = await getPokemon()
    const found = await collection.findOne({ _id: new ObjectId(id) })

    //const found = pokemonData.find(data => data.number.toString() === number)
    if (!found) response.send({ error: `Cannot find pokemon with id: ${id}`})
    else response.send(found)
})

router.post('/pokemon/add', async (request, response) => {
    const { number, name, types } = request.body
    const collection = await getPokemon()
    const result = await collection.insertOne({ number, name, types })
    response.send(result)
})

module.exports = router