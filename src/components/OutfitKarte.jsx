import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import OutfitDetail from './OutfitDetail'

function OutfitKarte({ outfit, onDelete, onEdit }) {
  const [detailOffen, setDetailOffen] = useState(false)

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
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`outfit-karte ${isDragging ? 'outfit-karte-dragging' : ''}`}
        onClick={() => setDetailOffen(true)}
      >
        <div className="outfit-karte-drag-handle" {...attributes} {...listeners} onClick={e => e.stopPropagation()}>
          <GripVertical size={16} />
        </div>
        <div className="outfit-karte-grid">
          {outfit.items.map(item => (
            <img key={item.id} src={item.foto} alt={item.typ} className="outfit-karte-foto" />
          ))}
        </div>
        
      </div>

      {detailOffen && (
        <OutfitDetail
          outfit={outfit}
          onClose={() => setDetailOffen(false)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  )
}

export default OutfitKarte