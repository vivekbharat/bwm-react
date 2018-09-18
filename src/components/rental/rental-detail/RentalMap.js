import React, { Component } from "react";
import MapWithGeoCode from "../../map/GoogleMap";

export class RentalMap extends Component {
  render() {
    const { location } = this.props;
    // const key = "AIzaSyCYevOdC59a92hnqOVnQouU6ByUx0P2BuI";
    const key2 = "AIzaSyD7Gz8fhyzLeMsHs-S0T0jbNSlY9LNNWtc";
    return (
      <MapWithGeoCode
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key2}&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `360px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        location={location}
      />
    );
  }
}

export default RentalMap;
