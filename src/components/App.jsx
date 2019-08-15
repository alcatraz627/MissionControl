import React, { useState, useEffect, createContext } from 'react'

// import _ from 'lodash'

import { Grid, Paper, Button } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

import Navbar from './Navbar';
import AltitudeComponent from './AltitudeComponent';
import Controls from './Controls';
import MapComponent from './MapComponent';
import CommandLog from './CommandLog';

import { PubNubService } from '../services/Pubnub';

import { PUBNUB_RETURNS } from '../constants';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../styles/theme';

const pns = new PubNubService({});

const App = () => {
    const [isArmable, setIsArmable] = useState(false);
    const [isArmed, setIsArmed] = useState(true);

    useEffect(() => {
        pns.subscribe((m) => {
            if (m.message == PUBNUB_RETURNS.ISARMABLE) {
                setIsArmable(true);
            }
            if (m.message == PUBNUB_RETURNS.ARMED) {
                setIsArmed(true);
            }
        })
    }, [])


    const styles = {
        container: {
            padding: '20px',
            backgroundColor: grey[50],
        }
    }

    const grid_spacing = 2;

    return (
        <MuiThemeProvider theme={theme}>
            <PubNubServiceProvider.Provider value={pns}>
                <Navbar isArmed={isArmed} />
                <Grid container style={styles.container} spacing={grid_spacing}>
                    <Grid item xs={12} lg={1}>
                        <Paper><AltitudeComponent isArmed={isArmed} /></Paper>
                    </Grid>

                    <Grid item xs={12} lg={5}>
                        <Grid container alignItems="stretch" justify="space-between" direction="column" spacing={grid_spacing}>
                            <Grid item xs={12}>
                                <Controls grid_spacing={grid_spacing} isArmable={isArmable} isArmed={isArmed} />
                            </Grid>

                            <Grid item xs={12}>
                                <CommandLog />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <MapComponent isArmed={isArmed} />
                    </Grid>
                </Grid>
            </PubNubServiceProvider.Provider>
        </MuiThemeProvider>
    )
}

export default App

export const PubNubServiceProvider = React.createContext(pns);