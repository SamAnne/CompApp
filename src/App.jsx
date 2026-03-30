import { useState } from 'react'
import './App.css'
import {Card, Container, Navbar} from 'react-bootstrap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar>
        <Container>
          <Navbar.Brand href="#home">
            Brand
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        why is nothing there
      </Container>
    </>
  )
}

export default App
