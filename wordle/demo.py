import random
words = []

# load the word list
with open('five_letter_words.txt', 'r') as words_file:
    words = [line.rstrip() for line in words_file]

# helper to automatically parse inputs
def custom_input(question):
    indices = input(question).split(',')

    if (len(indices) == 1 and len(indices[0].strip()) == 0):
        return []

    return list(map(lambda x: int(x) - 1, indices))

# use to prompt for inputs
def ask(word=''):
    green = custom_input('Green (Right placement): ')
    yellow = custom_input('Yellow (Wrong placement): ')
    gray = custom_input('Gray (Non-existent): ')

    return guess(word, green, yellow, gray)

# guesses a new word according to previous word and its state
def guess(previous_word='', green=[], yellow=[], gray=[]):
    if (len(previous_word) == 0): return random.choice(words)

    right_placement = list(map(lambda x: previous_word[x], green))
    wrong_placement = list(map(lambda x: previous_word[x], yellow))
    non_existent = list(map(lambda x: previous_word[x], gray))
    non_existent = list(filter(lambda x: x not in (right_placement + wrong_placement), non_existent))

    for index in range(len(words)-1, -1, -1):
        word = words[index]

        # skip and remove words with non-existent letters
        if (len(non_existent) > 0 and any(letter in non_existent for letter in word)):
            del words[index]
            continue

        # skip and remove words which do not have the right placement of green letters
        if (len(green) > 0 and not all(word[green_index] == previous_word[green_index] for green_index in green)):
            del words[index]
            continue
 
        # delete words that have letters on wrong placement
        if (len(yellow) > 0 and any(word[yellow_index] == previous_word[yellow_index] for yellow_index in yellow)):
            del words[index]
            continue

        if (len(yellow) and not all(letter in word for letter in wrong_placement)):
            del words[index]
            continue 

    return random.choice(words)

# decorates given text with borders
def add_border(text):
    lines = text.splitlines()
    width = max(len(x) for x in lines)
    result = ['┌' + '─' * width + '┐']
    for line in lines:
        result.append('│' + (line + ' ' * width)[:width] + '│')
    result.append('└' + '─' * width + '┘')
    return '\n'.join(result)

def prettify(word):
    return add_border(' '.join(list(word.upper())) + '\n1 2 3 4 5')

# Either chooses a random word or prompts the user
def get_initial_word():
    initial_word = random.choice(words)
    print(prettify(initial_word))

    if input('Enter word of your choice? (y/n) ') == 'y':
        initial_word = input('Enter your word: ').lower()

    while input('Is the initial word okay? (y/n) ') == 'n':
        initial_word = random.choice(words)
        print(prettify(initial_word))

    return initial_word

# This is the loop that runs for the solver
def loop():
    print('Wordle-Solver')
    print('Input the corresponding numbers signifying letters according to the rule. Make sure, your answers are comma-separated.') 
    
    attempts = 1
    max_attempts = 6
    found_answer = False

    word = get_initial_word()

    while attempts <= max_attempts:
        print(prettify(word))
        next_word = ask(word)

        if (word == next_word):
            found_answer = True
            break

        word = next_word
        attempts += 1

    if found_answer:
        print('Found Answer:\n' + prettify(word))
    else:
        print(f'Failed to find answer within {max_attempts}')

    print('Program End.')

# runs only when run as a script
if __name__ == '__main__':
    loop()
