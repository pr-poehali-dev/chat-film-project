"""
Business: Get messages for a room and post new messages
Args: event - dict with httpMethod, queryStringParameters, body
      context - object with request_id attribute
Returns: HTTP response with messages or success status
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        room_id = params.get('room_id')
        
        if not room_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'room_id is required'})
            }
        
        cur.execute("""
            SELECT 
                m.id,
                m.message,
                m.created_at,
                u.name as user_name,
                u.avatar_emoji
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.room_id = %s
            ORDER BY m.created_at DESC
            LIMIT 50
        """, (room_id,))
        
        messages = cur.fetchall()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps([dict(msg) for msg in messages])
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        room_id = body_data.get('room_id')
        user_id = body_data.get('user_id', 1)
        message = body_data.get('message', '')
        
        if not room_id or not message:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'room_id and message are required'})
            }
        
        cur.execute("""
            INSERT INTO messages (room_id, user_id, message)
            VALUES (%s, %s, %s)
            RETURNING id, created_at
        """, (room_id, user_id, message))
        
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message_id': result['id']})
        }
    
    cur.close()
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
