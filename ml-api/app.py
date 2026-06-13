from flask import Flask, request, jsonify
from flask_cors import CORS
import tf_keras as keras
from PIL import Image
import numpy as np
import io

app = Flask(__name__)
CORS(app)

# Real model load karo
print("🔄 Model load ho raha hai...")
model = keras.models.load_model('pneumonia_model.h5')
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
    image_bytes = file.read()

    processed = preprocess_image(image_bytes)
    prediction = model.predict(processed)

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

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML API is running!'})

if __name__ == '__main__':
    print("🚀 Flask server starting on port 5001...")
    app.run(port=5001, debug=True)