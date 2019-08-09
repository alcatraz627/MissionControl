import React, { useState, useEffect, createContext } from 'react'

// import _ from 'lodash'

import { Grid } from '@material-ui/core';

import Controls from './Controls';
import MapComponent from './MapComponent';
import CommandLog from './CommandLog';

import {PubNubService as PubNubServiceProvider} from '../services/Pubnub';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../styles/theme';

const pns = new PubNubServiceProvider({});
const App = () => {
    useEffect(() => {
        // console.log(pns);
        // pns.subscribe({callback: (message) => {console.log("Hooyeah", message)}})
        // pns.publish({message: "EeeE"})
    }, [])

    return (
        <MuiThemeProvider theme={theme}>
            <PubNubService.Provider value={pns}>
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
            </PubNubService.Provider>
        </MuiThemeProvider>
    )
}

export default App

export const PubNubService = React.createContext(pns);