import json
import boto3
import logging

# Set up logging to capture information for CloudWatch
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize DynamoDB resource and reference the VisitorCounter table
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('VisitorCounter')

# The site moved from resume.codenickk.com to the apex, and a single hardcoded origin meant every
# browser on the new domain had its response blocked by CORS. Reflect the caller's origin when it
# is one of ours — never a bare '*', which would let any site drive the counter up.
ALLOWED_ORIGINS = {
    'https://codenickk.com',
    'https://resume.codenickk.com',   # still 301s to the apex; harmless to keep allowed
}


def _cors(event):
    headers = (event or {}).get('headers') or {}
    # API Gateway does not normalise header case, so look for either
    origin = headers.get('origin') or headers.get('Origin') or ''
    allowed = origin if origin in ALLOWED_ORIGINS else 'https://codenickk.com'
    return {
        'Access-Control-Allow-Origin': allowed,
        'Vary': 'Origin',   # so a cache cannot hand one origin's header to another
    }


def lambda_handler(event, context):
    """
    AWS Lambda function to handle HTTP requests and update a visitor counter in a DynamoDB table.
    This function supports the following:
    - Handles CORS preflight OPTIONS requests.
    - Updates a visitor count stored in a DynamoDB table.
    - Returns the updated visitor count in the response.
    
    Args:
        event (dict): The event dictionary containing details of the HTTP request.
            - httpMethod (str): The HTTP method of the request (e.g., GET, OPTIONS).
        context (object): The runtime information provided by AWS Lambda.
    
    Returns:
        dict: A dictionary containing the HTTP response.
            - statusCode (int): The HTTP status code of the response.
            - headers (dict): The HTTP headers, including CORS headers.
            - body (str): A JSON string containing the response body.
    
    Raises:
        Exception: If an error occurs while updating the visitor count in the DynamoDB table.
    
    Notes:
        - The function assumes the existence of a DynamoDB table with a key 'WebsiteVisits' and an attribute 'visits'.
        - CORS headers reflect the caller's origin when it is in ALLOWED_ORIGINS.
        - The visitor count is incremented by 1 for each non-OPTIONS request.
    """
    cors = _cors(event)
    try:
        # Handle OPTIONS preflight request for CORS
        # This is necessary for browsers to validate cross-origin requests
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    **cors,
                    'Access-Control-Allow-Methods': 'GET,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }
        
        # Update visitor count in DynamoDB
        # Using atomic counter with ADD operation to ensure accuracy even with concurrent requests
        response = table.update_item(
            Key={'WebsiteVisits': 'home'},  # Partition key identifying the counter
            UpdateExpression='ADD visits :incr',  # Increment the visits attribute
            ExpressionAttributeValues={':incr': 1},  # Increment by 1
            ReturnValues='UPDATED_NEW'  # Return the new value after update
        )
        
        # Extract and convert the visitor count from the response
        visitor_count = int(response['Attributes']['visits'])
        
        # Return successful response with updated count
        return {
            'statusCode': 200,
            'headers': {
                **cors,
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'visits': visitor_count})
        }
    
    except Exception as e:
        # Log the error for debugging purposes
        logger.error(f"Error updating visitor count: {str(e)}")
        
        # Return error response to client
        return {
            'statusCode': 500,
            'headers': cors,
            'body': json.dumps({'error': 'Internal Server Error'})
        }