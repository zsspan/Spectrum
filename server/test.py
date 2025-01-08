from bs4 import BeautifulSoup
import requests

def home():
    url = "https://www.msnbc.com/know-your-value/career-growth/self-help-expert-gabrielle-bernstein-says-ditch-new-years-resolutions-rcna186619"

    response = requests.get(url)
    html_content = response.text

    with open("article.html", "w", encoding="utf-8") as file:
        file.write(html_content)

    soup = BeautifulSoup(html_content, 'html.parser')
    h1_tag = soup.find('h1')

    article_name = h1_tag.get_text() if h1_tag else "No article name found"
    
    print(article_name)

home()

#CNN, Fox,