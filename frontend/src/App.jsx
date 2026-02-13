import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/loginPage.jsx'
import NotFoundPage from './pages/notFound.jsx'

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </BrowserRouter>
    )
}

export default App
