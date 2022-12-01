/*
 * Tic-Tac-Toe CLI Game
 * Human Player vs. Minimax Algorithm
 * Written by Ralph Louis Gopez
 * 
 * This is an implementation of tic-tac-toe done using C++
 * Check out the Python version for easy reading.
 */
#include <iostream>
#include <algorithm>
#include <limits>

enum moves { _, X, O };

/**
 * Empties the board.
 * @param board This is the 3x3 board but is represented as a 1D array.
 */
void clear_board(enum moves board[9]) {
    for (int i = 0; i < 9; ++i) {
        board[i] = _;
    }
}

/**
 * Use to get the winner of a game of tic-tac toe.
 * @param board This is the 3x3 board but is represented as a 1D array.
 * @return The value of the winner (value of X or O as such) in enum moves.
 */
enum moves check_for_winner(enum moves board[9]) {
    for (int y = 0; y < 3; ++y) {
        int leftmost_index = y * 3;
        moves left = board[leftmost_index];
        moves middle = board[leftmost_index + 1];
        moves right = board[leftmost_index + 2];
        if (left != _ && left == middle && middle == right) return left;
    }

    for (int x = 0; x < 3; ++x) {
        moves top = board[x];        // x + (3 * 0)
        moves middle = board[x + 3]; // x + (3 * 1)
        moves bottom = board[x + 6]; // x + (3 * 2)
        if (top != _ && top == middle && middle == bottom) return top;
    }

    moves top_left = board[0];
    moves top_right = board[2];
    moves center = board[4];
    moves bottom_left = board[6];
    moves bottom_right = board[8];

    if (top_left != _ && top_left == center && center == bottom_right) return top_left;
    if (top_right != _ && top_right == center && center == bottom_left) return top_right;

    return _;
}

/**
 * Checks if the board is completely filled with moves.
 * @param board This is the 3x3 board but is represented as a 1D array.
 * @return The boolean value representing whether the board is filled or not.
 */
bool is_board_filled(enum moves board[9]) {
    for (int i = 0; i < 9; ++i) {
        if (board[i] == _) return false;
    }
    return true;
}

/**
 * Computes the score of any given state of the tic-tac-toe board on the perspective of the maximizing player.
 * @param board This is the 3x3 board but is represented as a 1D array.
 * @param maximizing_player This is the value of an enum move corresponding to the player that we want to win.
 * @return The score of the given board state.
 */
int evaluate_board(enum moves board[9], enum moves maximizing_player) {
    moves winner = check_for_winner(board);
    if (winner == _) return 0;
    return winner == maximizing_player ? 10 : -10;
}

/**
 * The minimax algorithm which returns a score for any game state, where the score is based upon the terminating states or condition
 * of the game, which considers the fact that the opponent will always pick their best move.
 * @param board This is the 3x3 board but is represented as a 1D array.
 * @param depth This refers to how deep the recursion in the algorithm should go.
 * @param alpha The starting value of alpha for alpha-beta pruning.
 * @param beta The starting value of beta for alpha-beta pruning.
 * @param is_maximizing Refers to whether in the current board state, the one to move is the maximizing player or not.
 * @param maximizing_player This is the value of an enum move corresponding to the player that we want to win.
 * @param minimizing_player This is the value of an enum move corresponding to the player that we don't want to win.
 * @return The score of the given board state.
 */
int minimax(enum moves board[9], int depth, int alpha, int beta, bool is_maximizing, enum moves maximizing_player, enum moves minimizing_player) {
    int score = evaluate_board(board, maximizing_player);
    if (score != 0 || is_board_filled(board) || depth == 0) return score;

    int best_value = (is_maximizing ? -1 : 1) * 1000;

    for (int i = 0; i < 9; ++i) {
        if (board[i] != _) continue;
        board[i] = is_maximizing ? maximizing_player : minimizing_player;
        int minimax_result = minimax(board, depth-1, alpha, beta, !is_maximizing, maximizing_player, minimizing_player);
        
        if (is_maximizing) {
            best_value = std::max(best_value, minimax_result);
            alpha = std::max(alpha, minimax_result);
        } else {
            best_value = std::min(best_value, minimax_result);
            beta = std::min(beta, minimax_result);
        }

        board[i] = _;
        if (beta <= alpha) break;
    }

    return best_value;
}

/**
 * Finds the index of the best move for the maximizing player.
 * @param board This is the 3x3 board but is represented as a 1D array.
 * @param maximizing_player This is the value of an enum move corresponding to the player that we want to win.
 * @param minimizing_player This is the value of an enum move corresponding to the player that we don't want to win.
 * @return The index in the board where the best move is for the maximizing player.
 */
int find_best_move(enum moves board[9], enum moves maximizing_player, enum moves minimizing_player) {
    int best_value = -1000;
    int best_move = -1;

    for (int i = 0; i < 9; ++i) {
        if (board[i] != _) continue;
        board[i] = maximizing_player;
        int value = minimax(board, 9, -1000, 1000, false, maximizing_player, minimizing_player);

        if (value > best_value) {
            best_move = i;
            best_value = value;
        }

        board[i] = _;
    }

    return best_move;
}

/**
 * Use this to pretty print the tic-tac-toe board to the terminal.
 * @param board This is the 3x3 board but is represented as a 1D array.
 */
void print_pretty(enum moves board[9]) {
    for (int y = 0; y < 3; ++y) {
        if (y == 0) std::cout << "  --- --- ---\n";
        for (int x = 0; x < 3; ++x) {
            if (x == 0) std::cout << " | ";
            moves move = board[y * 3 + x];
            char symbol = ' ';
            
            if (move == X) {
                symbol = 'X';
            } else if (move == O) {
                symbol = 'O';
            }

            std::cout << symbol << " | ";
        }
        std::cout << "\n  --- --- ---\n";
    }
}

int main() {
    moves board[9];     // by default, board is filled with 0s
    clear_board(board); // that's what I thought until it was different on Android, hence this

    moves player = O, opponent = X;
    bool player_turn = false;

    char player_first_prompt;
    std::cout << "Go first? (y/n): ";
    std::cin >> player_first_prompt;
    
    if (player_first_prompt == 'y') {
        player = X;
        opponent = O;
        player_turn = true;
    }

    while (true) {
        print_pretty(board);
        moves winner = check_for_winner(board);

        if (winner != _) {
            if (winner == player) {
                std::cout << "Congrats! You won!\n";
            } else {
                std::cout << "Oops! You lost!\n";
            }
            break;
        } else if ( is_board_filled(board) ) {
            std::cout << "The game ends in a tie!\n";
            break;
        }

        if (player_turn) {
            int player_move_index;
            std::cout << "Enter move 1-9: ";
            std::cin >> player_move_index;
            player_move_index -= 1;

            if ( std::cin.fail() ) {
                std::cout << "You did not enter a valid move!\n";
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                continue;
            }

            if (-1 < player_move_index && player_move_index < 9 && board[player_move_index] == _) {
                board[player_move_index] = player;
            } else {
                std::cout << "You cannot use a filled or non-existent position!\n";
                continue;
            }

        } else {
            int opponent_move_index = find_best_move(board, opponent, player);
            if (opponent_move_index != -1) {
                std::cout << "Opponent moved at index " << opponent_move_index << '\n';
                board[opponent_move_index] = opponent;
            }
        }

        player_turn = !player_turn;
    }

    return 0;
}
