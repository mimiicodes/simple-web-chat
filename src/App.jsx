import './App.scss'
// import PromptPage from './PromptPage/PromptPage'
import ChatApp from './ChatApp/ChatApp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ChatApp />} />
          {/* <Route path='/chatapp' element={<ChatApp />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
