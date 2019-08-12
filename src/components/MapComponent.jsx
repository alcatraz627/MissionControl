import React, { useState, useContext, useEffect } from 'react'

import { PubNubServiceProvider } from './App';

import { PUBNUB_MESSAGES, PUBNUB_RETURNS } from '../constants';

import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline } from 'google-maps-react';

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

    const [initDroneLocation, setInitDroneLocation] = useState(INIT_POS);

    const [droneLocation, setDroneLocation] = useState(INIT_POS);
    const [droneDestination, setDroneDestination] = useState(INIT_POS);

    const [isInfoWindowVisible, showInfoWindow] = useState(true);

    const [dronePath, setDronePath] = useState([]);

    const [historyMarkers, setHistoryMarkers] = useState([droneLocation]);

    const PubNubService = useContext(PubNubServiceProvider);

    useEffect(() => {
        setDronePath([...dronePath, droneLocation]);
    }, [droneLocation])

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
        setInitDroneLocation(droneLocation);
        setHistoryMarkers([...historyMarkers, droneLocation]);
    }

    useEffect(() => {
        let i = 0;
        setInterval(() => {
            setDroneLocation({ lat: droneLocation.lat + i * 0.0001, lng: droneLocation.lng + i * 0.0001 });
            i++;
        }, 500);
    }, [])


    return (
        <div className="mapContainer">
            <Map
                google={props.google}
                zoom={15.25}
                style={mapStyle}
                onClick={handleMapClicked}
                initialCenter={INIT_POS}
                rotateControl={true}
                scaleControl={true}
                center={droneLocation}
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

                {historyMarkers.map((e, i) => (
                    <Marker name={'Drone Initial position'} id="droneInitial" position={e} key={i}
                        icon={{url: 'http://maps.google.com/mapfiles/ms/icons/green.png'}}></Marker>
                ))}

                <Marker name={'Drone position'} id="droneCurrent" position={droneLocation}
                    // onClick={() => showInfoWindow(true)}
                    icon={{
                        url: droneimg,
                        // anchor: new google.maps.Point(32,32),
                        scaledSize: new google.maps.Size(30, 30)
                    }} ></Marker>

                <Polyline path={[initDroneLocation, droneDestination]}
                    strokeColor="#000000" strokeOpacity={0.8} strokeWeight={2} />

                {/* Actual path - past */}
                <Polyline path={[...dronePath, droneLocation]}
                    strokeColor="#39ff14" strokeOpacity={0.5} strokeWeight={4} />

                <Polyline path={[droneLocation, droneDestination]}
                    strokeColor="yellow" strokeOpacity={0.5} strokeWeight={4} />

            </Map>
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBIoUH-Dp2Jxr4a2lxXmLX_SBeGwTHR9XM'
})(MapComponent);