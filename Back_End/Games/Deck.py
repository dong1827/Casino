import random

class Deck:
    cards = None
    counter = None

    def __init__(self, new_cards=None):
        if new_cards is None:
            self.cards = []
            for i in range(1, 14):
                self.cards.append((i, "Hearts"))
                self.cards.append((i, "Diamonds"))
                self.cards.append((i, "Clubs"))
                self.cards.append((i, "Spades"))
            self.shuffle()
        else: 
            self.cards = new_cards[0]
            self.counter = new_cards[1]


    def shuffle(self):
        self.counter = -1

        for _ in range(300, random.randint(300, 1000)):
            swap1 = random.randint(0, 51)
            swap2 = random.randint(0, 51)

            temp = self.cards[swap1]
            self.cards[swap1] = self.cards[swap2]
            self.cards[swap2] = temp

        for _ in range(0, 3):
            cut = random.randint(10, 40)
            temp_cards = []
            for i in range(cut, 52):
                temp_cards.append(self.cards[i])

            for i in range(0, cut):
                temp_cards.append(self.cards[i])
   
            self.cards = temp_cards

    def deal(self):
        if self.counter == 51:
            self.shuffle()
            
        self.counter += 1
        return(self.cards[self.counter])
    
    def get_deck(self):
        return self.cards
    
    def get_counter(self):
        return self.counter