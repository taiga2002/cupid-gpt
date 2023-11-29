import React, { useState, useRef } from 'react';
import { uploadFile2 } from "@/components/fileupload/uploadFile2"
import styles from './AudioRecorder.module.css';


// @ts-ignore
const AudioRecorder = ( {setInputBoxValue} ) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleStartRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                // @ts-ignore
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                // @ts-ignore
                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        // @ts-ignore
                        audioChunksRef.current.push(event.data);
                    }
                };

                // @ts-ignore
                mediaRecorderRef.current.onstop = () => {
                    console.log("onstop")
                    console.log(setInputBoxValue)
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

                    // Call the uploadFile function with the audioBlob
                    uploadFile2(audioBlob).then((response) => {
                        console.log(response);
                        setInputBoxValue(response.response);
                        console.log(response.response);
                    }
                    ).catch((error) => {
                        console.log(error);
                    });
                };

                // @ts-ignore
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
        // @ts-ignore
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            // @ts-ignore
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className={styles.audioRecorder}>
            <button
                className={isRecording ? `${styles.recordButton} ${styles.isRecording}` : styles.recordButton}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
                <span className={styles.buttonContent}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </span>
                <span className={styles.recordIcon}></span>
            </button>
        </div>
    );
};

export default AudioRecorder;
