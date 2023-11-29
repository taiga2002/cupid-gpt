from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from pydub import AudioSegment
from io import BytesIO
from openai import OpenAI
import tempfile

app = Flask(__name__)
CORS(app, resources={r"/process_mp3": {"origins": "http://localhost:6006"}})

API_KEY = os.getenv('OPENAI_API_KEY')

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

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ['mp3', 'webm']

if __name__ == '__main__':
    app.run(debug=True, port=6006)
