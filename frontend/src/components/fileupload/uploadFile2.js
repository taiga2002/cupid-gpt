export const uploadFile2 = (file) => {
    const formData = new FormData();
    const audioFile = new File([file], "recording.webm", { type: 'audio/webm' });
    formData.append('file', audioFile);

    // Return the fetch promise
    return fetch('http://127.0.0.1:3000/process_mp3', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                console.log('File uploaded successfully');
                return response.json(); // Return the JSON response
            } else {
                console.log('Upload failed');
                throw new Error('Upload failed');
            }
        })
        // You can also handle the JSON response here if specific to this function
        .catch(error => {
            console.error('Error:', error);
            throw error; // Rethrow the error if you want to handle it outside
        });
}
