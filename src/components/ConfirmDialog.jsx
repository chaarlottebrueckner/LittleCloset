import React from 'react'

// simple re‑usable confirmation modal styled like the other forms
function ConfirmDialog({ message, onConfirm, onCancel }) {
  if (!message) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p style={{ marginBottom: '20px', fontSize: '1rem' }}>{message}</p>
        <div className="form-buttons">
          <button onClick={onCancel} className="btn btn-secondary">Abbrechen</button>
          <button onClick={onConfirm} className="btn btn-primary">Löschen</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
