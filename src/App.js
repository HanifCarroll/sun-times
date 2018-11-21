import React, { Component } from "react";
import Axios from "axios";
import Calendar from "react-calendar";
import { format } from "date-fns";

class App extends Component {
  state = {
    lat: null,
    lng: null,
    date: null,
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

    let url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}`;

    if (date) {
      url += `&date=${date}`;
    }

    const {
      data: { results },
    } = await Axios.get(url).catch(err => console.log(err));

    console.log(results);
  };

  onCalendarChange = date => {
    date = format(date, "YYYY-MM-DD");
    this.setState({ date });
  };

  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <Calendar onChange={date => this.onCalendarChange(date)} />
        <button onClick={this.getData}>Get Data</button>
        <button onClick={this.getLocation}>Use My Location</button>
      </div>
    );
  }
}

export default App;
