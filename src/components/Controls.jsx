import React, { useState, useContext } from 'react';

import { PubNubServiceProvider } from './App';

import _ from 'lodash';

import { Switch, Grid, Container, Slider, TextField, Input, Button, AppBar, Toolbar, Typography } from '@material-ui/core';
import { Paper, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';


const MIN = 0, MAX = 10000;
const STEP = (MAX - MIN) / 10;

const AXES_DEF = {
    x: 'Pitch',
    y: 'Roll',
    z: 'Yaw',
};

const PUBNUB_MESSAGES = {
    ARM: () => 'arm',
    ALT: h => `alt ${h}`,
    LAND: () => 'land',
    // One for custom typed commands
};


const Controls = () => {

    const [armed, setArmed] = useState(false);
    const [altitude, setAltitude] = useState(0);
    const altitudeMarks = _.range(MIN, MAX + 1, STEP).map(e => ({ value: e, label: `${e.toString()}m` }));

    // const [pns, setPns] = useState(PubNubService)


    const [axes, setAxes] = useState({
        x: 0,
        y: 0,
        z: 0
    })

    const PubNubService = useContext(PubNubServiceProvider);

    PubNubService.subscribe((m) => {
        console.log('Message from server:', m)
    })

    const handleArmedChange = ({ target: { value } }) => {
        setArmed(!armed);
        PubNubService.publish({ message: PUBNUB_MESSAGES.ARM() });
    }

    const handleAltitudeChange = (event, value) => { _updateAltitude(value) }

    const handleAltitudeChangeText = ({ target: { value } }) => { _updateAltitude(value) }

    const _updateAltitude = value => {
        setAltitude(Math.max(value, 0));
        PubNubService.publish({ message: PUBNUB_MESSAGES.ALT(Math.max(value, 0)) });
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
            <AppBar position="static" elevation={1} color={armed ? "primary" : "secondary"}>
                <Toolbar>
                    <Typography variant="h5" className="navbrand" >Mission Control</Typography>
                </Toolbar>
            </AppBar>
            <div className="armBox">
                <Switch size="medium" color={armed ? "primary" : "secondary"} checked={armed} onChange={handleArmedChange} value="isArmed" />
                <Button disableRipple elevation={0} disableFocusRipple disableTouchRipple
                    // variant={armed ? "contained" : "outlined"} color={armed ? "primary" : "secondary"}
                    variant="outlined" color="primary" disabled={!armed}
                >{armed ? "Armed" : "Disarmed"}</Button>
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
                    <Paper>
                        <Table>
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
                                    <TableCell color="primary"><Typography variant="body1">{d}</Typography></TableCell>
                                    <TableCell>
                                        <Input disabled={!armed} type="number" name={a} value={axes[a]} onChange={handleAxesUpdate} />
                                    </TableCell>
                                    <TableCell><Button disabled={!armed} onClick={() => handleAxesReset(a)} variant="outlined" color="secondary">Reset</Button></TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </Paper>
                    {/* {JSON.stringify(axes)} */}
                </Grid>

                <Grid item lg={5}>
                    <div className="feed" />
                </Grid>
            </Grid>
        </div>
    )
}

export default Controls;