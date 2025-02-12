import joblib
import pandas as pd
import spacy

# temporary warning supresssion for mismatched scikit-learn versions
import warnings
warnings.simplefilter("ignore", category=UserWarning)

nlp = spacy.load("en_core_web_sm")
nlp.max_length = 1500000

# load the logistic regression model and trained vectorizer
model = joblib.load("data/joblib/large_data_log.joblib")
vectorizer = joblib.load("data/joblib/vectorizer.joblib")


# tokenize and lemmatize the given text
def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    doc = nlp(text)
    processed_tokens = [
        token.lemma_ for token in doc if not token.is_stop and not token.is_punct
    ]
    return " ".join(processed_tokens)


# used to turn raw article body into a feature vector
def preprocess_article(article_body):
    preprocessed_text = preprocess_text(article_body)
    feature_vector = vectorizer.transform([preprocessed_text])

    return feature_vector


# get the political classification of the article
def classify(article_body):
    vectorized_article = preprocess_article(article_body)
    vectorized_article_dense = vectorized_article.toarray()
    prediction = model.predict(vectorized_article_dense)

    return prediction[0]


# get the words that contributed most to the classification of the article
def get_top_words(article_body, top_n=100):
    preprocessed_text = preprocess_text(article_body)
    feature_vector = vectorizer.transform([preprocessed_text])

    # get the non-zero entries (and words) in the 1 x n feature vector
    non_zero_indices = feature_vector.nonzero()[1]
    feature_names = vectorizer.get_feature_names_out()
    coefficients = model.coef_[0]

    word_coefficients = [(feature_names[i], coefficients[i]) for i in non_zero_indices]

    # sort the words by their coefficient values (magnitude) in descending order
    sorted_word_coefficients = sorted(
        word_coefficients, key=lambda x: abs(x[1]), reverse=True
    )

    top_words = [word for word, _ in sorted_word_coefficients[:top_n]]

    return top_words


# get final results of the NLP and ML analysis
def get_analysis_results(article_body):
    prediction = classify(article_body)
    top_words = get_top_words(article_body)

    return prediction, top_words
