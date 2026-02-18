import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/loginPage.jsx"
import ChatPage from "./pages/chatPage.jsx"
import NotFoundPage from "./pages/notFound.jsx"

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" />
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
