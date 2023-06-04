import io
import os
from flask import Flask, current_app, request, jsonify, make_response
from flask_cors import CORS
from googleapiclient.discovery import build
import requests
from square.client import Client
import ai

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
if os.environ.get("ENV") == "development":
  CORS(app)
  print("CORS enabled in development", "ENV", os.environ.get("ENV"))
else:
  print("CORS disabled in production", "ENV", os.environ.get("ENV"))

OPEN_API_KEY = os.environ.get("OPEN_API_KEY")
GOOGLE_CLOUD_API_KEY = os.environ.get("GOOGLE_CLOUD_API_KEY")
SHIPENGINE_API_KEY = os.getenv("SHIPENGINE_API_KEY")

def translate_text(text, target="en"):
  service = build("translate", "v2", developerKey=GOOGLE_CLOUD_API_KEY)
  response = service.translations().list(target=target, q=[text]).execute()
  # Extract the translated text from the response
  translated_text = response['translations'][0]['translatedText']
  return translated_text

def text_to_speech(text, target="en"):
  # Create a service object for the Text-to-Speech API
  service = build('texttospeech', 'v1', developerKey=GOOGLE_CLOUD_API_KEY)
  # Set the audio output parameters
  audio_config = {
      'audioEncoding': 'MP3'
  }
  # Set the voice parameters
  voice = {
      'languageCode': target,  # Language code
      'ssmlGender': 'FEMALE'  # Voice gender
  }
  # Perform the text-to-speech synthesis
  response = service.text().synthesize(
      body={
          'input': {
              'text': text
          },
          'voice': voice,
          'audioConfig': audio_config
      }
  ).execute()

  return response['audioContent']

@app.route('/')
def index():
  return current_app.send_static_file('index.html')

@app.route('/api/generate', methods=['POST'])
def generate_response():
  if (request.json["locale"].startswith("en")):
    ai_english_response = ai.ask(request.json["prompt"])
    response = jsonify({"text": ai_english_response, "locale": request.json["locale"]})
  else:
    english_user_prompt = translate_text(request.json["prompt"])
    ai_english_response = ai.ask(english_user_prompt)
    ai_translated_response = translate_text(ai_english_response, request.json["locale"])
    response = jsonify({"text": ai_translated_response, "locale": request.json["locale"]})
  return response

@app.route('/api/synthesize-speech', methods=['POST'])
def synthesize_speech():
  # Get the synthesized speech audio content
  audio_content = text_to_speech(request.json["text"], request.json["locale"])
  return jsonify({"audioContent": audio_content})

@app.route('/api/estimate-ship-rate', methods=['POST'])
def estimate_ship_rate():
  response = requests.post("https://api.shipengine.com/v1/rates/estimate",
    headers={"Content-Type":"application/json", "API-key": SHIPENGINE_API_KEY},
    json=request.json
    )
  return response.json()

@app.route('/api/fetch-store-catalog', methods=['GET'])
def fetch_store_catalog():
  client = Client(
    access_token=os.environ['SQUARE_ACCESS_TOKEN'],
    environment='sandbox')
  catalog_api = client.catalog
  response = client.catalog.list_catalog(types = "ITEM")
  items = response.body

  # Keep track of image object ids to later retrieve image urls.
  reponse_items = []
  object_ids = []
  for item in items["objects"]:
    if item["item_data"]["image_ids"]:
      image_id = item["item_data"]["image_ids"][0]
      object_ids.append(image_id)
      reponse_items.append(item)

  # Batch retrieve image urls for all image object ids.
  image_id_to_image_url = {}
  images = catalog_api.batch_retrieve_catalog_objects(body={"object_ids": object_ids})
  for image in images.body["objects"]:
    image_id_to_image_url[image["id"]] = image["image_data"]["url"]

  # Add image urls to response items.
  for i in range(len(reponse_items)):
    image_id = object_ids[i]
    image_url = image_id_to_image_url[image_id]
    item = reponse_items[i]["item_data"]["image_url"] = image_url

  return jsonify(reponse_items)
