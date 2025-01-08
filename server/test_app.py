# Barron's, The Independent
from urllib.parse import urlparse

# Example URL
url = "https://www.bbc.com/news/world-62116336"
domain = urlparse(url).netloc  # Extract domain, e.g., 'www.bbc.com'

# Simplify the domain name to get the news organization
domain = urlparse(url).netloc
news_org = domain.replace("www.", "").split(".")[0].capitalize()
print("News Organization:", news_org)
