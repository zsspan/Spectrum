from bs4 import BeautifulSoup
import requests


def get_soup_object(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL {url}: {e}")
        return ""

    html_content = response.text
    soup = BeautifulSoup(html_content, "html.parser")
    
    return soup


def get_article_body(url):
    soup = get_soup_object(url)

    article = soup.find("article")
    if article:
        body = article.get_text(separator="\n", strip=True)
        print("method 1 worked")
        return body

    common_classes = [
        "article-body",
        "content",
        "post-content",
        "entry-content",
        "article-content",
    ]

    for class_name in common_classes:
        div = soup.find("div", class_=class_name)
        if div:
            body = div.get_text(separator="\n", strip=True)
            print("method 2 worked")
            return body

    all_divs = soup.find_all("div")
    largest_div = max(
        all_divs, key=lambda div: len(div.get_text(strip=True)), default=None
    )
    if largest_div:
        body = largest_div.get_text(separator="\n", strip=True)
        print("method 3 worked")
        return body

    return "Article body not found :("
