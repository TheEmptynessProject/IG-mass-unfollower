import json
import webbrowser
import time

with open('pending_follow_requests.json', 'r') as file:
    data = json.load(file)

def open_all_links():
    links = []
    for item in data['relationships_follow_requests_sent']:
        for string_data in item['string_list_data']:
            if 'href' in string_data:
                links.append(string_data['href'])

    total_links = len(links)
    for index, link in enumerate(links, 1):
        webbrowser.open(link)
        print(f"Opened link {index} of {total_links}")
        time.sleep(7)

open_all_links()
