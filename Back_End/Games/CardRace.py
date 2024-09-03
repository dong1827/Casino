from .Deck import Deck

class CardRace:

    def __init__(self):
        self.deck = Deck()
        self.deck.shuffle()

    def result(self):
        cards = self.deck.get_deck()
        checkpoint = 0
        checkpoint_cards = cards[0:6]
        suits = {"Spades": 0, "Clubs": 0, "Hearts": 0, "Diamonds": 0}
        winner = ""

        for i in range(6, 53):
            cur_suit = cards[i][1]
            if (cards[i][0] != 1):
                suits[cur_suit] += 1
            
            if (min(suits.values()) > checkpoint):
                drawback_card = checkpoint_cards[checkpoint]
                suits[drawback_card[1]] -= 1
                checkpoint += 1

            if (max(suits.values()) == 7):
                winner = cur_suit
                break

        return [cards, winner]

        

        