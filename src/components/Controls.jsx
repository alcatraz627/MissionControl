import React, { useState } from 'react';

import _ from 'lodash';

import CommandLog from './CommandLog';

import { Switch, Grid, Container, Slider, TextField, Input, Button } from '@material-ui/core';
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
    const [altitude, setAltitude] = useState(0);

    const [axes, setAxes] = useState({
        x: 0,
        y: 0,
        z: 0
    })


    const handleAltitudeChange = (event, value) => {
        setAltitude(value);
    }

    const handleAltitudeChangeText = ({ target: { value } }) => {
        setAltitude(Math.max(value, 0));
    }

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
                <Switch size="medium" color={armed ? "primary" : "secondary"} checked={armed} onChange={() => setArmed(!armed)} value="isArmed" />
                <Button disableRipple disableFocusRipple disableTouchRipple variant={armed ? "contained" : "outlined"} color={armed ? "primary" : "secondary"}>{armed ? "Armed" : "Disarmed"}</Button>
            </div>

            <Grid container>
                <Grid item lg={2}>
                    <Container>
                        <div className="sliderContainer">
                            <Slider disabled={!armed} marks={altitudeMarks}
                                defaultValue={80} min={MIN} max={MAX}
                                value={altitude}
                                onChange={handleAltitudeChange}
                                // valueLabelFormat={x=>((x).toString() + 'm')}
                                orientation="vertical" valueLabelDisplay="on" />
                            <br />
                            <br />
                            <br />
                            <TextField type="number" min="0" disabled={!armed} label="Set Altitude(in m)" value={`${altitude}`} onChange={handleAltitudeChangeText} />
                        </div>
                    </Container>
                </Grid>

                <Grid item lg={2}>
                    <div style={{ padding: '0 20px' }}>
                        <div className="tiltdrone" style={{ transform: `rotateX(${axes.x}deg) rotateY(${axes.y}deg) rotateZ(${axes.z}deg)` }} />
                    </div>
                    </Grid>
                <Grid item lg={3}>
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
                                        <Input disabled={!armed} type="number" name={a} value={axes[a]} onChange={handleAxesUpdate} />
                                    </TableCell>
                                    <TableCell><Button disabled={!armed} onClick={() => handleAxesReset(a)} variant="outlined" color="secondary">Reset</Button></TableCell>
                                </TableRow>)}

                            </TableBody>
                        </Paper>
                    </Table>
                    {/* {JSON.stringify(axes)} */}
                </Grid>

                <Grid item lg={5}>
                    <div className="feed" />
                </Grid>

                <Grid item xs={12}>
                    <CommandLog />
                </Grid>
            </Grid>
        </div>
    )
}

export default Controls;