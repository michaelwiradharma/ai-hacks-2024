# backend/app/routes.api
from flask import Blueprint, request, jsonify
from flask_cors import CORS, cross_origin
from .models import User, Post, Reply
from .database import db
from sqlalchemy.sql import text
from .helper import get_reply_topic, sort_replies, get_sentiment_of_post, get_post_report  # Import helper functions

main = Blueprint('main', __name__)
CORS(main)

# returns userid from username
def get_userid(user):
    with db.engine.connect() as connection:
        query = text('SELECT * FROM users WHERE username = :username LIMIT 1');
        rows = connection.execute(query, {'username': user})
    result = [{column: value for column, value in row._mapping.items()} for row in rows]
    return result


@main.route('/add_user', methods=['POST'])
def add_user():
    # logic to add user
    return jsonify({"message": "User added"}), 201


# replies POST
@main.route('/posts/<int:post_id>/reply', methods=["POST"])
def add_reply(post_id):
    parent_reply_id = request.json.get("parent_reply_id")
    if not parent_reply_id:
        parent_reply_id = None
    content = request.json.get('content')
    if not content:
        return jsonify({'error': 'No content'}), 400
    user = request.json.get('user') # 'peyrinkao' or 'matthewkao'
    if not user:
        return jsonify({'error': 'No user'}), 400
    result = get_userid(user)
    if len(result) == 0:
        return jsonify({'error': 'No such user found'}), 400
    user = result[0]['id']

    reply = Reply(post_id=post_id, content=content, user_id=user, parent_reply_id=parent_reply_id)
    db.session.add(reply)
    db.session.commit()
    return jsonify({'message': 'Reply added successfully', 'reply_id': reply.id}), 201

# replies GET
@main.route('/posts/<int:post_id>/reply', methods=["GET"])
def get_replies(post_id):
    with db.engine.connect() as connection:
        query = text('SELECT replies.id, username, user_type, replies.created_at, content, parent_reply_id FROM replies, users WHERE post_id = :post_id AND replies.user_id = users.id ORDER BY replies.created_at ASC')
        rows = connection.execute(query, {'post_id': post_id})
    result = [{column: value for column, value in row._mapping.items()} for row in rows]
    hashmap = {res['id']: res for res in result}
    organized_result = []
    for res in result:
        if res['parent_reply_id'] == None:
            organized_result.append(res)
        else:
            parent = res['parent_reply_id']
            if 'replies' not in hashmap[parent].keys():
                hashmap[parent]['replies'] = []
            hashmap[parent]['replies'].append(res)
    return jsonify(organized_result), 201


# posts POST
@main.route('/posts/', methods=["POST"])
def add_post(post_id):
    content = request.json.get('content')
    if not content:
        return jsonify({'error': 'No content'}), 400
    title = request.json.get('title')
    if not title:
        return jsonify({'error': 'No title'}), 400
    user = request.json.get('user') # 'peyrinkao' or 'matthewkao'
    if not user:
        return jsonify({'error': 'No user'}), 400
    if user not in ['peyrinkao', 'matthewkao']:
        return jsonify({'error': 'No such user found'}), 400
    with db.engine.connect() as connection:
        query = text('SELECT * FROM users WHERE id = :user_id LIMIT 1');
        rows = connection.execute(query, user)
    result = [{column: value for column, value in row._mapping.items()} for row in rows]
    if len(result) == 0:
        return jsonify({'error': 'No such user found'}), 400     
    user = result[0]['id']

    # create new post row
    post = Post(user_id=user, title=title, content=content)
    db.session.add(post)
    db.session.commit()
    return jsonify({'message': 'Post added successfully', 'post_id': post.id}), 201

# posts GET
@main.route('/posts', methods=["GET"])
def get_posts():
    with db.engine.connect() as connection:
        query = text('SELECT posts.id, content, title, posts.created_at, username, user_type FROM posts, users WHERE posts.user_id = users.id')
        rows = connection.execute(query)
    result = [{column: value for column, value in row._mapping.items()} for row in rows]
    response = jsonify(result)
    return response, 201


@main.route('/')
def hello():
    return "hello, worlds"

# Get the sentiment of a post
# Input: post_id
@main.route('/get_sentiment', methods=["POST"])
def get_sentiment():
    data = request.json
    post_content = data.get("post")
    post_id = data.get("post_id")
    if not post_id:
        return jsonify({'error': 'No post_id'}), 400

    with db.engine.connect() as connection:
        replies = text('SELECT content FROM replies WHERE post_id = :post_id')
        rows = connection.execute(replies, {'post_id': post_id})
    replies = [{column: value for column, value in row._mapping.items()} for row in rows]
    print(replies)

    with db.engine.connect() as connection:
        topics = text('SELECT name FROM topics')
        rows = connection.execute(topics)
    topics = [{column: value for column, value in row._mapping.items()} for row in rows]
    topics = [topic['name'] for topic in topics]
    sorted_replies = sort_replies(replies, topics)
    result = get_sentiment_of_post(post_content, sorted_replies, topics)
    return jsonify(result), 200


@main.route('/get_report', methods=["POST"])
def get_report():
    return

@main.route('/get_topics/<int:reply_id>/reply', methods=["GET"])
def get_topics(reply_id):
    with db.engine.connect() as connection:
        query = text('SELECT * FROM posts, users WHERE reply_id = :reply_id')
        rows = connection.execute(query)
    response = get_reply_topic(rows)
    if not response:
        return jsonify({'error': 'Failed to get topic from Bedrock'}), 500
    return jsonify({'topic': response}), 200

@main.route('/get_sorted_replies', methods=["GET"])
def get_sorted_replies():

    return