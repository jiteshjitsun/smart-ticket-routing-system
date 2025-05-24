# team_classifier.py
import sys
import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

def train_model():
    with open("training_data.json") as f:
        data = json.load(f)

    texts = [item["summary"] + " " + item["description"] for item in data]
    labels = [item["team"] for item in data]

    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(texts)

    clf = MultinomialNB()
    clf.fit(X, labels)

    joblib.dump((vectorizer, clf), "model.pkl")

def predict(text):
    vectorizer, clf = joblib.load("model.pkl")
    X = vectorizer.transform([text])
    prediction = clf.predict(X)
    print(prediction[0])

if __name__ == "__main__":
    if sys.argv[1] == "train":
        train_model()
    elif sys.argv[1] == "predict":
        input_text = sys.argv[2]
        predict(input_text)
