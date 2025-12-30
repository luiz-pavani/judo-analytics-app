import React from 'react';
import JudoPlayer from './JudoPlayer';

export default function App() {
  return (
    // Removemos o cabeçalho antigo e tiramos o padding extra
    <div style={{ minHeight: '100vh', backgroundColor: '#111', margin: 0, padding: 0 }}>
      <JudoPlayer />
    </div>
  );
}