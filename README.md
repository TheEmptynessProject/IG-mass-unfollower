# Instagram Mass Unfollower

This repository automates the process of unfollowing users on Instagram using a **Tampermonkey userscript**. The script clicks the unfollow button on each user's profile and closes the tab once done. The session is managed using cookies, so you don't need to log in repeatedly.

**Please note:** The Puppeteer-based script is unreliable and prone to errors, so we recommend using the Tampermonkey solution for a smoother experience.

## Features

- **Automated Unfollow**: The script will automatically navigate to a user’s profile, click the unfollow button, and confirm the action.
- **Tampermonkey Userscript**: The easiest way to automate unfollowing directly from your browser, without needing to run complex scripts or manage sessions.
- **Automatic Tab Closure**: After unfollowing, the script will automatically close the tab for convenience.

## Installation

### 1. Install Tampermonkey
First, you need to install **[Tampermonkey](https://www.tampermonkey.net/)** in your browser. It’s a browser extension that allows you to run custom userscripts.

### 2. Add the Userscript
- Open **Tampermonkey** in your browser.
- Create a **new script** and paste the code from `tampermonkey-script.js` into the script editor.
- Save the script.

### 3. Run the Script
- Refer to [Usage](#Usage) down below.

## Usage

### 1. Download Your Instagram Data
To get the list of users you wish to unfollow, download your Instagram data:
- Go to **Settings** > **Account Center** > **Your information and permissions** > **Download your information**.
- Select **json** format and download the data.

### 2. Get the Correct JSON File
- Open the downloaded archive.
- Navigate to **Connections > Followers and Following > Pending Follow Requests**. This file will contain the list of pending follow requests.

### 3. Python Script for Opening Links in Batches
To automate the opening of links in batches, use the provided Python script. This script will read the `pending_follow_requests.json` file and open links in batches (e.g., 20 at a time).

#### Python Script: `open_links.py`

```python
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
```

### 4. How to Use the Python Script
1. Download the `pending_follow_requests.json` file as described in the previous step.
2. Place the Python script (`open_links.py`) in the same directory as the JSON file.
3. Run the Python script using Python 3.x:
   ```bash
   python open_links.py
   ```
   This will open the links in batches of 20 (or another batch size if you modify the script). The script will wait for 2 seconds between batches to prevent overwhelming your browser.

### 5. Run the Tampermonkey Script
- **Visit Instagram** in your browser.
- The userscript will automatically click the unfollow button on each user’s profile and confirm the unfollow.
- After all unfollows are completed, the tab will automatically close.

### 6. Session Management
The Tampermonkey userscript saves your session using cookies. Once logged in, the script will keep you logged in on future visits without requiring you to log in again.

## Why not use the Puppeteer script?

While Puppeteer is a powerful browser automation tool, it can be quite unreliable for this type of task. One common issue is **frame detachment**, which occurs when Instagram dynamically updates the page. This can lead to errors, causing the script to fail or requiring a page reload. As a result, running the Puppeteer-based script often results in inconsistencies and errors, making it less suitable for long-term use. **We strongly recommend using the Tampermonkey userscript** for a more stable and seamless experience.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
