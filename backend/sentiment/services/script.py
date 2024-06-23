import boto3

bedrock = boto3.client(
    service_name="bedrock", 
    region_name="us-east-1"
)

print(bedrock.list_foundation_models())