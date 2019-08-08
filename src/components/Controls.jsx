import React, { useState } from 'react';

import _ from 'lodash';

import { Switch, Grid, Container, Slider } from '@material-ui/core';

const Controls = () => {
    const MIN = 0, MAX = 10000;
    const STEP = (MAX-MIN)/10;

    const altitudeMarks = _.range(MIN, MAX+1, STEP).map(e => ({value: e, label: `${e.toString()}m` }));

    const [armed, setArmed] = useState(false);

    return (
        <div>
            <div className="text-center">
                <Switch checked={armed} onChange={() => setArmed(!armed)} value="isArmed" />
            </div>

            <Grid container>
                <Grid item xs="4">
                    <Container>
                        <div className="sliderContainer">

                            <Slider
                                aria-labelledby="discrete-slider-always"

                                defaultValue={80}

                                step={STEP}
                                min={MIN}
                                max={MAX}
                                marks={altitudeMarks}

                                orientation="vertical"
                                valueLabelDisplay="on"

                                // valueLabelFormat={x=>((x).toString() + 'm')}

                                // height="300"
                            />
                        </div>
                    </Container>
                </Grid>
                <Grid item xs="8">
                    
                </Grid>
            </Grid>
        </div>
    )
}

export default Controls;