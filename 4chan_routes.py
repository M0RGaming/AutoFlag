from json import dumps
import requests

from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os
from io import StringIO
from html.parser import HTMLParser

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.text = StringIO()
    def handle_data(self, d):
        self.text.write(d)
    def get_data(self):
        return self.text.getvalue()

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

app = Flask(__name__)
CORS(app)
# Load environment variables
load_dotenv()

# Get OpenAI API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

@app.route('/moderate', methods=['POST'])
def moderate_text():
    # Get input text from the POST request
    data = request.get_json()
    original_url = data.get('original_url', '')

    posts = get_thread_data(original_url)
    print(len(posts))
    flagged_posts = []
    all_messages = []
    for post in posts:
        all_messages.append(post["com"])

    # Perform moderation using OpenAI API
    response = client.moderations.create(input=all_messages)
    for post, resp in zip(posts, response.results):
        print(resp.flagged)
        # Filter and prepare response for true categories only
        true_categories = {attr: value for attr, value in resp.categories.__dict__.items() if value}
        print(true_categories)
        post["flagged"] = resp.flagged
        post["categories"] = true_categories
        if resp.flagged:
            flagged_posts.append(post)
    # for resp in response.results:

    #     print(resp.flagged)

    #     # Filter and prepare response for true categories only
    #     true_categories = {attr: value for attr, value in resp.categories.__dict__.items() if value}
    #     print(true_categories)

    # post["flagged"] = flagged
    # post["categories"] = true_categories
    # flagged_posts.append(post)

    # Prepare response
    response_data = {
        'posts': flagged_posts,
    }

    return jsonify(response_data)

def get_thread_data(original_url):
    # Extract the board name and thread number
    parts = original_url.split('/')
    board_name = parts[3]
    thread_number = parts[-1]

    # Construct the new URL
    new_url = f"https://a.4cdn.org/{board_name}/thread/{thread_number}.json"

    print(new_url)

    # Make a GET request to the 4chan thread URL
    response = requests.get(new_url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        thread_data = response.json()  # Assuming the response is in JSON format
        li = []
        for post in thread_data["posts"]:
            obj = {}
            post_number = post["no"]
            post_name = post["name"]
            try:
                replacedpost = post["com"].replace('<br>','\n')
                post_message = strip_tags(replacedpost)
            except:
                post_message = ""
            obj["no"] = post_number
            obj["name"] = post_name
            obj["com"] = post_message
            li.append(obj)
        print(li)
        return li
        # return dumps(thread_data["posts"][0]["com"])
    # else:
    #     return dumps({"error": f"Failed to fetch thread data. Status code: {response.status_code}"})

if __name__ == '__main__':
    # original_url = "https://boards.4chan.org/a/thread/261499247"

    # print(get_thread_data(original_url))
    app.run(debug=True, host="0.0.0.0", ssl_context='adhoc')
