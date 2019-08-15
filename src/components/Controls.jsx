import React, { useState, useContext, useEffect } from 'react';

import { PUBNUB_MESSAGES, PUBNUB_RETURNS } from '../constants';
import { useKeyPress } from '../services/effects';


import { PubNubServiceProvider } from './App';
import Orientation from './Orientation';
import Joystick from './Joystick';

import _ from 'lodash';

import { Grid, TextField, Button, Typography, Paper, Divider, CircularProgress, Link, Input, InputAdornment, Fab } from '@material-ui/core';
import { green, blue, yellow, red } from '@material-ui/core/colors';
import { AddCircle } from '@material-ui/icons';

const Controls = ({ grid_spacing = 2 }) => {

    const circ_prog_size = 80;

    let styles = {
        blue: {
            color: blue[800],
        },
        blueBorder: {
            borderColor: blue[800],
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
        fireButton: {
            width: '75px',
            height: '75px',
            color: '#fff',
            backgroundColor: red[500],
        }
    };


    const [altitude, setAltitude] = useState(0);
    const [heading, setHeading] = useState(0);
    const [battery, setBattery] = useState(90);
    const [orientation, setOrientation] = useState({ pitch: 0, roll: 0, yaw: 0 });

    const [circleParams, setCircleParams] = useState({ radius: '', turnRate: '' });

    const PubNubService = useContext(PubNubServiceProvider);

    PubNubService.subscribe((m) => {
        // Reads drone status and updates values
        let decode = m.message.split(' ');
        switch (decode[0]) {
            case (PUBNUB_RETURNS.STATUS):
                let [tok, alt, pitch, roll, yaw, bat] = decode; //Deconstructs and extracts values from the array
                // console.log('decode', decode)
                // console.log(alt, pitch, roll, yaw, bat);

                // Negative Altitude Value-> Zero
                // Altitude Between 0m and 0.5m-> Zero
                if (((alt > 0) && (alt < 0.5)) || (alt < 0)) alt = 0;
                setAltitude(parseInt(alt));
                setOrientation({ pitch, roll, yaw });
                setBattery(parseInt(bat));
                break;
        };
    });

    // useEffect(() => {
    //     if (((altitide > 0) && (altitide < 0.5)) || (altitide < 0)) setAltitude(0);
    // }, [altitude]);

    // const handleArmedChange = () => {
    //     PubNubService.publish({ message: PUBNUB_MESSAGES.ARM() });    
    // }

    const handleCircleParamsChange = ({ target: { name, value } }) => {
        setCircleParams({ ...circleParams, [name]: Math.max(0, parseInt(value)) || '' });
    }

    const handleCircleCommand = () => {
        ((circleParams.turnRate != '') && (circleParams.radius != '')) && PubNubService.publish({ message: PUBNUB_MESSAGES.CIRCLE(circleParams.radius, circleParams.turnRate) });
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
            color: 'default',
            style: { ...styles.blue, ...styles.blueBorder },
        },
        {
            label: 'Return to Launch',
            command: PUBNUB_MESSAGES.RETURN_TO_LAUNCH(),
            color: 'default',
        },
    ];

    const getBatteryColor = val => {
        if ((val < 100) && val >= 50) return 'green';
        else if (val < 50 && val >= 20) return 'yellow';
        else if (val < 20 && val >= 0) return 'red';
        else return 'blue';
    }

    const fireWeapon = useKeyPress(' ');

    const handleFireSignal = () => {
        PubNubService.publish({ message: PUBNUB_MESSAGES.FIRE() })
    }

    useEffect(() => { fireWeapon && handleFireSignal() }, [fireWeapon])


    return (
        <Paper>
            <Grid container spacing={8}>
                <Grid item xs={6}>
                    <Grid container direction="column" spacing={grid_spacing}>
                        {CONTROLS.map(e =>
                            <Grid item xs={12} key={e.command}>
                                <Button variant="outlined" color={e.color} style={e.style} fullWidth onClick={() => { handleCommand(e.command) }} >{e.label}</Button>
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
                        <Link href="//localhost:3000/log" target="_blank" variant="body2" style={styles.blue}>Download Log History</Link>
                        <Grid item xs={12}>
                            <Orientation orientation={orientation} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container>
                        <Grid item xs={6}>

                            <Typography variant="subtitle1">Current Altitude</Typography>
                            <Typography variant="h3" style={styles.blue}>{altitude}m</Typography>

                            <Divider style={styles.divider} />
                        </Grid>
                        <Grid item xs={6}>

                            <Typography variant="subtitle1">Camera</Typography>
                            <Typography variant="h3" style={styles.blue}>{heading * 180 / Math.PI} deg</Typography>

                            <Divider style={styles.divider} />
                        </Grid>
                        <Grid item xs={6}>

                            <Typography variant="subtitle1">Battery Remaining</Typography>
                            <div style={styles.batteryBox}>
                                <Typography style={{ ...styles.batteryLevel, ...styles[getBatteryColor(battery)] }} variant="h6" component="span">{battery}%</Typography>
                                <CircularProgress style={styles[getBatteryColor(battery)]} value={battery} size={circ_prog_size} thickness={4} variant="static" />
                            </div>
                            <Divider style={styles.divider} />
                        </Grid>
                        <Grid item xs={6}>
                            {/* <Divider style={styles.divider} /> */}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Manual Control</Typography>
                            <Joystick />
                            <Divider style={styles.divider} />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1">Fire Gun</Typography>
                            <Fab style={styles.fireButton} color="default" onClick={handleFireSignal}><AddCircle /></Fab>
                        </Grid>
                        {/* <Grid item xs={12}>
                            a
                        </Grid> */}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Controls;