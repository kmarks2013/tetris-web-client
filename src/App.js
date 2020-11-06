import React from 'react';
import './App.css';
import Tetris from './components/Tetris';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

function App() {
  return (
    <div className="App">
        <Tetris/>
    </div>
  );
}

export default App;
