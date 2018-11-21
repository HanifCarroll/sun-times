import React, { Component } from "react";
import Axios from "axios";
import { format } from "date-fns";
import { APIKEY, RESULTSLIMIT } from "./config";

import { Header, Calendar, Location, Times, Buttons } from "./components";

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
        this.getTimes();
      });
    }
  };

  setLocation = async () => {
    const { location } = this.state;

    if (!location) {
      return;
    }

    const locationURI = encodeURIComponent(location);

    await this.geocodeLocation(locationURI);
    this.getTimes();
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
    const sunrise = new Date(results.sunrise).toLocaleTimeString();
    const sunset = new Date(results.sunset).toLocaleTimeString();
    const noon = new Date(results.solar_noon).toLocaleTimeString();

    this.setState({ times: { sunrise, sunset, noon } });
  };

  onCalendarChange = date => {
    date = format(date, "YYYY-MM-DD");
    this.setState({ date });
  };

  onLocationChange = e => {
    this.setState({ location: e.target.value });
  };

  render() {
    const { location, times, geoInfo } = this.state;

    return (
      <div className="App">
        <Header />
        <Calendar onChange={date => this.onCalendarChange(date)} />
        <Buttons
          location={location}
          onLocationChange={this.onLocationChange}
          getTimes={this.getTimes}
          getLocation={this.getLocation}
          setLocation={this.setLocation}
        />
        <Location geoInfo={geoInfo} />
        <Times times={times} />
      </div>
    );
  }
}

export default App;
