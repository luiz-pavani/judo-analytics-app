import React, { useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Trash2, Users, ArrowLeftRight, CheckCircle, X } from 'lucide-react';

// --- CÉREBRO DO JUDÔ: Mapeamento Técnica -> Grupo ---
// Usando a classificação oficial da Kodokan
const DB_GOLPES: Record<string, string> = {
  // TE-WAZA (Mão)
  "Seoi-nage": "TE-WAZA", "Ippon-seoi-nage": "TE-WAZA", "Tai-otoshi": "TE-WAZA", 
  "Kata-guruma": "TE-WAZA", "Uki-otoshi": "TE-WAZA", "Sumi-otoshi": "TE-WAZA",
  "Eri-seoi-nage": "TE-WAZA", "Morote-seoi-nage": "TE-WAZA",
  
  // KOSHI-WAZA (Quadril)
  "Uki-goshi": "KOSHI-WAZA", "O-goshi": "KOSHI-WAZA", "Koshi-guruma": "KOSHI-WAZA",
  "Tsurikomi-goshi": "KOSHI-WAZA", "Sode-tsurikomi-goshi": "KOSHI-WAZA",
  "Harai-goshi": "KOSHI-WAZA", "Tsuri-goshi": "KOSHI-WAZA", "Hane-goshi": "KOSHI-WAZA",
  "Utsuri-goshi": "KOSHI-WAZA", "Ushiro-goshi": "KOSHI-WAZA",
  
  // ASHI-WAZA (Pé)
  "De-ashi-harai": "ASHI-WAZA", "Hiza-guruma": "ASHI-WAZA", "Sasae-tsurikomi-ashi": "ASHI-WAZA",
  "O-soto-gari": "ASHI-WAZA", "O-uchi-gari": "ASHI-WAZA", "Ko-soto-gari": "ASHI-WAZA",
  "Ko-uchi-gari": "ASHI-WAZA", "Okuri-ashi-harai": "ASHI-WAZA", "Uchi-mata": "ASHI-WAZA",
  "Ko-soto-gake": "ASHI-WAZA", "Ashi-guruma": "ASHI-WAZA", "Harai-tsurikomi-ashi": "ASHI-WAZA",
  "O-guruma": "ASHI-WAZA", "O-soto-guruma": "ASHI-WAZA",
  
  // SUTEMI-WAZA (Sacrifício)
  "Tomoe-nage": "SUTEMI-WAZA", "Sumi-gaeshi": "SUTEMI-WAZA", "Hikikomi-gaeshi": "SUTEMI-WAZA",
  "Ura-nage": "SUTEMI-WAZA", "Yoko-otoshi": "SUTEMI-WAZA", "Tani-otoshi": "SUTEMI-WAZA",
  "Yoko-guruma": "SUTEMI-WAZA", "Uki-waza": "SUTEMI-WAZA", "Yoko-wakare": "SUTEMI-WAZA",
  "Soto-makikomi": "SUTEMI-WAZA", "Uchi-makikomi": "SUTEMI-WAZA", "Hane-makikomi": "SUTEMI-WAZA"
};

const GRUPOS = ["TE-WAZA", "KOSHI-WAZA", "ASHI-WAZA", "SUTEMI-WAZA"];
const CORES_GRUPOS: Record<string, string> = {
  "TE-WAZA": "#6366f1", // Roxo
  "KOSHI-WAZA": "#10b981", // Verde
  "ASHI-WAZA": "#f59e0b", // Laranja
  "SUTEMI-WAZA": "#ef4444" // Vermelho
};

