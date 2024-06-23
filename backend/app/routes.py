from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from .models import User, Post, Reply
from .database import db
from sqlalchemy.sql import text

main = Blueprint('main', __name__)

@main.route('/add_user', methods=['POST'])
@cross_origin()
def add_user():
    # logic to add user
    return jsonify({"message": "User added"}), 201

@main.route('/posts/<int:post_id>/reply', methods=["POST"])
@cross_origin()
def add_reply(post_id):
    content = request.json.get('content')
    if not content:
        return jsonify({'error': 'No content'}), 400

    reply = Reply(post_id=post_id, content=content)
    db.session.add(reply)
    db.session.commit()
    response = jsonify({'message': 'Reply added successfully', 'reply_id': reply.reply_id})
    response.headers.add('Content-Security-Policy', "default-src 'self' https://trusty-mistakenly-mudfish.ngrok-free.app")
    return response, 201

@main.route('/posts/', methods=["GET"])
@cross_origin()
def get_posts():
    with db.engine.connect() as connection:
        query = text('SELECT * FROM posts')
        rows = connection.execute(query)
        result = [{column: value for column, value in row._mapping.items()} for row in rows]
    response = jsonify(result)
    response.headers.add('Content-Security-Policy', "default-src 'self' https://trusty-mistakenly-mudfish.ngrok-free.app")
    return response, 201

# @main.route('/posts/', methods=["POST"])
# def add_post():
#     data = request.json;
#     content = data.get('content')

#     reply = Reply(post_id=post_id, content=content)
#     db.session.add(reply)
#     db.session.commit()
#     return jsonify({'message': 'Reply added successfully', 'reply_id': reply.reply_id}), 201

@main.route('/')
def hello():
    return "hello, worlds"