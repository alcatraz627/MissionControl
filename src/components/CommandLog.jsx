import React, { useState, useContext } from 'react'

import {Input} from '@material-ui/core';

import { PubNubServiceProvider } from './App';

const CommandLog = () => {
    let [logs, setLogs] = useState([]);
    let [command, setCommand] = useState("");
    const PubNubService = useContext(PubNubServiceProvider);

    PubNubService.subscribe((m) => {
        console.log('Message from server:', m)
        setLogs([...logs, m])
    })

    const handleCommand = ({target: {value}}) => {
        setCommand(value);
    }

    const handleRun = (e) => {
        e.preventDefault();
        PubNubService.publish({message: command});
        setCommand("");
        
    }

    return (
        <div>
            <form onSubmit={handleRun}>
            <div className="commandbox">
                &gt;  <Input value={command} style={{ color: '#39ff14', width: '50%'}} onChange={handleCommand} name="command" placeholder="Enter Command" />
            </div>
            </form>
            <div className="logwindow">
                {logs.map(e => <span>[{new Date().toUTCString()}]&gt;  {e.message}<br /></span>)}
            </div>
        </div>)
}

export default CommandLog;