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

class User {
  constructor(name, age) {
  this.name = name;
  this.age = age;
  }
  getName() {
    return this.name + ' is ' + this.age + ' years old';
  }

function App() {
  const [count, setCount] = useState(0)
  var hello = ' sir you fine? ';
  const user = new User('Omnia', 25);
  console.log(user.getName());
  return ( 
    <>
      <Navbar />
      <h1>{hello}</h1>
      {list.map(function(item) {
        return (
            <div key={item.objectID}>
              <span><a href={item.url}>{item.title}</a></span>
            </div>
        );
        })}
    </>
  )
}

export default App
