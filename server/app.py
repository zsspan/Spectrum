from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from flask_cors import CORS
import requests
from urllib.parse import urlparse


app = Flask(__name__)
CORS(app)

@app.route("/current-article", methods=["POST"])
def current_article():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    response = requests.get(url, headers=headers)
    html_content = response.text

    with open("article.html", "w", encoding="utf-8") as file:
        file.write(html_content)

    soup = BeautifulSoup(html_content, 'html.parser')
    h1_tag = soup.find('h1')
    title_tag = soup.find('title')
    article_name = h1_tag.get_text() if h1_tag else (title_tag.get_text() if title_tag else "No article name found")
    print(article_name)

    meta_tag = soup.find("meta", property="og:site_name") or soup.find("meta", attrs={"name": "publisher"}) or soup.find("meta", attrs={"name": "application-name"})
    domain_tag = urlparse(url).netloc.replace("www.", "").split(".")[0].upper()
    publisher = meta_tag.get("content") if meta_tag else domain_tag if domain_tag else "No publisher found"
    print("Publisher:", publisher)

    return jsonify({"article_name": article_name, 'publisher': publisher})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)