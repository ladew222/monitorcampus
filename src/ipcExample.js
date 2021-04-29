import React, { useEffect, useState } from 'react';
//const { ipcRenderer } = require('electron');
const ipcRenderer = window.require("electron").ipcRenderer;

interface Response {
    [message: string]: string;
}

export default function IpcExample() {
    const [message, setMessage] = useState('');

    const handleResponse = (_event: any, response: Response) => {
        setMessage(response.message);

    };



    useEffect((): any => {
        ipcRenderer.on('my-ipc-channel', handleResponse);

        return () => ipcRenderer.off('my-ipc-channel', handleResponse);
    }, []);

    return <dev>{message}</dev>;
}