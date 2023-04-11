import json
import boto3
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('VisitorCounter')

def lambda_handler(event, context):
    try:
        # Handle OPTIONS preflight request for CORS
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': 'https://resume.codenickk.com',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }
        
        # Update visitor count
        response = table.update_item(
            Key={'WebsiteVisits': 'home'},
            UpdateExpression='ADD visits :incr',
            ExpressionAttributeValues={':incr': 1},
            ReturnValues='UPDATED_NEW'
        )
        
        visitor_count = int(response['Attributes']['visits'])
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'https://resume.codenickk.com',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'visits': visitor_count})
        }
    
    except Exception as e:
        logger.error(f"Error updating visitor count: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': 'https://resume.codenickk.com'
            },
            'body': json.dumps({'error': 'Internal Server Error'})
        }