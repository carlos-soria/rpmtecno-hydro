import './App.css';

import ListaServicios from './components/ListaServicios';

import { Route, Routes } from 'react-router-dom';



export default function App(){
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/servicios' element={<ListaServicios/> } />
      </Routes>

    </div>
  );
}

