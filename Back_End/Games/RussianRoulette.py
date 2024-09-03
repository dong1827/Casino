import random
import math

class Gun:
    def __init__(self, bullet_pos = None, pos = 0):
        if (bullet_pos == None): 
            self.bullet_pos = []
        else:
            self.bullet_pos = bullet_pos
        
        self.pos = pos

    def load(self, num_bullets):
        bul_pos = set()

        while (len(bul_pos) < num_bullets): 
            load_pos = random.randint(1, 6)
            bul_pos.add(load_pos)
        
        self.bullet_pos = list(bul_pos)

        return (self.bullet_pos)

    def fire(self):
        self.pos += 1
        if self.pos in self.bullet_pos:
            return "hit"
        else:
            return "miss"
            
        
    def cal_points(self, amount):
        if self.check():
            return 
        
        bullets = len(self.bullet_pos)
        total = 6 + 1 - self.pos

        miss = total - bullets
        hit = total - miss

        #Use ceil so player can win money. Use floor to make player lose money
        temp = float(amount)
        points = math.ceil((hit/miss) * temp)
        return points

    def get_pos(self):
        return self.pos
    
    def check(self):
        first = min(self.bullet_pos)
        return (self.pos >= first)
     
    def store(self): 
        string = [self.bullet_pos, self.pos]

        return string

