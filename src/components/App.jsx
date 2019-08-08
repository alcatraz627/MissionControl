import React, { useState } from 'react'
// import _ from 'lodash'
import {Grid} from '@material-ui/core';

import Controls from './Controls';
import MapComponent from './MapComponent';

const App = () => {

    return (
        <div className="">
                <div className="controls">
                    <Controls />
                </div>
                <div className="maps">
                    <MapComponent />
                </div>
        </div>
    )
}

export default App