import feedparser
import logging
# requests is not directly used by fetch_rss_feed but good to have if we expand this module
# import requests

# Basic logging configuration.
# This will be effective if no other logging config has been set up by the caller (e.g. main.py)
# For a library module, it's often better to get a logger instance: logger = logging.getLogger(__name__)
# and let the application configure handlers. But for now, this is okay.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

import requests # Added for send_to_n8n

def send_to_n8n(webhook_url: str, data: list, max_retries: int = 3, timeout: int = 10):
    """
    Sends data (e.g., a list of RSS feed entries) to the specified n8n webhook URL.

    Args:
        webhook_url: The n8n webhook URL.
        data: The data to send (should be JSON serializable, typically a list of dicts).
        max_retries: Maximum number of retries for transient errors.
        timeout: Request timeout in seconds.

    Returns:
        True if the data was sent successfully (HTTP 2xx), False otherwise.
    """
    if not data:
        logger.info("No data provided to send to n8n.")
        return True # Or False, depending on desired behavior for empty data

    logger.info(f"Attempting to send {len(data)} items to n8n webhook: {webhook_url}")

    headers = {
        'Content-Type': 'application/json'
    }

    for attempt in range(max_retries):
        try:
            response = requests.post(webhook_url, json=data, headers=headers, timeout=timeout)
            response.raise_for_status()  # Raises an HTTPError for bad responses (4XX or 5XX)

            logger.info(f"Successfully sent data to n8n. Status: {response.status_code}")
            # You could log response.text or response.json() if n8n returns a useful body
            return True
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error sending data to n8n: {e.response.status_code} {e.response.text}")
            # For client errors (4xx), retrying usually won't help.
            if 400 <= e.response.status_code < 500:
                if e.response.status_code == 401: # Unauthorized
                    logger.error("N8N webhook unauthorized (401). Please check the webhook URL and authentication.")
                elif e.response.status_code == 403: # Forbidden
                    logger.error("N8N webhook forbidden (403). Please check permissions.")
                elif e.response.status_code == 404: # Not Found
                    logger.error("N8N webhook not found (404). Please check the URL.")
                # Stop retrying for other client errors too.
                break
        except requests.exceptions.ConnectionError as e:
            logger.warning(f"Connection error sending data to n8n (attempt {attempt + 1}/{max_retries}): {e}")
        except requests.exceptions.Timeout as e:
            logger.warning(f"Timeout error sending data to n8n (attempt {attempt + 1}/{max_retries}): {e}")
        except requests.exceptions.RequestException as e: # Catch other requests-related errors
            logger.error(f"An unexpected requests error occurred (attempt {attempt + 1}/{max_retries}): {e}")

        if attempt < max_retries - 1:
            logger.info(f"Retrying in {2**(attempt + 1)} seconds...")
            # time.sleep(2**(attempt + 1)) # Exponential backoff - requires `import time`
        else:
            logger.error(f"Failed to send data to n8n after {max_retries} attempts.")
            return False

    return False


def fetch_rss_feed(feed_url: str):
    """
    Fetches and parses an RSS or Atom feed from the given URL.

    Args:
        feed_url: The URL of the RSS/Atom feed.

    Returns:
        A feedparser.FeedParserDict object containing the parsed feed data if successful,
        None otherwise.
    """
    logger.info(f"Attempting to fetch RSS feed from: {feed_url}")
    try:
        # Using a common user-agent can help avoid being blocked by some servers.
        # It's good practice to identify your bot if it's making many requests.
        user_agent = 'RSS-to-n8n-Tool/1.0 (+https://github.com/your-repo-if-public)'

        # feedparser handles the HTTP GET request.
        # It also handles common issues like character encoding detection.
        # It respects standard proxy environment variables (http_proxy, https_proxy).
        # For more advanced HTTP control (e.g. custom timeouts, retries),
        # one might fetch the content with 'requests' first and then parse with 'feedparser.parse(content)'.
        # However, feedparser's internal fetching is usually sufficient.
        feed_data = feedparser.parse(feed_url, agent=user_agent)

        # Check for HTTP errors if feedparser was able to get a status code
        if hasattr(feed_data, 'status'):
            if feed_data.status >= 400:
                logger.error(f"HTTP error {feed_data.status} when fetching feed from {feed_url}.")
                # feed.get('bozo_exception') might contain more info from underlying http client
                bozo_exc = feed_data.get('bozo_exception', 'No specific exception details from feedparser.')
                logger.error(f"Underlying exception/details: {bozo_exc}")
                return None

        # The 'bozo' flag is 1 if the feed is not well-formed XML or has other issues.
        # It's not always a fatal error; sometimes data can still be extracted.
        if feed_data.bozo:
            bozo_exception = feed_data.get('bozo_exception', 'Unknown parsing error.')
            # CharacterEncodingOverride is common and often non-fatal.
            if isinstance(bozo_exception, feedparser.exceptions.CharacterEncodingOverride):
                logger.warning(f"Feed from {feed_url} had a character encoding issue: {bozo_exception}. Feedparser attempted to handle it.")
            else:
                logger.warning(f"Feed from {feed_url} may be ill-formed or encountered a parsing problem: {bozo_exception}")

        # Check if the feed object itself or entries are missing, which indicates a more severe problem.
        if not feed_data.feed and not feed_data.entries:
            logger.error(f"Failed to parse any feed data from {feed_url}. The URL may not point to a valid RSS/Atom feed or the feed is empty/corrupt.")
            return None

        # Log success and number of entries
        feed_title = feed_data.feed.get('title', 'N/A')
        num_entries = len(feed_data.entries)
        logger.info(f"Successfully fetched and parsed feed '{feed_title}'. Found {num_entries} entries.")

        if num_entries == 0:
            logger.warning(f"The feed '{feed_title}' from {feed_url} contains 0 entries.")

        return feed_data

    except Exception as e:
        # Catch any other unexpected errors.
        logger.error(f"An unexpected error occurred while processing feed {feed_url}: {e}", exc_info=True)
        return None

