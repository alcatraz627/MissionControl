import React, { useState, useEffect, createContext } from 'react'

// import _ from 'lodash'

import { Grid } from '@material-ui/core';

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

    return (
        <MuiThemeProvider theme={theme}>
            <PubNubServiceProvider.Provider value={pns}>
                <div className="">
                    <div className="controls">
                        <Controls />
                    </div>

                    <Grid container>
                        <Grid item xs={12} lg={6}>
                            <CommandLog />
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <div className="maps">
                                <MapComponent />
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </PubNubServiceProvider.Provider>
        </MuiThemeProvider>
    )
}

export default App

export const PubNubServiceProvider = React.createContext(pns);