import { Formik, Form, Field } from "formik"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const LoginPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loginError, setLoginError] = useState("")

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src="https://frontend-chat-ru.hexlet.app/assets/avatar-DIE1AEpS.jpg" className="rounded-circle" alt={t('auth.login.title')} />
              </div>
              
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
                    setLoginError(t('auth.login.error'))
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-md-0">
                    <h1 className="text-center mb-4">{t('auth.login.title')}</h1>
                    
                    {loginError && (
                      <div className="alert alert-danger" role="alert">
                        {loginError}
                      </div>
                    )}
                    
                    <div className="form-floating mb-3">
                      <Field
                        name="username"
                        id="username"
                        placeholder={t('auth.login.usernamePlaceholder')}
                        className="form-control"
                        autoComplete="username"
                        required
                      />
                      <label htmlFor="username">{t('auth.login.username')}</label>
                    </div>

                    <div className="form-floating mb-4">
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        placeholder={t('auth.login.passwordPlaceholder')}
                        className="form-control"
                        autoComplete="current-password"
                        required
                      />
                      <label htmlFor="password">{t('auth.login.password')}</label>
                    </div>

                    <button 
                      type="submit" 
                      className="w-100 mb-3 btn btn-outline-primary"
                      disabled={isSubmitting}
                    >
                      {t('auth.login.submit')}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
            
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('auth.login.noAccount')}</span> <Link to="/signup">{t('auth.login.signupLink')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
