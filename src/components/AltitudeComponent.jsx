import React, { useState, useContext, useEffect } from 'react'

import { Slider, TextField } from '@material-ui/core';

import { PUBNUB_MESSAGES, PUBNUB_RETURNS } from '../constants';

import { PubNubServiceProvider } from './App';

const MIN = 0, MAX = 10.0;
const STEP = (MAX - MIN) / 10;

const AltitudeComponent = () => {

    const PubNubService = useContext(PubNubServiceProvider);

    const [altitude, setAltitude] = useState(0);
    const [altitudeText, setAltitudeText] = useState(0);
    const altitudeMarks = _.range(MIN, MAX + 1, STEP).map(e => ({ value: e, label: `${e.toString()}m` }));

    PubNubService.subscribe((m) => {
        // console.log('Message from server:', m)
        if (m.message.split(' ')[0] == PUBNUB_RETURNS.ALTITUDE) {
            setAltitude(parseInt(m.message.split(' ')[1]))
        }
    })


    const handleAltitudeChange = (event, value) => { _updateAltitude(value) }

    const handleAltitudeChangeText = ({ target: { value } }) => { setAltitudeText(value) }

    const handleAltitudeTextEnter = (e) => {
        e.preventDefault();
        setAltitude(Math.max(parseInt(altitudeText), 0));

        setAltitudeText(altitude);

    }

    const _updateAltitude = value => {
        setAltitude(Math.max(value, 0));
        PubNubService.publish({ message: PUBNUB_MESSAGES.ALT(Math.min(MAX, Math.max(value, 0))) });
    }

    useEffect(() => {
        setAltitudeText(altitude)
    }, [altitude])

    const styles = {
        slider: {
            minHeight: '300px',
            height: '67vh',
            marginTop: '20px',
        }
    }

    return (
        <div className="sliderContainer">
            <Slider marks={altitudeMarks} style={styles.slider}
                defaultValue={80} min={MIN} max={MAX}
                value={altitude}
                onChange={handleAltitudeChange}
                // valueLabelFormat={x=>((x).toString() + 'm')}
                orientation="vertical" valueLabelDisplay="on" />
            <br />
            <br />
            <br />
            <form onSubmit={handleAltitudeTextEnter}>
                <TextField type="number" min="0" label="Set Altitude(in m)" value={`${altitudeText}`} onChange={handleAltitudeChangeText} />
            </form>
        </div>

    )
}

export default AltitudeComponent;