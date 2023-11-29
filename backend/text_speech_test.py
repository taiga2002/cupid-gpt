# test_app.py
import unittest
import os
import pygame
from server import app

class FlaskTest(unittest.TestCase):

    def setUp(self):
        # Set up the Flask test client
        app.testing = True
        self.client = app.test_client()

    def test_generate_speech(self):
        # Send a POST request
        response = self.client.post('/generate-speech', json={'text': 'Hello, world!'})

        # Check if the response is 200 OK
        self.assertEqual(response.status_code, 200)

        # Save the response content as an MP3 file
        with open('test_speech.mp3', 'wb') as file:
            file.write(response.data)

        # Play the MP3 file
        pygame.mixer.init()
        pygame.mixer.music.load('test_speech.mp3')
        pygame.mixer.music.play()

        # Wait for playback to finish
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)

    def tearDown(self):
        # Cleanup after each test
        if os.path.exists('test_speech.mp3'):
            os.remove('test_speech.mp3')

if __name__ == '__main__':
    unittest.main()
