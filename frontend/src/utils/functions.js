// Function to upload audio and get the transcribed text
export const uploadAudio = (audioFile) => {
    const formData = new FormData();
    formData.append('file', audioFile);

    return fetch('http://127.0.0.1:3000/audio_to_text', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.ok ? response.json() : Promise.reject('Upload failed'))
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

// Function to process text and get the server message
export const processText = (text) => {
    return fetch('http://127.0.0.1:3000/user_msg_to_server_msg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
    })
        .then(response => response.ok ? response.json() : Promise.reject('Text processing failed'))
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

// Function to handle the entire flow (upload audio, get text, get response)
export const audioToText = (file) => {
    const audioFile = new File([file], "recording.webm", { type: 'audio/webm' });

    return uploadAudio(audioFile)
        .then(data => {
            console.log('File uploaded successfully');
            console.log(data)
            return data.transcription
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}
