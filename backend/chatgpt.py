import os
import time
import pygame
from openai import OpenAI
import openai
import sounddevice as sd
import soundfile as sf

# Constants
API_KEY = "sk-****"
SPEECH_FILE = "speech.mp3"
TEXT_FILE = "recorded_audio.wav"

# Initialize OpenAI client
if API_KEY:
    client = OpenAI(api_key=API_KEY)
else:
    raise ValueError("Please set your OpenAI API key.")

# Initialize Pygame mixer
pygame.mixer.init()

def text_to_speech_and_play(text):
    try:
        response_audio = client.audio.speech.create(
            model="tts-1",
            voice="nova",
            input=text
        )
        speech_file_path = os.path.join(os.getcwd(), SPEECH_FILE)
        response_audio.stream_to_file("speech.mp3")
        return speech_file_path
        pygame.mixer.music.load(speech_file_path)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            time.sleep(1)
    except openai.error.OpenAIError as e:
        print(f"An error occurred: {e}")

# Main interaction loop
gpt_prompts = [{"role": "system", "content": "I am a man and you are a woman. I am trying to practice speaking to women. You can be flirty when necessary."}]
print("Your dating assistant is ready! Speak now (type 'quit' to exit):")

while True:
    print("Recording... Speak into the microphone.")

    # Record audio
    duration=10
    samplerate=44100
    audio_data = sd.rec(int(samplerate * duration), samplerate=samplerate, channels=1, dtype='int16')
    sd.wait()

    # Save audio to file
    sf.write(TEXT_FILE, audio_data, samplerate)

    audio_file = open(TEXT_FILE, "rb")
    user_message = client.audio.transcriptions.create(
        model="whisper-1", 
        file=audio_file
    )
    print(user_message.text)

    gpt_prompts.append({"role": "user", "content": user_message.text})
    try:
        response = client.chat.completions.create(model="gpt-3.5-turbo", messages=gpt_prompts)
        reply = response.choices[0].message.content
        gpt_prompts.append({"role": "assistant", "content": reply})
        print("\n" + reply + "\n")
        text_to_speech_and_play(reply)
    except openai.BadRequestError as e:
        print(f"An error occurred: {e}")

# Clean up and exit
pygame.mixer.quit()
print("Session ended.")