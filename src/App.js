import React, { Component } from "react";
import Axios from "axios";
import { Header, Calendar, Location, Times, Buttons } from "./components";
import {
  extractGeoData,
  convertTimes,
  getTimezone,
  convertDate,
  makeSunURL,
} from "./helpers";

const API_KEY = process.env.API_KEY || process.env.REACT_APP_API_KEY;

class App extends Component {
  state = {
    location: "",
    geoInfo: {},
    date: null,
    times: {},
    error: "",
  };

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const {
          coords: { latitude, longitude },
        } = position;
        const resultsLimit = 1;
        this.setState({ times: {} });

        const point = `${latitude},${longitude}`;
        const url = `https://graphhopper.com/api/1/geocode?point=${point}&limit=${resultsLimit}&reverse=true&key=${API_KEY}`;

        const {
          data: { hits: results },
        } = await Axios.get(url);

        const extractedResults = extractGeoData(results);
        this.setState({ geoInfo: { ...extractedResults } });
        this.getTimeZone({ lat: latitude, lng: longitude });
        this.getTimes();
      });
    }
  };

  setLocation = async () => {
    const { location } = this.state;
    this.setState({ error: "", times: {} });

    if (!location) {
      return;
    }

    const locationURI = encodeURIComponent(location);

    const { lat, lng } = await this.geocodeLocation(locationURI);
    if (!lat || !lng) return;
    this.getTimeZone({ lat, lng });
    this.getTimes();
  };

  geocodeLocation = async location => {
    const resultsLimit = 1;
    const url = `https://graphhopper.com/api/1/geocode?q=${location}&limit=${resultsLimit}&key=${API_KEY}`;

    const {
      data: { hits: results },
    } = await Axios.get(url);

    if (!results[0]) {
      return this.setState({ error: "No matches found for that location." });
    }

    const extractedResults = extractGeoData(results);
    this.setState({ geoInfo: { ...extractedResults } });

    return { ...results[0].point };
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
    const { location, times, geoInfo, error } = this.state;

    return (
      <div className="App">
        {console.log(this.state)}
        <Header />
        <Calendar onChange={date => this.onCalendarChange(date)} />
        <Buttons
          location={location}
          onLocationChange={this.onLocationChange}
          getTimes={this.getTimes}
          getLocation={this.getLocation}
          setLocation={this.setLocation}
        />
        <Location geoInfo={geoInfo} error={error} />
        <Times times={times} />
      </div>
    );
  }
}

export default App;
