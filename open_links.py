import json
import webbrowser
import time

with open('pending_follow_requests.json', 'r') as file:
    data = json.load(file)

def open_links_in_batches(batch_size=20):
    links = []
    for item in data['relationships_follow_requests_sent']:
        for string_data in item['string_list_data']:
            if 'href' in string_data:
                links.append(string_data['href'])

    for i in range(0, len(links), batch_size):
        batch = links[i:i + batch_size]
        for link in batch:
            webbrowser.open(link)
        print(f"Opened batch {i//batch_size + 1} of {len(links)//batch_size + 1}")

open_links_in_batches()
