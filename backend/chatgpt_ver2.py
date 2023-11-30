import openai
import pyttsx3
import speech_recognition as sr
import time
from openai import OpenAI

API_KEY = "sk-******"
engine = pyttsx3.init()
if API_KEY:
    client = OpenAI(api_key=API_KEY)
else:
    raise ValueError("Please set your OpenAI API key.")
def transcribe_audio_to_text(filename):
    recognizer = sr.Recognizer()
    with sr.AudioFile(filename) as source:
        audio = recognizer.record(source)
    try:
        return recognizer.recognize_google(audio)
    except:
        print("Skipping unknown error")

def generate_response(user_message):
    gpt_prompts = []
    gpt_prompts.append({"role": "user", "content": user_message})
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=gpt_prompts)
    reply = response.choices[0].message.content
    return reply



def speak_text(text):
    engine.say(text)
    engine.runAndWait()

def main():
    while True:
        print("Say Genius")
        with sr.Microphone() as source:
            recognizer = sr.Recognizer()
            audio=recognizer.listen(source)
            try:
                transcription = recognizer.recognize_google(audio)
                if transcription.lower() == "genius":
                    filename = "input.wav"
                    print("Say question")
                    with sr.Microphone() as source:
                        recognizer = sr.Recognizer()
                        source.pause_threshold = 1
                        audio=recognizer.listen(source, phrase_time_limit=None, timeout=None)
                        with open(filename, "wb") as f:
                            f.write(audio.get_wav_data())

                    text = transcribe_audio_to_text(filename)
                    if text:
                        print(f"You said {text}")
                        response = generate_response(text)
                        print(f"GPT says: {response}")
                        speak_text(response)
            except Exception as e:
                print(f"An error occured: {e}")

if __name__ == "__main__":
    main()