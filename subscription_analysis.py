import os
from square.client import Client
import ai

from dateutil.relativedelta import relativedelta
from datetime import date, datetime

CUSTOMER_ANALYSIS_PROMPT = "You are an award winning marketer that's been responsible for many viral campaigns for Nike, Apple, etc. You are well versed in psychographic analysis. You will always provide a psychographic analysis with personality, interest, hobbies, trends, music, food, drinks, TV shows, fashion, sports that those ages groups like also for each category give examples, brands, names, show names, restaurant names, etc."

def calculate_age(birth_date):
  today = date.today()
  birth_date = datetime.strptime(birth_date, "%Y-%m-%d").date()
  age = relativedelta(today, birth_date)
  return age.years

def get_top_age_bucket(customer_ids, customer_map):
  age_buckets = {
      "<18": 0,
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55-64": 0,
      "65+": 0
  }
  for customer_id in customer_ids:
    if customer_id in customer_map and "birthday" in customer_map[customer_id]:
      age = calculate_age(customer_map[customer_id]["birthday"])
      if age < 18:
        age_buckets["<18"] += 1
      elif age < 25:
        age_buckets["18-24"] += 1
      elif age < 35:
        age_buckets["25-34"] += 1
      elif age < 45:
        age_buckets["35-44"] += 1
      elif age < 55:
        age_buckets["45-54"] += 1
      elif age < 65:
        age_buckets["55-64"] += 1
      else:
        age_buckets["65+"] += 1

  # Sort count desc.
  sorted_by_count_age_buckets = sorted(age_buckets.items(), key=lambda item: item[1], reverse=True)
  return sorted_by_count_age_buckets

PLAN_ID_TO_NAME = {
    'YD2IOM6UEDYSQQ3PKKE6EB3I': 'Drink Subscription Membership',
    'RXLLOVNEGZ6BZZH2R35KP5G3': 'Annual Drink Subscription Membership'
}

class ItemMetric:

  def __init__(self, plan_id):
    self.plan_id = plan_id
    self.total_quantity = 0
    self.customer_ids = set()
    self.popular_age_bucket = None

  def __lt__(self, other):
    self.total_quantity < other.total_quantity

  def to_json(self):
    return {
      "plan_id": self.plan_id,
      "name": PLAN_ID_TO_NAME[self.plan_id],
      "total_quantity": self.total_quantity,
      "popular_age_bucket": self.popular_age_bucket
    }


def fetch_subscriptions():
  client = Client(access_token=os.environ['SQUARE_ACCESS_TOKEN'],
                  environment='sandbox')

  # Fetch all the subscriptions
  subscriptions_api = client.subscriptions
  result = subscriptions_api.search_subscriptions(
    body = {}
  )

  # Items and how many sold
  object_id_to_metric = {}
  item_metrics = []

  if result.is_error():
    print(result.errors)
    return []

  filtered_orders = []
  for order in result.body["subscriptions"]:
    plan_id = order["plan_id"]
    if plan_id not in object_id_to_metric:
        item_metric = ItemMetric(plan_id)
        object_id_to_metric[plan_id] = item_metric
        item_metrics.append(item_metric)
    object_id_to_metric[plan_id].total_quantity += 1
    object_id_to_metric[plan_id].customer_ids.add(order["customer_id"])

  # Sort by items with the most sold count descending.
  most_popular_items = sorted(item_metrics, reverse=True)
  return {
    'most_popular_items': most_popular_items,
  }

def run_report():
  # Fetch all the customers and create a customer_id to customer map
  client = Client(
    access_token=os.environ['SQUARE_ACCESS_TOKEN'],
    environment='sandbox')
  customers_api = client.customers
  response = customers_api.list_customers()

  customer_id_to_customer = {}
  for customer in response.body["customers"]:
    customer_id_to_customer[customer["id"]] = customer

  # Calculate the most popular age buckets
  result = fetch_subscriptions()
  most_popular_items = result["most_popular_items"]

  age_buckets = {
      "<18": 0,
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55-64": 0,
      "65+": 0
  }
  for popular_item in most_popular_items:
    popular_item.popular_age_bucket = get_top_age_bucket(popular_item.customer_ids, customer_id_to_customer)

  # Run psychoanalysis on the most popular items's top 3 age bucket
  
  top_three_age_buckets = [p[0] for p in set(most_popular_items[0].popular_age_bucket[:3])]
  print("top_three_age_buckets")
  print(top_three_age_buckets)
  
  query1 = "My most popular customers fall into these age buckets: " + ", ".join(list(set(top_three_age_buckets)))
  query2 = "For each of my age buckets show me a psychographic analysis with personality, interest, hobbies, trends, music, food, drinks, TV shows, fashion, sports that those ages groups like. Also for each category give examples, brands, names, show names, restaurant names, etc."

  messages = [
    {"role": "system", "content": CUSTOMER_ANALYSIS_PROMPT},
    {"role": "user", "content": query1},
    {"role": "user", "content": query2},
  ]
  ai_response = ai.ask(messages)

  # Convert most_popular_items to json
  most_popular_items = [p.to_json() for p in most_popular_items]
  return {
    'most_popular_items': most_popular_items,
    'top_three_items_analysis': ai_response,
  }
