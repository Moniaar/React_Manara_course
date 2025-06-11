import { useState } from 'react'
import './App.css'
import Navbar from './Navbar'

function App() {
  const [count, setCount] = useState(0)
  var hello = ' hi from above here hehe ';
  return ( 
    <>
      <Navbar />
      <h1>{hello}</h1>
    </>
  )
}

export default App
