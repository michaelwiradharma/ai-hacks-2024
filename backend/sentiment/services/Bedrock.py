import boto3
import json

# Initialize the boto3 client for bedrock-runtime
class AWSBedrock:
    def __init__(self):
        self.br = boto3.client(service_name='bedrock-runtime')
        self.anthr = boto3.client(service_name='anthropic.claude-v2')

    def get_reply(self, input_text):
        body = json.dumps({
            'inputText': input_text
        })

        response = self.br.invoke_model(
            modelId='amazon.titan-tg1-large', 
            body=body
        )

        response_body = json.loads(response.get("body").read())
        # print(f"Output text: {response_body['results'][0]['outputText']}")
        
        return response_body['results'][0]['outputText']
    
    def get_reply_anthr(self, input_text):
        {
            "prompt": "\n\nHuman:<prompt>\n\nAssistant:",
            "temperature": float,
            "top_p": float,
            "top_k": int,
            "max_tokens_to_sample": int,
            "stop_sequences": [string]
        }
        
        body = json.dumps({
            'inputText': input_text
        })

        response = self.br.invoke_model(
            modelId='amazon.titan-tg1-large', 
            body=body
        )

        response_body = json.loads(response.get("body").read())
        # print(f"Output text: {response_body['results'][0]['outputText']}")
        
        return response_body['results'][0]['outputText']


