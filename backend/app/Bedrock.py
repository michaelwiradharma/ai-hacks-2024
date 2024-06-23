from .constants import *
import boto3
import json
import logging

from botocore.exceptions import ClientError

class AWSBedrock:
    def __init__(self):
        self.br = boto3.client(service_name='bedrock-runtime', 
                                region_name='us-east-1', 
                                aws_access_key_id=AWS_ACCESS_KEY, 
                                aws_secret_access_key=AWS_SECRET_KEY)

    def generate_message(self, model_id, system_prompt, messages, max_tokens):
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "system": system_prompt,
            "messages": messages
        })

        response = self.br.invoke_model(body=body, modelId=model_id)
        response_body = json.loads(response.get('body').read())
        return response_body

    def get_reply(self, input_text):
        model_id = 'anthropic.claude-3-sonnet-20240229-v1:0'
        system_prompt = "Please respond with text"
        max_tokens = 1000

        # Prompt with user turn only
        user_message = {"role": "user", "content": input_text}
        messages = [user_message]

        response = self.generate_message(model_id, system_prompt, messages, max_tokens)
        return response.get('content')[0].get('text')

    def get_reply_anthr(self, input_text):
        body = json.dumps({
            "prompt": "\n\nHuman: " + input_text + "\n\nAssistant:",
            "max_tokens_to_sample": 300,
            "temperature": 0.1,
            "top_p": 0.9,
        })

        model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0'
        accept = 'application/json'
        content_type = 'application/json'

        response = self.br.invoke_model(body=body, modelId=model_id, accept=accept, contentType=content_type)
        response_body = json.loads(response.get('body').read())
        return response_body.get('completion')


