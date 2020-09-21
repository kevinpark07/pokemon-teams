const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const trainerContainer = document.querySelector('main')


document.addEventListener('DOMContentLoaded', (e) => {
    console.log('DOM Loaded')

    const fetchTrainer = url => {
        
        fetch(url)
        .then(response => response.json())
        .then(trainerData => {
            for (trainer of trainerData) {
                renderTrainer(trainer);
         }
        })
    }

function renderTrainer(trainer) {
    let trainerCard = document.createElement('div');
    trainerCard.innerHTML = `
    <div class="card" data-id="${trainer.id}">
    <p>${trainer.name}</p>
    <button class="add-pokemon" data-trainer-id="${trainer.id}">Add Pokemon</button>
    <ul data-trainer-list="${trainer.id}">
    ${trainer.pokemons.map (pokemon => {
        return `<li> ${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
    }).join('')}
    </ul>
    </div>
    `
    trainerContainer.append(trainerCard);
}

const deleteFromDatabase = (pokemon) => {
    const pokemonId = pokemon.dataset.pokemonId
    const options = {
        method: "DELETE",
    }

    fetch(POKEMONS_URL+ "/" + pokemonId, options)
    .then(response => response.json())
    .then(data => console.log(data))
}

const addPokemon = (trainer) => {
    fetch(POKEMONS_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'trainer_id': trainer
        })
    })
    .then(resp => {
        if(resp.ok) {
            return resp.json()
        } else {
            throw Error(resp.statusText)
        }
    })
    .then(pokemon => {
        pokemonList = document.querySelector(`[data-trainer-list="${trainer}"]`)
        newLi = document.createElement('li')
        newLi.innerHTML = `${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button>`
        pokemonList.appendChild(newLi)
    })
}

const clickHandler = () => {
    document.addEventListener("click", e => {
        if (e.target.matches(".release")) {
            deleteFromDatabase(e.target);
            e.target.parentNode.remove()
        }
        if (e.target.matches(".add-pokemon")) {
            addPokemon(parseInt(e.target.dataset.trainerId))
        }
    })
}


fetchTrainer(TRAINERS_URL);
clickHandler();

})