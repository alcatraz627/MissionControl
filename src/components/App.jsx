import React, { useState } from 'react'
// import _ from 'lodash'
import {Grid} from '@material-ui/core';

import Controls from './Controls';

const App = () => {

    return (
        <div className="">
            <Grid container spacing={8} className="w-100 h-100">
                <Grid item xs className="controls">
                    <Controls />
                </Grid>
                <Grid item xs className="maps">
                    -
                </Grid>
            </Grid>
        </div>
    )
}

export default App