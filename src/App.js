import React, { Component } from "react";
import Axios from "axios";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { APIKEY, RESULTSLIMIT } from "./config";

class App extends Component {
  state = {
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

        const point = `${latitude},${longitude}`;
        const url = `https://graphhopper.com/api/1/geocode?point=${point}&limit=${RESULTSLIMIT}&reverse=true&key=${APIKEY}`;

        const {
          data: { hits: results },
        } = await Axios.get(url);

        this.extractGeoData(results);
      });
    }
  };

  setLocation = () => {
    const { location } = this.state;

    if (!location) {
      return;
    }

    const locationURI = encodeURIComponent(location);

    this.geocodeLocation(locationURI);
  };

  geocodeLocation = async location => {
    const url = `https://graphhopper.com/api/1/geocode?q=${location}&limit=${RESULTSLIMIT}&key=${APIKEY}`;

    const {
      data: { hits: results },
    } = await Axios.get(url);

    this.extractGeoData(results);
  };

  extractGeoData = results => {
    if (results[0]) {
      console.log(results[0]);
      const { country, state, city, name, point } = results[0];

      this.setState({ geoInfo: { country, state, city, name, point } });
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
    const { geoInfo, date } = this.state;
    const {
      point: { lat, lng },
    } = geoInfo;

    let url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;

    if (date) {
      url += `&date=${date}`;
    }

    return url;
  };

  extractTimes = results => {
    console.log(results);
    const sunrise = new Date(results.sunrise).toLocaleTimeString();
    const sunset = new Date(results.sunset).toLocaleTimeString();
    const noon = new Date(results.solar_noon).toLocaleTimeString();

    this.setState({ times: { sunrise, sunset, noon } });
  };

  onCalendarChange = date => {
    date = format(date, "YYYY-MM-DD");
    this.setState({ date });
  };

  renderLocation = () => {
    const {
      geoInfo: { country, state, city, name },
    } = this.state;

    let locationString = "";
    name ? (locationString += `${name}`) : (locationString += "");
    city && city !== name
      ? (locationString += `, ${city}`)
      : (locationString += "");
    state ? (locationString += `, ${state}`) : (locationString += "");
    country ? (locationString += `, ${country}`) : (locationString += "");

    return <p>{locationString}</p>;
  };

  render() {
    const { location, times } = this.state;
    const { sunrise, sunset, noon } = times;

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
        <button onClick={this.setLocation} disabled={!location}>
          Use Input Location
        </button>
        {console.log(this.state)}
        {this.renderLocation()}
        <p>Sunrise - {sunrise}</p>
        <p>Solar Noon - {noon}</p>
        <p>Sunset - {sunset}</p>
      </div>
    );
  }
}

export default App;
