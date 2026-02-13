import { Formik, Form, Field } from "formik"

const LoginPage = () => {
return (
  <Formik
    initialValues={{ username: '', password: '' }}
    onSubmit={(values, { setSubmitting }) => {
    console.log('Form values:', values)
    console.log('Form is validated! Submitting the form...')
    setSubmitting(false)
    }}
>
    {() => (
      <Form className="col-12 col-md-6 mt-3 mt-md-0">
        <h1 className="text-center mb-4">Войти</h1>
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
        >
            Войти
        </button>
      </Form>
    )}
  </Formik>
  )
}

export default LoginPage
