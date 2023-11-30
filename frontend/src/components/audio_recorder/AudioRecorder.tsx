import React, { useEffect, useRef } from 'react';

// @ts-ignore
const Mp3Reader = ({ musicSrc }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (musicSrc && audioRef.current) {
            // @ts-ignore
            audioRef.current.src = musicSrc; // Set the new source
            // @ts-ignore
            audioRef.current.play().catch(error => console.error('Error playing the audio:', error));
        }
    }, [musicSrc]);

    return (
        // Render the audio element off-screen
        <audio ref={audioRef} style={{ position: 'absolute', left: '-9999px' }} />
    );
};

export default Mp3Reader;
