"""
Tic Tac Toe AI Algorithm
Goal: Find the best move in each state of the board in the turn-based game of Tic Tac Toe.

Approach: Minimax Algorithm
We have a set of possible moves and we're going to evaluate them by ending up with some numerical
value that indicates how good that move is.
Steps:
    1. Test move on empty cell.
    2. Simulate opponent's response by having a move tested on another empty cell.
    3. Do steps 1-2 recursively until a terminating state is reached, only then proceed to step 4.
    4. Terminating state is when there is a winner or a tie, use this to return the final score of the board.
    5. Apply minimax theory, by having minimizers pick the moves with minimum values which gets returned to a maximizer which picks
    the highest values and so on, until the recursion is unrolled.
    6. We now have a score for the empty cell on step 1.

More Details:
    The minimax algorithm is an approach where we reach the terminating states of the game and from that backtrack
    towards the current state of the board where we figure out the best move by having the series of minimizers and
    maximizers figure out their own value. The theory works as we always assume that our opponent will pick the best
    move for them, which in turn is bad for us.

    To make it a bit clearer:
    The general step is that we test every possible move, we figure out the score of each possible move using minimax.
    Minimax also needs to use an evaluation function to figure out in terminating states what the score is.

    We look at every possible move we can make. From that we simulate the whole game by also simulating all the 
    possible moves our opponent can make as a response. Eventually, the game will reach a terminating state, a.k.a.
    someone has won or it is a tie. We are the maximizer, our opponent is the minimizer. 

    We assume that our enemy would always pick the move with the least gains to us, hence they are the minimizer.
    We also want us to pick the move with the most gains to us, hence we are the maximizer.

    Say we are one turn away from a terminating state that ends with our opponent picking the last 
    move and they end up the winner. Any terminating state where the enemy is the winner has an evaluation 
    that is lower than the evaluation if it were a tie or a win. Hence, they will pick that as the minimizer. 
    Say at the same turn, there is also a possible move where it ends up a tie. We can control the game 
    essentially by picking the move where the only move our enemy can make ends up with a tie. 

    Why minimax?
    Say there exists a move where there is a chance of winning after three turns (this turn, enemy turn, our turn).
    However if we use that move, since it is then the enemy's turn, there exists a move where they would win.
    We can only win if the enemy does a blunder. However the minimax algorithm takes into account that our enemy
    would always pick the best move, hence as the opponent is the minimizer, the value of the board at that turn
    would be a lower value (compared to tie/win) and would be returned as the score of the board if we make such move.
    But, we are the maximizer, hence if a different move exists, we would instead be able to pick that.
"""

def main():
    # X always goes first, O always goes second
    # but we could pick who's X and who's O
    X, _, O = get_board_definitions()

    board = [
        [ _, _, _ ],
        [ _, _, _ ],
        [ _, _, _ ]
    ]

    player_first = input("Go first? (y/n): ").lower() == "y"

    player = X if player_first else O
    opponent = X if player == O else O

    player_turn = player_first

    while True:
        print( prettify(board) )
        winner = check_for_winner(board)

        if winner:
            if winner == player:
                print("Congrats! You won!")
            else:
                print("You lost!")
            break

        if is_board_filled(board):
            if not winner:
                print("The game ends in a tie!")
            break

        if player_turn:
            player_move = int( input("Enter move 1-9: ") ) - 1
            y = player_move // 3
            x = player_move % 3
            
            if board[y][x] == _:
                board[y][x] = player
            else:
                print("You cannot use a filled position!")
                continue
        else:
            opponent_move = find_best_move(board, opponent, player)
            if opponent_move != (-1, -1):
                y, x = opponent_move
                print(f"Opponent moved at {x}, {y}")
                board[y][x] = opponent

        player_turn = not player_turn

def get_board_definitions():
    """
    get_board_definitions simply has the possible vales of the board.

    :return: a tuple in with the values corresponding to an entry in the board, 
    in the order of X, empty cell, and O.
    """
    # this could be destructured as follows
    # X, _, O = get_board_definitions()
    return (-1, 0, 1) 

def prettify(board):
    """
    prettify is used to generate a string from a board.

    :param board: a 2d array that has the board values.
    :return: a string where if printed in the terminal would look pleasing.
    """
    X, empty, O = get_board_definitions()

    result = ""
        
    for y, row in enumerate(board):
        result += " ---" * 3
        result += "\n"

        for x, cell in enumerate(row):
            result += "|"
            symbol = " "

            if cell != empty:
                symbol = "X" if cell == X else "O"

            result += f"{symbol:^3}"

            if x == len(row) - 1:
                result += "|"

        result += "\n"
        
        if y == len(board) - 1:
            result += " ---" * 3
            result += "\n"

    return result

