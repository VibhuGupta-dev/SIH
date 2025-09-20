import os
import google.generativeai as genai
from datetime import datetime
import requests
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from cachetools import TTLCache
import google.api_core.exceptions
from time import sleep

# Initialize Flask app
app = Flask(__name__)

# Configure CORS to allow requests from frontend
CORS(app, origins=['http://localhost:5173'], supports_credentials=True)

# Configure rate limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

# Configure cache: 1 hour TTL, max 100 items
cache = TTLCache(maxsize=100, ttl=3600)

# Configure Gemini API
try:
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    print("✅ Gemini API configured successfully")
except Exception as e:
    print(f"❌ Failed to configure Gemini API: {str(e)}")

# Health check endpoint
@app.route('/health', methods=['GET'])
@limiter.limit("10 per minute")
def health_check():
    try:
        return jsonify({
            'status': 'Gemini Mental Health AI running',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0.0'
        }), 200
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return jsonify({'error': f'Health check failed: {str(e)}'}), 500

# Analyze mental health data or user message
def analyze_mental_health(assessment_data=None, user_message=None, user_id=None):
    cache_key = f"{user_id}:{user_message or str(assessment_data)}"
    if cache_key in cache:
        print(f"Cache hit for {cache_key}")
        return cache[cache_key]

    try:
        content = ""
        if user_message:
            content = f"User message: {user_message}\nProvide a supportive mental health response with possible concerns, recommendations, and a disclaimer to consult a professional."
        elif assessment_data:
            content = f"Analyze mental health based on the following assessment data: {assessment_data}\nProvide a detailed report with possible concerns, recommendations, and a disclaimer to consult a professional."
        else:
            content = "Generate a general mental health report with recommendations and a disclaimer to consult a professional."

        model = genai.GenerativeModel("gemini-1.5-flash")
        max_retries = 3
        retry_delay = 5  # Initial delay in seconds

        for attempt in range(max_retries):
            try:
                response = model.generate_content(content)
                result = response.text
                cache[cache_key] = result
                print(f"Gemini response: {result[:100]}...")  # Log first 100 chars
                return result
            except google.api_core.exceptions.ResourceExhausted as e:
                if attempt < max_retries - 1:
                    print(f"⚠️ Rate limit hit, retrying in {retry_delay}s... (Attempt {attempt + 1}/{max_retries})")
                    sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                else:
                    print(f"❌ Max retries reached: {str(e)}")
                    raise
    except Exception as e:
        print(f"⚠️ Gemini error: {str(e)}")
        traceback.print_exc()
        analysis_text = (
            "🧠 FALLBACK MENTAL HEALTH REPORT\n"
            "📋 Possible Concerns: Unknown due to API limitations\n"
            "💡 Recommendations:\n"
            "• Practice daily mindfulness or meditation to reduce stress.\n"
            "• Engage in light physical activity, like a walk, to boost mood.\n"
            "• Consider journaling your thoughts to gain clarity.\n"
            "⚠️ Disclaimer: This is AI-generated advice. Always consult a mental health professional for personalized care."
        )
        cache[cache_key] = analysis_text
        return analysis_text

# Generate mental health report
@app.route('/api/ai-report', methods=['GET'])
@limiter.limit("10 per minute")
def generate_report():
    try:
        user_id = request.args.get('userId', '').strip()
        print(f"Received /api/ai-report request for userId: {user_id}")
        if not user_id:
            print("Error: User ID missing")
            return jsonify({'error': 'User ID required'}), 400

        print(f"Fetching assessment from {os.getenv('BACKEND_URL')}/api/usermentalhealth/status")
        assessment_response = requests.get(
            f"{os.getenv('BACKEND_URL', 'http://localhost:3000')}/api/usermentalhealth/status",
            params={'userId': user_id},
            cookies=request.cookies
        )
        print(f"Assessment response status: {assessment_response.status_code}")
        print(f"Assessment response: {assessment_response.json()}")

        if assessment_response.status_code != 200:
            print(f"Error: Failed to fetch assessment data, status {assessment_response.status_code}")
            return jsonify({
                'analysis': f"Failed to fetch assessment data: Status {assessment_response.status_code}",
                'type': 'error',
                'confidence': '0%',
                'source': 'Error',
                'timestamp': datetime.now().isoformat(),
            }), 500

        assessment_data = assessment_response.json().get('mentalHealthAnswers', {})

        result = analyze_mental_health(assessment_data=assessment_data, user_id=user_id)
        response_data = {
            'analysis': result,
            'type': 'fallback' if 'FALLBACK' in result else 'gemini_mental_health',
            'confidence': '50%' if 'FALLBACK' in result else '85%',
            'source': 'Fallback' if 'FALLBACK' in result else 'Gemini LLM',
            'timestamp': datetime.now().isoformat(),
        }

        print(f"Returning report: {response_data}")
        return jsonify(response_data), 200
    except Exception as e:
        print(f"❌ Error generating report: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'analysis': f"Failed to generate report: {str(e)}",
            'type': 'error',
            'confidence': '0%',
            'source': 'Error',
            'timestamp': datetime.now().isoformat(),
        }), 500

# Handle chat messages
@app.route('/api/ai-chat', methods=['POST'])
@limiter.limit("10 per minute")
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        user_id = data.get('userId', '').strip()
        print(f"Received /api/ai-chat request: message={user_message}, userId={user_id}")

        if not user_message:
            print("Error: Message missing")
            return jsonify({'error': 'Message required'}), 400

        result = analyze_mental_health(user_message=user_message, user_id=user_id)
        response_data = {
            'response': result,
            'type': 'fallback' if 'FALLBACK' in result else 'gemini_mental_health',
            'confidence': '50%' if 'FALLBACK' in result else '85%',
            'source': 'Fallback' if 'FALLBACK' in result else 'Gemini LLM',
            'timestamp': datetime.now().isoformat(),
        }

        print(f"Returning chat response: {response_data}")
        return jsonify(response_data), 200
    except Exception as e:
        print(f"❌ Error in chat: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'response': f"Failed to get response: {str(e)}",
            'type': 'error',
            'confidence': '0%',
            'source': 'Error',
            'timestamp': datetime.now().isoformat(),
        }), 500

# Fetch analysis history
@app.route('/api/analyses', methods=['GET'])
@limiter.limit("10 per minute")
def get_analyses():
    try:
        user_id = request.args.get('userId', '').strip()
        print(f"Received /api/analyses request for userId: {user_id}")
        if not user_id:
            print("Error: User ID missing")
            return jsonify({'error': 'User ID required'}), 400

        # Mock history for now (replace with actual storage logic if needed)
        history = [
            {
                'userInput': {'text': 'I feel sad'},
                'aiResponse': {
                    'response': 'I’m sorry to hear you’re feeling sad. It’s okay to have these moments. Try journaling or talking to a trusted friend. Always consult a professional for personalized support.',
                    'type': 'gemini_mental_health',
                    'confidence': '85%',
                    'source': 'Gemini LLM',
                    'timestamp': datetime.now().isoformat(),
                },
                'timestamp': datetime.now().isoformat(),
            }
        ]

        print(f"Returning history: {history}")
        return jsonify({'success': True, 'data': history}), 200
    except Exception as e:
        print(f"❌ Error fetching analyses: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': f'Failed to fetch analyses: {str(e)}'}), 500

if __name__ == '__main__':
    print("🚀 Starting Gemini Mental Health AI on port 5002...")
    app.run(host='0.0.0.0', port=5002, debug=True)