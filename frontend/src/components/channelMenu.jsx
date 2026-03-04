const ChannelMenu = ({ channel, currentChannelId, onSwitchChannel, onShowRemove, onShowRename }) => {
  return (
    <div className="d-flex dropdown btn-group w-100">
      <button 
        type="button"
        className={`w-100 rounded-0 text-start text-truncate btn ${channel.id === currentChannelId ? 'btn-secondary' : ''}`}
        onClick={() => onSwitchChannel(channel.id)}
      >
        <span className="me-1">#</span>{channel.name}
      </button>
      
      <button 
        type="button"
        className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span className="visually-hidden">Управление каналом</span>
      </button>
      
      <div className="dropdown-menu">
        <button 
          className="dropdown-item" 
          onClick={onShowRemove}
        >
          Удалить
        </button>
        <button 
          className="dropdown-item"
          onClick={onShowRename}
        >
          Переименовать
        </button>
      </div>
    </div>
  )
}

export default ChannelMenu
