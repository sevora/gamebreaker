words = []
with open('all_words.txt', 'r') as word_files:
    for word in word_files:
        clean_word = word.strip()
        if (len(clean_word) == 5):
            words.append(clean_word)

with open('five_letter_words.txt', 'w') as result_file:
    result_file.write('\n'.join(words))
