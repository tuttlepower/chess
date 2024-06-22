import os
from supabase import create_client, Client
import requests
from datetime import datetime, timedelta
import re
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Supabase client
url = os.environ['SUPABASE_URL']
key = os.environ['SUPABASE_KEY']
supabase: Client = create_client(url, key)

def insert_game(game_data):
    response = supabase.table('games').insert(game_data).execute()
    print(response.data)

def retrieve_games():
    # Calculate the timestamp for midnight at the start of the previous day
    yesterday_midnight = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=1)
    epoch_yesterday_midnight = int(yesterday_midnight.timestamp())

    response = requests.get(
        "https://lichess.org/games/export/TuttlePower",
        params={"since": epoch_yesterday_midnight * 1000}
        )
    
    return response.text

def parse_pgn_games(pgn_text):
    games = pgn_text.strip().split("\n\n\n")
    
    def parse_pgn(pgn):
        headers = {}
        moves = []
        lines = pgn.strip().split("\n")
        for line in lines:
            if line.startswith("["):
                key, value = re.match(r'\[(\w+) "([^"]+)"\]', line).groups()
                headers[key.lower()] = value
            elif line.strip() and not line.startswith("["):
                moves.append(line.strip())
        
        move_text = " ".join(moves)
        move_count = len(move_text.split()) // 2
        checkmate = "#" in move_text
        
        game_data = {
            "event": headers.get("event", ""),
            "site": headers.get("site", ""),
            "date": headers.get("date", ""),
            "white": headers.get("white", ""),
            "black": headers.get("black", ""),
            "result": headers.get("result", ""),
            "utc_date": headers.get("utcdate", ""),
            "utc_time": headers.get("utctime", ""),
            "white_elo": int(headers.get("whiteelo", 0)),
            "black_elo": int(headers.get("blackelo", 0)),
            "white_rating_diff": int(headers.get("whiteratingdiff", 0)),
            "black_rating_diff": int(headers.get("blackratingdiff", 0)),
            "variant": headers.get("variant", ""),
            "time_control": headers.get("timecontrol", ""),
            "eco": headers.get("eco", ""),
            "termination": headers.get("termination", ""),
            "opening_name": "",  # This would need to be determined if available
            "move_count": move_count,
            "checkmate": checkmate,
            "pgn": move_text
        }
        return game_data

    return [insert_game(parse_pgn(game)) for game in games]

def get_most_recent_game():
    response = supabase.table('games').select('*').order('date', desc=True).limit(1).execute()
    if response.data:
        return response.data[0]
    return None

# Example usage
most_recent_game = get_most_recent_game()
print(f"Most recent game: {most_recent_game}")