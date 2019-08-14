import React, { useState, useEffect } from 'react'

const Joystick = () => {
    const boxSize = 82;

    const KEYS = { w: 'w', a: 'a', s: 's', d: 'd' };

    const [deltas, setDeltas] = useState({ x: 0, y: 0 });


    function useKeyPress(targetKey) {

        const [keyPressed, setKeyPressed] = useState(false);
        function downHandler({ key }) {
            if (key === targetKey) {
                setKeyPressed(true);
            }
        }
        const upHandler = ({ key }) => {
            if (key === targetKey) {
                setKeyPressed(false);
            }
        };


        useEffect(() => {
            window.addEventListener('keydown', downHandler);
            window.addEventListener('keyup', upHandler);
            return () => {
                window.removeEventListener('keydown', downHandler);
                window.removeEventListener('keyup', upHandler);
            };
        }, []);

        return keyPressed;
    }

    const wPress = useKeyPress('w');
    const sPress = useKeyPress('s');
    const aPress = useKeyPress('a');
    const dPress = useKeyPress('d');


    useEffect(() => {
        setDeltas({ x: 1 * aPress - 1 * dPress, y: 1 * wPress - 1 * sPress })
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
            left: `${boxSize * ((1 - 1 / 6) / 2) * (1 - deltas.x)}px`,
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