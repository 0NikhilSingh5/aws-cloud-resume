"""
Contact Form Handler Lambda Function

This AWS Lambda function processes contact form submissions from a static website
and sends the form data as an email using Amazon SES.

Required environment variables:
- None (sender and recipient emails are hardcoded in this version)

Required IAM permissions:
- ses:SendEmail

Form parameters expected in the request:
- name: The name of the person contacting you
- email: The email address of the sender
- message: The content of their message
"""

import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    """
    Main Lambda handler function that processes contact form submissions.
    
    Parameters:
    -----------
    event : dict
        The event data passed to the Lambda function, containing the HTTP request details
    context : LambdaContext
        Runtime information provided by AWS Lambda
        
    Returns:
    --------
    dict
        API Gateway response object containing status code, headers, and JSON body
    """
    # Parse the incoming event data
    try:
        # Extract the form data from the API Gateway event
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            # Return error if no body is found in the request
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
        sender = "Portfolio Website <your-verified-email@example.com>"  # Replace with your verified SES email
        recipient = "0nikhilsingh5@gmail.com"  # Your personal email to receive messages
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
        
        # Return a generic error response
        return generate_response(500, {
            'success': False,
            'message': 'An unexpected error occurred'
        })

def format_email_body(name, email, message):
    """
    Formats the email body with the form submission data.
    
    Parameters:
    -----------
    name : str
        The name of the person contacting you
    email : str
        The email address of the sender
    message : str
        The content of their message
        
    Returns:
    --------
    str
        Formatted email body text
    """
    return f"""
    You have received a new message from your portfolio website:
    
    Name: {name}
    Email: {email}
    
    Message:
    {message}
    
    ---
    This email was sent from your portfolio website contact form.
    """

def send_email_via_ses(sender, recipient, reply_to, subject, body_text):
    """
    Sends an email using Amazon SES.
    
    Parameters:
    -----------
    sender : str
        The sender's email address (must be verified in SES)
    recipient : str
        The recipient's email address
    reply_to : str
        The email address to set as Reply-To
    subject : str
        The email subject line
    body_text : str
        The email body content
        
    Returns:
    --------
    dict
        Result of the email sending operation with success flag and message
    """
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
    """
    Generates a standardized API Gateway response object.
    
    Parameters:
    -----------
    status_code : int
        HTTP status code to return
    body_dict : dict
        Dictionary to be converted to JSON in the response body
        
    Returns:
    --------
    dict
        Complete API Gateway response object
    """
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