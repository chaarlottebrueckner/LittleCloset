import { useState } from 'react'
import toast from 'react-hot-toast'

const KATEGORIEN = ['Oberteil', 'Unterteil', 'Ganzkörper', 'Jacken & Cardigans','Schuhe', 'Accessoire']

function OutfitBuilder({ kleidung, onSave, onClose, bearbeiten }) {
  const [auswahl, setAuswahl] = useState(bearbeiten?.items || [])
  const [aktivKategorie, setAktivKategorie] = useState('Oberteil')

  function handleSelect(item) {
  const istAusgewaehlt = auswahl.find(a => a.id === item.id)
  if (istAusgewaehlt) {
    setAuswahl(auswahl.filter(a => a.id !== item.id))
  } else {
    setAuswahl([...auswahl, item])
  }
}

  function isSelected(item) {
    return !!auswahl.find(a => a.id === item.id)
  }

  function handleSubmit() {
  if (auswahl.length === 0) {
    toast.error('Bitte mindestens ein Kleidungsstück auswählen!')
    return
  }

  const wetterSaisons = ['Sommer', 'Übergang', 'Winter']
  const outfitWetter = wetterSaisons.filter(saison =>
    auswahl.every(item => item.wetter?.includes(saison))
  )

  onSave({
    id: bearbeiten?.id || Date.now(),
    items: auswahl,
    wetter: outfitWetter,
  })
}

  const kleidungInKategorie = kleidung.filter(k => k.kategorie === aktivKategorie)

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">{bearbeiten ? 'Outfit bearbeiten' : 'Outfit erstellen'}</h2>

        <div className="form-group">
          <label className="form-label">Kategorie</label>
          <div className="chip-group">
            {KATEGORIEN.map(k => (
              <button
                key={k}
                onClick={() => setAktivKategorie(k)}
                className={`chip ${aktivKategorie === k ? 'chip-active' : ''}`}
              >
                {k}
                {auswahl.filter(a => a.kategorie === k).length > 0 && (
                  <span className="chip-badge">
                    {auswahl.filter(a => a.kategorie === k).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="outfit-grid">
          {kleidungInKategorie.length === 0 ? (
            <p className="empty-text">Keine Kleidung in dieser Kategorie.</p>
          ) : (
            kleidungInKategorie.map(item => (
              <div
                key={item.id}
                className={`outfit-item ${isSelected(item) ? 'outfit-item-selected' : ''}`}
                onClick={() => handleSelect(item)}
              >
                <img src={item.foto} alt={item.typ} className="outfit-item-foto" />
                <span className="outfit-item-typ">{item.typ}</span>
                {isSelected(item) && <div className="outfit-check">✓</div>}
              </div>
            ))
          )}
        </div>

        {auswahl.length > 0 && (
          <div className="outfit-vorschau">
            <label className="form-label">Auswahl ({auswahl.length})</label>
            <div className="outfit-vorschau-grid">
              {auswahl.map(item => (
                <img key={item.id} src={item.foto} alt={item.typ} className="outfit-vorschau-foto" />
              ))}
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button onClick={onClose} className="btn btn-secondary">Abbrechen</button>
          <button onClick={handleSubmit} className="btn btn-primary">Speichern</button>
        </div>
      </div>
    </div>
  )
}

export default OutfitBuilder