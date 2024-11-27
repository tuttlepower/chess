import os
from supabase import create_client, Client


# Initialize Supabase client
url = os.environ["SUPABASE_URL"]
key = os.environ["SUPABASE_KEY"]
supabase: Client = create_client(url, key)


def insert_game(game_data):
    response = supabase.table("games").insert(game_data).execute()
    if response.error:
        print("An error occurred:", response.error.message)
    else:
        print("Game inserted successfully:", response.data)


if __name__ == "__main__":
    # Example game data
    game_data = {
        "event": "Rated Blitz game",
        "site": "https://lichess.org/dzh0QrWD",
        "date": "2023-07-27",
        "white": "Taborlin_The_Great",
        "black": "TuttlePower",
        "result": "1-0",
        "utc_date": "2023-07-27",
        "utc_time": "00:00:36",
        "white_elo": 1583,
        "black_elo": 1585,
        "white_rating_diff": 5,
        "black_rating_diff": -5,
        "variant": "Standard",
        "time_control": "180+0",
        "eco": "D06",
        "termination": "Normal",
        "opening_name": "Queen's Gambit Declined: Marshall Defense",
        "move_count": 44,
        "checkmate": True,
        "pgn": """1. d4 d5 2. c4 Bf5 3. Nc3 dxc4 4. e3 e6 5. Bxc4 Bb4 6. Nf3 Nf6 7. O-O O-O 8. Re1 Ne4 9. Bd3 Nxc3 10. bxc3 Bxc3 11. Bxf5 Bxa1 12. Bxh7+ Kxh7 13. h4 Bc3 14. Ng5+ Kg6 15. Qd3+ f5 16. Qxc3 Nc6 17. e4 Qxd4 18. Qg3 Kf6 19. Nh7+ Ke7 20. Qg5+ Rf6 21. Nxf6 Qxf6 22. Qd2 Rd8 23. Qe2 Nd4 24. Qe3 Nc2 25. Qc5+ Rd6 26. Qxc2 fxe4 27. Bg5 Qxg5 28. hxg5 Rc6 29. Qxe4 a5 30. Qh4 g6 31. Qh7+ Kd6 32. Qxg6 Kd5 33. Rd1+ Kc5 34. Rc1+ Kb5 35. Rxc6 bxc6 36. Qxe6 c5 37. g6 Kb4 38. g7 Ka3 39. g8=Q c4 40. Qxc4 a4 41. Qg3+ Kb2 42. Qe2+ Ka1 43. Qc3+ Kb1 44. Qeb2#""",
    }

    # Insert the game into the database
    insert_game(game_data)
