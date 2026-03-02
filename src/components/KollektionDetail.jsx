import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

function KollektionDetail({ kollektion, outfits, onBack, onAddOutfit, onRemoveOutfit }) {
  const kollektionOutfits = outfits.filter(o => kollektion.outfitIds?.includes(o.id))
  const verfuegbareOutfits = outfits.filter(o => !kollektion.outfitIds?.includes(o.id))

  return (
    <div className="container">
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="header" style={{fontSize:'1.4rem'}}>{kollektion.name}</h1>
        <div style={{width:'40px'}} />
      </div>

      {kollektionOutfits.length === 0 ? (
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
        </div>
      ) : (
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
      )}

      {verfuegbareOutfits.length > 0 && (
        <div className="outfit-hinzufuegen">
          <h3 className="form-label" style={{marginBottom:'12px'}}>Outfit hinzufügen</h3>
          <div className="kollektion-outfits">
            {verfuegbareOutfits.map(outfit => (
              <div
                key={outfit.id}
                className="kollektion-outfit-karte kollektion-outfit-add"
                onClick={() => onAddOutfit(kollektion.id, outfit.id)}
              >
                <div className="outfit-karte-grid">
                  {outfit.items.map(item => (
                    <img key={item.id} src={item.foto} alt={item.typ} className="outfit-karte-foto" />
                  ))}
                </div>
                <div className="outfit-add-overlay">
                  <Plus size={24} color="white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default KollektionDetail