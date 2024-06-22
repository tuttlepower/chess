# chess
https://chessopenings.com/eco/

https://www.chessgames.com/chessecohelp.html


- Grab games from the day
    - game_retreiver.py
- Add the games to supabase
    - db_service.py


    
- Run a report? maybe weekly?  
    - What openings and I playing? Am I doing better or worse?
    - Can I get puzzle count?
    - time trouble? May be too annoying to put in report


CREATE TABLE chess.games (
    game_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event text,
    site text,
    date date,
    white text,
    black text,
    result text,
    utc_date date,
    utc_time time,
    white_elo int,
    black_elo int,
    white_rating_diff int,
    black_rating_diff int,
    variant text,
    time_control text,
    eco text,
    termination text,
    opening_name text,
    move_count int,
    checkmate boolean,
    pgn text
);