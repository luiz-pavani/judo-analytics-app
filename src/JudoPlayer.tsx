import React, { useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Trash2, Save, Users, ArrowLeftRight } from 'lucide-react';

export default function JudoPlayer() {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // --- NOVOS ESTADOS DE CONTEXTO ---
  const [atletaAtual, setAtletaAtual] = useState('BRANCO'); // 'BRANCO' ou 'AZUL'
  const [ladoAtual, setLadoAtual] = useState('DIREITA');   // 'DIREITA' ou 'ESQUERDA'
  const [nomeGolpe, setNomeGolpe] = useState('');          // Ex: "Seoi-nage" (Opcional)

  const [eventos, setEventos] = useState(() => {
    const salvos = localStorage.getItem('jaap_dados_v2'); // Mudamos a chave para não misturar versões
    return salvos ? JSON.parse(salvos) : [];
  });

  // Cores adaptativas para o gráfico
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']; 

  useEffect(() => {
    localStorage.setItem('jaap_dados_v2', JSON.stringify(eventos));
  }, [eventos]);

  // Dados do gráfico agora filtram apenas o ATLETA SELECIONADO (Análise individual)
  const dadosGrafico = [
    { name: 'Te-Waza', value: eventos.filter(e => e.atleta === atletaAtual && e.grupo === 'TE-WAZA').length },
    { name: 'Koshi-Waza', value: eventos.filter(e => e.atleta === atletaAtual && e.grupo === 'KOSHI-WAZA').length },
    { name: 'Ashi-Waza', value: eventos.filter(e => e.atleta === atletaAtual && e.grupo === 'ASHI-WAZA').length },
    { name: 'Sutemi-Waza', value: eventos.filter(e => e.atleta === atletaAtual && e.grupo === 'SUTEMI-WAZA').length },
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

  // --- NOVA FUNÇÃO DE REGISTRO COMPLETO ---
  const registrarAcao = (grupo, corBase) => {
    const novoEvento = {
      id: Date.now(),
      tempo: currentTime,
      grupo: grupo,           // Ex: TE-WAZA
      especifico: nomeGolpe,  // Ex: Seoi-Nage (se tiver digitado)
      atleta: atletaAtual,    // BRANCO ou AZUL
      lado: ladoAtual,        // DIREITA ou ESQUERDA
      cor: corBase            // Cor do grupo para o gráfico
    };
    
    setEventos([novoEvento, ...eventos]); 
    setNomeGolpe(''); // Limpa o campo de nome específico após registrar
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

  const baixarCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    // Cabeçalho expandido
    csvContent += "Tempo (s),Atleta,Grupo,Golpe Especifico,Lado\n"; 

    eventos.forEach((ev) => {
      const tempoFormatado = ev.tempo.toFixed(3).replace('.', ',');
      // CSV precisa tratar campos vazios
      const especificoLimpo = ev.especifico ? ev.especifico : "-"; 
      csvContent += `${tempoFormatado},${ev.atleta},${ev.grupo},${especificoLimpo},${ev.lado}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analise_jaap_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const limparDados = () => {
    if (confirm("Apagar toda a análise?")) setEventos([]);
  };

  // Estilos auxiliares para os botões de contexto
  const contextBtnStyle = (ativo, corAtiva) => ({
    flex: 1,
    padding: '10px',
    border: `2px solid ${ativo ? corAtiva : '#4b5563'}`,
    background: ativo ? corAtiva : 'transparent',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', color: 'white', paddingBottom: '100px' }}>
      
      {/* HEADER ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '15px' }}>
        <button onClick={limparDados} style={{ padding: '8px 15px', background: '#374151', color: '#9ca3af', border: '1px solid #4b5563', borderRadius: '4px', cursor: 'pointer', display: 'flex', gap: '5px' }}>
          <Trash2 size={16}/> Limpar
        </button>
        <button onClick={baixarCSV} style={{ padding: '8px 15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', gap: '5px' }}>
          <Download size={16}/> Relatório CSV
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '25px', alignItems: 'start' }}>
        
        {/* ESQUERDA: VÍDEO + CONTROLES DE ANÁLISE */}
        <div>
          {/* Player Wrapper */}
          <div style={{ border: '2px solid #333', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
            <YouTube
              videoId="Jz6nuq5RBUA" // Lembre de trocar pelo ID que quiser
              onReady={onReady}
              onStateChange={onStateChange}
              opts={{ width: '100%', height: '450px', playerVars: { controls: 0, rel: 0 } }}
            />
          </div>

          {/* Timeline Visual */}
          <div style={{ position: 'relative', height: '30px', background: '#1f2937', marginTop: '10px', borderRadius: '4px', cursor: 'pointer', overflow: 'hidden' }}>
            <div style={{ width: `${(currentTime / duration) * 100}%`, height: '100%', background: '#3b82f6', opacity: 0.3, transition: 'width 0.1s linear' }}></div>
            {eventos.map((ev) => (
              <div key={ev.id} 
                   onClick={() => irParaGolpe(ev.tempo)} 
                   title={`${ev.atleta}: ${ev.grupo}`}
                   style={{ 
                     position: 'absolute', top: '0', bottom: '0', width: '4px', 
                     left: `${(ev.tempo / duration) * 100}%`, 
                     backgroundColor: ev.atleta === 'BRANCO' ? '#fff' : '#3b82f6', // Cor na timeline indica o atleta
                     zIndex: 10 
                   }} 
              />
            ))}
          </div>

          {/* Play Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
             <button onClick={togglePlay} style={{ fontWeight: 'bold', cursor: 'pointer', background: isPlaying ? '#ef4444' : '#22c55e', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '6px', fontSize: '16px' }}>
               {isPlaying ? "PAUSAR (Mate)" : "COMBATER (Hajime)"}
             </button>
             <span style={{ fontSize: '24px', fontFamily: 'monospace', color: '#fbbf24' }}>
               {currentTime.toFixed(2)}s
             </span>
          </div>

          {/* --- PAINEL DE CONTEXTO (A GRANDE MUDANÇA) --- */}
          <div style={{ marginTop: '25px', padding: '20px', background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Configurar Próximo Ataque</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              
              {/* Seletor de Atleta */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', color: '#ccc' }}><Users size={16}/> Atleta</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => setAtletaAtual('BRANCO')} style={contextBtnStyle(atletaAtual === 'BRANCO', '#9ca3af')}>
                    🥋 BRANCO
                  </button>
                  <button onClick={() => setAtletaAtual('AZUL')} style={contextBtnStyle(atletaAtual === 'AZUL', '#2563eb')}>
                    🥋 AZUL
                  </button>
                </div>
              </div>

              {/* Seletor de Lado */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', color: '#ccc' }}><ArrowLeftRight size={16}/> Lateralidade</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => setLadoAtual('DIREITA')} style={contextBtnStyle(ladoAtual === 'DIREITA', '#10b981')}>
                    DIREITA (Migi)
                  </button>
                  <button onClick={() => setLadoAtual('ESQUERDA')} style={contextBtnStyle(ladoAtual === 'ESQUERDA', '#f59e0b')}>
                    ESQUERDA (Hidari)
                  </button>
                </div>
              </div>
            </div>

            {/* Input Opcional de Nome */}
            <div style={{ marginBottom: '20px' }}>
               <input 
                 type="text" 
                 placeholder="Nome específico da técnica (Opcional - ex: Uchi Mata)" 
                 value={nomeGolpe}
                 onChange={(e) => setNomeGolpe(e.target.value)}
                 style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #444', color: 'white', borderRadius: '6px' }}
               />
            </div>

            {/* BOTÕES DE AÇÃO (REGISTRO) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <button onClick={() => registrarAcao('TE-WAZA', '#6366f1')} style={btnActionStyle('#6366f1')}>TE (Mão)</button>
              <button onClick={() => registrarAcao('KOSHI-WAZA', '#10b981')} style={btnActionStyle('#10b981')}>KOSHI (Quadril)</button>
              <button onClick={() => registrarAcao('ASHI-WAZA', '#f59e0b')} style={btnActionStyle('#f59e0b')}>ASHI (Pé)</button>
              <button onClick={() => registrarAcao('SUTEMI-WAZA', '#ef4444')} style={btnActionStyle('#ef4444')}>SUTEMI (Sacrifício)</button>
            </div>
          </div>

        </div>

        {/* DIREITA: DASHBOARD + LOG */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Gráfico Filtrado */}
          <div style={{ background: '#1f2937', padding: '15px', borderRadius: '12px', border: '1px solid #374151' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 5px 0', fontSize: '14px', color: '#fff' }}>
              Perfil Tático: <span style={{ color: atletaAtual === 'AZUL' ? '#60a5fa' : '#ccc' }}>{atletaAtual}</span>
            </h3>
            <div style={{ height: '220px' }}>
              {dadosGrafico.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={dadosGrafico} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                      {dadosGrafico.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555'}}>Sem dados para este atleta</div>}
            </div>
          </div>

          {/* Lista de Eventos Detalhada */}
          <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #333', fontWeight: 'bold' }}>Histórico da Luta</div>
            <div style={{ padding: '10px', overflowY: 'auto', maxHeight: '500px' }}>
              {eventos.map((ev) => (
                <div key={ev.id} onClick={() => irParaGolpe(ev.tempo)} 
                     style={{ 
                       padding: '12px', marginBottom: '8px', borderRadius: '6px', cursor: 'pointer',
                       background: '#1f2937', borderLeft: `4px solid ${ev.atleta === 'AZUL' ? '#2563eb' : '#fff'}`
                     }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#fbbf24', fontFamily: 'monospace', fontWeight: 'bold' }}>{ev.tempo.toFixed(2)}s</span>
                    <span style={{ fontSize: '11px', background: '#374151', padding: '2px 6px', borderRadius: '4px' }}>{ev.lado}</span>
                  </div>
                  
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{ev.grupo}</div>
                  {ev.especifico && <div style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>"{ev.especifico}"</div>}
                  
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const btnActionStyle = (bg) => ({
  background: bg, padding: '20px 10px', border: 'none', borderRadius: '8px', 
  color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase'
});
