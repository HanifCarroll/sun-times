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

  getData = async () => {
    let url = `https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400`;

    if (this.state.date) {
      url += `&date=${this.state.date}`;
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

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div className="App">
        <h1>App</h1>
        <Calendar onChange={date => this.onCalendarChange(date)} />
        <button onClick={this.getData}>Get Data</button>
      </div>
    );
  }
}

export default App;
