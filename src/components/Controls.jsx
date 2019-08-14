import React, { useState, useContext } from 'react';

import { PUBNUB_MESSAGES, PUBNUB_RETURNS } from '../constants';

import { PubNubServiceProvider } from './App';
import Orientation from './Orientation';

import _ from 'lodash';

import { Grid, TextField, Button, Typography, Paper, Divider, CircularProgress, Link, Input, InputAdornment } from '@material-ui/core';
import { green, blue, yellow, red } from '@material-ui/core/colors';

const Controls = ({ grid_spacing = 2 }) => {


    const [altitude, setAltitude] = useState(0);
    const [heading, setHeading] = useState(0);
    const [battery, setBattery] = useState(90);

    const [circleParams, setCircleParams] = useState({ radius: '', turnRate: '' });

    const PubNubService = useContext(PubNubServiceProvider);

    PubNubService.subscribe((m) => {
        // console.log('Message from server:', m)
        let decodeArr = m.message.split(',')
        let decode;
        decodeArr.map(e => {
            decode = e.split(' ');
            switch (decode[0]) {
                case (PUBNUB_RETURNS.ALTITUDE):
                    parseInt(decode[1]) && setAltitude(Math.max(0, parseInt(decode[1])));
                    break;
                case (PUBNUB_RETURNS.BATTERY):
                    parseInt(decode[1]) && setBattery(Math.min(100, Math.max(0, parseInt(decode[1]))));
                    break;
                case (PUBNUB_RETURNS.HEADING):
                    parseInt(decode[1]) && setHeading(parseInt(decode[1]));
                    break;
            }
        });
    });

    // const handleArmedChange = () => {
    //     PubNubService.publish({ message: PUBNUB_MESSAGES.ARM() });    
    // }

    const handleCircleParamsChange = ({ target: { name, value } }) => {
        setCircleParams({ ...circleParams, [name]: Math.max(0, parseInt(value)) || '' });
    }

    const handleCircleCommand = () => {
        PubNubService.publish({ message: PUBNUB_MESSAGES.CIRCLE(circleParams.radius, circleParams.turnRate) });
    }

    const handleCircleCommandSubmit = (e) => {
        e.preventDefault();
        handleCircleCommand()
    }

    const handleCommand = (command) => {
        PubNubService.publish({ message: command });
    }

    const CONTROLS = [
        {
            label: 'Arm Drone',
            command: PUBNUB_MESSAGES.ARM(),
            color: 'primary',
        },
        {
            label: 'Land Drone',
            command: PUBNUB_MESSAGES.LAND(),
            color: 'secondary',
        },
        {
            label: 'Return to Launch',
            command: PUBNUB_MESSAGES.RETURN_TO_LAUNCH(),
            color: 'default',
        },
    ];

    const circ_prog_size = 80;

    let styles = {
        blue: {
            color: blue[800],
        },
        green: {
            color: green[800],
        },
        yellow: {
            color: yellow[800],
        },
        red: {
            color: red[800],
        },
        divider: {
            margin: '20px 0',
        },
        batteryBox: {
            position: 'relative',
            display: 'inline-block'
        },
        batteryLevel: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            textAlign: 'center',
            lineHeight: `${circ_prog_size}px`,
        },
    };

    const getBatteryColor = val => {
        if ((val < 100) && val >= 50) return 'green';
        else if (val < 50 && val >= 20) return 'yellow';
        else if (val < 20 && val >= 0) return 'red';
        else return 'blue';
    }


    return (
        <Paper>
            <Grid container spacing={8}>
                <Grid item xs={6}>
                    <Grid container direction="column" spacing={grid_spacing}>
                        {CONTROLS.map(e =>
                            <Grid item xs={12} key={e.command}>
                                <Button variant="outlined" color={e.color} fullWidth onClick={() => { handleCommand(e.command) }} >{e.label}</Button>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <form onSubmit={handleCircleCommandSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Input endAdornment={<InputAdornment position="end">m</InputAdornment>} fullWidth placeholder="Radius" value={circleParams.radius} name="radius" onChange={handleCircleParamsChange} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Input endAdornment={<InputAdornment position="end">m</InputAdornment>} fullWidth placeholder="Turn Rate" value={circleParams.turnRate} name="turnRate" onChange={handleCircleParamsChange} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button fullWidth variant="outlined" color="default" onClick={handleCircleCommand}>Circle</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                        <Divider />
                        <Link href="//localhost:3000/log" target="_blank" variant="body2" style={styles.blue}>View Log History</Link>
                        <Grid item xs={12}>
                            <Orientation />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle1">Altitude</Typography>
                    <Typography variant="h3" style={styles.blue}>{altitude}m</Typography>

                    <Divider style={styles.divider} />

                    <Typography variant="subtitle1">Camera</Typography>
                    <Typography variant="h3" style={styles.blue}>{heading * 180 / Math.PI} deg</Typography>

                    <Divider style={styles.divider} />

                    <Typography variant="subtitle1">Battery Remaining</Typography>
                    <div style={styles.batteryBox}>
                        <Typography style={{ ...styles.batteryLevel, ...styles[getBatteryColor(battery)] }} variant="h6" component="span">{battery}%</Typography>
                        <CircularProgress style={styles[getBatteryColor(battery)]} value={battery} size={circ_prog_size} thickness={4} variant="static" />
                    </div>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Controls;