import { useState } from 'react'
import { Sun, Leaf, Snowflake } from 'lucide-react'
import toast from 'react-hot-toast'

const KATEGORIEN = {
  'Oberteil': ['T-Shirt', 'Hemd', 'Bluse', 'Pullover', 'Hoodie', 'Top'],
  'Jacken & Cardigans': ['Jacke', 'Blazer', 'Cardigan', 'Mantel', 'Weste'],
  'Unterteil': ['Hose', 'Jeans', 'Rock', 'Shorts', 'Leggings'],
  'Ganzkörper': ['Kleid', 'Jumpsuit', 'Overall'],
  'Schuhe': ['Sneaker', 'Stiefel', 'Sandalen', 'Heels', 'Halbschuhe'],
  'Accessoire': ['Tasche', 'Schal', 'Mütze', 'Gürtel', 'Schmuck', 'Sonstiges'],
}

const WETTER = [
  { label: 'Sommer', icon: <Sun size={14} /> },
  { label: 'Übergang', icon: <Leaf size={14} /> },
  { label: 'Winter', icon: <Snowflake size={14} /> },
]

const STYLE_TAGS = ['Casual', 'Cozy', 'Ausgehen', 'Sport', 'Business', 'Festlich']

function AddClothingForm({ onSave, onClose, bearbeiten }) {
  const [kategorie, setKategorie] = useState(bearbeiten?.kategorie || 'Oberteil')
  const [typ, setTyp] = useState(bearbeiten?.typ || KATEGORIEN['Oberteil'][0])
  const [wetter, setWetter] = useState(bearbeiten?.wetter || [])
  const [styleTags, setStyleTags] = useState(bearbeiten?.styleTags || [])
  const [foto, setFoto] = useState(null)
  const [vorschau, setVorschau] = useState(bearbeiten?.foto || null)

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setFoto(file)
    setVorschau(URL.createObjectURL(file))
  }

  function handleKategorie(k) {
    setKategorie(k)
    setTyp(KATEGORIEN[k][0])
  }

  function handleWetter(w) {
    setWetter(prev =>
      prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]
    )
  }

  function handleStyleTag(tag) {
    setStyleTags(prev =>
      prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]
    )
  }

  function handleSubmit() {
    if (!vorschau) {
      toast.error('Bitte ein Foto hinzufügen!')
      return
    }

    const data = {
      id: bearbeiten?.id || Date.now(),
      kategorie,
      typ,
      wetter,
      styleTags,
    }

    if (foto) {
      const reader = new FileReader()
      reader.onloadend = () => onSave({ ...data, foto: reader.result })
      reader.readAsDataURL(foto)
    } else {
      onSave({ ...data, foto: vorschau })
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">{bearbeiten ? 'Kleidung bearbeiten' : 'Kleidung hinzufügen'}</h2>

        <div className="form-group">
          <label className="form-label">Foto</label>
          <input type="file" accept="image/*" onChange={handleFoto} className="form-input" />
          {vorschau && <img src={vorschau} alt="Vorschau" className="foto-vorschau" />}
        </div>

        <div className="form-group">
          <label className="form-label">Kategorie</label>
          <div className="chip-group">
            {Object.keys(KATEGORIEN).map(k => (
              <button key={k} onClick={() => handleKategorie(k)} className={`chip ${kategorie === k ? 'chip-active' : ''}`}>{k}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Typ</label>
          <div className="chip-group">
            {KATEGORIEN[kategorie]?.map(t => (
              <button key={t} onClick={() => setTyp(t)} className={`chip ${typ === t ? 'chip-active' : ''}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Wetter (optional)</label>
          <div className="chip-group">
            {WETTER.map(w => (
              <button key={w.label} onClick={() => handleWetter(w.label)} className={`chip ${wetter.includes(w.label) ? 'chip-active' : ''}`}>
                {w.icon} {w.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Style (optional)</label>
          <div className="chip-group">
            {STYLE_TAGS.map(tag => (
              <button key={tag} onClick={() => handleStyleTag(tag)} className={`chip ${styleTags.includes(tag) ? 'chip-active' : ''}`}>{tag}</button>
            ))}
          </div>
        </div>

        <div className="form-buttons">
          <button onClick={onClose} className="btn btn-secondary">Abbrechen</button>
          <button onClick={handleSubmit} className="btn btn-primary">Speichern</button>
        </div>
      </div>
    </div>
  )
}

export default AddClothingForm