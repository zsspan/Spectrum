import joblib
import pandas as pd
import spacy

nlp = spacy.load('en_core_web_sm')
nlp.max_length = 1500000
from sklearn.feature_extraction.text import TfidfVectorizer


def preprocess_text(text):
    if not isinstance(text, str):
        return ''
    doc = nlp(text)
    processed_tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct]
    return ' '.join(processed_tokens)

def preprocess_article(article_body):
    preprocessed_text = preprocess_text(article_body)
    vectorizer = joblib.load('data/vectorizer.joblib')

    x = vectorizer.transform([preprocessed_text])
    return x
