from flask import Flask, request, jsonify
import openai
import os
from pydub import AudioSegment
from io import BytesIO
from openai import OpenAI
import tempfile

app = Flask(__name__)

API_KEY = "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"

if API_KEY:
    client = OpenAI(api_key=API_KEY)
else:
    raise ValueError("Please set your OpenAI API key.")
gpt_prompts = [{"role": "system", "content": "I am a man and you are a woman. I am trying to practice speaking to women. You can be flirty when necessary."}]

@app.route('/process_mp3', methods=['POST'])
def process_mp3():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        # Process the MP3 file
        audio = AudioSegment.from_mp3(BytesIO(file.read()))

        # Write the converted audio to a temporary WAV file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_wav:
            audio.export(temp_wav.name, format="wav")

            # Read the WAV file and send for transcription
            with open(temp_wav.name, 'rb') as wav_file:
                try:
                    user_message = client.audio.transcriptions.create(
                        model="whisper-1", 
                        file=wav_file
                    )
                    transcription = user_message.text
                except openai.OpenAIError as e:
                    return jsonify({'error': str(e)}), 500

            # Remove the temporary file
            os.remove(temp_wav.name)
        gpt_prompts.append({"role": "user", "content": user_message.text})
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
           filename.rsplit('.', 1)[1].lower() in ['mp3']

if __name__ == '__main__':
    app.run(debug=True)
