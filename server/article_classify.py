import joblib
import pandas as pd
import spacy
import numpy as np

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


def get_top_words(article_body, top_n=50):
    # load the fitted vectorizer and model
    vectorizer = joblib.load("data/joblib/vectorizer.joblib")
    model = joblib.load("data/joblib/large_data_log.joblib")

    preprocessed_text = preprocess_text(article_body)
    feature_vector = vectorizer.transform([preprocessed_text])
    
    # get the non-zero entries (and words) in the 1 x n feature vector
    non_zero_indices = feature_vector.nonzero()[1]
    feature_names = vectorizer.get_feature_names_out()
    coefficients = model.coef_[0]

    word_coefficients = [(feature_names[i], coefficients[i]) for i in non_zero_indices]

    # sort the words by their coefficient values (magnitude) in descending order
    sorted_word_coefficients = sorted(word_coefficients, key=lambda x: abs(x[1]), reverse=True)

    top_words = sorted_word_coefficients[:top_n]

    return top_words


def predict_with_top_words(article_body):
    prediction = predict(article_body)
    top_words = get_top_words(article_body)

    return prediction, top_words
