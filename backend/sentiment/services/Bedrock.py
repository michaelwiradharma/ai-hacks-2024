import boto3
import json

# Initialize the boto3 client for bedrock-runtime
class AWSBedrock:
    def __init__(self):
        self.br = boto3.client(service_name='bedrock-runtime')

    def get_reply(self, input_text):
        body = json.dumps({
            'inputText': input_text
        })

        response = self.br.invoke_model(
            modelId='amazon.titan-tg1-large', 
            body=body
        )

        response_body = json.loads(response.get("body").read())
        print(f"Input token count: {response_body['inputTextTokenCount']}")
        for result in response_body['results']:
            print(f"Token count: {result['tokenCount']}")
            print(f"Output text: {result['outputText']}")
            print(f"Completion reason: {result['completionReason']}")
        
        return response_body['results'][0]['outputText']


# create model
aws = AWSBedrock()
aws.get_reply("I am excited to submit my homework on Friday")

# Make the model invocation call


