import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Pencil, Check } from 'lucide-react'

function KollektionDetail({ kollektion, outfits, onBack, onAddOutfit, onRemoveOutfit, onRename }) {
  const [outfitsOffen, setOutfitsOffen] = useState(false)
  const [nameBearbeiten, setNameBearbeiten] = useState(false)
  const [neuerName, setNeuerName] = useState(kollektion.name)
  const [ausgewaehlt, setAusgewaehlt] = useState([])

  const kollektionOutfits = outfits.filter(o => kollektion.outfitIds?.includes(o.id))
  const verfuegbareOutfits = outfits.filter(o => !kollektion.outfitIds?.includes(o.id))

  function handleRename() {
    if (neuerName.trim()) {
      onRename(kollektion.id, neuerName.trim())
      setNameBearbeiten(false)
    }
  }

  function toggleAuswahl(id) {
    setAusgewaehlt(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleHinzufuegen() {
    ausgewaehlt.forEach(id => onAddOutfit(kollektion.id, id))
    setAusgewaehlt([])
    setOutfitsOffen(false)
  }

  return (
    <div>
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        {nameBearbeiten ? (
          <input
            className="form-input"
            value={neuerName}
            onChange={e => setNeuerName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => e.key === 'Enter' && handleRename()}
            autoFocus
            style={{flex:1, margin:'0 10px'}}
          />
        ) : (
          <h1 className="header" style={{fontSize:'1.4rem', flex:1, textAlign:'center'}}>{kollektion.name}</h1>
        )}
        <button className="action-btn" onClick={() => setNameBearbeiten(!nameBearbeiten)}>
          <Pencil size={15} />
        </button>
      </div>

      {kollektionOutfits.length === 0 && !outfitsOffen ? (
        <div className="empty-state" style={{marginTop:'40px'}}>
          <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="60" fill="#fde8f0"/>
            <rect x="30" y="45" width="25" height="35" rx="4" fill="#e8789e" opacity="0.4"/>
            <rect x="40" y="38" width="2" height="10" rx="1" fill="#e8789e" opacity="0.6"/>
            <rect x="65" y="50" width="20" height="28" rx="4" fill="#e8789e" opacity="0.6"/>
            <rect x="74" y="43" width="2" height="10" rx="1" fill="#e8789e" opacity="0.8"/>
            <circle cx="75" cy="40" r="4" fill="#e8789e" opacity="0.5"/>
            <circle cx="41" cy="35" r="5" fill="#e8789e" opacity="0.3"/>
          </svg>
          <h3 className="empty-title">Noch keine Outfits</h3>
          <p className="empty-subtitle">Füge Outfits zu dieser Kollektion hinzu</p>
          <button className="btn btn-primary" onClick={() => setOutfitsOffen(true)}>
            <Plus size={18} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}}/>
            Outfit hinzufügen
          </button>
        </div>
      ) : (
        <>
          <button className="btn btn-primary btn-full" onClick={() => { setOutfitsOffen(!outfitsOffen); setAusgewaehlt([]) }}>
            <Plus size={18} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}}/>
            {outfitsOffen ? 'Abbrechen' : 'Outfits hinzufügen'}
          </button>

          {outfitsOffen && (
            <div className="filter-panel" style={{marginBottom:'16px'}}>
              <p className="form-label" style={{marginBottom:'12px'}}>Outfits auswählen</p>
              {verfuegbareOutfits.length === 0 ? (
                <p style={{color:'var(--text-light)', fontSize:'0.9rem'}}>Alle Outfits sind bereits in dieser Kollektion.</p>
              ) : (
                <>
                  <div className="kollektion-outfits">
                    {verfuegbareOutfits.map(outfit => (
                      <div
                        key={outfit.id}
                        className={`kollektion-outfit-karte ${ausgewaehlt.includes(outfit.id) ? 'kollektion-outfit-selected' : 'kollektion-outfit-add'}`}
                        onClick={() => toggleAuswahl(outfit.id)}
                      >
                        <div className="outfit-karte-grid">
                          {outfit.items.map(item => (
                            <img key={item.id} src={item.foto} alt={item.typ} className="outfit-karte-foto" />
                          ))}
                        </div>
                        <div className={`outfit-add-overlay ${ausgewaehlt.includes(outfit.id) ? 'outfit-selected-overlay' : ''}`}>
                          {ausgewaehlt.includes(outfit.id)
                            ? <Check size={24} color="white" />
                            : <Plus size={24} color="white" />
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                  {ausgewaehlt.length > 0 && (
                    <button className="btn btn-primary btn-full" style={{marginTop:'12px'}} onClick={handleHinzufuegen}>
                      <Check size={18} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}}/>
                      {ausgewaehlt.length} Outfit{ausgewaehlt.length > 1 ? 's' : ''} hinzufügen
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          <div className="kollektion-outfits">
            {kollektionOutfits.map(outfit => (
              <div key={outfit.id} className="kollektion-outfit-karte">
                <div className="outfit-karte-grid">
                  {outfit.items.map(item => (
                    <img key={item.id} src={item.foto} alt={item.typ} className="outfit-karte-foto" />
                  ))}
                </div>
                <button
                  className="action-btn"
                  style={{position:'absolute', top:'8px', right:'8px'}}
                  onClick={() => onRemoveOutfit(kollektion.id, outfit.id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default KollektionDetail