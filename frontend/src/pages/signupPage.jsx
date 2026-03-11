import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

const SignupPage = () => {
  const navigate = useNavigate()
  const [signupError, setSignupError] = useState("")
  
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "От 3 до 20 символов")
      .max(20, "От 3 до 20 символов")
      .required("Обязательное поле"),
    password: Yup.string()
      .min(6, "Не менее 6 символов")
      .required("Обязательное поле"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Пароли должны совпадать")
      .required("Обязательное поле"),
  })

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src="https://frontend-chat-ru.hexlet.app/assets/avatar_1-D7Cot-zE.jpg" className="rounded-circle" alt="Регистрация" />
              </div>
              
              <Formik
                initialValues={{ username: "", password: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    setSignupError("")

                    await axios.post("/api/v1/signup", {
                      username: values.username,
                      password: values.password,
                    })

                    const response = await axios.post("/api/v1/login", {
                      username: values.username,
                      password: values.password,
                    })

                    localStorage.setItem("token", response.data.token)
                    navigate("/")
                  } catch (error) {
                    if (error.response?.status === 409) {
                      setSignupError("Такой пользователь уже существует")
                    }
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="w-50">
                    <h1 className="text-center mb-4">Регистрация</h1>
                    
                    {signupError && (
                      <div className="alert alert-danger" role="alert">
                        {signupError}
                      </div>
                    )}

                    <div className="form-floating mb-3">
                      <Field
                        name="username"
                        id="username"
                        placeholder="От 3 до 20 символов"
                        className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                        autoComplete="username"
                        required
                      />
                      <label htmlFor="username">Имя пользователя</label>
                      {errors.username && touched.username && (
                        <div className="invalid-tooltip" placement="right">
                          {errors.username}
                        </div>
                      )}
                    </div>

                    <div className="form-floating mb-3">
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Не менее 6 символов"
                        className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                        autoComplete="new-password"
                        required
                      />
                      <label htmlFor="password">Пароль</label>
                      {errors.password && touched.password && (
                        <div className="invalid-tooltip">
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="form-floating mb-4">
                      <Field
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Пароли должны совпадать"
                        className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                        autoComplete="new-password"
                        required
                      />
                      <label htmlFor="confirmPassword">Подтвердите пароль</label>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="invalid-tooltip">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      className="w-100 btn btn-outline-primary"
                      disabled={isSubmitting}
                    >
                      Зарегистрироваться
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
