import os
import ast  # for converting embeddings saved as strings back to arrays
import openai  # for calling the OpenAI API
import pandas as pd  # for storing text and embeddings data
import tiktoken  # for counting tokens
from scipy import spatial  # for calculating vector similarities for search
from flask import request

OPEN_API_KEY = os.environ.get("OPEN_API_KEY")
openai.api_key = OPEN_API_KEY

# models
GPT_MODEL = "gpt-3.5-turbo"

def ask(
    query: str,
    model: str = GPT_MODEL,
    token_budget: int = 4096 - 500,
    print_message: bool = False,
) -> str:
    """Answers a query using GPT"""
    message = query
    
    if print_message:
        print(message)

    messages = [
        {"role": "system", "content": """
I want you to act as a knowledgeable guide in the realm of Square ecommerce, anticipating my interest in establishing an online store using Square as the platform of choice. Assume that I am an entrepreneur or small business owner seeking to leverage Square's capabilities for selling products or services online. Provide me with a step-by-step walkthrough on how to set up a Square ecommerce store, including the initial account setup, store customization, product listing, and integration of payment gateways. Explain the key features and advantages of using Square for ecommerce, such as its user-friendly interface, secure payment processing, and inventory management tools.
Moreover, I need assistance in generating new product ideas that resonate with my target audience. Offer strategies and techniques for brainstorming, conducting market research, and identifying customer pain points to develop innovative and compelling products or services. Provide guidance on validating product ideas and conducting product testing before officially launching them in the store.
Furthermore, I require help in analyzing trends within my store's orders and understanding customer preferences. Describe methods for extracting meaningful insights from sales data, such as using Square's built-in analytics tools or integrating third-party analytics platforms. Explain how to identify the most popular products by analyzing sales volumes, customer reviews, and website traffic. Offer advice on leveraging customer feedback and reviews to improve existing products or develop new offerings that align with customer demand.
Lastly, discuss strategies for effectively marketing and promoting the Square ecommerce store, including social media marketing, search engine optimization (SEO), and email marketing. Provide tips for driving traffic to the store, increasing conversions, and retaining customers for long-term success.
By addressing these aspects comprehensively, you'll equip me with the knowledge and tools necessary to set up a thriving Square ecommerce store, develop enticing new products, and gain valuable insights from order trends and customer preferences.
        """},
        {"role": "user", "content": message},
    ]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0
    )
    response_message = response["choices"][0]["message"]["content"]
    return response_message