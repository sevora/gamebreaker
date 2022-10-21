def main():
    # X always goes first
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
            opponent_move = find_best_move(board, opponent)
            if opponent_move != (-1, -1):
                y, x = opponent_move
                print(f"Opponent moved at {x}, {y}")
                board[y][x] = opponent

        player_turn = not player_turn

"""

"""
def get_board_definitions():
    return (-1, 0, 1) # X, empty cell, O

def prettify(board):
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

"""
Checks the tic-tac-toe board for a winner.
Returns the value of the winner according to get_board_definitions().
If there is no winner, it returns None.
"""
def check_for_winner(board): 
    _X, empty, _O = get_board_definitions()

    # check for a winner horizontally
    for y in range(3):
        left, middle, right = board[y]
        if left == middle and middle == right:
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

"""
maximize_for refers to the value of the player we want to win
"""
def evaluate_board(board, maximize_for):
    winner = check_for_winner(board)

    if not winner:
        return 0

    return 10 if winner == maximize_for else -10


def is_board_filled(board):
    _X, empty, _O = get_board_definitions()

    for row in board:
        for cell in row:
            if cell == empty:
                return False
    return True

def minimax(board, depth, is_maximizing, maximizing_player, minimizing_player):
    score = evaluate_board(board, maximizing_player)
    _X, empty, _O = get_board_definitions()

    if abs(score) == 10:
        return score
    elif is_board_filled(board):
        return 0

    best_value = (-1 if is_maximizing else 1) * 1000 

    for y in range(3):
        for x in range(3):
            if board[y][x] == empty:
                board[y][x] = maximizing_player if is_maximizing else minimizing_player
                minimax_result = minimax(board, depth+1, not is_maximizing, maximizing_player, minimizing_player) 
                best_value = (max if is_maximizing else min)(best_value, minimax_result)
                board[y][x] = empty

    return best_value
            
def find_best_move(board, maximize_for):
    X, empty, O = get_board_definitions()

    minimize_for = X if maximize_for == O else O
    best_value = -1000
    best_move = (-1, -1)

    for y in range(3):
        for x in range(3):
            if board[y][x] == empty:
                board[y][x] = maximize_for

                move_value = minimax(board, 0, False, maximize_for, minimize_for)
                
                if move_value > best_value:
                    best_move = (y, x) 
                    best_value = move_value

                board[y][x] = empty

    return best_move

if __name__ == "__main__":
    main()
