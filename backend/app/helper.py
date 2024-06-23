# HELPER FUNCTIONS ! :)
from .Bedrock import AWSBedrock
# post = "HW 01 is released and will be due Wednesday, June 26 at 11:59 pm. Please post question-specific questions in their respective threads, and post general questions below (submitting, autograder, etc.). Come to office hours if you have any further questions. Good luck! Q1: A Plus Abs B: #49 Q2: Two of Three: #50 Q3: Largest Factor: #51 Q4: Hailstone: #52 Topics covered include boolean logic like short circuiting, while loops, conditionals."

# replies = [
#     {"role": "student", "content": "I'm stuck on the first question where we need to print numbers from 1 to 10 using a loop. My loop isn't working as expected. What could I be missing?"},
#     {"role": "staff", "content": "Let’s troubleshoot your loop. Are you initializing your counter variable correctly and updating it within the loop? Also, ensure the condition allows the loop to terminate."},
#     {"role": "student", "content": "For the second question, I'm trying to make a simple calculator with different conditions, but it’s not handling all operations correctly. Any ideas on what I might be doing wrong?"},
#     {"role": "staff", "content": "Check the structure of your conditions. Are you correctly checking the operation types and handling each one? Also, ensure you’re capturing the user input properly."},
#     {"role": "student", "content": "I'm having trouble with the third question where we need to check if a number meets certain criteria. My conditions aren’t working together. What might I be missing?"},
#     {"role": "staff", "content": "Make sure you’re combining your conditions correctly. Are you checking if the number meets both criteria using the correct logical operator?"}
# ]

# topics = ["boolean logic", "short circuiting", "while loops", "conditionals", "office hours"]


'''HELPER FUNCTIONS'''
# Given a reply, what topic is it most related to.
def get_reply_topic(reply, topics):
    bedrock = AWSBedrock()
    prompt = f"Given the following reply, {reply['content']} which topic among these topics: {topics} does it most correlate to? ONLY ANSWER WITH THE TOPIC NAMES AND NO ADDITIONAL WORDS, ONLY ANSWER WITH TOPIC NAMES ALREADY GIVEN. "
    response = bedrock.get_reply(prompt)
    # print(response)

    # from response, get the topic name closest to it (since response could be a sentence sometimes?)
    best_topic = None
    best_score = 0
    for topic in topics:
        topic_lower = topic.lower()
        score = sum(word in response.lower() for word in topic_lower.split())

        if score > best_score:
            best_score = score
            best_topic = topic
    # print(best_topic)

    return best_topic

# Sort comments into its separate topics
# returns a dictionary of topics to the replies
def sort_replies(replies, topics):
    sorted_replies = {topic: [] for topic in topics} 
    
    for reply in replies:
        best_topic = get_reply_topic(reply, topics)
        sorted_replies[best_topic].append(reply)
    
    return sorted_replies

# sentiment analysis
def get_sentiment_of_post(post, sorted_replies, topics):
    bedrock = AWSBedrock()
    data_format = "{topic_n: confusion_score_n, ...}"

    prompt = f"Given these topics: {topics} and its correlated replies: {sorted_replies}, give a confusion_score ranging from 1-10. Return only an integer" + " Follow this format: {data_format}. An example is like this:" + "\n" + "{boolean logic: 5, short circuiting: 3, ...}"
    response = bedrock.get_reply(prompt)
    return response

# create a report (sentiment + summary) for instructor
# input: takes in a dictionary of topic: replies and topic: sentiment
def get_post_report(sorted_replies, sentiment, topics):
    bedrock = AWSBedrock()
    data_format = "{topic_n: summary, ...}"

    prompt = f"Given these topics: {topics} and its correlated replies: {sorted_replies} and confusion score: {sentiment}, write a summary about each topic. Follow this format: {data_format}."
    response = bedrock.get_reply(prompt)
    return response

# # === main ===
# sorted_replies = sort_replies(replies, topics)
# sentiment = get_sentiment_of_post(post, sorted_replies)
# print(get_post_report(sorted_replies, sentiment))
