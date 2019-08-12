import React, { useState, useContext } from 'react';

import {AXES_DEF, PUBNUB_MESSAGES, PUBNUB_RETURNS} from '../constants';

import { PubNubServiceProvider } from './App';

import _ from 'lodash';

import { Switch, Grid, Container, Slider, TextField, Input, Button, AppBar, Toolbar, Typography } from '@material-ui/core';
import { Paper, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';


const MIN = 0, MAX = 10.0;
const STEP = (MAX - MIN) / 10;

const Controls = () => {

    const [armed, setArmed] = useState(false);
    const [altitude, setAltitude] = useState(0);
    const [altitudeText, setAltitudeText] = useState(0);
    const altitudeMarks = _.range(MIN, MAX + 1, STEP).map(e => ({ value: e, label: `${e.toString()}m` }));

    // const [pns, setPns] = useState(PubNubService)


    const [axes, setAxes] = useState({
        x: 0,
        y: 0,
        z: 0
    })

    const PubNubService = useContext(PubNubServiceProvider);

    PubNubService.subscribe((m) => {
        // console.log('Message from server:', m)
        if(m.message.split(' ')[0] == PUBNUB_RETURNS.ALTITUDE) {
            setAltitude(m.message.split(' ')[1])
        }
    })

    const handleArmedChange = ({ target: { value } }) => {
        setArmed(true);
        PubNubService.publish({ message: PUBNUB_MESSAGES.ARM() });
    }

    const handleAltitudeChange = (event, value) => { _updateAltitude(value) }

    const handleAltitudeChangeText = ({ target: { value } }) => {  setAltitudeText(value) }

    const handleAltitudeTextEnter = (e) => {
        e.preventDefault();
        setAltitude(Math.max(parseInt(altitudeText), 0))

    }

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
    const handleLand = () => {
        PubNubService.publish({ message: PUBNUB_MESSAGES.LAND() });
    }

    return (
        <div>
            <AppBar position="static" elevation={1} color={armed ? "primary" : "secondary"}>
                <Toolbar>
                    <Typography variant="h5" className="navbrand" >Mission Control</Typography>
                </Toolbar>
            </AppBar>
            <div className="armBox">
                <Button elevation={0} variant="contained" color="primary" onClick={handleArmedChange}>Arm</Button>
                &nbsp;&nbsp;&nbsp;
                <Button disableRipple elevation={0} disableFocusRipple disableTouchRipple onClick={handleLand}
                    variant="outlined" color="secondary">Land</Button>
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
                            <form onSubmit={handleAltitudeTextEnter}>
                                <TextField type="number" min="0" disabled={!armed} label="Set Altitude(in m)" value={`${altitudeText}`} onChange={handleAltitudeChangeText} />
                            </form>
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