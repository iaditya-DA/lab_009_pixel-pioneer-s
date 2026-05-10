// components/MonasteryViewer.tsx
import React from 'react';
import StreetView from './StreetView';
import { Monastery } from '@/data/MapData/mapData';

export default function MonasteryViewer({ monastery }: { monastery: Monastery }) {
  return (
    <div>
      <h2>{monastery.name}</h2>

      {monastery.images.map(img => (
        <div key={img.id} style={{ marginBottom: '20px' }}>
          <h4>{img.title}</h4>
          <StreetView iframe={img.iframe} />
        </div>
      ))}
    </div>
  );
}
