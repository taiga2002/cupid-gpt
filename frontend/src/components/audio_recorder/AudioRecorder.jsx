import React, { useState, useRef } from 'react';
import { uploadFile2 } from "@/components/fileupload/uploadFile2"

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleStartRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

                    // Call the uploadFile function with the audioBlob
                    uploadFile2(audioBlob).then((response) => {
                        console.log(response);
                    }
                    ).catch((error) => {
                        console.log(error);
                    });
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (error) {
                console.error('Error accessing media devices:', error);
                alert('Error accessing your microphone.');
            }
        } else {
            alert('Audio recording is not supported in this browser.');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const audioRecorderStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Adjust as needed
    };

    const recordButtonBaseStyle = {
        position: 'relative',
        padding: '15px 30px',
        border: '2px solid #4CAF50',
        borderRadius: '25px',
        backgroundColor: 'transparent',
        color: '#4CAF50',
        fontSize: '16px',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
    };

    const recordButtonHoverStyle = {
        borderColor: '#45a049',
        color: '#45a049',
    };

    const recordIconBaseStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100%',
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%) scale(0)',
        transition: 'transform 0.3s ease',
    };

    const recordIconHoverStyle = {
        transform: 'translate(-50%, -50%) scale(1.2)',
    };

    const recordingStyle = {
        color: '#f44336',
        borderColor: '#f44336',
    };

    const recordingIconStyle = {
        backgroundColor: '#f44336',
    };

    const recordingHoverStyle = {
        color: '#e31b0c',
        borderColor: '#e31b0c',
    };

    const recordingIconHoverStyle = {
        backgroundColor: '#e31b0c',
    };

    const recordButtonStyle = isRecording ? { ...recordButtonBaseStyle, ...recordingStyle } : recordButtonBaseStyle;
    const recordIconStyle = isRecording ? { ...recordIconBaseStyle, ...recordingIconStyle } : recordIconBaseStyle;

    return (
        <div style={audioRecorderStyle}>
            <button
                style={isRecording ? { ...recordButtonStyle, ...recordingHoverStyle } : recordButtonStyle}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
                <span>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </span>
                <span style={isRecording ? { ...recordIconStyle, ...recordingIconHoverStyle } : recordIconStyle}></span>
            </button>
        </div>
    );
};

export default AudioRecorder;
