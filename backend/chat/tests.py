# from django.test import TestCase

# # Create your tests here.
# import requests
# import json

# # Define the API endpoint
# url = 'http://localhost:8000/api/chat/extract-link-test/'

# # Create the payload (data to be sent)
# payload = {
#     'message': 'Your message here',  # Replace with your actual message
#     'other_key': 'Other value'        # Add any other required fields
# }

# # Send a POST request to the API
# try:
#     response = requests.post(url, json=payload)

#     # Check if the request was successful
#     if response.status_code == 200:
#         print("Success:", response.json())  # Print the response from the server
#     else:
#         print("Error:", response.status_code, response.text)

# except requests.exceptions.RequestException as e:
#     print("An error occurred:", e)


# # print(get_topic_sort("U-Net: Semantic segmentation with PyTorch", ['generative AI', 'system design', 'machine learning', 'leetcode']))
from extract_link import extract_links, tag_extractor

data_dict = extract_links('https://www.youtube.com/watch?v=DUg2SWWK18I')
