import React, { useState } from 'react';

import _ from 'lodash';

import CommandLog from './CommandLog';

import { Switch, Grid, Container, Slider, Input, Button } from '@material-ui/core';
import { Paper, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';


const MIN = 0, MAX = 10000;
const STEP = (MAX - MIN) / 10;

const AXES_DEF = {
    x: 'Pitch',
    y: 'Roll',
    z: 'Yaw',
}


const Controls = () => {
    const altitudeMarks = _.range(MIN, MAX + 1, STEP).map(e => ({ value: e, label: `${e.toString()}m` }));

    const [armed, setArmed] = useState(false);

    const [axes, setAxes] = useState({
        x: 0,
        y: 0,
        z: 0
    })


    const handleAxesUpdate = ({ target: { name, value } }) => {
        setAxes({ ...axes, [name]: parseInt(value) })
    }

    const handleAxesReset = (name) => {
        setAxes({ ...axes, [name]: 0 })
        // console.log(name)
    }

    return (
        <div>
            <div className="armBox">
                <Switch checked={armed} onChange={() => setArmed(!armed)} value="isArmed" />
            </div>

            <Grid container>
                <Grid item lg={4} sm={12}>
                    <Container>
                        <div className="sliderContainer">
                            <Slider disabled={!armed} marks={altitudeMarks}
                                defaultValue={80} min={MIN} max={MAX}
                                // valueLabelFormat={x=>((x).toString() + 'm')}
                                orientation="vertical" valueLabelDisplay="on" />
                        </div>
                    </Container>
                </Grid>

                <Grid item lg={8} sm={10}>
                    <div style={{ padding: '0 20px' }}>
                        <div className="tiltdrone" style={{transform: `rotateX(${axes.x}deg) rotateY(${axes.y}deg) rotateZ(${axes.z}deg)`}} />
                    </div>
                    {/* </Grid>
                <Grid item lg={4} sm={6}> */}
                    <Table>
                        <Paper>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parameter</TableCell>
                                    <TableCell>Value</TableCell>
                                    <TableCell>Options</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* d->external dimension(Pitch, Roll, Yaw), a->(x, y, z) */}
                                {_.map(AXES_DEF, (d, a) => <TableRow key={a}>
                                    <TableCell>{d}</TableCell>
                                    <TableCell>
                                        <Input type="number" name={a} value={axes[a]} onChange={handleAxesUpdate} />
                                    </TableCell>
                                    <TableCell><Button onClick={()=>handleAxesReset(a)} variant="outlined" color="secondary">Reset</Button></TableCell>
                                </TableRow>)}

                            </TableBody>
                        </Paper>
                    </Table>
                    {/* {JSON.stringify(axes)} */}
                </Grid>

                <Grid item xs={12}>
                    <CommandLog />
                </Grid>
            </Grid>
        </div>
    )
}

export default Controls;