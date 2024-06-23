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
        # print(f"Output text: {response_body['results'][0]['outputText']}")
        
        return response_body['results'][0]['outputText']
    
    def get_reply_anthr(self, input_text):
        body = json.dumps({
            "prompt": "\n\nHuman: " + input_text + "\n\nAssistant:",
            "max_tokens_to_sample": 300,
            "temperature": 0.1,
            "top_p": 0.9,
        })

        modelId = 'anthropic.claude-v2'
        accept = 'application/json'
        contentType = 'application/json'

        response = self.br.invoke_model(body=body, modelId=modelId, accept=accept, contentType=contentType)

        response_body = json.loads(response.get('body').read())

        # text
        #print(response_body.get('completion'))
        
        return response_body.get('completion')


# prompt = {
#     "prompt": "\n\nHuman:<prompt>\n\nAssistant:",
#     "temperature": float,
#     "top_p": float,
#     "top_k": int,
#     "max_tokens_to_sample": int,
#     "stop_sequences": [string]
# }

# THIS IS WORKING
# brt = boto3.client(service_name='bedrock-runtime')
# body = json.dumps({
#     "prompt": "\n\nHuman: explain black holes to 8th graders\n\nAssistant:",
#     "max_tokens_to_sample": 300,
#     "temperature": 0.1,
#     "top_p": 0.9,
# })

# modelId = 'anthropic.claude-sonnet-3.5'
# accept = 'application/json'
# contentType = 'application/json'

# response = brt.invoke_model(body=body, modelId=modelId, accept=accept, contentType=contentType)

# response_body = json.loads(response.get('body').read())

# # text
# print(response_body.get('completion'))


