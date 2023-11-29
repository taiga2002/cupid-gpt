import React, { useState } from 'react';

const Mp3Reader = () => {
    const [audioSrc, setAudioSrc] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'audio/mpeg') {
            const src = URL.createObjectURL(file);
            setAudioSrc(src);
        } else {
            alert('Please select an MP3 file.');
        }
    };

    return (
        <div>
            <input type="file" accept="audio/mpeg" onChange={handleFileChange} />
            {audioSrc && <audio controls src={audioSrc} />}
        </div>
    );
};

export default Mp3Reader;
