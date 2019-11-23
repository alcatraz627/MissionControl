import React, { useState, useContext, useEffect } from 'react'
import { Grid, Paper, Button, Fab, Typography, Icon } from '@material-ui/core';
import { KeyboardArrowUp, KeyboardArrowLeft, KeyboardArrowRight, KeyboardArrowDown, ZoomIn, ZoomOut, RotateLeft, RotateRight, GpsFixed } from '@material-ui/icons';

import { PUBNUB_MESSAGES, PUBNUB_RETURNS } from '../constants';

import { PubNubServiceProvider } from './App';

const CAMERA_UPDATE_CONTROLS =
{
    UP: {
        label: 'up',
        IconComp: KeyboardArrowUp,
    },
    DOWN: {
        label: 'down',
        IconComp: KeyboardArrowDown,
    },
    LEFT: {
        label: 'left',
        IconComp: KeyboardArrowLeft,
    },
    RIGHT: {
        label: 'right',
        IconComp: KeyboardArrowRight,
    },

    ROT_LEFT: {
        label: 'rotleft',
        IconComp: RotateLeft,
    },
    ROT_RIGHT: {
        label: 'rotright',
        IconComp: RotateRight,
    },

    ZOOM_IN: {
        label: 'zoomin',
        IconComp: ZoomIn,
    },
    ZOOM_OUT: {
        label: 'zoomout',
        IconComp: ZoomOut,
    },
    CENTER: {
        label: 'center',
        IconComp: GpsFixed
    }
}

const CAMERA_CONTROLS = [
    CAMERA_UPDATE_CONTROLS.ZOOM_IN,
    CAMERA_UPDATE_CONTROLS.UP,
    CAMERA_UPDATE_CONTROLS.ROT_RIGHT,

    CAMERA_UPDATE_CONTROLS.LEFT,
    CAMERA_UPDATE_CONTROLS.CENTER,
    CAMERA_UPDATE_CONTROLS.RIGHT,

    CAMERA_UPDATE_CONTROLS.ZOOM_OUT,
    CAMERA_UPDATE_CONTROLS.DOWN,
    CAMERA_UPDATE_CONTROLS.ROT_LEFT,
]

const VideoComponent = props => {
    const PubNubService = useContext(PubNubServiceProvider);

    const handleUpdateCamera = dir => {
        // console.log(dir)
        PubNubService.publish({ message: PUBNUB_MESSAGES.CAMERA(dir) });
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <img src="http://ec2-13-233-133-20.ap-south-1.compute.amazonaws.com/video" className="streamImage" />
            </Grid>
            <Grid item xs={4}>
                <Paper>
                    <Typography variant="h6">Camera Controls</Typography>
                    <br /><br /><br />
                    <Grid container alignItems="center" justify="center" spacing={2}>

                        {CAMERA_CONTROLS.map(({ label, IconComp }, i) => 
                            <Grid item xs={4} key={i}>
                                <Fab size="small" onClick={() => handleUpdateCamera(label)}><IconComp /></Fab>
                                <Typography variant="subtitle2" component="div" className="cameraLabel" >{label}</Typography>
                            </Grid>
                        )}

                        {/* <Grid item xs={4} alignItems="center">
                            <Fab size="small" onClick={() => handleUpdateCamera(CAMERA_UPDATE_ENUMS.UP)}><KeyboardArrowUp /></Fab>
                            <Typography variant="subtitle2" component="div" className="cameraLabel" >Up</Typography>
                        </Grid>
                        <Grid item xs={4} alignItems="center">
                            <Fab size="small" onClick={() => handleUpdateCamera(CAMERA_UPDATE_ENUMS.UP)}><KeyboardArrowUp /></Fab>
                            <Typography variant="subtitle2" component="div" className="cameraLabel" >Up</Typography>
                        </Grid>
                        <Grid item xs={4}></Grid>

                        <Grid item xs={4}>
                            <Fab size="small" onClick={() => handleUpdateCamera(CAMERA_UPDATE_ENUMS.LEFT)}><KeyboardArrowLeft /></Fab>
                            <Typography variant="subtitle2" component="div" className="cameraLabel">Left</Typography>
                        </Grid>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                            <Fab size="small"  onClick={() => handleUpdateCamera(CAMERA_UPDATE_ENUMS.RIGHT)}><KeyboardArrowRight/></Fab>
                            <Typography variant="subtitle2" component="div" className="cameraLabel">Right</Typography>
                        </Grid>

                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                            <Fab size="small" onClick={() => handleUpdateCamera(CAMERA_UPDATE_ENUMS.DOWN)}><KeyboardArrowDown/></Fab>
                            <Typography variant="subtitle2" component="div" className="cameraLabel">Down</Typography>
                        </Grid>
                        <Grid item xs={4}></Grid> */}

                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default VideoComponent