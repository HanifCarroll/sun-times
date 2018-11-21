import React, { Component } from "react";
import Axios from "axios";
import { APIKEY, RESULTSLIMIT } from "./config";

import { Header, Calendar, Location, Times, Buttons } from "./components";
import { convertTimes, getTimezone, convertDate, makeSunURL } from "./helpers";

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
        this.getTimeZone({ lat: latitude, lng: longitude });
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

    const { lat, lng } = await this.geocodeLocation(locationURI);
    this.getTimeZone({ lat, lng });
    this.getTimes();
  };

  geocodeLocation = async location => {
    const url = `https://graphhopper.com/api/1/geocode?q=${location}&limit=${RESULTSLIMIT}&key=${APIKEY}`;

    const {
      data: { hits: results },
    } = await Axios.get(url);

    this.extractGeoData(results);

    return { ...results[0].point };
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

  getTimeZone = ({ lat, lng }) => {
    const timezone = getTimezone({ lat, lng });

    this.setState({ geoInfo: { ...this.state.geoInfo, timezone } });
  };

  getTimes = async () => {
    const { lat, lng } = this.state.geoInfo.point;
    const { date } = this.state;
    const url = makeSunURL({ lat, lng, date });

    const {
      data: { results },
    } = await Axios.get(url).catch(err => console.log(err));

    this.extractTimes(results);
  };

  extractTimes = ({ sunrise, sunset, solar_noon }) => {
    const timezone = this.state.geoInfo.timezone;
    const times = [sunrise, sunset, solar_noon];

    [sunrise, sunset, solar_noon] = convertTimes(times, timezone);

    this.setState({ times: { sunrise, sunset, solar_noon } });
  };

  onCalendarChange = date => {
    const convertedDate = convertDate(date);
    this.setState({ date: convertedDate });
  };

  onLocationChange = e => {
    this.setState({ location: e.target.value });
  };

  render() {
    const { location, times, geoInfo } = this.state;

    return (
      <div className="App">
        {console.log(this.state.geoInfo)}
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
