from .Deck import Deck

#Define a new player class instead 
class BlackJack: 

    def __init__(self, deck=None, player=None, dealer=None,):
        self.deck = Deck(deck)
        self.player = Player(player)
        self.dealer = Player(dealer)

    
    def initialize(self):
        self.player.add_card(self.deck.deal())
        self.player.add_card(self.deck.deal())

        self.dealer.add_card(self.deck.deal())
        self.dealer.add_card(self.deck.deal())

    def hit(self):
        result = self.player.add_card(self.deck.deal())                

        return (result)
    
    def stand(self):
        while (self.dealer.get_info()[1] <= 18 and self.dealer.get_info()[1] != -1):
            self.dealer.add_card(self.deck.deal())
        
        return()
    
    def result(self):
        result = ""
        if self.player.get_info()[1] > self.dealer.get_info()[1]:
            result = "player won"
        else:
            result = "dealer won"

        return result 

    def get_cards(self):
        player_info = self.player.get_info()
        dealer_info = self.dealer.get_info()
        return([player_info, dealer_info])
    
    def get_deck(self):
        return([self.deck.get_deck(), self.deck.get_counter()])

class Player:

    def __init__(self, player=None):
        self.cards = []
        self.points = 0
        if player is not None:
            self.cards = player[0]
            self.points = player[1] 

    def add_card(self, card):
        append_card = card
        
        if card[0] in (11, 12, 13):
            self.points += 10
        elif card[0] == 1: 
            self.points += 11
            append_card = (14, card[1])
        else: 
            self.points += card[0]

        self.cards.append(append_card) 
            
        if self.points > 21: 
            for i in range(0, len(self.cards)): 
                cur_card = self.cards[i]
                if cur_card[0] == 14:
                    self.points -= 10
                    self.cards[i] = [1, card[1]]
                    break

            if self.points > 21:
                self.points = -1
                return ("exceed")
            
        return("under")
    
    def get_info(self):
        return([self.cards, self.points])