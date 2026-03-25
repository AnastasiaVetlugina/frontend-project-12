import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useEffect, useRef } from "react"
import { useTranslation } from 'react-i18next'

const AddChannelModal = ({ channelNames = [], onAddChannel, onClose }) => {
  const inputRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('validation.usernameMin'))
      .max(20, t('validation.usernameMax'))
      .required(t('validation.required'))
      .notOneOf(channelNames, t('validation.unique')),
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
          console.error(t('errors.channelCreate'), error)
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
                  placeholder={t('modals.addChannel.namePlaceholder')}
                  disabled={isSubmitting}
                />
                <label className="visually-hidden" htmlFor="name">
                  {t('modals.addChannel.nameLabel')}
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
                  {t('modals.addChannel.cancel')}
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {t('modals.addChannel.submit')}
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
