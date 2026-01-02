// import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import CreateRoom from "@/components/CreateRoom"
import Room from "@/components/Room"
import AuthForm from "@/components/login/AuthForm"

import './App.css'

function App() {

  return (
    
      <div>
        hello world
        <BrowserRouter>
          <Routes>
            <Route path="/room/create" element={<CreateRoom/>}></Route>
            <Route path="/room/:roomID" element={<Room/>}></Route>
            <Route path="/login" element={<AuthForm/>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
     
    
  )
}

export default App
