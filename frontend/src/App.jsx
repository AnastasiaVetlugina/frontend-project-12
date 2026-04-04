import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/loginPage.jsx"
import SignupPage from "./pages/signupPage.jsx"
import ChatPage from "./pages/chatPage.jsx"
import NotFoundPage from "./pages/notFound.jsx"
import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import { isAuthenticated } from "./api/authApi"

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />
  }
  return children;
};

function App() {
  const { t } = useTranslation()
  const authenticated = isAuthenticated()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    window.location = '/login'
  }

  return (
    <BrowserRouter>
      <div className="d-flex flex-column h-100">
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <a className="navbar-brand" href="/">{t('app.title')}</a>
            {authenticated && (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleLogout}
              >
                {t('app.logout')}
              </button>
            )}
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </BrowserRouter>
  )
}

export default App
