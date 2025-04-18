from tensorflow.keras.models import model_from_json, Sequential
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np
import cv2
import os
import time

# Suppress TensorFlow warnings (optional)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Load model architecture
with open('facialemotionmodel.json', 'r') as json_file:
    model_json = json_file.read()
model = model_from_json(model_json, custom_objects={'Sequential': Sequential})
model.load_weights('facialemotionmodel.h5')

# Emotion labels - must match the model's training order!
emotion_labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

# Output path for saving detected emotion
output_path = '../eduease-platform (1)/app/classroom/component/detected_emotion.txt'
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Load OpenCV face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Start webcam
cap = cv2.VideoCapture(0)

try:
    while True:
        detected_emotion = None  # Reset before each attempt

        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            continue

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            face = frame[y:y + h, x:x + w]
            face_gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            face_resized = cv2.resize(face_gray, (48, 48))
            face_resized = face_resized.astype("float") / 255.0
            face_array = img_to_array(face_resized)
            face_array = np.expand_dims(face_array, axis=0)

            prediction = model.predict(face_array)
            print("Prediction scores:", prediction[0])  # Debugging line

            max_index = np.argmax(prediction[0])
            detected_emotion = emotion_labels[max_index]
            print(f"Detected Emotion: {detected_emotion}")
            break  # Only use the first detected face

        if detected_emotion:
            with open(output_path, 'w') as f:
                f.write(detected_emotion)
        else:
            print("No face detected.")

        # Wait 30 seconds before the next detection
        time.sleep(30)

except KeyboardInterrupt:
    print("Interrupted by user. Exiting...")

finally:
    cap.release()
    cv2.destroyAllWindows()
