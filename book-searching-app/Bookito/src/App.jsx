import { useState } from 'react'
import './App.css'
import Navbar from './Navbar'

const list = [ 
  {
  author: 'Omnia',
  url: 'https://github.com/Moniaar',
  title: 'My GitHub',
  description: 'Check out my GitHub profile for projects and contributions.',
  },
  {
  title: 'My Portfolio',
  url: 'https://github.com/Moniaar/Official-Portfolio',
  author: 'Omnia',
  description: 'Explore my portfolio showcasing my work and skills.',
  },
];


function App() {
  const [count, setCount] = useState(0)
  var hello = ' sir you fine? ';
  const list = [ 
  {
  author: 'Omnia',
  url: 'https://github.com/Moniaar',
  title: 'My GitHub',
  description: 'Check out my GitHub profile for projects and contributions.',
  },
  {
  title: 'My Portfolio',
  url: 'https://github.com/Moniaar/Official-Portfolio',
  author: 'Omnia',
  description: 'Explore my portfolio showcasing my work and skills.',
  },
];

  return ( 
    <>
      <Navbar />
      <h1>{hello}</h1>
      {list.map(function(item) {
        return <div>{item.title}</div>;
        })}
    </>
  )
}

export default App
