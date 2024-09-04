import { Routes, Route} from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Start from './pages/Start';
import GuessDice from './pages/GuessDice';
import RussianRoulette from './pages/RussianRoulette';
import CardRace from './pages/CardRace';
import BlackJack from './pages/BlackJack';

function App() {

  return (
    //Routers to pages
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/start' element={<Start />} />
      <Route path='/guess-dice' element={<GuessDice />} />
      <Route path='/russian-roulette' element={<RussianRoulette />} /> 
      <Route path='/card-race' element={<CardRace />} />
      <Route path='/black-jack' element={<BlackJack />} />
    </Routes>
  );
}

export default App;
