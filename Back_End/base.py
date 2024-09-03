from flask import Flask, request, session, json
from flask_cors import CORS
import pyodbc
from datetime import timedelta
import Games.GuessDice as GuessDice
from Games.RussianRoulette import Gun
from Games.CardRace import CardRace
from Games.BlackJack import BlackJack
import Config

app = Flask(__name__)
app.config.from_object(Config.Config)

CORS(app, supports_credentials=True)

#Establishing a database connection
def get_connection():
    #Find other ways to do this
    server = "DESKTOP-KMAD9BP"
    database = "Casino"
    user = app.config["USER"]
    password = app.config["PASSWORD"]
    driver = "{ODBC Driver 17 for SQL Server}"

    connection_string = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={user};PWD={password}'

    try:
        conn = pyodbc.connect(connection_string)
        return conn
    except pyodbc.Error as e:
        # Change this to something else later
        print(f"An error has occured while connecting to database: {e}")

#Makes session permanent as long as the user leave their browser open
@app.before_request
def make_session_permanent():
    session.permanent = True
    session.modified = True


@app.route('/register', methods = ['post'])
#Try to register the user into the database and return whether it was success
def register(): 
    res_body = {"register": "fail", "Msg": "An error has occured"}
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    sql = "INSERT INTO Users (username, password) VALUES (?, ?)"
    conn = get_connection()
    cursor = conn.cursor()

    #Trying to insert username and password into database
    try:
        cursor.execute(sql, username, password)
        cursor.commit()
        res_body["register"] = "success"
        res_body["Msg"] = "Succuessfully registered"
    #Add in custom message
    except pyodbc.IntegrityError:
        res_body["register"] = "fail"
        res_body["Msg"] = "Username already exists"

    except ValueError as ve:
        res_body["register"] = "fail"
        res_body["Msg"] = f"Invalid input: {str(ve)}"

    except Exception as e:
        res_body["register"] = "fail"
        res_body["Msg"] = "An error has occured"

    return res_body
    


@app.route('/login', methods = ['post'])
#Try to log the user in and return whether it was successful
def login():
    res_body = {"login": "fail"}

    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    #Grab the user's password
    sql = "SELECT Password FROM Users WHERE Username = ?"
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(sql, username)
    result = cursor.fetchall()

    #Check if the passwords match
    if result:
        if (result[0][0] == password): 
            session["user"] = username
            res_body["login"] = "success"

            sql = "SELECT points FROM Points WHERE username = ?"
            cursor.execute(sql, username)
            result = cursor.fetchall()

            session["points"] = int(result[0][0])

    return res_body

@app.route('/logout', methods = ['post'])
def logout(): 
    res_body = {"result": "None"}
    session.clear()
    res_body["result"] = "success"

    return res_body

@app.route('/session', methods = ['get'])
#Check if there's an active session
def get_session(): 
    res_body = {"session": "None"}

    if ("user" in session):
        res_body["session"] = session["user"]
        res_body["points"] = session["points"]

    return res_body


@app.route('/guess-dice/bet', methods = ['post'])
#Return the result of the bet 
def guess_dice():
    res_body = {"result": "None", "dice": "None", "points": 0, "earned": 0}
    data = request.get_json()
    earned = int(data["amount"])

    #Roll the dice and determine the result
    #Refactor this by using temporary variables
    res_body["dice"] = GuessDice.roll_dice()
    res_body["result"] = GuessDice.determine_result(data["answer"], res_body["dice"])
    
    #Calculating points 
    if (res_body["result"] == "lose"):
        earned = 0 - earned

    add_points(earned)

    res_body["points"] = session["points"]
    res_body["earned"] = earned

    return res_body


@app.route('/russian-roulette/bet', methods = ['post'])
def russian_roulette():

    #Check data integrity
    res_body = {"hit": "", "current": "", "points": 0, "earned": 0}
    data = request.get_json()

    if (("gun" not in session) or (data["restart"])):
        gun = Gun()
        gun.load(data["bullets"])
    else: 
        gun_data = session["gun"]
        gun = Gun(gun_data[0], gun_data[1])
        if (gun.check()):
            gun = Gun()
            gun.load(data["bullets"])

    is_hit = gun.fire()

    if (is_hit == "miss"):
        earned = gun.cal_points(data["amount"])
    else:
        session.pop("gun", None)
        earned = 0 - int(data["amount"]) 
    
    
    add_points(earned)

    res_body["hit"] = is_hit
    res_body["current"] = gun.get_pos()
    res_body["points"] = session["points"]
    res_body["earned"] = earned
    session["gun"] = gun.store()

    return res_body


@app.route('/Card-Race/bet', methods = ['post'])
def card_race():
    res_body = {"cards": "", "result": "", "points": 0, "earned": 0}
    data = request.get_json()

    earned = 0
    race = CardRace()
    result = race.result()

    if (data["choice"] == result[1]):
        earned = 3 * int(data["amount"])
    else: 
        earned = 0 - int(data["amount"])

    add_points(earned)

    res_body["cards"] = result[0]
    res_body["result"] = result[1]
    res_body["points"] = session["points"]
    res_body["earned"] = earned

    return res_body

@app.route('/Black-Jack/bet', methods = ['post'])
def black_jack(): 
    res_body = {"player": "", "dealer": "", "result": "", "points": 0, "earned": 0}
    data = request.get_json()
    result = "" 
    earned = 0

    if ("deck" in session):
        blj = BlackJack(session["deck"], session["blj_player"], session["blj_dealer"])

        if (data["action"]) == "hit":
            res = blj.hit()
            if res == "exceed":
                result = "dealer won"

        elif (data["action"]) == "stand":
            blj.stand()
            result = blj.result()
            res_body["result"] = result
        
        session["deck"] = blj.get_deck()
        if result != "": 
            if result == "player won":
                earned = int(data["amount"])
            elif result == "dealer won":
                earned = 0 - int(data["amount"])

            add_points(earned)
            session.pop("deck")

    else:   
        blj = BlackJack()
        blj.initialize()
        session["deck"] = blj.get_deck()
    
    cards = blj.get_cards()
    session["blj_player"] = cards[0]
    session["blj_dealer"] = cards[1]

    res_body["player"] = session["blj_player"][0]
    res_body["dealer"] = session["blj_dealer"][0]
    res_body["result"] = result
    res_body["earned"] = earned
    res_body["points"] = session["points"]

    return res_body


def add_points(earned):

    session["points"] += earned

    sql = "UPDATE Points SET points = ? WHERE username = ?"
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(sql, session["points"], session['user'])
    cursor.commit()


app.run(debug=True)