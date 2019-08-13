import React, { useState, useEffect, createContext } from 'react'

// import _ from 'lodash'

import { Grid, Paper, Button } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

import Navbar from './Navbar';
import AltitudeComponent from './AltitudeComponent';
import Orientation from './Orientation';
import Controls from './Controls';
import MapComponent from './MapComponent';
import CommandLog from './CommandLog';

import { PubNubService } from '../services/Pubnub';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../styles/theme';

const pns = new PubNubService({});

const App = () => {
    useEffect(() => {
        // console.log(pns);
        // pns.subscribe({callback: (message) => {console.log("Hooyeah", message)}})
        // pns.publish({message: "EeeE"})
    }, [])

    const styles = {
        container: {
            padding: '20px',
            backgroundColor: grey[50],
        },

        h: {
            // width: '100%',
            // padding: '16px',
            // height: '70vh',
        },
        v: {
            // height: '100%',
            // padding: '16px',
            // height: '70vh',
        }
    }

    const grid_spacing = 2;

    return (
        <MuiThemeProvider theme={theme}>
            <PubNubServiceProvider.Provider value={pns}>
                <Navbar />
                <Grid container style={styles.container} spacing={grid_spacing}>
                    <Grid item xs={12} lg={2}>
                        <Paper style={styles.h}><AltitudeComponent /></Paper>
                        {/* <div className="controls">
                            <Controls />
                        </div> */}
                    </Grid>

                    <Grid item xs={12} lg={5}>
                        <Grid container alignItems="stretch" justify="space-between" direction="column" spacing={grid_spacing}>
                            <Grid item xs={12}>
                                <Paper style={styles.v}>
                                    <Controls grid_spacing={grid_spacing} />
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <CommandLog />
                            </Grid>

                        </Grid>
                        {/* <CommandLog /> */}
                    </Grid>

                    <Grid item xs={12} lg={5}>
                        <MapComponent />
                        {/* <div className="maps">
                            <MapComponent />
                        </div> */}
                    </Grid>
                </Grid>
            </PubNubServiceProvider.Provider>
        </MuiThemeProvider>
    )
}

export default App

export const PubNubServiceProvider = React.createContext(pns);