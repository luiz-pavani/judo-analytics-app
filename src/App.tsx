import React from 'react';
import JudoPlayer from './JudoPlayer'; // Importamos o nosso componente

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111', padding: '20px', color: 'white' }}>
      
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🥋 <span style={{ color: '#ef4444' }}>FRAMI</span> WEB <small style={{ fontSize: '12px', color: '#666' }}>Alpha v0.1</small>
        </h1>
      </header>

      <main>
        <JudoPlayer />
      </main>

    </div>
  );
}