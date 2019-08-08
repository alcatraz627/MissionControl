import React, { useState } from 'react'

import { Map, GoogleApiWrapper } from 'google-maps-react';

const MapComponent = (props) => {

    const mapStyle = {
        width: '100%',
        height: '100%',
    }

    return (
        <div className="mapContainer">
            <Map
                google={props.google}
                zoom={15.25}
                style={mapStyle}
                initialCenter={{ lat: 12.9982637, lng: 80.2324117 }}
            />
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBIoUH-Dp2Jxr4a2lxXmLX_SBeGwTHR9XM'
})(MapComponent);