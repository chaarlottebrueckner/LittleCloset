import { useState, useEffect } from 'react'
import localforage from 'localforage'
import toast from 'react-hot-toast'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Shirt, Sparkles, SlidersHorizontal, Plus, Sun, Leaf, Snowflake, BookMarked, Trash2 } from 'lucide-react'
import AddClothingForm from './components/AddClothingForm'
import OutfitBuilder from './components/OutfitBuilder'
import OutfitKarte from './components/OutfitKarte'
import KollektionKarte from './components/KollektionKarte'
import KollektionDetail from './components/KollektionDetail'
import ConfirmDialog from './components/ConfirmDialog'
import KleidungDetail from './components/KleidungDetail'


const KATEGORIEN = ['Oberteil', 'Jacken & Cardigans', 'Unterteil', 'Ganzkörper', 'Schuhe', 'Accessoire']
const WETTER = [
  { label: 'Sommer', icon: <Sun size={14} /> },
  { label: 'Übergang', icon: <Leaf size={14} /> },
  { label: 'Winter', icon: <Snowflake size={14} /> },
]

function App() {
  const [kleidung, setKleidung] = useState([])
  const [outfits, setOutfits] = useState([])
  const [kollektionen, setKollektionen] = useState([])
  const [tab, setTab] = useState('kleidung')
  const [formOffen, setFormOffen] = useState(false)
  const [outfitBuilderOffen, setOutfitBuilderOffen] = useState(false)
  const [filterOffen, setFilterOffen] = useState(false)
  const [filterKategorie, setFilterKategorie] = useState(null)
  const [filterWetter, setFilterWetter] = useState(null)
  const [filterOutfitWetter, setFilterOutfitWetter] = useState(null)
  const [filterOutfitOffen, setFilterOutfitOffen] = useState(false)
  const [bearbeitenItem, setBearbeitenItem] = useState(null)
  const [bearbeitenOutfit, setBearbeitenOutfit] = useState(null)
  const [aktiveKollektion, setAktiveKollektion] = useState(null)
  const [kollektionFormOffen, setKollektionFormOffen] = useState(false)
  const [kollektionBearbeiten, setKollektionBearbeiten] = useState(null)
  const [kollektionName, setKollektionName] = useState('')
  const [confirm, setConfirm] = useState(null) 
  const [detailItem, setDetailItem] = useState(null)
  const [filterStyleTag, setFilterStyleTag] = useState(null)
  const [filterOutfitStyleTag, setFilterOutfitStyleTag] = useState(null)

  function ask(message, action) {
    setConfirm({ message, action })
  }

  useEffect(() => {
    localforage.getItem('kleidung').then(data => { if (data) setKleidung(data) })
    localforage.getItem('outfits').then(data => { if (data) setOutfits(data) })
    localforage.getItem('kollektionen').then(data => { if (data) setKollektionen(data) })
  }, [])

  async function handleSaveKleidung(item) {
    const neu = [item, ...kleidung]
    setKleidung(neu)
    await localforage.setItem('kleidung', neu)
    setFormOffen(false)
  }

  async function handleDeleteKleidung(id) {
    ask('Kleidungsstück wirklich löschen? Alle Outfits mit diesem Teil werden ebenfalls gelöscht.', async () => {
      const neueKleidung = kleidung.filter(item => item.id !== id)
      const neueOutfits = outfits.filter(o => !o.items.some(item => item.id === id))
      const neueKollektionen = kollektionen.map(k => ({
        ...k,
        outfitIds: k.outfitIds.filter(oid => neueOutfits.find(o => o.id === oid))
      }))
      setKleidung(neueKleidung)
      setOutfits(neueOutfits)
      setKollektionen(neueKollektionen)
      await localforage.setItem('kleidung', neueKleidung)
      await localforage.setItem('outfits', neueOutfits)
      await localforage.setItem('kollektionen', neueKollektionen)
    })
  }

  async function handleSaveOutfit(outfit) {
    const neu = [outfit, ...outfits]
    setOutfits(neu)
    await localforage.setItem('outfits', neu)
    setOutfitBuilderOffen(false)
  }

  async function handleDeleteOutfit(id) {
  ask('Outfit wirklich löschen?', async () => {
    const neueOutfits = outfits.filter(o => o.id !== id)
    const neueKollektionen = kollektionen.map(k => ({
      ...k,
      outfitIds: k.outfitIds.filter(oid => oid !== id)
    }))
    setOutfits(neueOutfits)
    setKollektionen(neueKollektionen)
    await localforage.setItem('outfits', neueOutfits)
    await localforage.setItem('kollektionen', neueKollektionen)
  })
}

  async function handleEditKleidung(item) {
    const neu = kleidung.map(k => k.id === item.id ? item : k)
    setKleidung(neu)
    await localforage.setItem('kleidung', neu)
    setBearbeitenItem(null)
  }

  async function handleEditOutfit(outfit) {
    const neu = outfits.map(o => o.id === outfit.id ? outfit : o)
    setOutfits(neu)
    await localforage.setItem('outfits', neu)
    setBearbeitenOutfit(null)
  }

  async function handleSaveKollektion() {
  if (!kollektionName.trim()) {
    toast.error('Bitte einen Namen eingeben!')
    return
  }
  if (kollektionBearbeiten) {
    const neu = kollektionen.map(k => k.id === kollektionBearbeiten.id ? { ...k, name: kollektionName } : k)
    setKollektionen(neu)
    await localforage.setItem('kollektionen', neu)
    setAktiveKollektion(kollektionBearbeiten)
  } else {
    const neueKollektion = { id: Date.now(), name: kollektionName, outfitIds: [] }
    const neu = [neueKollektion, ...kollektionen]
    setKollektionen(neu)
    await localforage.setItem('kollektionen', neu)
    setAktiveKollektion(neueKollektion)
  }
  setKollektionFormOffen(false)
  setKollektionBearbeiten(null)
  setKollektionName('')
}

  async function handleDeleteKollektion(id) {
    ask('Kollektion wirklich löschen?', async () => {
      const neu = kollektionen.filter(k => k.id !== id)
      setKollektionen(neu)
      await localforage.setItem('kollektionen', neu)
    })
  }

  async function handleAddOutfitToKollektion(kollektionId, outfitIds) {
    const ids = Array.isArray(outfitIds) ? outfitIds : [outfitIds]
    const neu = kollektionen.map(k => {
      if (k.id !== kollektionId) return k
      const neueIds = [...(k.outfitIds || []), ...ids.filter(id => !k.outfitIds?.includes(id))]
      const vorschauOutfit = outfits.find(o => o.id === ids[0])
      const vorschau = vorschauOutfit?.items?.[0]?.foto
      return { ...k, outfitIds: neueIds, vorschau: k.vorschau || vorschau }
    })
    setKollektionen(neu)
    await localforage.setItem('kollektionen', neu)
    toast.success('Outfits hinzugefügt! ✨')
  }

  async function handleRemoveOutfitFromKollektion(kollektionId, outfitId) {
    const neu = kollektionen.map(k => {
      if (k.id !== kollektionId) return k
      const outfitIds = k.outfitIds.filter(id => id !== outfitId)
      return { ...k, outfitIds }
    })
    setKollektionen(neu)
    await localforage.setItem('kollektionen', neu)
  }

  async function handleRenameKollektion(id, name) {
  const neu = kollektionen.map(k => k.id === id ? { ...k, name } : k)
  setKollektionen(neu)
  await localforage.setItem('kollektionen', neu)
  toast.success('Name gespeichert! 🌸')
}

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = outfits.findIndex(o => o.id === active.id)
    const newIndex = outfits.findIndex(o => o.id === over.id)
    const neu = arrayMove(outfits, oldIndex, newIndex)
    setOutfits(neu)
    localforage.setItem('outfits', neu)
  }

  const sensors = useSensors(useSensor(PointerSensor))

  const gefilterteKleidung = kleidung.filter(item => {
    if (filterKategorie && item.kategorie !== filterKategorie) return false
    if (filterWetter && !item.wetter?.includes(filterWetter)) return false
    if (filterStyleTag && !item.styleTags?.includes(filterStyleTag)) return false
    return true
  })

  const aktiveFilter = (filterKategorie ? 1 : 0) + (filterWetter ? 1 : 0) + (filterStyleTag ? 1 : 0)
  console.log('outfits in App:', outfits)
  return (
    <>
    {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={() => {
            const res = confirm.action()
            if (res && res.then) {
              res.then(() => setConfirm(null))
            } else {
              setConfirm(null)
            }
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    <div className="container">
      <div className="top-bar">
        <h1 className="header">Little<span>Closet</span></h1>
        {tab === 'kleidung' && (
          <button
            className={`filter-icon-btn ${aktiveFilter > 0 ? 'filter-aktiv' : ''}`}
            onClick={() => setFilterOffen(!filterOffen)}
          >
            <SlidersHorizontal size={16} />
            {aktiveFilter > 0 ? ` (${aktiveFilter})` : ''}
          </button>
        )}
        {tab === 'outfits' && (
          <button
            className={`filter-icon-btn ${filterOutfitWetter ? 'filter-aktiv' : ''}`}
            onClick={() => setFilterOutfitOffen(!filterOutfitOffen)}
          >
            <SlidersHorizontal size={16} />
          </button>
        )}
      </div>

      {tab === 'kleidung' && filterOffen && (
        <div className="filter-panel">
          <div className="form-group">
            <label className="form-label">Kategorie</label>
            <div className="chip-group">
              <button className={`chip ${filterKategorie === null ? 'chip-active' : ''}`} onClick={() => setFilterKategorie(null)}>Alle</button>
              {KATEGORIEN.map(k => (
                <button key={k} className={`chip ${filterKategorie === k ? 'chip-active' : ''}`} onClick={() => setFilterKategorie(k)}>{k}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Wetter</label>
            <div className="chip-group">
              <button className={`chip ${filterWetter === null ? 'chip-active' : ''}`} onClick={() => setFilterWetter(null)}>Alle</button>
              {WETTER.map(w => (
                <button key={w.label} className={`chip ${filterWetter === w.label ? 'chip-active' : ''}`} onClick={() => setFilterWetter(w.label)}>
                  {w.icon} {w.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Style</label>
            <div className="chip-group">
              <button className={`chip ${filterStyleTag === null ? 'chip-active' : ''}`} onClick={() => setFilterStyleTag(null)}>Alle</button>
              {['Casual', 'Cozy', 'Ausgehen', 'Sport', 'Business', 'Festlich'].map(tag => (
                <button key={tag} className={`chip ${filterStyleTag === tag ? 'chip-active' : ''}`} onClick={() => setFilterStyleTag(tag)}>{tag}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'outfits' && filterOutfitOffen && (
        <div className="filter-panel">
          <div className="form-group">
            <label className="form-label">Wetter</label>
            <div className="chip-group">
              <button className={`chip ${filterOutfitWetter === null ? 'chip-active' : ''}`} onClick={() => setFilterOutfitWetter(null)}>Alle</button>
              {WETTER.map(w => (
                <button key={w.label} className={`chip ${filterOutfitWetter === w.label ? 'chip-active' : ''}`} onClick={() => setFilterOutfitWetter(w.label)}>
                  {w.icon} {w.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Style</label>
            <div className="chip-group">
              <button className={`chip ${filterOutfitStyleTag === null ? 'chip-active' : ''}`} onClick={() => setFilterOutfitStyleTag(null)}>Alle</button>
              {['Casual', 'Cozy', 'Ausgehen', 'Sport', 'Business', 'Festlich'].map(tag => (
                <button key={tag} className={`chip ${filterOutfitStyleTag === tag ? 'chip-active' : ''}`} onClick={() => setFilterOutfitStyleTag(tag)}>{tag}</button>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab === 'kleidung' && (
        <>
          <button className="btn btn-primary btn-full" onClick={() => setFormOffen(true)}>
            <Plus size={18} style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}} />
            Kleidung hinzufügen
          </button>
          <div className="kleidung-grid">
            {gefilterteKleidung.length === 0 && kleidung.length === 0 ? (
              <div className="empty-state">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="60" fill="#fde8f0"/>
                  <path d="M60 25 C50 25 42 30 42 38 C42 42 44 45 47 47 L38 52 C35 53 33 56 33 59 L33 85 C33 88 36 90 39 90 L81 90 C84 90 87 88 87 85 L87 59 C87 56 85 53 82 52 L73 47 C76 45 78 42 78 38 C78 30 70 25 60 25Z" fill="#e8789e" opacity="0.3"/>
                  <path d="M60 28 C51 28 44 32 44 38 C44 43 48 46 52 47 L40 53 C37 54 35 57 35 60 L35 84 C35 87 37 88 39 88 L81 88 C83 88 85 87 85 84 L85 60 C85 57 83 54 80 53 L68 47 C72 46 76 43 76 38 C76 32 69 28 60 28Z" fill="#e8789e" opacity="0.6"/>
                  <circle cx="60" cy="38" r="5" fill="#e8789e"/>
                  <path d="M52 47 Q60 52 68 47" stroke="#e8789e" strokeWidth="2" fill="none"/>
                </svg>
                <h3 className="empty-title">Dein Kleiderschrank ist leer</h3>
                <p className="empty-subtitle">Füge dein erstes Kleidungsstück hinzu!</p>
                <button className="btn btn-primary" onClick={() => setFormOffen(true)}>
                  <Plus size={18} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}}/>
                  Erstes Teil hinzufügen
                </button>
              </div>
            ) : gefilterteKleidung.length === 0 ? (
              <div className="empty-state">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="#fde8f0"/>
                  <path d="M25 45 L40 25 L55 45" stroke="#e8789e" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <line x1="40" y1="25" x2="40" y2="55" stroke="#e8789e" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                <h3 className="empty-title">Keine Treffer</h3>
                <p className="empty-subtitle">Versuche einen anderen Filter</p>
              </div>
            ) : (
              gefilterteKleidung.map(item => (
                <div key={item.id} className="kleidung-karte" onClick={() => setDetailItem(item)}>
                  <div className="kleidung-foto-wrapper">
                    <img src={item.foto} alt={item.typ} className="kleidung-foto" />
                  </div>
                  <div className="kleidung-info">
                    <span className="kleidung-name">{item.typ}</span>
                    <span className="kleidung-kategorie">{item.kategorie}</span>
                    <span className="kleidung-wetter">
                      {item.wetter?.map(w => {
                        if (w === 'Sommer') return <Sun key={w} size={12} />
                        if (w === 'Übergang') return <Leaf key={w} size={12} />
                        if (w === 'Winter') return <Snowflake key={w} size={12} />
                        return null
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {tab === 'outfits' && (
        <>
          <button className="btn btn-primary btn-full" onClick={() => setOutfitBuilderOffen(true)}>
            <Plus size={18} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}} />
            Outfit erstellen
          </button>
          <div className="outfits-liste">
            {outfits.length === 0 ? (
              <div className="empty-state">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="60" fill="#fde8f0"/>
                  <rect x="30" y="45" width="25" height="35" rx="4" fill="#e8789e" opacity="0.4"/>
                  <rect x="40" y="38" width="2" height="10" rx="1" fill="#e8789e" opacity="0.6"/>
                  <rect x="65" y="50" width="20" height="28" rx="4" fill="#e8789e" opacity="0.6"/>
                  <rect x="74" y="43" width="2" height="10" rx="1" fill="#e8789e" opacity="0.8"/>
                  <circle cx="75" cy="40" r="4" fill="#e8789e" opacity="0.5"/>
                  <circle cx="41" cy="35" r="5" fill="#e8789e" opacity="0.3"/>
                  <path d="M45 72 Q60 80 75 72" stroke="#e8789e" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
                <h3 className="empty-title">Noch keine Outfits</h3>
                <p className="empty-subtitle">Stelle dein erstes Outfit zusammen!</p>
                <button className="btn btn-primary" onClick={() => setOutfitBuilderOffen(true)}>
                  <Plus size={18} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}}/>
                  Erstes Outfit erstellen
                </button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={outfits.map(o => o.id)} strategy={verticalListSortingStrategy}>
                  {outfits
                    .filter(o => !filterOutfitWetter || o.wetter?.includes(filterOutfitWetter))
                    .filter(o => !filterOutfitStyleTag || o.styleTags?.includes(filterOutfitStyleTag))
                    .map(outfit => (
                      <OutfitKarte key={outfit.id} outfit={outfit} onDelete={handleDeleteOutfit} onEdit={setBearbeitenOutfit} />
                    ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </>
      )}

      {tab === 'kollektionen' && !aktiveKollektion && (
        <>
          <button className="btn btn-primary btn-full" onClick={() => { setKollektionName(''); setKollektionFormOffen(true) }}>
            <Plus size={18} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}} />
            Kollektion erstellen
          </button>
          {kollektionen.length === 0 ? (
            <div className="empty-state">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="60" fill="#fde8f0"/>
                <rect x="25" y="35" width="70" height="55" rx="8" fill="#e8789e" opacity="0.2"/>
                <rect x="30" y="40" width="60" height="45" rx="6" fill="#e8789e" opacity="0.3"/>
                <rect x="35" y="45" width="50" height="35" rx="4" fill="#e8789e" opacity="0.4"/>
                <path d="M45 60 L75 60" stroke="#e8789e" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M45 68 L65 68" stroke="#e8789e" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <h3 className="empty-title">Noch keine Kollektionen</h3>
              <p className="empty-subtitle">Erstelle z.B. "Büro", "Party" oder "Reise Italien"</p>
              <button className="btn btn-primary" onClick={() => { setKollektionName(''); setKollektionFormOffen(true) }}>
                <Plus size={18} style={{display:'inline', marginRight:'6px', verticalAlign:'middle'}}/>
                Erste Kollektion erstellen
              </button>
            </div>
          ) : (
            <div className="kollektionen-grid">
              {kollektionen.map(k => (
                <KollektionKarte
                  key={k.id}
                  kollektion={k}
                  outfits={outfits}
                  onClick={() => setAktiveKollektion(k)}
                  onDelete={handleDeleteKollektion}
                  onEdit={(k) => { setAktiveKollektion(k) }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'kollektionen' && aktiveKollektion && (
        <KollektionDetail
          kollektion={kollektionen.find(k => k.id === aktiveKollektion.id)}
          outfits={outfits}
          onBack={() => setAktiveKollektion(null)}
          onAddOutfit={handleAddOutfitToKollektion}
          onRemoveOutfit={handleRemoveOutfitFromKollektion}
          onRename={handleRenameKollektion}
/>
      )}

      {kollektionFormOffen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">{kollektionBearbeiten ? 'Kollektion bearbeiten' : 'Neue Kollektion'}</h2>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={kollektionName}
                onChange={e => setKollektionName(e.target.value)}
                placeholder="z.B. Büro, Party, Reise Italien..."
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-buttons">
              <button onClick={() => { setKollektionFormOffen(false); setKollektionBearbeiten(null) }} className="btn btn-secondary">Abbrechen</button>
              <button onClick={handleSaveKollektion} className="btn btn-primary">Speichern</button>
            </div>
          </div>
        </div>
      )}

      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'kleidung' ? 'tab-aktiv' : ''}`} onClick={() => setTab('kleidung')}>
          <Shirt size={22} />
          <span>Kleidung</span>
        </button>
        <button className={`tab-btn ${tab === 'outfits' ? 'tab-aktiv' : ''}`} onClick={() => setTab('outfits')}>
          <Sparkles size={22} />
          <span>Outfits</span>
        </button>
        <button className={`tab-btn ${tab === 'kollektionen' ? 'tab-aktiv' : ''}`} onClick={() => setTab('kollektionen')}>
          <BookMarked size={22} />
          <span>Kollektionen</span>
        </button>
      </div>

      {formOffen && (
        <AddClothingForm onSave={handleSaveKleidung} onClose={() => setFormOffen(false)} />
      )}
      {outfitBuilderOffen && (
        <OutfitBuilder kleidung={kleidung} onSave={handleSaveOutfit} onClose={() => setOutfitBuilderOffen(false)} />
      )}
      {bearbeitenItem && (
        <AddClothingForm onSave={handleEditKleidung} onClose={() => setBearbeitenItem(null)} bearbeiten={bearbeitenItem} />
      )}
      {bearbeitenOutfit && (
        <OutfitBuilder kleidung={kleidung} onSave={handleEditOutfit} onClose={() => setBearbeitenOutfit(null)} bearbeiten={bearbeitenOutfit} />
      )}
      {detailItem && (
        <KleidungDetail
          item={detailItem}
          outfits={outfits}
          onClose={() => setDetailItem(null)}
          onEdit={(item) => { setDetailItem(null); setBearbeitenItem(item) }}
          onDelete={(id) => { setDetailItem(null); handleDeleteKleidung(id) }}
          onOutfitErstellen={() => {
            setDetailItem(null)
            setTab('outfits')
            setOutfitBuilderOffen(true)
          }}
        />
      )}
    </div>
    </>
  )
}

export default App
