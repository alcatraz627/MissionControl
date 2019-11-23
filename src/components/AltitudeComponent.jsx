import React, { useState, useContext, useEffect } from 'react'

import { Slider, TextField } from '@material-ui/core';

import { PUBNUB_MESSAGES, PUBNUB_RETURNS } from '../constants';

import { PubNubServiceProvider } from './App';

const MIN = 0, MAX = 10.0;

const AltitudeComponent = ({isArmed=false}) => {

    const PubNubService = useContext(PubNubServiceProvider);

    const [max, setMax] = useState(MAX);
    const [maxText, setMaxText] = useState(MAX);

    const [altitude, setAltitude] = useState(0);
    const [altitudeText, setAltitudeText] = useState(0);
    // const [scaling, setScaling]

    let altitudeMarks = _.range(MIN, max + 1, (max - MIN) / 10).map(e => ({ value: e, label: `${e.toFixed(1).toString()}m` }));

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
        PubNubService.publish({ message: PUBNUB_MESSAGES.ALT(Math.max(value, 0)) });
    }

    useEffect(() => {
        setAltitudeText(altitude)
    }, [altitude])

    const handleMaxTextChange = ({ target: { name, value } }) => {
        setMaxText(Math.max(0.0, parseFloat(value)) || '');
    }

    const handleMaxAltitudeSet = e => {
        e.preventDefault();
        parseFloat(maxText) && setMax(Math.min(Math.max(MAX, parseFloat(maxText)), 500) || MAX);
        setMaxText(Math.max(MAX, Math.min(parseFloat(maxText), 500)))
    }

    const styles = {
        slider: {
            minHeight: '300px',
            height: '39em',
            marginTop: '20px',
        }
    }

    return (
        <div className="sliderContainer">
            <form onSubmit={handleMaxAltitudeSet}>
                <TextField disabled={!isArmed} type="number" min="0" label="Max Range" helperText="Set max range" value={maxText} onChange={handleMaxTextChange} />
            </form>
            <Slider
                disabled={!isArmed}
                marks={altitudeMarks}
                min={MIN} max={max}
                style={styles.slider}
                value={altitude}
                onChange={handleAltitudeChange}
                // valueLabelFormat={x=>((x).toString() + 'm')}
                orientation="vertical"
                valueLabelDisplay="auto"
            />
            <br />
            <br />
            <br />
            <form onSubmit={handleAltitudeTextEnter}>
                <TextField disabled={!isArmed} type="number" min="0" label="Set Alt(m)" value={`${altitudeText}`} onChange={handleAltitudeChangeText} />
            </form>
        </div>

    )
}

export default AltitudeComponent;