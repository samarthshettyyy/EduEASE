from flask import Flask, request, render_template, jsonify
import os
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up the Gemini API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyCRgD7XRU23hAGmzSMhcnZOu38tgLe_S98"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Store conversation history globally
conversation_history = []

def generate_ai_response(user_input):
    model = genai.GenerativeModel("models/gemini-1.5-pro")
    
    # Generate a response from the Gemini model
    response = model.generate_content(user_input)
    
    # Return the text response
    return response.text


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/process_voice", methods=["POST"])
def process_voice():
    data = request.json
    user_input = data.get("user_input", "")
    
    # Get response from AI
    ai_response = generate_ai_response(user_input)
    
    # Add to conversation history
    conversation_history.append({
        "user": user_input,
        "ai": ai_response
    })
    
    # Keep only the last 10 entries
    if len(conversation_history) > 10:
        conversation_history.pop(0)
    
    return jsonify({
        "response": ai_response,
        "conversation_history": conversation_history
    })


if __name__ == "__main__":
    app.run(debug=True)
