import React, { useState, useContext, useEffect } from 'react'

import { PubNubServiceProvider } from './App';

import { PUBNUB_MESSAGES, PUBNUB_RETURNS } from '../constants';

import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

import droneimg from '../../images/drone.png';

const MapComponent = (props) => {

    const mapStyle = {
        width: '100%',
        height: '100%',
    }

    const INIT_POS = {
        lat: 12.985101091142496,
        lng: 80.23870976488331,
    }

    const [droneLocation, setDroneLocation] = useState(INIT_POS);
    const [droneDestination, setDroneDestination] = useState(INIT_POS);

    const [isInfoWindowVisible, showInfoWindow] = useState(true);

    const PubNubService = useContext(PubNubServiceProvider);

    PubNubService.subscribe(m => {

        if (m.message.split(' ')[0] == PUBNUB_RETURNS.GPSLOG) {
            // setDroneLocation({ lat: lat(), lng: lng() });
            let [tok, lat, lng] = m.message.split(' ');
            setDroneLocation({ lat: lat, lng: lng });
        }
        // console.log(m);
    })

    const handleMapClicked = (mapProps, map, { latLng: { lat, lng } }) => {
        PubNubService.publish({ message: PUBNUB_MESSAGES.GOTO(lat(), lng()) });
        setDroneDestination({ lat: lat(), lng: lng() });
    }

    // useEffect(() => {
    //     let i = 0;
    //     setInterval(() => {
    //         setDroneLocation({ lat: droneLocation.lat + i * 0.0001, lng: droneLocation.lng + i * 0.0001 });
    //         i++;
    //     }, 500);
    // }, [])


    return (
        <div className="mapContainer">
            <Map
                google={props.google}
                zoom={15.25}
                style={mapStyle}
                onClick={handleMapClicked}
                initialCenter={{ lat: 12.9982637, lng: 80.2324117 }}
            >
                <Marker
                    position={droneDestination}
                    visible={droneLocation != droneDestination}
                >
                    <InfoWindow
                        visible={isInfoWindowVisible}
                    // marker="droneID"
                    >
                        <div>
                            <p>Click on the map or drag the marker to select location where the incident occurred</p>
                        </div>
                    </InfoWindow>

                </Marker>

                <Marker name={'Drone position'} id="droneCurrent" position={droneLocation}
                    // onClick={() => showInfoWindow(true)}
                    icon={{
                        url: droneimg,
                        // anchor: new google.maps.Point(32,32),
                        scaledSize: new google.maps.Size(30, 30)
                    }} ></Marker>
            </Map>
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBIoUH-Dp2Jxr4a2lxXmLX_SBeGwTHR9XM'
})(MapComponent);