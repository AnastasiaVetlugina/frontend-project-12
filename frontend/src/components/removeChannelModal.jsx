import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const RemoveChannelModal = ({ channel, onClose, onRemove }) => {
  const [removing, setRemoving] = useState(false)
  const { t } = useTranslation()

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await onRemove(channel.id)
      onClose()
    } catch (error) {
      console.error(t('errors.channelDelete'), error)
      setRemoving(false)
    }
  }

  return (
    <>
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">{t('modals.removeChannel.title')}</div>
              <button 
                type="button" 
                aria-label="Close" 
                className="btn-close"
                onClick={onClose}
                disabled={removing}
              />
            </div>
            
            <div className="modal-body">
              <p className="lead">{t('modals.removeChannel.confirmMessage')}</p>
              <div className="d-flex justify-content-end">
                <button 
                  type="button" 
                  className="me-2 btn btn-secondary"
                  onClick={onClose}
                  disabled={removing}
                >
                  {t('modals.removeChannel.cancel')}
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleRemove}
                  disabled={removing}
                >
                  {t('modals.removeChannel.submit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RemoveChannelModal
