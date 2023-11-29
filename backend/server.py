from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import openai
import os
from pydub import AudioSegment
from io import BytesIO
from openai import OpenAI
import tempfile

app = Flask(__name__)
CORS(app)

API_KEY = "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"

if API_KEY:
    client = OpenAI(api_key=API_KEY)
else:
    raise ValueError("Please set your OpenAI API key.")

gpt_prompts = [{"role": "system", "content": "I am a man and you are a woman. I am trying to practice speaking to women. You can be flirty when necessary."}]

@app.route('/process_mp3', methods=['POST'])
def process_mp3():
    if 'file' not in request.files:
        print("No file part")
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        print("No selected file")
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        print(file.filename)
        print("Processing file")
        # Process the audio file
        audio_format = file.filename.rsplit('.', 1)[1].lower()
        audio = AudioSegment.from_file(BytesIO(file.read()), format=audio_format)

        # Write the converted audio to a temporary WAV file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_wav:
            print("here 123")
            audio.export(temp_wav.name, format="wav")

            # Read the WAV file and send for transcription
            with open(temp_wav.name, 'rb') as wav_file:
                print("here 456")
                try:
                    user_message = client.audio.transcriptions.create(
                        model="whisper-1",
                        file=wav_file
                    )
                    transcription = user_message.text
                except openai.OpenAIError as e:
                    print(f"An error occurred 9999999: {e}")
                    return jsonify({'error': str(e)}), 500

            # Remove the temporary file
            os.remove(temp_wav.name)
        gpt_prompts.append({"role": "user", "content": user_message.text})
        print("\n 1923891238912839" + user_message.text + "\n")
        try:
            response = client.chat.completions.create(model="gpt-3.5-turbo", messages=gpt_prompts)
            reply = response.choices[0].message.content
            gpt_prompts.append({"role": "assistant", "content": reply})
            print("\n" + reply + "\n")
            return jsonify({'response': reply})
        except openai.BadRequestError as e:
            print(f"An error occurred: {e}")

@app.route('/generate-speech', methods=['POST'])
def generate_speech():
    text = request.json.get('text')
    if not text:
        return "No text provided", 400

    # Assuming you have a function to generate the speech file
    speech_file_path = text_to_speech_and_play(text)

    # Return the generated speech file
    return send_file(speech_file_path, mimetype="audio/mp3")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ['mp3', 'webm']

def text_to_speech_and_play(text):
    response_audio = client.audio.speech.create(
        model="tts-1",
        voice="nova",
        input=text
    )
    SPEECH_FILE = "speech.mp3"
    speech_file_path = os.path.join(os.getcwd(), SPEECH_FILE)
    response_audio.stream_to_file("speech.mp3")
    return speech_file_path

if __name__ == '__main__':
    app.run(debug=True, port=3000)
