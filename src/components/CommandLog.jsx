import React, { useState, useContext } from 'react'
import axios from 'axios';
import { Input } from '@material-ui/core';

import { PubNubServiceProvider } from './App';

const CommandLog = () => {
    let [logs, setLogs] = useState([]);
    let [command, setCommand] = useState("");
    const PubNubService = useContext(PubNubServiceProvider);

    PubNubService.subscribe((m) => {
        // console.log('Message from server:', m.message)
        // setLogs([...logs, m])
        let newEntry = `[${new Date().toUTCString()}]> ${m.message}`;
        setLogs([...logs, newEntry]);

        axios.post('//localhost:3000/log', {log: `[${new Date().toUTCString()}]> ${m.message}`})
            .then((res => {console.log("Logged: ", res)}))
    })

    const handleCommandUpdate = ({ target: { value } }) => {
        setCommand(value);
    }

    const handleRun = (e) => {
        e.preventDefault();
        command == 'clear' ? setLogs([]) : PubNubService.publish({ message: command });
        setCommand("");
    }

    return (
        <div>
            <form onSubmit={handleRun}>
                <div className="commandbox">
                    &gt;  <Input value={command} style={{ color: '#39ff14', width: '50%' }} onChange={handleCommandUpdate} name="command" placeholder="Enter Command" />
                </div>
            </form>
            <div className="logwindow">
                {logs.map((e, i) => <span key={i}>{e}<br /></span>)}
                {/* {JSON.stringify(logs)} */}
            </div>
        </div>)
}

export default CommandLog;