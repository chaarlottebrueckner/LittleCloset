import { X, Plus } from 'lucide-react'
import { Sun, Leaf, Snowflake } from 'lucide-react'

function KleidungDetail({ item, outfits, onClose, onOutfitErstellen }) {
  const itemOutfits = outfits.filter(o => o.items.some(i => i.id === item.id))

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <img src={item.foto} alt={item.typ} className="kleidung-detail-foto" />

        <div className="kleidung-detail-info">
          <span className="kleidung-detail-typ">{item.typ}</span>
          <span className="kleidung-detail-kategorie">{item.kategorie}</span>
          {item.wetter?.length > 0 && (
            <div style={{display:'flex', gap:'6px', marginTop:'6px'}}>
              {item.wetter.map(w => (
                <span key={w} className="chip chip-active" style={{padding:'4px 12px', fontSize:'0.78rem'}}>
                  {w === 'Sommer' && <Sun size={12} />}
                  {w === 'Übergang' && <Leaf size={12} />}
                  {w === 'Winter' && <Snowflake size={12} />}
                  {w}
                </span>
              ))}
            </div>
          )}
        </div>

        {itemOutfits.length > 0 && (
          <div className="kleidung-detail-outfits">
            <p className="form-label" style={{marginBottom:'12px'}}>
              Outfits mit diesem Teil ({itemOutfits.length})
            </p>
            {itemOutfits.map(outfit => (
              <div key={outfit.id} className="kollektion-outfit-karte" style={{marginBottom:'10px'}}>
                <div className="outfit-karte-grid">
                  {outfit.items.map(i => (
                    <img key={i.id} src={i.foto} alt={i.typ} className="outfit-karte-foto" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {itemOutfits.length === 0 && (
          <p style={{color:'var(--text-light)', fontSize:'0.9rem', textAlign:'center', margin:'16px 0'}}>
            Dieses Teil ist noch in keinem Outfit.
          </p>
        )}

        <button className="btn btn-primary btn-full" style={{marginTop:'8px'}} onClick={onOutfitErstellen}>
          <Plus size={18} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}}/>
          Outfit erstellen
        </button>

        <button className="btn btn-secondary btn-full" style={{marginTop:'8px'}} onClick={onClose}>
          <X size={16} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}}/>
          Schließen
        </button>

      </div>
    </div>
  )
}

export default KleidungDetail