import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useEffect, useRef } from "react"

const AddChannelModal = ({ channelNames = [], onAddChannel, onClose }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "От 3 до 20 символов")
      .max(20, "От 3 до 20 символов")
      .required("Обязательное поле")
      .notOneOf(channelNames, "Должно быть уникальным"),
  })

  return (
    <Formik
      initialValues={{ name: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await onAddChannel(values.name)
          resetForm()
          onClose()
        } catch (error) {
          console.error("Ошибка:", error)
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">Добавить канал</div>
              <button 
                type="button" 
                aria-label="Close" 
                className="btn-close"
                onClick={onClose}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="modal-body">
              <div className="mb-3">
                <Field
                  name="name"
                  id="name"
                  innerRef={inputRef}
                  className={`form-control ${errors.name && touched.name ? "is-invalid" : ""}`}
                  placeholder="Имя канала"
                  disabled={isSubmitting}
                />
                <label className="visually-hidden" htmlFor="name">
                  Имя канала
                </label>
                <ErrorMessage 
                  name="name" 
                  component="div" 
                  className="invalid-feedback" 
                />
              </div>
              
              <div className="d-flex justify-content-end">
                <button 
                  type="button" 
                  className="me-2 btn btn-secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Отменить
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AddChannelModal
