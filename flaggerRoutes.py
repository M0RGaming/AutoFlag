from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Load environment variables
load_dotenv()

# Get OpenAI API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

@app.route('/moderate', methods=['POST'])
def moderate_text():
    # Get input text from the POST request
    data = request.get_json()
    prompt = data.get('prompt', '')

    # Perform moderation using OpenAI API
    response = client.moderations.create(input=prompt)
    result = response.results[0]
    flagged = result.flagged
    categories = result.categories

    # Filter and prepare response for true categories only
    true_categories = {attr: value for attr, value in categories.__dict__.items() if value}

    # Prepare response
    response_data = {
        'flagged': flagged,
        'categories': true_categories
    }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)
