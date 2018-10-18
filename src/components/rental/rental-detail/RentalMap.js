import React, { Component } from "react";
import { connect } from "react-redux";

import MapWithGeoCode from "../../map/GoogleMap";
import * as actions from "../../../actions";

class RentalMap extends Component {
  reloadMapFinish = () => {
    // console.log("running action");
    this.props.dispatch(actions.reloadMapFinish());
  };

  render() {
    const {
      location,
      map: { isReloading }
    } = this.props;

    //console.log(isReloading, "isReloading from RentalMap.js");

    const key2 = "AIzaSyD7Gz8fhyzLeMsHs-S0T0jbNSlY9LNNWtc";
    return (
      <MapWithGeoCode
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key2}&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `360px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        location={location}
        isReloading={isReloading}
        mapLoaded={this.reloadMapFinish}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    map: state.map
  };
};

export default connect(mapStateToProps)(RentalMap);
