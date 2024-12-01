import requests
from groq import Groq
import os
import ast
def tag_extractor(data_dict):
    groq_client = Groq(api_key="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")
    PROMPT = f"""you are given a description of a media source {data_dict}. You are supposed to extract keyword only containing the core content in this source descrption.
        return in the format ["keyword1", "keyword2", ... "keywordn"]
        you should only return the list, nothing else."""
    completion = groq_client.chat.completions.create(
            messages=[{"role": "system", "content": PROMPT}],
            model="mixtral-8x7b-32768",
            temperature=0.7,
            max_tokens=1024,
        )
    return completion.choices[0].message.content

def extract_links(url):
    params = {'url': url, 'meta': True}
    api_url = 'https://api.microlink.io'
    response = requests.get(api_url, params)
    response = response.json()
    data_dict = {}
    data_dict['author'] = response['data']['author']
    data_dict['title'] = response['data']['title']
    data_dict['publisher'] = response['data']['publisher']
    data_dict['description'] = response['data']['description']
    data_dict['date'] = response['data']['date']
    parsed_tag = ast.literal_eval(tag_extractor(data_dict))
    data_dict['tags'] = parsed_tag
    return data_dict

def get_topic_sort(topic_text, node_list):
    groq_client = Groq(api_key="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")
    PROMPT = f"""you are given a media source description dictionary "{topic_text}" and a list of node on the current level {node_list}.
    Give only one tag that this topic you think is most relevant to.
    return only the tag in exactly same format as in the tag list, nothing else.
    """
    completion = groq_client.chat.completions.create(
            messages=[{"role": "system", "content": PROMPT}],
            model="llama3-70b-8192",
            temperature=0.7,
            max_tokens=1024,
        )
    return completion.choices[0].message.content
