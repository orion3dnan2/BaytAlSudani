import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import jsonify

load_dotenv()

JWT_SECRET = os.getenv('JWT_SECRET', 'your-jwt-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

def encode_jwt(payload: dict) -> str:
    """
    Encode a JWT token with the given payload
    
    Args:
        payload (dict): The payload to encode in the JWT
        
    Returns:
        str: The encoded JWT token
    """
    # Add expiration time to payload
    payload['exp'] = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload['iat'] = datetime.utcnow()
    
    try:
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return token
    except Exception as e:
        raise Exception(f"JWT encoding failed: {str(e)}")

def decode_jwt(token: str) -> dict:
    """
    Decode a JWT token and return the payload
    
    Args:
        token (str): The JWT token to decode
        
    Returns:
        dict: The decoded payload
        
    Raises:
        Exception: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
    except Exception as e:
        raise Exception(f"JWT decoding failed: {str(e)}")

def verify_jwt_token(request):
    """
    Verify JWT token from request headers
    
    Args:
        request: Flask request object
        
    Returns:
        dict: Decoded token payload if valid, None if invalid
    """
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return None
    
    try:
        # Extract token from "Bearer <token>" format
        token = auth_header.split(' ')[1]
        payload = decode_jwt(token)
        return payload
    except IndexError:
        return None
    except Exception:
        return None

def require_jwt_auth(request):
    """
    Decorator-like function to require JWT authentication
    Returns error response if authentication fails
    
    Args:
        request: Flask request object
        
    Returns:
        tuple: (payload, None) if valid, (None, error_response) if invalid
    """
    payload = verify_jwt_token(request)
    
    if not payload:
        error_response = jsonify({
            "status": "error", 
            "message": "Unauthorized: Invalid or missing JWT token"
        }), 401
        return None, error_response
    
    return payload, None