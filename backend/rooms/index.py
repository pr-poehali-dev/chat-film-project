"""
Business: Get all active rooms with movie details and viewer count
Args: event - dict with httpMethod, queryStringParameters
      context - object with request_id attribute
Returns: HTTP response with rooms list
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
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT 
            r.id,
            r.name,
            r.status,
            r.video_time,
            r.is_playing,
            m.title as movie_title,
            m.poster_emoji,
            (SELECT COUNT(*) FROM users WHERE current_room_id = r.id AND status = 'online') as viewers
        FROM rooms r
        LEFT JOIN movies m ON r.movie_id = m.id
        WHERE r.status = 'active'
        ORDER BY r.created_at DESC
    """)
    
    rooms = cur.fetchall()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps([dict(room) for room in rooms])
    }
