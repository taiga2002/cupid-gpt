import React, { useState, useRef } from 'react';
// @ts-ignore
import { uploadAudio, processText, audioToText } from "@/utils/functions";
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

                    // Call the uploadFile function with the audioBlob'
                    // @ts-ignore
                    audioToText(audioBlob).then((response) => {
                        console.log("Audio to text:")
                        console.log(response);
                        setInputBoxValue(response);
                    }
                    // @ts-ignore
                    ).catch((error) => {
                        console.log(error);
                    });
                    console.log("after audioToText")
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
                // onClick={
                //     () => {
                //         setInputBoxValue("Recording...");
                //     }
                // }
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