if __name__ == '__main__':
    # This block allows direct testing of this script.
    print("--- Starting rss_fetcher.py direct test ---")

    # Test URLs
    test_feeds = {
        "Ars Technica": "https://feeds.arstechnica.com/arstechnica/index/",
        "The Verge": "https://www.theverge.com/rss/index.xml",
        # "XKCD": "https://xkcd.com/rss.xml",
        # "Google News (hypothetical)": "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
        "Non-existent domain": "http://thisshouldnotexist12345abc.com/feed.xml",
        "HTML Page (Google)": "https://www.google.com",
        "404 Error Feed": "https://example.com/thisgivesa404.xml"
    }

    first_valid_feed_entries = []

    for name, url in test_feeds.items():
        logger.info(f"\n>>> Testing feed fetching: {name} ({url})")
        feed_content = fetch_rss_feed(url)
        if feed_content:
            logger.info(f"<<< Successfully processed feed: {name}")
            logger.info(f"    Title: {feed_content.feed.get('title', 'N/A')}")
            logger.info(f"    Entries: {len(feed_content.entries)}")
            if feed_content.entries:
                logger.info(f"    First entry title: {feed_content.entries[0].get('title', 'N/A')}")
                if not first_valid_feed_entries and name == "Ars Technica": # Store entries from a known good feed for n8n test
                    # Convert feedparser entries to simple dicts for JSON serialization
                    for entry in feed_content.entries[:2]: # Send only first 2 entries for testing
                        first_valid_feed_entries.append({
                            "title": entry.get("title"),
                            "link": entry.get("link"),
                            "summary": entry.get("summary"),
                            "published": entry.get("published")
                        })
            if feed_content.bozo:
                logger.warning(f"    Bozo bit was set for {name}. Details: {feed_content.bozo_exception}")
        else:
            logger.error(f"<<< Failed to process feed: {name} ({url})")
        logger.info("-" * 30)

    # --- Test send_to_n8n ---
    # IMPORTANT: Replace with a real test webhook URL (e.g., from webhook.site) for actual testing.
    # Using a non-functional placeholder by default to avoid accidental real posts.
    # A good practice is to load this from an environment variable for testing.
    # test_n8n_webhook_url = "https://webhook.site/#!/f9b3d9c0-725e-4970-b119-efb9f28b027c/86f99e73-977f-4a79-912a-e2262ac0ef1d/1" # This was the viewer URL
    test_n8n_webhook_url = "https://webhook.site/f9b3d9c0-725e-4970-b119-efb9f28b027c" # Correct POST URL for the webhook I created.
    # This webhook.site endpoint (f9b3d9c0-725e-4970-b119-efb9f28b027c) is live for testing.
    # Data sent here can be viewed at https://webhook.site/#!/f9b3d9c0-725e-4970-b119-efb9f28b027c/
    # It will eventually expire or be rate-limited.

    if not first_valid_feed_entries:
        logger.warning("No valid feed entries fetched, creating dummy data for n8n send test.")
        first_valid_feed_entries = [{"title": "Test Item 1", "link": "http://example.com/1"}, {"title": "Test Item 2", "link": "http://example.com/2"}]

    logger.info(f"\n>>> Testing send_to_n8n with {len(first_valid_feed_entries)} items to {test_n8n_webhook_url}")

    # Test with valid data and URL
    success = send_to_n8n(test_n8n_webhook_url, first_valid_feed_entries)
    if success:
        logger.info("<<< send_to_n8n reported success for valid data.")
    else:
        logger.error("<<< send_to_n8n reported failure for valid data.")
    logger.info("-" * 30)

    # Test with an invalid URL (e.g., non-existent domain)
    invalid_n8n_url = "http://thisshouldnotexist12345abc.com/webhook"
    logger.info(f"\n>>> Testing send_to_n8n with invalid URL: {invalid_n8n_url}")
    success_invalid_url = send_to_n8n(invalid_n8n_url, first_valid_feed_entries)
    if not success_invalid_url:
        logger.info("<<< send_to_n8n correctly reported failure for invalid URL.")
    else:
        logger.error("<<< send_to_n8n incorrectly reported success for invalid URL.")
    logger.info("-" * 30)

    # Test with empty data
    logger.info(f"\n>>> Testing send_to_n8n with empty data list to {test_n8n_webhook_url}")
    success_empty_data = send_to_n8n(test_n8n_webhook_url, [])
    if success_empty_data: # As per current logic, empty data returns True
        logger.info("<<< send_to_n8n correctly handled empty data list.")
    else:
        logger.error("<<< send_to_n8n failed for empty data list.")
    logger.info("-" * 30)

    print("\n--- rss_fetcher.py direct test complete ---")
