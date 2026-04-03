from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load dataset (default resumes)
data = pd.read_csv('resumes.csv')
default_resumes = data['resume'].tolist()

@app.route('/')
def home():
    return "Backend is running!"

@app.route('/rank', methods=['POST'])
def rank_resumes():
    data_json = request.json

    job_desc = data_json.get('job_description', '')
    
    # 👇 NEW: check if frontend sent resumes
    resumes = data_json.get('resumes')

    # If no resumes sent → use CSV resumes
    if not resumes:
        resumes = default_resumes

    # Convert to vectors
    vectorizer = TfidfVectorizer(stop_words='english')
    resume_vectors = vectorizer.fit_transform(resumes)

    job_vector = vectorizer.transform([job_desc])
    similarity = cosine_similarity(job_vector, resume_vectors).flatten()

    ranked = sorted(
        list(enumerate(similarity)),
        key=lambda x: x[1],
        reverse=True
    )

    results = [
        {"resume": resumes[i], "score": float(score)}
        for i, score in ranked
    ]

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)