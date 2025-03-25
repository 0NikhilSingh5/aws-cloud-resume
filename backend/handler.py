"""
This module handles AWS Lambda function for updating visitor count in DynamoDB.
"""
import json
import logging
import boto3
from botocore.exceptions import ClientError

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Constants
ORIGIN_URL = 'https://resume.codenickk.com'
TABLE_NAME = 'VisitorCounter'
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    AWS Lambda function to handle visitor count updates and CORS.

    Args:
        event (dict): AWS Lambda event object
        context (object): AWS Lambda context object

    Returns:
        dict: Response object with status code, headers, and body
    """
    try:
        # Handle OPTIONS preflight request for CORS
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': ORIGIN_URL,
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
                'Access-Control-Allow-Origin': ORIGIN_URL,
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'visits': visitor_count})
        }
    except ClientError as error:
        logger.error("Error updating visitor count: %s", str(error))
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': ORIGIN_URL
            },
            'body': json.dumps({'error': 'Internal Server Error'})
        }
    except Exception as error:
        logger.error("Unexpected error: %s", str(error))
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': ORIGIN_URL
            },
            'body': json.dumps({'error': 'Internal Server Error'})
        }
