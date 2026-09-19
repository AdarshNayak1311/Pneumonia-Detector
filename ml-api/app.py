import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tf_keras as keras
from PIL import Image
import numpy as np
import io

app = Flask(__name__)
CORS(app)

# Real model load karo
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'pneumonia_model.h5')

print("🔄 Model load ho raha hai...")
model = keras.models.load_model(MODEL_PATH)
print("✅ Model loaded successfully!")

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB')
    img = img.resize((180,180))  # ⚠️ apne model ki input size
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'Koi image nahi mili'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Koi file select nahi ki gayi'}), 400

    try:
        image_bytes = file.read()
        processed = preprocess_image(image_bytes)
        prediction = model(processed, training=False).numpy()

        confidence = float(prediction[0][0])
        if confidence > 0.5:
            result = "PNEUMONIA"
        else:
            result = "NORMAL"
            confidence = 1 - confidence

        return jsonify({
            'result': result,
            'confidence': round(confidence * 100, 2)
        })
    except Exception as e:
        return jsonify({'error': f'Image processing error: {str(e)}'}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML API is running!'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1')
    print(f"🚀 Flask server starting on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=debug)