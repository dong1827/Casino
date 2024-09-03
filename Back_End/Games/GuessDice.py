import random 

#Get 3 random dice rolls
def roll_dice(): 
    roll1 = random.randint(1,6)
    roll2 = random.randint(1,6)
    roll3 = random.randint(1,6)

    result = [roll1, roll2, roll3]
    return (result)

#Compare the results 
def determine_result(guess, dice):
    result = ""
    roll = ""
    dice_sum = sum(dice)
    
    if dice_sum > 10: 
        roll = "High"
    else: 
        roll = "Low"


    if (guess == roll):
        result = "win"
    else:
        result = "lose"

    return result