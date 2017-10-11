import React, { Component } from 'react';
import Crawler from './Crawler.js';
import Controls from './Controls.js';
import CardContainer from './CardContainer.js';
import Favorites from './Favorites.js';
import '../styles/App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentDataArray: null,
      favoritesArray: [],
      peopleArray: null,
      planetArray: null,
      vehicleArray: null,
      filmArray: null,
      whichCrawler: Math.floor(Math.random() * (6 - 0 + 1))
    };
  }

  componentDidMount() {
    this.getPeopleData();
    this.getCrawlerData();
    this.getVehicleData();
    this.getPlanetData();
  }

  getCrawlerData() {
    fetch('https://swapi.co/api/films/')
      .then(response => response.json())
      .then(filmData => filmData.results)
      .then(filmArray => {
        const finalArray = filmArray.map( film => {
          return Object.assign({}, {
            title: film.title,
            openingCrawl: film.opening_crawl,
            release: film.release_date
          });
        });
        this.setState({ filmArray: finalArray });
      });
  }


  getVehicleData() {
    fetch('https://swapi.co/api/vehicles/')
      .then(response => response.json())
      .then(vehicleData => vehicleData.results)
      .then(vehicleArray => {
        const finalVehicleArray = vehicleArray.map( vehicle => {
          return Object.assign({}, {
            name: vehicle.name,
            model: vehicle.model,
            class: vehicle.vehicle_class,
            passengers: vehicle.passengers
          });
        });
        this.setState({ vehicleArray: finalVehicleArray});
      });
  }

  //name, terrain, population, climate, residents
  getPlanetData() {
    fetch('https://swapi.co/api/planets/')
      .then(response => response.json())
      .then(planetData => planetData.results)
      .then(planetArray => {
        const residents = planetArray.map( planet =>{
          return planet.residents;
        });
        const unresolvedPromises = residents.map( resident =>{
          return resident.map( url => {
            return fetch(url).then(response => response.json());
          });
        });
        const promiseAll = Promise.all(unresolvedPromises.map( innerPromiseArray => {
          return Promise.all(innerPromiseArray);
        }));

        promiseAll.then( residentsArray => {
          const names = residentsArray.map( residentPlanet =>{
            return residentPlanet.map( resident => {
              return resident.name;
            });
          });
          const nameStringArray = names.map( name => {
            return name.toString();
          });
          const finalArray = nameStringArray.map( (names, index) => {
            return Object.assign({}, {
              name: planetArray[index].name,
              terrain: planetArray[index].terrain,
              population: planetArray[index].population,
              climate: planetArray[index].climate,
              residents: names});
          });
          this.setState({ planetArray: finalArray});
        });
      });
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

        promiseAll.then( speciesPlanetArray =>{
          const finalArray = speciesPlanetArray[1].map((planet, index) => {
            return Object.assign({}, { name: peopleArray[index].name,
              species: speciesPlanetArray[0][index].name,
              homeworld: planet.name,
              population: planet.population});
          });
          this.setState({
            peopleArray: finalArray,
            currentDataArray: finalArray});
        });
      });
  }

  // need better name for this function
  onClick = (query) => {
    if (query === 'People') {
      this.setState({ currentDataArray: this.state.peopleArray });
    }
    if (query === 'Planets') {
      this.setState({ currentDataArray: this.state.planetArray });
    }
    if (query === 'Vehicles')  {
      this.setState({ currentDataArray: this.state.vehicleArray });
    }
  };

  // need better name for this
  onFavoriteClick = (object) => {
    const { favoritesArray } = this.state;
    const tempArray = favoritesArray.filter(card => card.name !== object.name);

    if (tempArray.length === favoritesArray.length) {
      tempArray.push(object);
    }
    this.setState({
      favoritesArray: tempArray,
      favoritesCardArray: object
    });
  }

  // catch set state to error view true

  render() {
    const { peopleArray, planetArray, vehicleArray, filmArray, whichCrawler, favoritesArray, currentDataArray } = this.state;

    // if (peopleArray && vehicleArray && planetArray && filmArray) {
    if (peopleArray && planetArray && vehicleArray && filmArray && currentDataArray) {
      return (
        <div className="App">
          <Crawler
            filmArray={filmArray}
            whichCrawler={whichCrawler} />
          <Controls onClick={this.onClick} />
          <CardContainer
            currentDataArray={currentDataArray}
            favoritesArray={favoritesArray}
            onFavoriteClick={this.onFavoriteClick} />
          <Favorites
            favoritesArray={favoritesArray}
            onFavoriteClick={this.onFavoriteClick}
          />
        </div>
      );
    } else {
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    }
  }
}


export default App;
