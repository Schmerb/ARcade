import React, { Component } from 'react'
// import styled from 'styled-components'
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps'

const defaultCenter = {
  lat: -34.397,
  lng: 150.644
}

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={defaultCenter}>
    {props.showMarker
      ? <Marker position={defaultCenter} />
      : null
    }
  </GoogleMap>
))

export default class Map extends Component {
  constructor (props) {
    super(props)
    this.state = {
      defaultCenter
    }
  }

  render () {
    return (
      <MyMapComponent
        defaultCenter={this.state.defaultCenter}
        showMarker
        googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places'
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: 'calc(100vh - 105px)' }} />}
        mapElement={<div style={{ height: `100%` }} />} />
    )
  }
}
