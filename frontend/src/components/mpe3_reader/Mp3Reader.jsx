import React, { useEffect, useRef } from 'react';

const Mp3Reader = ({ musicSrc }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (musicSrc && audioRef.current) {
            audioRef.current.src = musicSrc; // Set the new source
            audioRef.current.play().catch(error => console.error('Error playing the audio:', error));
        }
    }, [musicSrc]);

    return (
        // Render the audio element off-screen
        <audio ref={audioRef} style={{ position: 'absolute', left: '-9999px' }} />
    );
};

export default Mp3Reader;
