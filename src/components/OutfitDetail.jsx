import { X, Sun, Leaf, Snowflake } from 'lucide-react'

function OutfitDetail({ outfit, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Outfit</h2>

        {outfit.wetter?.length > 0 && (
          <div style={{display:'flex', gap:'6px', marginBottom:'16px'}}>
            {outfit.wetter.map(w => (
              <span key={w} className="chip chip-active" style={{padding:'4px 12px', fontSize:'0.78rem'}}>
                {w === 'Sommer' && <Sun size={12} />}
                {w === 'Übergang' && <Leaf size={12} />}
                {w === 'Winter' && <Snowflake size={12} />}
                {w}
              </span>
            ))}
          </div>
        )}

        <div className="outfit-detail-grid">
          {outfit.items.map(item => (
            <div key={item.id} className="outfit-detail-item">
              <img src={item.foto} alt={item.typ} className="outfit-detail-foto" />
              <span className="outfit-detail-typ">{item.typ}</span>
              <span className="outfit-detail-kategorie">{item.kategorie}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-secondary btn-full" style={{marginTop:'8px'}} onClick={onClose}>
          <X size={16} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}}/>
          Schließen
        </button>
      </div>
    </div>
  )
}

export default OutfitDetail