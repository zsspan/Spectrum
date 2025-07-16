from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse
from .article_classify import get_analysis_results
from .article_parse import get_article_body, get_soup_object

app = Flask(__name__)
CORS(app)


# using the URL provided in the request, the function extracts the article name and publisher name
@app.route("/current-article", methods=["POST"])
def current_article():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    soup = get_soup_object(url)
    if soup == "":
        return jsonify({"error": "Invalid URL"}), 400

    h1_tag = soup.find('h1')
    title_tag = soup.find('title')
    article_name = h1_tag.get_text() if h1_tag else (title_tag.get_text() if title_tag else "No article name found")

    meta_tag = soup.find("meta", property="og:site_name") or soup.find("meta", attrs={"name": "publisher"}) or soup.find(
        "meta", attrs={"name": "application-name"})
    domain_tag = urlparse(url).netloc.replace("www.", "").split(".")[0].upper()
    publisher = meta_tag.get("content") if meta_tag else domain_tag if domain_tag else "No publisher found"

    return jsonify({"article_name": article_name, 'publisher': publisher})


# article-parse endpoint takes the URL of an article and categorizes political bias of the article
@app.route("/article-parse", methods=["POST"])
def article_content():
    data = request.get_json()
    url = data.get("url")
    print("url: ", url)

    article_body = get_article_body(url)
    # prediction = predict(article_body).capitalize()

    prediction, top_words = get_analysis_results(article_body)
    prediction = prediction.capitalize()

    # print("top words: ", top_words)
    # print("predicted: ", prediction)
    return jsonify({'prediction': prediction, 'top_words': top_words})


# add status check endpoint
@app.route('/health')
def health_check():
    return "OK", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
