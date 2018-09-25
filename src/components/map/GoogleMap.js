import React, { Component } from "react";
import { Cacher } from "../../services/cacher";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Circle,
  InfoWindow
} from "react-google-maps";
// import { resolve } from "path";

const MapComponent = props => {
  const { coordinates, isError, isLocationLoaded } = props;

  return (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={coordinates}
      center={coordinates}
      options={{ disableDefaultUI: isError ? true : false }}
    >
      {isLocationLoaded &&
        !isError && <Circle center={coordinates} radius={500} />}
      {isLocationLoaded && isError ? (
        <InfoWindow position={coordinates} options={{ maxWidth: 300 }}>
          <div>
            There is a problem to find the location on the Map. We will resolve
            this issue as fast as possible. Contact host for additional
            information
          </div>
        </InfoWindow>
      ) : null}
    </GoogleMap>
  );
};

function GeoCode(WrappedComponent) {
  return class extends Component {
    constructor() {
      super();

      this.cacher = new Cacher();

      this.state = {
        coordinates: {
          lat: 0,
          lng: 0
        },
        isError: false,
        isLocationLoaded: false
      };
    }

    componentWillMount() {
      this.getGeoCodeLocation();
    }

    updateCoordinates(coordinates) {
      this.setState({ coordinates, isLocationLoaded: true });
    }

    geocodeLocation(location) {
      const geoCoder = new window.google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geoCoder.geocode({ address: location }, (result, status) => {
          // console.log("result:", result);
          // console.log("status:", status);

          if (status === "OK") {
            const geometry = result[0].geometry.location;
            const coordinates = { lat: geometry.lat(), lng: geometry.lng() };
            this.cacher.cacheValue(location, coordinates);

            resolve(coordinates);
          } else {
            reject("ERROR!!!!");
          }
        });
      });
    }

    getGeoCodeLocation = () => {
      const location = this.props.location;
      // console.log(location, "location");

      if (this.cacher.isValueCached(location)) {
        this.updateCoordinates(this.cacher.getCacheValue(location));
        // console.log(this.state.coordinates);
      } else {
        this.geocodeLocation(location)
          .then(coordinates => {
            this.updateCoordinates(coordinates);
            // this.setState({ coordinates, isLocationLoaded: true });
          })
          .catch(error => {
            this.setState({ isError: true, isLocationLoaded: true });
          });
      }
    };

    render() {
      return <WrappedComponent {...this.state} />;
    }
  };
}

const MapWithGeoCode = withScriptjs(withGoogleMap(GeoCode(MapComponent)));

export default MapWithGeoCode;
