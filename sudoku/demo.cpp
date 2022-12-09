#include <iostream>
#include <cmath>

int board[81] = {
    0, 0, 0, 2, 6, 0, 7, 0, 1,
    6, 8, 0, 0, 7, 0, 0, 9, 0,
    1, 9, 0, 0, 0, 4, 5, 0, 0,
    8, 2, 0, 1, 0, 0, 0, 4, 0,
    0, 0, 4, 6, 0, 2, 9, 0, 0,
    0, 5, 0, 0, 0, 3, 0, 2, 8,
    0, 0, 9, 3, 0, 0, 0, 7, 4,
    0, 4, 0, 0, 5, 0, 0, 3, 6,
    7, 0, 3, 0, 1, 8, 0, 0, 0
};

bool test_answer_at(int* board, int index, int answer) {
    int y = std::floor(index / 9.0);
    int x = index % 9;

    int row = y * 9;
    for (int i = 0; i < 9; ++i) {
        int position = row + i;
        int value = *(board + position);
        if (index != position && value == answer) {
            return false;
        }
    }

    for (int i = 0; i < 9; ++i) {
        int position = x + (9 * i);
        int value = *(board + position);
        if (index != position && value == answer) {
            return false;
        }
    }

    int anchor_point[2] = { y - (y % 3), x - (x % 3) };

    for (int row = anchor_point[0] + 2; row >= anchor_point[0]; --row) {
        for (int column = anchor_point[1] + 2; column >= anchor_point[1]; --column) {
            int position = (row * 9) + column;
            int value = *(board + position);
            if (index != position && value == answer) {
                return false;
            }
        }
    }

    return true;
}

int find_empty_cell(int* board) {
    for (int position = 0; position < 81; ++position) {
        if (*(board + position) == 0) return position;
    }
    return -1;
}

bool solve(int* board) {
    int position = find_empty_cell(board);

    if (position == -1)
        return true;
    
    for (int answer = 1; answer <= 9; ++answer) {
        if ( !test_answer_at(board, position, answer) ) 
            continue;
        int& cell = *(board + position);
        cell = answer;
        if ( solve(board) ) 
            return true;
        cell = 0;
    }
    
    return false;
}

void display_board(int* board) {
    for (int y = 0; y < 9; ++y) {
        if (y != 0 && y % 3 == 0) {
            std::cout << " -  -  -   -  -  -   -  -  - \n";
        }
        for (int x = 0; x < 9; ++x) {
            int value = *(board + (y * 9) + x);
            if (x != 0 && x % 3 == 0) std::cout << '|';
            if (value == 0) {
                std::cout << " ? ";
                continue;
            } 
            std::cout << ' ' << value << ' ';            
        }
        std::cout << '\n';
    }
    std::cout << '\n';
}


int main() {
    std::cout << "Given Board:\n";
    display_board(board);
    if ( solve(board) ) {
        std::cout << "Solved Board:\n";
        display_board(board);
    } else {
        std::cout << "Board Has No Solution";
    }
    return 0;
}
