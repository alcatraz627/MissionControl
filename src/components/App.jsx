import React, { useState } from 'react'
// import _ from 'lodash'
import { Grid } from '@material-ui/core';

import Controls from './Controls';
import MapComponent from './MapComponent';
import CommandLog from './CommandLog';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../styles/theme';

const App = () => {

    return (
        <MuiThemeProvider theme={theme}>

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
        </MuiThemeProvider>
    )
}

export default App