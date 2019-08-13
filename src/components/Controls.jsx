import React, { useState, useContext } from 'react';

import { PUBNUB_MESSAGES, PUBNUB_RETURNS } from '../constants';

import { PubNubServiceProvider } from './App';
import Orientation from './Orientation';

import _ from 'lodash';

import { Grid, TextField, Button, Typography, Paper, Divider, CircularProgress } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

const Controls = ({ grid_spacing = 2 }) => {


    const PubNubService = useContext(PubNubServiceProvider);

    // PubNubService.subscribe((m) => {
    //     // console.log('Message from server:', m)
    //     if (m.message.split(' ')[0] == PUBNUB_RETURNS.ALTITUDE) {
    //         setAltitude(m.message.split(' ')[1])
    //     }
    // })

    // const handleArmedChange = () => {
    //     PubNubService.publish({ message: PUBNUB_MESSAGES.ARM() });
    // }

    const handleCommand = (command) => {
        console.log(command);
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

    const styles = {
        blue: {
            color: blue[800],
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
        }
    }



    return (
        <div>
            <Grid container spacing={8}>
                <Grid item xs={6}>
                    <Grid container direction="column" spacing={grid_spacing}>
                        {CONTROLS.map(e =>
                            <Grid item xs={12} key={e.command}>
                                <Button variant="outlined" color={e.color} fullWidth onClick={() => {handleCommand(e.command)}} >{e.label}</Button>
                            </Grid>
                        )}
                        <Grid item>
                            <Orientation />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle1">Altitude</Typography>
                    <Typography variant="h3" style={styles.blue}>156m</Typography>

                    <Divider style={styles.divider} />

                    <Typography variant="subtitle1">Heading</Typography>
                    <Typography variant="h3" style={styles.blue}>30 deg</Typography>

                    <Divider style={styles.divider} />

                    <Typography variant="subtitle1">Battery Remaining</Typography>
                    <div style={styles.batteryBox}>
                        <Typography style={{ ...styles.batteryLevel, ...styles.blue }} variant="h6" component="span">40%</Typography>
                        <CircularProgress style={styles.blue} value={40} size={circ_prog_size} thickness={4} variant="static" />
                    </div>
                </Grid>
            </Grid>

        </div>
    )
}

export default Controls;