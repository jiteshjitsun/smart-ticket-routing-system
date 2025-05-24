import sys
import json
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

def train_model():
    training_data_path = os.path.join(script_dir, "training_data.json")
    model_path = os.path.join(script_dir, "model.pkl")
    
    with open(training_data_path) as f:
        data = json.load(f)

    texts = [item["summary"] + " " + item["description"] for item in data]
    labels = [item["team"] for item in data]

    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(texts)

    clf = MultinomialNB()
    clf.fit(X, labels)

    joblib.dump((vectorizer, clf), model_path)
    print(f"Model trained and saved to {model_path}")

def predict(text):
    model_path = os.path.join(script_dir, "model.pkl")
    
    if not os.path.exists(model_path):
        print("Error: Model not found. Please train the model first.")
        sys.exit(1)
    
    vectorizer, clf = joblib.load(model_path)
    X = vectorizer.transform([text])
    prediction = clf.predict(X)
    print(prediction[0])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 team_classifier.py [train|predict] [text]")
        sys.exit(1)
        
    if sys.argv[1] == "train":
        train_model()
    elif sys.argv[1] == "predict":
        if len(sys.argv) < 3:
            print("Error: Please provide text to predict")
            sys.exit(1)
        input_text = sys.argv[2]
        predict(input_text)
