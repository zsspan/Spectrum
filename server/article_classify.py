import joblib
import pandas as pd
import spacy

nlp = spacy.load("en_core_web_sm")
nlp.max_length = 1500000


def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    doc = nlp(text)
    processed_tokens = [
        token.lemma_ for token in doc if not token.is_stop and not token.is_punct
    ]

    return " ".join(processed_tokens)


def preprocess_article(article_body):
    # loading the fitted vectorizer
    vectorizer = joblib.load("data/joblib/vectorizer.joblib")

    preprocessed_text = preprocess_text(article_body)
    feature_vector = vectorizer.transform([preprocessed_text])

    return feature_vector


def predict(article_body):
    # loading the trained logistic regression model
    model = joblib.load("data/joblib/large_data_log.joblib")

    vectorized_article = preprocess_article(article_body)
    vectorized_article_dense = vectorized_article.toarray()
    prediction = model.predict(vectorized_article_dense)

    return prediction[0]
