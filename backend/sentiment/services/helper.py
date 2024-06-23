# HELPER FUNCTIONS ! :)
import boto3
import json

post = "Homework 4 is due on Friday. I am so excited to submit it. I am sure I will get a good grade."
replies = [{"role": "student", "content": "I am excited"}, {"role": "teacher", "content": "I am excited too"}]
topics = ["homework", "project", "exam"]

# initialize aws bedrock
bedrock_client = boto3.client('bedrock-runtime')

# User facing
def post():
    return

def reply():
    return

# instructor facing
def submit_topics():
    return 

# helper functions for sentiment analysis
def get_reply_topic(post):
    payload = json.dumps({
        "text": post,
        "action": "classify",
        "labels": topics
    })
    response = bedrock_client.invoke_model(
        modelId='amazon.titan-tg1-large',
        body=payload
    )
    print(response)
    result = json.loads(response['body'])['classification']['best']
    return result

# === main ===
best_topic = get_reply_topic(post)
print(f"The best topic for the post is: {best_topic}")