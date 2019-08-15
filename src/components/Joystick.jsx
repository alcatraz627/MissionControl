import React, { useState, useEffect, useContext, useRef } from 'react'
import { PubNubServiceProvider } from './App';

import {useInterval, useKeyPress} from '../services/effects';

const Joystick = () => {
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

    useInterval(() => {
        // console.log(`${sigX[deltas.x]}${sigY[deltas.y]}`)
        ((deltas.y != 0) || (deltas.x != 0)) && PubNubService.publish({ message: `${sigY[deltas.y]}${sigX[deltas.x]}` })
    }, 500)


    const wPress = useKeyPress('w');
    const sPress = useKeyPress('s');
    const aPress = useKeyPress('a');
    const dPress = useKeyPress('d');


    useEffect(() => {
        setDeltas({ x: 1 * dPress - 1 * aPress, y: 1 * wPress - 1 * sPress })
    }, [wPress, aPress, sPress, dPress]);

    const styles = {
        joystickContainer: {
            width: `${boxSize}px`,
            height: `${boxSize}px`,
            borderRadius: '1000px',
            backgroundColor: '#ff8a8035',
            position: 'relative',
        },
        joystickBall: {
            position: 'absolute',
            width: `${boxSize / 6}px`,
            height: `${boxSize / 6}px`,
            borderRadius: '1000px',
            backgroundColor: 'red',
            top: `${boxSize * ((1 - 1 / 6) / 2) * (1 - deltas.y)}px`,
            left: `${boxSize * ((1 - 1 / 6) / 2) * (1 + deltas.x)}px`,
        }
    }

    return (
        <div style={styles.joystickContainer}>
            <div style={styles.joystickBall}>
            </div>
        </div>

    )
}

export default Joystick;