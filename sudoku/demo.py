"""
Sudoku Solver Algorithm
Goal: Given a 9x9 matrix representing a sudoku board, fill in the remaining missing digits such that 
the new matrix is a valid and solved sudoku board.

Approach: Backtracking Algorithm, a brute-force algorithm made more efficient.
Steps:
    1. Find an empty cell. If there are no empty cells that can be found, skip to step 5.
    2. Test the possible digits (1-9) on that cell.
    3. If any working digit is found, go back to step 1 (put the current step 2 on hold).
    4. If no working digit is found meaning all (1-9) digits have been tried, set the current cell 
    back to empty, and go back to the previous cell that has been filled. This means that we go back to step 
    2 of that cell. Do NOT proceed to step 5 from this step.
    5. Terminate the whole sequence.

More Details:
    The algorithm will first find an empty cell and try to test the answer if it is valid on that given cell starting from 1-9.
    If any of those digit is valid, then the algorithm proceeds to the next empty cell and tries to do the same thing. However, if 
    it reaches an empty cell, and finds that no digit is valid on the now current cell, it resets that current cell back to empty and 
    goes back to the previously filled cell to test for other possible digits that have not been tested yet. The same process repeats 
    until no more empty cell can be found.

    So for each empty cell that is currently being worked on, if any digit is found to work (remember this occurs in an iteration of the 
    digits 1-9), proceed to the next empty cell (meaning that the iteration is halted to the current digit), if there are no possible 
    valid digits, go back to the previous cell (meaning the previous iteration and steps that have been halted will continue).
"""

# If there is a solution, the matrix will be solved, otherwise it will stay as it is.
# The solve method returns a boolean indicating whether the board was solved or not.
# This board and its solution can be found at https://dingo.sbs.arizona.edu/~sandiway/sudoku/examples.html
inputs = [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0]
]

class Board:
    def __init__(self, matrix):
        """
        Constructor for the sudoku board. Matrix is a 2-dimensional array with both arrays having a length of 9.
        """
        self.matrix = matrix

    def __str__(self):
        """
        This method is called when any instance of the Board class
        is passed on to the builtin str function.
        """
        height = len(self.matrix)
        width = len(self.matrix[0])

        result = ''
        
        for y in range(height):

            # This is used to add horizontal dividers to emphasize the 3x3 sub-grids
            if y % 3 == 0 and y != 0:
                line_symbol = ' - ' * 3
                line = ' '.join([line_symbol for n in range(3)])
                result += line + '\n'

            for x in range(width):

                # This is used to add vertical dividers to emphasize the 3x3 sub-grids.
                if x % 3 == 0 and x != 0:
                    result += '|'

                # Empty cells will show up as a ? instead of 0
                if self.matrix[y][x] == 0:
                    result += ' ? '
                else:
                    # Filled cells will show up as they are
                    result += f'{self.matrix[y][x]:^3}'
                
            result += '\n'

        return result

    def __repr__(self):
        """
        This method is called when any instance of the Board class is passed on to the builtin
        repr function. It is also called when the instance is passed on to the builtin print function.
        """
        return self.__str__()

    def test_answer_at(self, x, y, answer):
        """
        Use this to test if a digit at a given position is a valid answer. Returns True if it is,
        otherwise returns False. Note: This ignores checking for the cell where the answer will be placed at.
        """

        # checking if the corresponding row has no occurence of that digit yet
        # the extra condition (index != x) makes it so that it skips the current
        # cell that is being tested the answer for from being checked.
        row = self.matrix[y]
        for index, cell in enumerate(row):
            if answer == cell and index != x:
                return False

        # checking if the corresponding column has no occurence of that digit yet
        # the extra condition (index != y) makes it so that it skips the current cell
        # that is being tested the answer for from being checked.
        column = [ row[x] for row in self.matrix ]
        for index, cell in enumerate(column):
            if answer == cell and index != y:
                return False

        # checking if the corresponding 3x3 subgrid has no occurence of that digit yet
        # anchor point has the coordinates of the corresponding sub-grid's top-and-left-most element
        # in the format (y-coordinate, x-coordinate)
        anchor_point = (y - (y % 3), x - (x % 3))

        for row in range(anchor_point[0], anchor_point[0] + 3):
            for column in range(anchor_point[1], anchor_point[1] + 3):
                # the extra condition is to prevent the current cell being tested on 
                # from being checked
                if self.matrix[row][column] == answer and (row, column) != (y, x):
                    return False

        return True 

    def find_empty_cell(self):
        """
        Use this to find an empty cell. Returns a tuple in the form (x, y) where
        x is the cell's position on x-axis and y is the cell's position on the y-axis.
        If no empty cell is found, this returns a (-1, -1)
        """

        for y, row in enumerate(self.matrix):
            for x, cell in enumerate(row):
                if cell == 0:
                    return (x, y)

        return (-1, -1)

    def solve(self):
        """
        Use this to solve the sudoku board.
        Mutates self.matrix, returns a boolean value indicating
        whether board was solved or not.
        """

        # this function is explained at the top part of this program
        # Step 1: Find an empty cell, if there are no empty cells skip to step 5.
        current_position = self.find_empty_cell()

        # 5. Terminate the whole sequence.
        if current_position == (-1, -1):
            return True

        x, y = current_position

        # Step 2: Test the possible digits (1-9) on that cell
        for answer in range(1, 10):
            if self.test_answer_at(x, y, answer):
                self.matrix[y][x] = answer

                # Step 3: If any working digit is found, go back to step 1 (put the current step 2 on hold).
                if self.solve():
                    return True
 
                self.matrix[y][x] = 0

        # 4. If no working digit is found meaning all (1-9) digits have been tried, set the current cell 
        # back to empty (hence self.matrix[y][x] = 0), and go back to the previous cell that has been filled. 
        # This means that we go back to step 2 of that cell. Do NOT proceed to step 5 from this step.
        return False

if __name__ == '__main__':
    board = Board(inputs)
    print(f'Given Board:\n{board}')
    message = "Solved Board" if board.solve() else "Board Has No Solution"
    print(f'{message}:\n{board}')
