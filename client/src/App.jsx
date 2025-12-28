// import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'

import CreateRoom from "./components/CreateRoom"
import Room from "./components/Room"

import './App.css'

function App() {

  return (
    
      <div>
        hello world
        <BrowserRouter>
          <Routes>
            <Route path="/room/create" element={<CreateRoom/>}></Route>
            <Route path="/room/:roomID" element={<Room/>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
     
    
  )
}

export default App
