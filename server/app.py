from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from flask_cors import CORS
import requests
from urllib.parse import urlparse

import joblib

from text_process import preprocess_article

app = Flask(__name__)
CORS(app)

def get_soup_object(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    response = requests.get(url, headers=headers)
    html_content = response.text
    
    # with open("article.html", "w", encoding="utf-8") as file:
    #     file.write(html_content)
    
    soup = BeautifulSoup(html_content, 'html.parser')
    return soup

def get_article_body(url):
    soup = get_soup_object(url)

    """ Three method approach
        1. find simple article tag
        2. look for common article tags
        3. search maximum length text div
    """

    article = soup.find('article')
    if article:
        body = article.get_text(separator="\n", strip=True)
        print('method 1 worked')
        return body

    common_classes = ['article-body', 'content', 'post-content', 'entry-content', 'article-content']
    for class_name in common_classes:
        div = soup.find('div', class_=class_name)
        if div:
            body = div.get_text(separator="\n", strip=True)
            print('method 2 worked')
            return body

    all_divs = soup.find_all('div')
    largest_div = max(all_divs, key=lambda div: len(div.get_text(strip=True)), default=None)
    if largest_div:
        body = largest_div.get_text(separator="\n", strip=True)
        print('method 3 worked')
        return body

    return "Article body not found :("


def predict(article_body):
    model = joblib.load("data/large_data_log.joblib")
    vectorized_article = preprocess_article(article_body)
    vectorized_article_dense = vectorized_article.toarray()
    prediction = model.predict(vectorized_article_dense)

    return prediction

@app.route("/current-article", methods=["POST"])
def current_article():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    soup = get_soup_object(url)

    h1_tag = soup.find('h1')
    title_tag = soup.find('title')
    article_name = h1_tag.get_text() if h1_tag else (title_tag.get_text() if title_tag else "No article name found")

    meta_tag = soup.find("meta", property="og:site_name") or soup.find("meta", attrs={"name": "publisher"}) or soup.find("meta", attrs={"name": "application-name"})
    domain_tag = urlparse(url).netloc.replace("www.", "").split(".")[0].upper()
    publisher = meta_tag.get("content") if meta_tag else domain_tag if domain_tag else "No publisher found"

    return jsonify({"article_name": article_name, 'publisher': publisher})

@app.route("/article-content", methods=["POST"])
def article_content():
    data = request.get_json()
    url = data.get("url")

    article_body = get_article_body(url)
    print(predict(article_body))
    
    return jsonify({'prediction': url})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)