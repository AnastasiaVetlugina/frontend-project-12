import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from 'yup'
import { useEffect, useRef, useState } from 'react'

const RenameChannelModal = ({ channel, onClose, onRename, channelNames }) => {
  const inputRef = useRef(null)
  const [renaming, setRenaming] = useState(false)
  const otherNames = channelNames.filter(name => name !== channel.name)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .notOneOf(otherNames, 'Должно быть уникальным'),
  })

  return (
    <>
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <Formik
            initialValues={{ name: channel.name }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              setRenaming(true)
              try {
                await onRename(channel.id, values.name)
                onClose()
              } catch (error) {
                console.error('Ошибка:', error)
                setRenaming(false)
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="modal-title h4">Переименовать канал</div>
                    <button 
                      type="button" 
                      aria-label="Close" 
                      className="btn-close"
                      onClick={onClose}
                      disabled={renaming}
                    />
                  </div>
                  
                  <div className="modal-body">
                    <div className="mb-3">
                      <Field
                        name="name"
                        id="name"
                        innerRef={inputRef}
                        className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                        disabled={renaming}
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
                        disabled={renaming}
                      >
                        Отменить
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={renaming}
                      >
                        Отправить
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}

export default RenameChannelModal
