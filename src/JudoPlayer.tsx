import React, { useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Trash2, Save } from 'lucide-react';

export default function JudoPlayer() {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // LÊ DO LOCALSTORAGE AO INICIAR (Memória persistente)
  const [eventos, setEventos] = useState(() => {
    const salvos = localStorage.getItem('judo_dados');
    return salvos ? JSON.parse(salvos) : [];
  });

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']; 

  // SALVA AUTOMATICAMENTE SEMPRE QUE MUDAR
  useEffect(() => {
    localStorage.setItem('judo_dados', JSON.stringify(eventos));
  }, [eventos]);

  const dadosGrafico = [
    { name: 'Te-Waza', value: eventos.filter(e => e.tipo.includes('TE')).length },
    { name: 'Koshi-Waza', value: eventos.filter(e => e.tipo.includes('KOSHI')).length },
    { name: 'Ashi-Waza', value: eventos.filter(e => e.tipo.includes('ASHI')).length },
    { name: 'Sutemi-Waza', value: eventos.filter(e => e.tipo.includes('SUTEMI')).length },
  ].filter(item => item.value > 0);

  useEffect(() => {
    let animationFrameId;
    const lerTempo = () => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime());
        animationFrameId = requestAnimationFrame(lerTempo);
      }
    };
    if (isPlaying) lerTempo();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  const registrarAcao = (tipoGolpe, cor) => {
    setEventos([{ id: Date.now(), tempo: currentTime, tipo: tipoGolpe, cor: cor }, ...eventos]); 
  };

  const onReady = (e) => {
    playerRef.current = e.target;
    setDuration(e.target.getDuration());
  };

  const togglePlay = () => isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo();
  const onStateChange = (e) => setIsPlaying(e.data === 1);

  const irParaGolpe = (tempo) => {
    if (playerRef.current) {
      playerRef.current.seekTo(tempo, true);
      playerRef.current.playVideo();
    }
  };

  // --- FUNÇÃO DE EXPORTAÇÃO (CIÊNCIA DE DADOS) ---
  const baixarCSV = () => {
    // 1. Cria o cabeçalho
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Tempo (s),Tipo de Golpe,Classificacao\n"; // Cabeçalho do Excel

    // 2. Adiciona cada linha
    eventos.forEach((ev) => {
      // Separa o nome (ex: "TE-WAZA (Mão)" -> Pega só o TE-WAZA)
      const limpo = ev.tipo.split('(')[0].trim();
      csvContent += `${ev.tempo.toFixed(3).replace('.', ',')},${ev.tipo},${limpo}\n`;
    });

    // 3. Cria o link de download invisível e clica nele
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analise_judo_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- FUNÇÃO PARA LIMPAR TUDO ---
  const limparDados = () => {
    if (confirm("Tem certeza? Isso apagará toda a análise atual.")) {
      setEventos([]);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', color: 'white', paddingBottom: '50px' }}>
      
      {/* CABEÇALHO DE COMANDOS */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
        <button onClick={limparDados} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', background: '#374151', color: '#9ca3af', border: '1px solid #4b5563', borderRadius: '4px', cursor: 'pointer' }}>
          <Trash2 size={16} /> Nova Luta
        </button>
        <button onClick={baixarCSV} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Download size={16} /> Baixar Excel
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* PLAYER + TIMELINE */}
        <div>
          <div style={{ border: '2px solid #444', borderRadius: '8px', overflow: 'hidden' }}>
            <YouTube
              videoId="Jz6nuq5RBUA"
              onReady={onReady}
              onStateChange={onStateChange}
              opts={{ width: '100%', height: '400px', playerVars: { controls: 0, rel: 0 } }}
            />
          </div>

          <div style={{ position: 'relative', height: '40px', background: '#374151', marginTop: '10px', borderRadius: '4px', cursor: 'pointer' }}>
            <div style={{ width: `${(currentTime / duration) * 100}%`, height: '100%', background: 'rgba(255,255,255,0.1)', borderRight: '2px solid #fbbf24', transition: 'width 0.1s linear' }}></div>
            {eventos.map((ev) => (
              <div key={ev.id} onClick={() => irParaGolpe(ev.tempo)} title={`${ev.tipo}`} style={{ position: 'absolute', top: '5px', left: `${(ev.tempo / duration) * 100}%`, width: '12px', height: '12px', borderRadius: '50%', backgroundColor: ev.cor, border: '2px solid white', cursor: 'pointer', zIndex: 10, transform: 'translateX(-50%)' }} />
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', background: '#222', padding: '10px', borderRadius: '5px' }}>
             <button onClick={togglePlay} style={{ fontWeight: 'bold', cursor: 'pointer', background: isPlaying ? '#ef4444' : '#22c55e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>
               {isPlaying ? "PAUSAR" : "PLAY"}
             </button>
             <span style={{ fontSize: '20px', fontFamily: 'monospace', color: '#fbbf24' }}>
               {currentTime.toFixed(2)}s / {duration.toFixed(0)}s
             </span>
          </div>
        </div>

        {/* DASHBOARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#1f2937', padding: '10px', borderRadius: '8px', height: '250px' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '14px', color: '#aaa' }}>ESTATÍSTICAS</h3>
            {eventos.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={dadosGrafico} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                    {dadosGrafico.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : <div style={{textAlign:'center', marginTop: '80px', color:'#555'}}>Sem dados</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            <button onClick={() => registrarAcao('TE-WAZA', '#6366f1')} style={btnStyle('#6366f1')}>TE (Mão)</button>
            <button onClick={() => registrarAcao('KOSHI-WAZA', '#10b981')} style={btnStyle('#10b981')}>KOSHI (Quadril)</button>
            <button onClick={() => registrarAcao('ASHI-WAZA', '#f59e0b')} style={btnStyle('#f59e0b')}>ASHI (Pé)</button>
            <button onClick={() => registrarAcao('SUTEMI-WAZA', '#ef4444')} style={btnStyle('#ef4444')}>SUTEMI (Sacrifício)</button>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '30px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Save size={16} color="#10b981" /> Histórico Salvo Automaticamente
      </h3>
      <div style={{ marginTop: '10px', maxHeight: '300px', overflowY: 'auto' }}>
        {eventos.map((ev) => (
          <div key={ev.id} onClick={() => irParaGolpe(ev.tempo)} style={{ padding: '10px', borderBottom: '1px solid #333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#1f2937', marginBottom: '5px', borderRadius: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: ev.cor }}></div>
            <span style={{ color: '#fbbf24', fontFamily: 'monospace', fontWeight: 'bold' }}>{ev.tempo.toFixed(2)}s</span>
            <span style={{ color: 'white' }}>{ev.tipo}</span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#9ca3af' }}>▶ Rever</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = (bg) => ({
  background: bg, padding: '15px', border: 'none', borderRadius: '8px', 
  color: 'white', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', paddingLeft: '20px'
});
