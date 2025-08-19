from flask import Flask, request, jsonify
from flask_cors import CORS
from blockchain_service import submit_article, vote_article, get_article

app = Flask(__name__)
CORS(app)

@app.route("/submit-article", methods=["POST"])
def api_submit_article():
    data = request.get_json()
    title = data.get('title')
    article_hash = data.get('article_hash')

    if not title or not article_hash:
        return jsonify({"error": "Missing title or article_hash"}), 400

    try:
        tx_hash = submit_article(title, article_hash)
        return jsonify({"tx_hash": tx_hash}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/vote-article", methods=["POST"])
def api_vote_article():
    data = request.get_json()
    try:
        article_id = int(data.get("article_id"))
        upvote = bool(data.get("upvote"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid input data"}), 400

    try:
        tx_hash = vote_article(article_id, upvote)
        return jsonify({"tx_hash": tx_hash}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-article/<int:article_id>", methods=["GET"])
def api_get_article(article_id):
    try:
        article = get_article(article_id)
        return jsonify({
            "title": article[0],
            "hash": article[1],
            "submittedBy": article[2],
            "upvotes": article[3],
            "downvotes": article[4],
            "verified": article[5]
        }), 200
    except IndexError:
        return jsonify({"error": "Article ID out of bounds"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
