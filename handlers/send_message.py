import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Parse the incoming event data
    try:
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'success': False,
                    'message': 'Invalid request format'
                })
            }
        
        # Extract form fields
        name = body.get('name', '')
        email = body.get('email', '')
        message = body.get('message', '')
        
        # Validate the required fields
        if not name or not email or not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'success': False,
                    'message': 'Missing required fields'
                })
            }
        
        # Configure SES parameters
        sender = "Your Website <your-verified-email@example.com>"  # Must be verified in SES
        recipient = "0nikhilsingh5@gmail.com"
        subject = f"New contact from {name} via Portfolio Website"
        
        # Format the body of the email
        email_body = f"""
        You have received a new message from your portfolio website:
        
        Name: {name}
        Email: {email}
        
        Message:
        {message}
        """
        
        # Create a new SES resource
        client = boto3.client('ses', region_name='ap-south-1')  # Use your AWS region
        
        # Try to send the email
        try:
            response = client.send_email(
                Destination={
                    'ToAddresses': [recipient]
                },
                Message={
                    'Body': {
                        'Text': {
                            'Charset': 'UTF-8',
                            'Data': email_body
                        }
                    },
                    'Subject': {
                        'Charset': 'UTF-8',
                        'Data': subject
                    }
                },
                Source=sender,
                ReplyToAddresses=[email]
            )
        except ClientError as e:
            print(e.response['Error']['Message'])
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'success': False,
                    'message': 'Error sending email'
                })
            }
        
        # Return success response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Your message has been sent successfully!'
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': False,
                'message': 'An unexpected error occurred'
            })
        }