export default function JudoPlayer() {
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Contexto
  const [atletaAtual, setAtletaAtual] = useState('BRANCO'); 
  const [ladoAtual, setLadoAtual] = useState('DIREITA');   
  const [nomeGolpe, setNomeGolpe] = useState('');          
  const [grupoSelecionado, setGrupoSelecionado] = useState('TE-WAZA'); // Default
  const [sugestoes, setSugestoes] = useState<string[]>([]);

  const [eventos, setEventos] = useState(() => {
    const salvos = localStorage.getItem('jaap_dados_v3');
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => {
    localStorage.setItem('jaap_dados_v3', JSON.stringify(eventos));
  }, [eventos]);

  // AUTO-COMPLETE E DETECÇÃO DE GRUPO
  useEffect(() => {
    if (nomeGolpe.length > 1) {
      // Filtra as chaves do banco de dados que contêm o texto digitado
      const matches = Object.keys(DB_GOLPES).filter(k => 
        k.toLowerCase().includes(nomeGolpe.toLowerCase())
      );
      setSugestoes(matches.slice(0, 5)); // Mostra top 5 sugestões

      // Se o usuário digitou exatamente um golpe conhecido, seleciona o grupo automaticamente
      const matchExato = matches.find(k => k.toLowerCase() === nomeGolpe.toLowerCase());
      if (matchExato) {
        setGrupoSelecionado(DB_GOLPES[matchExato]);
      }
    } else {
      setSugestoes([]);
    }
  }, [nomeGolpe]);

  // Selecionar sugestão da lista
  const selecionarSugestao = (golpe: string) => {
    setNomeGolpe(golpe);
    setGrupoSelecionado(DB_GOLPES[golpe]);
    setSugestoes([]);
  };

  const dadosGrafico = GRUPOS.map(grp => ({
    name: grp,
    value: eventos.filter((e: any) => e.atleta === atletaAtual && e.grupo === grp).length
  })).filter(item => item.value > 0);

  useEffect(() => {
    let animationFrameId: number;
    const lerTempo = () => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime());
        animationFrameId = requestAnimationFrame(lerTempo);
      }
    };
    if (isPlaying) lerTempo();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  const registrarAcao = () => {
    const novoEvento = {
      id: Date.now(),
      tempo: currentTime,
      grupo: grupoSelecionado,
      especifico: nomeGolpe || "Técnica não especificada", // Texto default se vazio
      atleta: atletaAtual,
      lado: ladoAtual,
      cor: CORES_GRUPOS[grupoSelecionado] || '#999'
    };
    
    setEventos([novoEvento, ...eventos]); 
    setNomeGolpe(''); // Limpa input
    setSugestoes([]); // Limpa sugestões
    // Não reseta o atleta/lado pois geralmente há sequências do mesmo atleta
  };

  const deletarEvento = (id: number) => {
    if(confirm("Apagar este registro?")) {
      setEventos(eventos.filter((e: any) => e.id !== id));
    }
  };

  const onReady = (e: any) => {
    playerRef.current = e.target;
    setDuration(e.target.getDuration());
  };

  const togglePlay = () => isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo();
  const onStateChange = (e: any) => setIsPlaying(e.data === 1);
  const irParaGolpe = (tempo: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(tempo, true);
      playerRef.current.playVideo();
    }
  };

  const baixarCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Tempo (s),Atleta,Grupo,Golpe Especifico,Lado\n"; 
    eventos.forEach((ev: any) => {
      csvContent += `${ev.tempo.toFixed(3).replace('.', ',')},${ev.atleta},${ev.grupo},${ev.especifico},${ev.lado}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analise_jaap_pro_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const limparDados = () => { if (confirm("Apagar tudo?")) setEventos([]); };

  // Estilos
  const contextBtnStyle = (ativo: boolean, corAtiva: string) => ({
    flex: 1, padding: '12px', border: `2px solid ${ativo ? corAtiva : '#4b5563'}`,
    background: ativo ? corAtiva : 'transparent', color: 'white', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', display: 'flex', 
    alignItems: 'center', justifyContent: 'center', gap: '8px'
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', color: 'white', paddingBottom: '100px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{fontSize: '14px', color: '#666'}}>JAAP PRO <span style={{color: '#ef4444'}}>v1.2</span></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={limparDados} style={{ padding: '8px 15px', background: '#374151', color: '#9ca3af', border: '1px solid #4b5563', borderRadius: '4px', cursor: 'pointer', display: 'flex', gap: '5px' }}><Trash2 size={16}/> Limpar</button>
          <button onClick={baixarCSV} style={{ padding: '8px 15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', gap: '5px' }}><Download size={16}/> CSV</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '25px', alignItems: 'start' }}>
        
        {/* ESQUERDA: VÍDEO + COCKPIT */}
        <div>
          <div style={{ border: '2px solid #333', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
            <YouTube videoId="Jz6nuq5RBUA" onReady={onReady} onStateChange={onStateChange} opts={{ width: '100%', height: '450px', playerVars: { controls: 0, rel: 0 } }} />
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', height: '30px', background: '#1f2937', marginTop: '10px', borderRadius: '4px', cursor: 'pointer', overflow: 'hidden' }}>
            <div style={{ width: `${(currentTime / duration) * 100}%`, height: '100%', background: '#3b82f6', opacity: 0.3 }}></div>
            {eventos.map((ev: any) => (
              <div key={ev.id} onClick={() => irParaGolpe(ev.tempo)} title={`${ev.atleta}: ${ev.especifico}`} style={{ position: 'absolute', top: '0', bottom: '0', width: '4px', left: `${(ev.tempo / duration) * 100}%`, backgroundColor: ev.atleta === 'BRANCO' ? '#fff' : '#3b82f6', zIndex: 10 }} />
            ))}
          </div>

          {/* Player Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
             <button onClick={togglePlay} style={{ fontWeight: 'bold', cursor: 'pointer', background: isPlaying ? '#ef4444' : '#22c55e', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '6px' }}>{isPlaying ? "PAUSAR" : "COMBATER"}</button>
             <span style={{ fontSize: '24px', fontFamily: 'monospace', color: '#fbbf24' }}>{currentTime.toFixed(2)}s</span>
          </div>

          {/* --- NOVO PAINEL DE CONTEXTO --- */}
          <div style={{ marginTop: '25px', padding: '20px', background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
            
            {/* LINHA 1: ATLETA */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>QUEM ATACOU?</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setAtletaAtual('BRANCO')} style={contextBtnStyle(atletaAtual === 'BRANCO', '#9ca3af')}>🥋 BRANCO</button>
                <button onClick={() => setAtletaAtual('AZUL')} style={contextBtnStyle(atletaAtual === 'AZUL', '#2563eb')}>🥋 AZUL</button>
              </div>
            </div>

            {/* LINHA 2: LATERALIDADE (INVERTIDA CONFORME PEDIDO) */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>QUAL LADO?</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* ESQUERDA NA ESQUERDA */}
                <button onClick={() => setLadoAtual('ESQUERDA')} style={contextBtnStyle(ladoAtual === 'ESQUERDA', '#f59e0b')}>
                  <ArrowLeftRight size={18} /> ESQUERDA (Hidari)
                </button>
                {/* DIREITA NA DIREITA */}
                <button onClick={() => setLadoAtual('DIREITA')} style={contextBtnStyle(ladoAtual === 'DIREITA', '#10b981')}>
                  DIREITA (Migi) <ArrowLeftRight size={18} />
                </button>
              </div>
            </div>

            {/* LINHA 3: AUTO-COMPLETE TÉCNICO */}
            <div style={{ marginBottom: '20px', position: 'relative' }}>
               <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>QUAL TÉCNICA? (Comece a digitar...)</div>
               <div style={{display: 'flex', gap: '10px'}}>
                 <div style={{flex: 2, position: 'relative'}}>
                   <input 
                     type="text" 
                     placeholder="Ex: Seoi..." 
                     value={nomeGolpe}
                     onChange={(e) => setNomeGolpe(e.target.value)}
                     style={{ width: '100%', padding: '15px', background: '#000', border: '1px solid #444', color: 'white', borderRadius: '6px', fontSize: '16px' }}
                   />
                   {/* Lista de Sugestões Flutuante */}
                   {sugestoes.length > 0 && (
                     <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#2d3748', border: '1px solid #4a5568', borderRadius: '0 0 6px 6px', zIndex: 50, boxShadow: '0 10px 15px rgba(0,0,0,0.5)' }}>
                       {sugestoes.map(sug => (
                         <div key={sug} onClick={() => selecionarSugestao(sug)} 
                              style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #4a5568', display: 'flex', justifyContent: 'space-between' }}>
                           <span>{sug}</span>
                           <span style={{ fontSize: '10px', background: CORES_GRUPOS[DB_GOLPES[sug]], padding: '2px 6px', borderRadius: '4px' }}>{DB_GOLPES[sug]}</span>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
                 {/* Seletor de Grupo Automático (mas editável) */}
                 <div style={{flex: 1}}>
                    <select 
                      value={grupoSelecionado} 
                      onChange={(e) => setGrupoSelecionado(e.target.value)}
                      style={{ width: '100%', height: '100%', background: CORES_GRUPOS[grupoSelecionado], color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', padding: '0 10px', cursor: 'pointer' }}
                    >
                      {GRUPOS.map(g => <option key={g} value={g} style={{background: '#333'}}>{g}</option>)}
                    </select>
                 </div>
               </div>
            </div>

            {/* LINHA 4: O GRANDE BOTÃO DE REGISTRO */}
            <button 
              onClick={registrarAcao}
              style={{ width: '100%', padding: '20px', background: 'linear-gradient(to right, #3b82f6, #2563eb)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)' }}
            >
              <CheckCircle size={24} /> REGISTRAR AÇÃO
            </button>

          </div>
        </div>

        {/* DIREITA: LOG E GRÁFICO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: '#1f2937', padding: '15px', borderRadius: '12px', border: '1px solid #374151' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 5px 0', fontSize: '14px', color: '#fff' }}>Perfil: {atletaAtual}</h3>
            <div style={{ height: '200px' }}>
              {dadosGrafico.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={dadosGrafico} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                      {dadosGrafico.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={CORES_GRUPOS[entry.name]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555'}}>Sem dados</div>}
            </div>
          </div>

          {/* LISTA DE REGISTROS COM BOTÃO DE APAGAR */}
          <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #333', fontWeight: 'bold', fontSize: '14px', color: '#ccc' }}>REGISTROS ({eventos.length})</div>
            <div style={{ padding: '10px', overflowY: 'auto', maxHeight: '500px' }}>
              {eventos.map((ev: any) => (
                <div key={ev.id} 
                     style={{ 
                       padding: '12px', marginBottom: '8px', borderRadius: '6px', 
                       background: '#1f2937', borderLeft: `4px solid ${ev.atleta === 'AZUL' ? '#2563eb' : '#fff'}`,
                       display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center'
                     }}>
                  
                  {/* Conteúdo do Card (Clicável para ir ao tempo) */}
                  <div onClick={() => irParaGolpe(ev.tempo)} style={{ cursor: 'pointer' }}>
                    