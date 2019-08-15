import React, { useState, useEffect, useContext, useRef } from 'react'
import { PubNubServiceProvider } from './App';

import { useInterval, useKeyPress } from '../services/effects';
import { PUBNUB_MESSAGES } from '../constants';

const Joystick = ({ isArmed = false }) => {
    const boxSize = 82;

    // const KEYS = { w: 'w', a: 'a', s: 's', d: 'd' };

    const [deltas, setDeltas] = useState({ x: 0, y: 0 });

    const PubNubService = useContext(PubNubServiceProvider);

    const sigX = {
        "-1": 'l',
        "0": '-',
        "1": 'r',
    }
    const sigY = {
        "-1": 'b',
        "0": '-',
        "1": 'f',
    }

    const moveDrone = () => {
        // console.log(`${sigX[deltas.x]}${sigY[deltas.y]}`)
        PubNubService.publish({ message: PUBNUB_MESSAGES.MOVE(`${sigY[deltas.y]}${sigX[deltas.x]}`) })
    }

    useInterval(() => {
        ((deltas.y != 0) || (deltas.x != 0)) && moveDrone()
    }, 500)

    const wPress = useKeyPress('w');
    const sPress = useKeyPress('s');
    const aPress = useKeyPress('a');
    const dPress = useKeyPress('d');


    useEffect(() => {
        isArmed && setDeltas({ x: 1 * dPress - 1 * aPress, y: 1 * wPress - 1 * sPress })
    }, [wPress, aPress, sPress, dPress]);

    const styles = {
        joystickContainer: {
            opacity: isArmed ? 1 : 0.2,
            width: `${boxSize}px`,
            height: `${boxSize}px`,
            borderRadius: '10px',
            backgroundColor: '#ff8a8035',
            position: 'relative',
            margin: 'auto',
        },
        joystickBall: {
            position: 'absolute',
            width: `${boxSize / 6}px`,
            height: `${boxSize / 6}px`,
            borderRadius: '1000px',
            backgroundColor: 'red',
            top: `${boxSize * ((1 - 1 / 6) / 2) * (1 - deltas.y)}px`,
            left: `${boxSize * ((1 - 1 / 6) / 2) * (1 + deltas.x)}px`,
        },
        xAxis: {
            position: 'absolute',
            width: `${boxSize - 60}px`,
            height: `2px`,
            backgroundColor: '#999',
            top: `${boxSize / 2 - 1}px`,
            left: '30px',
        },
        yAxis: {
            position: 'absolute',
            width: `2px`,
            height: `${boxSize - 60}px`,
            backgroundColor: '#999',
            top: '30px',
            left: `${boxSize / 2 - 1}px`,
        }
    }

    return (
        <div style={styles.joystickContainer}>
            <div style={styles.xAxis} />
            <div style={styles.yAxis} />
            <div style={styles.joystickBall} />
        </div>

    )
}

export default Joystick;