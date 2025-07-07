import argparse
import logging
import os
import sys
from dotenv import load_dotenv

# Assuming rss_fetcher.py is in the same directory
from rss_fetcher import fetch_rss_feed, send_to_n8n

# Setup basic logging
# More advanced logging could be configured (e.g., file output, specific formatters for modules)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__) # Get a logger for this module

def process_feed_to_n8n(rss_url: str, n8n_webhook_url: str):
    """
    Fetches an RSS feed and sends its entries to an n8n webhook.
    """
    if not rss_url:
        logger.error("RSS feed URL is required.")
        return False
    if not n8n_webhook_url:
        logger.error("n8n webhook URL is required.")
        return False

    logger.info(f"Processing RSS feed: {rss_url}")
    logger.info(f"Target n8n webhook: {n8n_webhook_url}")

    feed_content = fetch_rss_feed(rss_url)

    if not feed_content:
        logger.error(f"Could not fetch or parse RSS feed from {rss_url}. Aborting.")
        return False

    if not feed_content.entries:
        logger.warning(f"Feed '{feed_content.feed.get('title', rss_url)}' has no entries. Nothing to send to n8n.")
        return True # Successfully processed an empty feed

    # Convert feed entries to a list of simple dictionaries for JSON serialization
    # This ensures we don't try to send complex feedparser objects directly.
    items_to_send = []
    for entry in feed_content.entries:
        items_to_send.append({
            "title": entry.get("title"),
            "link": entry.get("link"),
            "summary": entry.get("summary"),
            "published": entry.get("published_parsed") or entry.get("updated_parsed"), # Parsed time tuple
            "published_original_string": entry.get("published") or entry.get("updated"), # Original string
            "id": entry.get("id"),
            # Add other fields as needed, e.g., author, content, etc.
        })

    logger.info(f"Prepared {len(items_to_send)} items from the feed to send to n8n.")

    if send_to_n8n(n8n_webhook_url, items_to_send):
        logger.info("Successfully sent feed items to n8n.")
        return True
    else:
        logger.error("Failed to send feed items to n8n.")
        return False

def main():
    # Load environment variables from .env file if it exists
    # This allows N8N_WEBHOOK_URL to be set in .env
    load_dotenv()

    parser = argparse.ArgumentParser(description="Fetch an RSS feed and send its items to an n8n webhook.")
    parser.add_argument("rss_url", help="The URL of the RSS feed to fetch.")
    parser.add_argument(
        "--n8n_url",
        help="The n8n webhook URL. If not provided, script will try to use N8N_WEBHOOK_URL from environment variables.",
        default=os.getenv("N8N_WEBHOOK_URL") # Get from env var if set
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Enable debug logging."
    )

    args = parser.parse_args()

    if args.debug:
        # Set all loggers to DEBUG level.
        # You might want finer control for specific modules in a larger app.
        logging.getLogger().setLevel(logging.DEBUG)
        for handler in logging.getLogger().handlers:
            handler.setLevel(logging.DEBUG)
        logger.info("Debug logging enabled.")


    if not args.n8n_url:
        logger.error("n8n webhook URL is not provided via argument or N8N_WEBHOOK_URL environment variable.")
        parser.print_help()
        sys.exit(1)

    if not args.rss_url: # Should be caught by argparse as it's a positional arg
        logger.error("RSS Feed URL is a required argument.")
        parser.print_help()
        sys.exit(1)

    success = process_feed_to_n8n(args.rss_url, args.n8n_url)

    if success:
        logger.info("Process completed successfully.")
        sys.exit(0)
    else:
        logger.error("Process failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
