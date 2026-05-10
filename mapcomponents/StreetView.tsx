// components/StreetView.tsx
import React from 'react'

type Props = { iframe: string }

export default function StreetView({ iframe }: Props) {
  return (
    <div
      style={{ width: "100%", maxWidth: 900, margin: "20px 0" }}
      dangerouslySetInnerHTML={{ __html: iframe }}
    />
  )
}
