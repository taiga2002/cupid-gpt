import requests

url = 'http://localhost:5000/process_mp3'
files = {'file': open('speech.mp3', 'rb')}

response = requests.post(url, files=files)
print(response.text)