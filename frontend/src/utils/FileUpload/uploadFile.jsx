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

            try {
                const response = await fetch('http://localhost:5000/upload', {
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
