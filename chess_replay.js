$(function () {
    var cfg = {
      position: 'start'
    };
    var board = ChessBoard('board5', cfg);
    var game = new Chess();

    // 1. Load a PGN into the game
    var pgn =
      '1. d4 d5 2. Nf3 Nf6 3. Bg5 h6 4. Bf4 a6 5. Nc3 Nc6 6. e3 Bf5 7. Bd3 e6 8. Bxf5 exf5 9. Ne5 Ne4 10. Nxc6 bxc6 11. Nxe4 fxe4 12. O-O Bd6 13. Bxd6 Qxd6 14. Qe2 O-O 15. c4 Rfb8 16. c5 Qe7 17. a4 a5 18. b3 Rb4 19. Rab1 Rab8 20. Qd1 Qd7 21. Qc2 Qc8 22. Qd1 Qb7 23. Qg4 Rxb3 24. Rxb3 Qxb3 25. Qd7 Qxa4 26. Qxc7 Qb5 27. h3 a4 28. Ra1 Ra8 29. g4 a3 30. g5 hxg5 31. Kg2 a2 32. Kg3 Qb2 33. Rh1 a1=Q 34. Rxa1 Qxa1 35. Qxc6 Rd8 36. Kg4 Qa8 37. Qxa8 Rxa8 38. Kxg5 Ra2 39. Kf5 Rxf2+ 40. Ke5 Re2 41. c6 Rxe3 42. c7 Rc3 43. Kd6 e3 44. Kd7 e2 45. c8=Q+ Rxc8 46. Kxc8 e1=Q 47. Kd7 Qe3 48. Kd6 Qxd4 49. h4 Qe4 50. h5 d4 51. Kc5 d3 52. h6 d2 53. hxg7 Kxg7 54. Kd6 d1=Q+ 55. Kc5 Qec2+ 56. Kb4 Qdb1+ 57. Ka3 Qca2# 0-1';
    game.load_pgn(pgn);
    $('#pgn5').html(pgn);
    // 2. Get the full move history
    var history = game.history();
    game.reset();
    var i = 0;
    // 3. If Next button clicked, move forward one
    $('#nextBtn5').on('click', function () {
      game.move(history[i]);
      board.position(game.fen());
      i += 1;
      if (i > history.length) {
        i = history.length;
      }
    });
    // 4. If Prev button clicked, move backward one
    $('#prevBtn5').on('click', function () {
      game.undo();
      board.position(game.fen());
      i -= 1;
      if (i < 0) {
        i = 0;
      }
    });
    // 5. If Start button clicked, go to start position
    $('#startPositionBtn5').on('click', function () {
      game.reset();
      board.start();
      i = 0;
    });

    // 6. If End button clicked, go to end position
    $('#endPositionBtn5').on('click', function () {
      game.load_pgn(pgn);
      board.position(game.fen());
      i = history.length;
    });
  });