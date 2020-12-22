import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const URL = 'ws://localhost:3030'
const mapStyles = {
  height: '600px',
};


class GoogleMap extends Component {
  state = {
    markers: [],
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.ws.onopen = (evt) => {
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      const marker = JSON.parse(evt.data);
      this.addMarker(marker);
    }

    this.ws.onclose = () => {
      console.log('disconnected');
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addMarker = marker => {
    this.setState(state => ({ markers: [marker, ...state.markers] }));
  }

  removeMarker = marker => {
    this.setState(state => ({ markers: state.markers.filter((markerInState) => markerInState !== marker) }))
  }


  displayMarkers = () => {
    return this.state.markers.map((marker, index) => {
      const markerComp = <Marker key={index} id={index} position={{
        lat: marker.lat,
        lng: marker.lng
      }} />
      setTimeout(() => {
        this.removeMarker(marker);
      }, 3000);
      return markerComp;
    })
  }

  render() {
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={4}
          style={mapStyles}
          initialCenter={{ lat: 50.4501, lng: 30.5234 }}
        >
          {this.displayMarkers()}
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAK_vkvxDH5vsqGkd0Qn-dDmq-rShTA7UA'
})(GoogleMap);
