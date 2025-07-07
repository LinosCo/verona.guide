# RSS to n8n Tool

This tool fetches items from an RSS feed and sends them to a specified n8n webhook URL.

## Project Structure
-   `.venv/`: Python virtual environment
-   `rss_fetcher.py`: Contains logic for fetching and parsing RSS feeds.
-   `main.py`: Command-line interface for the tool.
-   `.env.example`: Example environment file for n8n webhook URL.
-   `README.md`: This file.

## Setup
1.  Ensure Python 3.8+ is installed.
2.  Clone this repository.
3.  Navigate to the `rss_to_n8n_tool` directory (this directory).
4.  The virtual environment `.venv` with dependencies should already be set up if you ran the initial project setup script correctly. If not, or to recreate:
    *   `python3 -m venv .venv`
    *   `source .venv/bin/activate` (or `.venv\Scripts\activate` on Windows)
    *   `pip install -r requirements.txt`
5.  Copy `.env.example` to a new file named `.env` in this same directory.
6.  Edit `.env` and set your `N8N_WEBHOOK_URL`.

## Usage
From within the `rss_to_n8n_tool` directory, with the virtual environment activated:
```bash
python main.py YOUR_RSS_FEED_URL_HERE [--n8n_url YOUR_N8N_WEBHOOK_URL_HERE]
```
If `--n8n_url` is omitted, the script will attempt to load it from the `N8N_WEBHOOK_URL` variable in the `.env` file.
