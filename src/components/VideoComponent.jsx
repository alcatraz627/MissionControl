import React, { useState, useContext, useEffect } from 'react'
import { Grid, Paper, Button, Fab, Typography, Divider } from '@material-ui/core';
import { KeyboardArrowUp, KeyboardArrowLeft, KeyboardArrowRight, KeyboardArrowDown, ZoomIn, ZoomOut, RotateLeft, RotateRight, GpsFixed } from '@material-ui/icons';

import { PUBNUB_MESSAGES, PUBNUB_RETURNS, VIDEO_SERVER_URL } from '../constants';

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

    const V_MAX = 1850, V_MIN = 1000
    const H_MAX = 2000, H_MIN = 1000
    const R_MAX = 2000, R_MIN = 1000

    const DIFF = 50 

    const [vVal, setV] = useState(1500) // Vertical
    const [hVal, setH] = useState(1500) // Horizontal
    const [rVal, setR] = useState(1500) // Rotation

    const handleUpdateCamera = dir => {
        // console.log(dir)
        let command = dir, param = ''
        switch(dir) {
            case CAMERA_UPDATE_CONTROLS.DOWN.label:
                param = Math.min(vVal + DIFF, V_MAX)
                setV(param)
                command = 'ver'
                break
            case CAMERA_UPDATE_CONTROLS.UP.label:
                param = Math.max(vVal - DIFF, V_MIN)
                setV(param)
                command = 'ver'
                break

            case CAMERA_UPDATE_CONTROLS.RIGHT.label:
                param = Math.min(hVal + DIFF, H_MAX)
                setH(param)
                command = 'hor'
                break
            case CAMERA_UPDATE_CONTROLS.LEFT.label:
                param = Math.max(hVal - DIFF, H_MIN)
                setH(param)
                command = 'hor'
                break

            case CAMERA_UPDATE_CONTROLS.ROT_RIGHT.label:
                param = Math.min(rVal + DIFF, R_MAX)
                setR(param)
                command = 'rot'
                break
            case CAMERA_UPDATE_CONTROLS.ROT_LEFT.label:
                param = Math.max(rVal - DIFF, R_MIN)
                setR(param)
                command = 'rot'
                break

            case CAMERA_UPDATE_CONTROLS.CENTER.label:
                setH(1500)
                setV(1500)
                setR(1500)
                command = 'center'
                break
        }
        PubNubService.publish({ message: PUBNUB_MESSAGES.CAMERA(command, param) });
    }


    const handleClick = e => {
          // e = Mouse click event.
        let rect = e.target.getBoundingClientRect();
        let x = Math.round((e.clientX - rect.left) * 100 / e.target.width) / 100; //x position within the element.
        let y = Math.round((e.clientY - rect.top) * 100 / e.target.height) / 100  //y position within the element.
        console.log("Coord:", x, y)
        PubNubService.publish({ message: PUBNUB_MESSAGES.CLICK_FRAME(x, y) });
    }

    const handleImageCaptureClick = e => {
        PubNubService.publish({ message: PUBNUB_MESSAGES.CAPTURE_IMAGE() });
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <img src={`${VIDEO_SERVER_URL}/video`} className="streamImage" onClick={handleClick} />
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

                    </Grid>
                    <Divider style={{margin: '20px auto'}} />
                    <Button variant="contained" fullWidth color="primary" onClick={handleImageCaptureClick} >Click Image</Button>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default VideoComponent