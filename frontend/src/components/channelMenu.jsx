import { useTranslation } from 'react-i18next'
import profanity from '../utils/profanity'

const ChannelMenu = ({ channel, currentChannelId, onSwitchChannel, onShowRemove, onShowRename }) => {
  const { t } = useTranslation()
  const displayName = profanity.clean(channel.name)

  return (
    <div className="d-flex dropdown btn-group w-100">
      <button 
        type="button"
        className={`w-100 rounded-0 text-start text-truncate btn ${channel.id === currentChannelId ? 'btn-secondary' : ''}`}
        onClick={() => onSwitchChannel(channel.id)}
        aria-label={displayName}
      >
        <span className="me-1">#</span>{displayName}
      </button>
      
      <button 
        type="button"
        className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span className="visually-hidden">{t('chat.channelManagement')}</span>
      </button>
      
      <div className="dropdown-menu">
        <button 
          className="dropdown-item" 
          onClick={onShowRemove}
        >
          {t('chat.delete')}
        </button>
        <button 
          className="dropdown-item"
          onClick={onShowRename}
        >
          {t('chat.rename')}
        </button>
      </div>
    </div>
  )
}

export default ChannelMenu
