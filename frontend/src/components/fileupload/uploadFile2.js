// Function to upload a file
// Function to upload a file
export const uploadFile2 = (file) => {
    const formData = new FormData();

    // Create a new file with a filename including the file type
    const audioFile = new File([file], "recording.webm", { type: 'audio/webm' });
    formData.append('file', audioFile);

    console.log('uploadFile2: file = ', audioFile);

    fetch('http://127.0.0.1:3000/process_mp3', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                console.log('File uploaded successfully');
            } else {
                console.log('Upload failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
