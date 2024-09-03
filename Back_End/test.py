from Games.Deck import Deck
from Games.BlackJack import BlackJack


def test():
    bj = BlackJack()
    bj.initialize()

    print(bj.get_cards()[0])


if __name__ == "__main__":
    test()