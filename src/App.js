import React, { Component } from "react";
import Axios from "axios";
import Calendar from "react-calendar";
import { format } from "date-fns";

class App extends Component {
  state = {
    lat: null,
    lng: null,
    date: null,
    times: {},
  };

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const {
          coords: { latitude, longitude },
        } = position;

        this.setState({ lat: latitude, lng: longitude });
      });
    }
  };

  getData = async () => {
    const { lat, lng, date } = this.state;

    let url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;

    if (date) {
      url += `&date=${date}`;
    }

    const {
      data: { results },
    } = await Axios.get(url).catch(err => console.log(err));

    this.setState({
      times: { sunrise: results.sunrise, sunset: results.sunset },
    });

    let sunrise = new Date(results.sunrise).toLocaleTimeString();
    let sunset = new Date(results.sunset).toLocaleTimeString();
    let noon = new Date(results.solar_noon).toLocaleTimeString();

    this.setState({ times: { sunrise, sunset, noon } });
  };

  onCalendarChange = date => {
    date = format(date, "YYYY-MM-DD");
    this.setState({ date });
  };

  render() {
    const { sunrise, sunset, noon } = this.state.times;

    return (
      <div className="App">
        <h1>App</h1>
        <Calendar onChange={date => this.onCalendarChange(date)} />
        <button onClick={this.getData}>Get Data</button>
        <button onClick={this.getLocation}>Use My Location</button>

        <p>Sunrise - {sunrise}</p>
        <p>Noon - {noon}</p>
        <p>Sunset - {sunset}</p>
      </div>
    );
  }
}

export default App;