def check_for_winner(board): 
    """
    check_for_winner checks for a win in a tic-tac-toe board and returns the winner.
    To be more specific, it simply checks if there is any sort of non-empty (empty is 
    defined from get_board_definitions) sequence forming a win in a traditional tic-tac-toe 
    board.

    :param board: a 2d array that has the board values.
    :return: an integer that corresponds to a winner, or None
    """
    empty = get_board_definitions()[1]

    # check for a winner horizontally
    for y in range(3):
        left, middle, right = board[y]
        if left == middle and middle == right:
            # explicit alternative is,
            # X, empty, O = get_board_definitions() 
            # if left == X or left == O:
            if left: # if cell is not empty, return the winner
                return left

    # check for a winner vertically
    for x in range(3):
        top = board[0][x]
        middle = board[1][x]
        bottom = board[2][x]

        if top == middle and middle == bottom:
            if top != empty: 
                return top

    # used for diagonals in the board
    top_left = board[0][0]
    top_right = board[0][2]
    center = board[1][1]
    bottom_left = board[2][0]
    bottom_right = board[2][2]

    # check for a winner diagonally
    if top_left == center and center == bottom_right:
        if top_left != empty:
            return top_left

    if top_right == center and center == bottom_left:
        if top_right != empty:
            return top_right
       
    return None

def evaluate_board(board, maximize_for):
    """
    evaluate_board calculates a score for a given board where the score is based if 
    a given value is considered the winner or not.

    :param board: a 2d array that has the board values.
    :param maximize_for: an integer corresponding to the winner (use get_board_definitions to make sense of this)
    :return: an integer that corresponds to the score of the board in the perspective of maximize_for
    """
    winner = check_for_winner(board)

    if not winner:
        return 0

    return 10 if winner == maximize_for else -10

def is_board_filled(board):
    """
    is_board_filled checks if the board is filled or not.

    :param board: a 2d array that has the board values.
    :return: a boolean that says if the board is filled or not
    """

    # as you can see, what it considers empty 
    # is based on get_board_definitions
    empty = get_board_definitions()[1]
    for row in board:
        for cell in row:
            if cell == empty:
                return False
    return True

def minimax(board, depth, is_maximizing, maximizing_player, minimizing_player):
    """
    minimax this is the main algorithm that uses the minimax theory. It returns the score of
    the board state according to minimax theory. Essentially we could have multiple board states,
    that differ in the move done on each and use minimax on all of those, then we pick the one 
    with the highest value, check find_best_move for that.

    :param board: a 2d array that has the board values.
    :param depth: an integer corresponding to how deep we are in the recursion.
    :param is_maximizing: a boolean that determines whether we maximize the score or minimize it.
    :param maximizing_player: an integer that determines the maximizing_player / or symbol aka X or O.
    :param minimizing_player: an integer that determines the minimizing_player / or symbol aka X or O.
    :return: an integer corresponding to the score of the board according to the minimax algorithm
    """
    score = evaluate_board(board, maximizing_player)
    _X, empty, _O = get_board_definitions()

    # if score has an absolute value of 10,
    # this means there is a winner
    if abs(score) == 10:
        return score
    # additonally, if the board is filled at this point
    # and previous condition is met, then it is a tie
    elif is_board_filled(board):
        return 0

    best_value = (-1 if is_maximizing else 1) * 1000 

    # imagine this as the breadth of the tree graph
    for y in range(3):
        for x in range(3):
            if board[y][x] == empty:
                board[y][x] = maximizing_player if is_maximizing else minimizing_player
                
                # imagine this as the width of the tree graph
                minimax_result = minimax(board, depth+1, not is_maximizing, maximizing_player, minimizing_player) 
                best_value = (max if is_maximizing else min)(best_value, minimax_result)

                # as we are only testing the move, we set the cell we tested on back to empty
                board[y][x] = empty

    return best_value
            
def find_best_move(board, maximizing_player, minimizing_player):
    """
    find_best_move finds the best possible move assuming this is the maximizing_player's turn.

    :param board: a 2d array that has the board values.
    :param maximizing_player: an integer that determines the maximizing_player / or symbol aka X or O
    :param minimizing_player: an integer that determines the minimizing_player / or symbol aka X or O
    :return: a tuple corresponding to the coordinates of the best move.
    """
    empty = get_board_definitions()[1]

    best_value = -1000
    best_move = (-1, -1)

    # as you can see this is simply the same loop for maximizing in the minimax algorithm,
    # we test all possible moves that are still valid,
    # and using minimax we get the score of each move,
    # then we choose the move with the highest score
    for y in range(3):
        for x in range(3):
            if board[y][x] == empty:
                board[y][x] = maximizing_player

                # the parameter is_maximizing is False as this test move in this loop is our turn
                # and the next move would then be our opponent's hence they're gonna be minimizing
                # as they will pick the move with the least gains for us (equivalently most gains to them) 
                move_value = minimax(board, 0, False, maximizing_player, minimizing_player)
                
                if move_value > best_value:
                    best_move = (y, x) 
                    best_value = move_value

                board[y][x] = empty

    return best_move

if __name__ == "__main__":
    main()
