import React, { useState } from 'react';
import Mp3Reader from './Mp3Reader'; // Adjust the path as necessary

const ParentComponent = () => {
    const [musicSrc, setMusicSrc] = useState(null);

    // Function to update musicSrc, e.g., when a user selects a file
    const handleMusicSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'audio/mpeg') {
            setMusicSrc(URL.createObjectURL(file));
        } else {
            alert('Please select an MP3 file.');
        }
    };

    return (
        <div>
            <input type="file" accept="audio/mpeg" onChange={handleMusicSelect} />
            <Mp3Reader musicSrc={musicSrc} />
        </div>
    );
};

export default ParentComponent;
