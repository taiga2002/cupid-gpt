import React, { useState } from 'react';

function FileUpload() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            console.log("123")

            try {
                const response = await fetch('http://127.0.0.1:6006/process_mp3', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    console.log('File uploaded successfully');
                } else {
                    console.log('Upload failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept=".mp3" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
    );
}

export default FileUpload;
