import { Pencil, Trash2 } from 'lucide-react'

function KollektionKarte({ kollektion, onClick, onDelete, onEdit }) {
  const coverFoto = kollektion.outfitIds?.length > 0 && kollektion.vorschau
    ? kollektion.vorschau
    : null

  return (
    <div className="kollektion-karte" onClick={onClick}>
      <div className="kollektion-cover">
        {coverFoto ? (
          <img src={coverFoto} alt={kollektion.name} className="kollektion-cover-img" />
        ) : (
          <div className="kollektion-cover-leer">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#fde8f0"/>
              <path d="M12 28 L12 16 Q12 14 14 14 L26 14 Q28 14 28 16 L28 28" stroke="#e8789e" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M10 28 L30 28" stroke="#e8789e" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 14 L17 11 Q17 10 18 10 L22 10 Q23 10 23 11 L23 14" stroke="#e8789e" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        )}
        <div className="kollektion-actions" onClick={e => e.stopPropagation()}>
          <button className="action-btn" onClick={() => onEdit(kollektion)}>
            <Pencil size={13} />
          </button>
          <button className="action-btn" onClick={() => onDelete(kollektion.id)}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div className="kollektion-info">
        <span className="kollektion-name">{kollektion.name}</span>
        <span className="kollektion-anzahl">{kollektion.outfitIds?.length || 0} Outfits</span>
      </div>
    </div>
  )
}

export default KollektionKarte