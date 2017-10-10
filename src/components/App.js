import React, { Component } from 'react';
import Crawler from './Crawler.js';
import Controls from './Controls.js';
import CardContainer from './CardContainer.js';
import '../styles/App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      peopleArray : []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getPeopleData() {
    fetch('https://swapi.co/api/people/')
      .then(response => response.json())
      .then(peopleData => peopleData.results)
      .then(peopleArray => {
        const unresolvedPromisesSpecies = peopleArray.map( person =>{
          return fetch(person.species).then(response => response.json());
        });
        const unresolvedPromisesWorld = peopleArray.map( person =>{
          return fetch(person.homeworld).then(response => response.json());
        });

        const promiseAll = Promise.all([Promise.all(unresolvedPromisesSpecies), Promise.all(unresolvedPromisesWorld)]);
        console.log(promiseAll);

        promiseAll.then( speciesPlanetArray =>{
          console.log(speciesPlanetArray);
          const finalArray = speciesPlanetArray[1].map((planet, index) => {
            return Object.assign({}, { name: peopleArray[index].name,
              species: speciesPlanetArray[0][index].name,
              homeworld: planet.name,
              population: planet.population});
          });

          this.setState({ peopleArray: finalArray });
        });
      });
  }

  //catch set state to error view true

  render() {
    return (
      <div className="App">
        <h1>App  is here</h1>
        <Crawler />
        <Controls />
        <CardContainer peopleArray={this.state.peopleArray} />
      </div>
    );
  }
}

// {
//     "films": "https://swapi.co/api/films/",
//     "people": "https://swapi.co/api/people/",
//     "planets": "https://swapi.co/api/planets/",
//     "species": "https://swapi.co/api/species/",
//     "starships": "https://swapi.co/api/starships/",
//     "vehicles": "https://swapi.co/api/vehicles/"
// }

export default App;
