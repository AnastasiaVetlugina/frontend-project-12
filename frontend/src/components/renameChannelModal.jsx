import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from 'yup'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const RenameChannelModal = ({ channel, onClose, onRename, channelNames }) => {
  const inputRef = useRef(null)
  const [renaming, setRenaming] = useState(false)
  const { t } = useTranslation()
  const otherNames = channelNames.filter(name => name !== channel.name)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('validation.channelNameMin'))
      .max(20, t('validation.channelNameMax'))
      .required(t('validation.required'))
      .notOneOf(otherNames, t('validation.unique')),
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
                console.error(t('errors.channelRename'), error)
                setRenaming(false)
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="modal-title h4">{t('modals.renameChannel.title')}</div>
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
                        {t('modals.renameChannel.nameLabel')}
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
                        {t('modals.renameChannel.cancel')}
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={renaming}
                      >
                        {t('modals.renameChannel.submit')}
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
