from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
prompt = input("Enter hate speech here: ")

response = client.moderations.create(
	input=prompt
	)

result = response.results[0]
flagged = result.flagged
categories = result.categories

if flagged:
	print("Flagged for hate speech")
	for attr, value in categories.__dict__.items():
	    print(attr, value)
	# print(result)
else:
	print("Not flagged for hate speech")