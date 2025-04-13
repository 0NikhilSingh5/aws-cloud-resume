import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Parse the incoming event data

    print(f"Received event: {event}")

    try:
        # Extract the form data from the API Gateway event
        if 'body' in event:
            # Handle case where body is a string (normal API Gateway behavior)
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            # Handle case where body is already an object (API Gateway test console)
            elif isinstance(event['body'], dict):
                body = event['body']
            else:
                print(f"Unexpected body type: {type(event['body'])}")
                return generate_response(400, {
                    'success': False,
                    'message': f"Invalid body type: {type(event['body'])}"
                })
        else:
            print(f"Could not find body in event: {event}")
            return generate_response(400, {
                'success': False,
                'message': 'Invalid request format'
            })
        
        # Extract form fields
        name = body.get('name', '')
        email = body.get('email', '')
        message = body.get('message', '')
        
        # Validate the required fields
        if not name or not email or not message:
            return generate_response(400, {
                'success': False,
                'message': 'Missing required fields'
            })
        
        # Email configuration
        sender = "Portfolio Website <0nikhilsingh5@gmail.com>"  
        recipient = "0nikhilsingh5@gmail.com"
        subject = f"New contact from {name} via Portfolio Website"
        
        # Format the email content
        email_body = format_email_body(name, email, message)
        
        # Send the email using SES
        send_email_result = send_email_via_ses(sender, recipient, email, subject, email_body)
        
        if not send_email_result['success']:
            return generate_response(500, {
                'success': False,
                'message': send_email_result['message']
            })
        
        # Return success response
        return generate_response(200, {
            'success': True,
            'message': 'Your message has been sent successfully!'
        })
        
    except Exception as e:
        # Log the full exception for debugging
        print(f"Error: {str(e)}")
        import traceback
        print(traceback.format_exc())
        
        # Return a generic error response
        return generate_response(500, {
            'success': False,
            'message': 'An unexpected error occurred'
        })

def format_email_body(name, email, message):
    return f"""
    You have received a new message from your portfolio website:
    
    Name: {name}
    Email: {email}
    
    Message:
    {message} 
    ---
    """

def send_email_via_ses(sender, recipient, reply_to, subject, body_text):
    # Create a new SES resource
    # Specify the region where SES is configured
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
                        'Data': body_text
                    }
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': subject
                }
            },
            Source=sender,
            ReplyToAddresses=[reply_to]
        )
        
        # Return success if the email was sent
        return {
            'success': True,
            'message': 'Email sent successfully',
            'messageId': response['MessageId']
        }
        
    except ClientError as e:
        # Log the specific SES error
        error_message = e.response['Error']['Message']
        print(f"SES Error: {error_message}")
        
        # Return failure with the error message
        return {
            'success': False,
            'message': error_message
        }

def generate_response(status_code, body_dict):
   
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',  # Allow requests from any origin
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body_dict)
    }