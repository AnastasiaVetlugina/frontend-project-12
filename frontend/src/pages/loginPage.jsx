import { Formik, Form, Field } from "formik"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState("")

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setLoginError("")

          const response = await axios.post("/api/v1/login", {
            username: values.username,
            password: values.password,
          })

          localStorage.setItem("token", response.data.token)
          navigate("/")
        } catch (error) {
          setLoginError(
            "Неверный ник или пароль. Пожалуйста, попробуйте снова.",
          )
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="col-12 col-md-6 mt-3 mt-md-0">
          <h1 className="text-center mb-4">Войти</h1>
          {loginError && (
            <div className="alert alert-danger" role="alert">
              {loginError}
            </div>
          )}
          <div className="form-floating mb-3">
            <Field
              name="username"
              id="username"
              placeholder="Ваш ник"
              className="form-control"
              autoComplete="username"
              required
            />
            <label htmlFor="username">Ваш ник</label>
          </div>

          <div className="form-floating mb-4">
            <Field
              type="password"
              name="password"
              id="password"
              placeholder="Пароль"
              className="form-control"
              autoComplete="current-password"
              required
            />
            <label htmlFor="password">Пароль</label>
          </div>

          <button 
            type="submit" 
            className="w-100 mb-3 btn btn-outline-primary"
            disabled={isSubmitting}
          >
            Войти
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default LoginPage
