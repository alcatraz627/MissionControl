import React, { useState } from 'react'

import { Map, GoogleApiWrapper } from 'google-maps-react';

const MapComponent = (props) => {

    const mapStyle = {
        position: 'relative',
    }

    return (
        <div className="mapContainer">
            <Map
                google={props.google}
                zoom={8}
                style={mapStyle}
                initialCenter={{ lat: 47.444, lng: -122.176 }}
            />
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBIoUH-Dp2Jxr4a2lxXmLX_SBeGwTHR9XM'
})(MapComponent);