import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

function OutfitKarte({ outfit, onDelete, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: outfit.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative',
  }

  return (
    <div ref={setNodeRef} style={style} className={`outfit-karte ${isDragging ? 'outfit-karte-dragging' : ''}`}>
      <div className="outfit-karte-drag-handle" {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>
      <div className="outfit-karte-grid">
        {outfit.items.map(item => (
          <img key={item.id} src={item.foto} alt={item.typ} className="outfit-karte-foto" />
        ))}
      </div>
      <div className="outfit-karte-actions">
        <button className="action-btn" onClick={() => onEdit(outfit)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className="action-btn" onClick={() => onDelete(outfit.id)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/><path d="M9,6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default OutfitKarte