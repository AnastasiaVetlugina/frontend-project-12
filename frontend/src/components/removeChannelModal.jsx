import { useState } from 'react'

const RemoveChannelModal = ({ channel, onClose, onRemove }) => {
  const [removing, setRemoving] = useState(false)

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await onRemove(channel.id)
      onClose()
    } catch (error) {
      console.error('Ошибка удаления:', error)
      setRemoving(false)
    }
  }

  return (
    <>
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">Удалить канал</div>
              <button 
                type="button" 
                aria-label="Close" 
                className="btn-close"
                onClick={onClose}
                disabled={removing}
              />
            </div>
            
            <div className="modal-body">
              <p className="lead">Уверены?</p>
              <div className="d-flex justify-content-end">
                <button 
                  type="button" 
                  className="me-2 btn btn-secondary"
                  onClick={onClose}
                  disabled={removing}
                >
                  Отменить
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleRemove}
                  disabled={removing}
                >
                  Удалить
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
