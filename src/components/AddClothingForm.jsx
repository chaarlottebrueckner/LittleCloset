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

function AddClothingForm({ onSave, onClose, bearbeiten }) {
  const [kategorie, setKategorie] = useState(bearbeiten?.kategorie || 'Oberteil')
  const [typ, setTyp] = useState(bearbeiten?.typ || KATEGORIEN['Oberteil'][0])
  const [wetter, setWetter] = useState(bearbeiten?.wetter || [])
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

  function handleSubmit() {
    if (!vorschau) {
      toast.error('Bitte ein Foto hinzufügen!')
      return
    }
    if (wetter.length === 0) {
      toast.error('Bitte mindestens eine Jahreszeit wählen!')
      return
    }

    if (foto) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onSave({
          id: bearbeiten?.id || Date.now(),
          kategorie,
          typ,
          wetter,
          foto: reader.result,
        })
      }
      reader.readAsDataURL(foto)
    } else {
      onSave({
        id: bearbeiten?.id || Date.now(),
        kategorie,
        typ,
        wetter,
        foto: vorschau,
      })
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">{bearbeiten ? 'Kleidung bearbeiten' : 'Kleidung hinzufügen'}</h2>

        <div className="form-group">
          <label className="form-label">Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFoto}
            className="form-input"
          />
          {vorschau && <img src={vorschau} alt="Vorschau" className="foto-vorschau" />}
        </div>

        <div className="form-group">
          <label className="form-label">Kategorie</label>
          <div className="chip-group">
            {Object.keys(KATEGORIEN).map(k => (
              <button
                key={k}
                onClick={() => handleKategorie(k)}
                className={`chip ${kategorie === k ? 'chip-active' : ''}`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Typ</label>
          <div className="chip-group">
            {KATEGORIEN[kategorie]?.map(t => (
              <button
                key={t}
                onClick={() => setTyp(t)}
                className={`chip ${typ === t ? 'chip-active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Wetter</label>
          <div className="chip-group">
            {WETTER.map(w => (
              <button
                key={w.label}
                onClick={() => handleWetter(w.label)}
                className={`chip ${wetter.includes(w.label) ? 'chip-active' : ''}`}
              >
                {w.icon} {w.label}
              </button>
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