// pages/test.tsx
import React from 'react'
import StreetView from '../../mapcomponents/StreetView'
import { monasteries } from '../../data/MapData/mapData'

export default function TestPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>360 Monasteries Module</h1>

      {monasteries.map(m => (
        <div key={m.id} style={{ marginBottom: '60px' }}>
          <h2>{m.name}</h2>

          {m.images.map(img => (
            <div key={img.id} style={{ marginTop: '20px' }}>
              <h4>{img.title}</h4>
              <StreetView iframe={img.iframe} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
