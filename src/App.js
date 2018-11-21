import React, { Component } from "react";
import Axios from "axios";
import Calendar from "react-calendar";
import { format } from "date-fns";

class App extends Component {
  state = {
    lat: null,
    lng: null,
    location: "",
    geoInfo: {},
    date: null,
    times: {},
  };

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const {
          coords: { latitude, longitude },
        } = position;

        const apiKey = "9e59bc25-9417-438f-860e-926289f82523";
        const resultsLimit = 1;
        const point = `${latitude},${longitude}`;
        const url = `https://graphhopper.com/api/1/geocode?point=${point}&limit=${resultsLimit}&reverse=true&key=${apiKey}`;

        const {
          data: { hits: results },
        } = await Axios.get(url);

        this.extractGeoData(results);
      });
    }
  };

  setLocation = () => {
    const { location } = this.state;

    const locationURI = encodeURIComponent(location);

    this.geocodeLocation(locationURI);
  };

  geocodeLocation = async location => {
    const apiKey = "9e59bc25-9417-438f-860e-926289f82523";
    const resultsLimit = 1;
    const url = `https://graphhopper.com/api/1/geocode?q=${location}&limit=${resultsLimit}&key=${apiKey}`;

    const {
      data: { hits: results },
    } = await Axios.get(url);

    this.extractGeoData(results);
  };

  extractGeoData = results => {
    if (results[0]) {
      console.log(results[0]);
      const { country, state, name, point } = results[0];

      this.setState({ geoInfo: { country, state, name, point } });
    } else {
      console.log("Query not found.");
      this.setState({ geoInfo: {} });
    }
  };

  getTimes = async () => {
    const url = this.makeSunUrl();

    const {
      data: { results },
    } = await Axios.get(url).catch(err => console.log(err));

    this.extractTimes(results);
  };

  makeSunUrl = () => {
    const { lat, lng, date } = this.state;

    let url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;

    if (date) {
      url += `&date=${date}`;
    }

    return url;
  };

  extractTimes = results => {
    const sunrise = new Date(results.sunrise).toLocaleTimeString();
    const sunset = new Date(results.sunset).toLocaleTimeString();
    const noon = new Date(results.solar_noon).toLocaleTimeString();

    this.setState({ times: { sunrise, sunset, noon } });
  };

  onCalendarChange = date => {
    date = format(date, "YYYY-MM-DD");
    this.setState({ date });
  };

  render() {
    const { sunrise, sunset, noon, location } = this.state.times;

    return (
      <div className="App">
        <h1>App</h1>
        <Calendar onChange={date => this.onCalendarChange(date)} />
        <button onClick={this.getTimes}>Get Data</button>
        <button onClick={this.getLocation}>Use My Location</button>
        <input
          type="text"
          value={location}
          onChange={e => this.setState({ location: e.target.value })}
        />
        <button onClick={this.setLocation}>Use Input Location</button>
        {console.log(this.state)}
        <p>Sunrise - {sunrise}</p>
        <p>Noon - {noon}</p>
        <p>Sunset - {sunset}</p>
      </div>
    );
  }
}

export default App;
