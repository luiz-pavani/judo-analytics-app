import React, { useRef, useState, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Trash2, ArrowLeftRight, PlayCircle, PauseCircle, Timer, Flag, Gavel, X, Search, CheckCircle } from 'lucide-react';

// --- BANCO DE DADOS (Mantido) ---
const DB_SHIDOS = ["Passividade", "Falso Ataque", "Saída de Área", "Postura Defensiva", "Evitar Pegada", "Pegada Ilegal", "Dedos na manga", "Desarrumar Gi", "Outros"];
const DB_GOLPES: Record<string, string> = {
  "Seoi-nage": "TE-WAZA", "Ippon-seoi-nage": "TE-WAZA", "Tai-otoshi": "TE-WAZA", "Kata-guruma": "TE-WAZA", "Uki-otoshi": "TE-WAZA", 
  "Uki-goshi": "KOSHI-WAZA", "O-goshi": "KOSHI-WAZA", "Koshi-guruma": "KOSHI-WAZA", "Harai-goshi": "KOSHI-WAZA", "Utsuri-goshi": "KOSHI-WAZA",
  "De-ashi-harai": "ASHI-WAZA", "Hiza-guruma": "ASHI-WAZA", "Sasae-tsurikomi-ashi": "ASHI-WAZA", "O-soto-gari": "ASHI-WAZA", "O-uchi-gari": "ASHI-WAZA", "Ko-soto-gari": "ASHI-WAZA", "Ko-uchi-gari": "ASHI-WAZA", "Okuri-ashi-harai": "ASHI-WAZA", "Uchi-mata": "ASHI-WAZA", 
  "Tomoe-nage": "SUTEMI-WAZA", "Sumi-gaeshi": "SUTEMI-WAZA", "Ura-nage": "SUTEMI-WAZA", "Tani-otoshi": "SUTEMI-WAZA", "Yoko-otoshi": "SUTEMI-WAZA",
  "Kesa-gatame": "OSAEKOMI-WAZA", "Kata-gatame": "OSAEKOMI-WAZA", "Kami-shiho-gatame": "OSAEKOMI-WAZA", "Yoko-shiho-gatame": "OSAEKOMI-WAZA",
  "Nami-juji-jime": "SHIME-WAZA", "Hadaka-jime": "SHIME-WAZA", "Sankaku-jime": "SHIME-WAZA",
  "Ude-garami": "KANSETSU-WAZA", "Ude-hishigi-juji-gatame": "KANSETSU-WAZA"
};
const GRUPOS = ["TE-WAZA", "KOSHI-WAZA", "ASHI-WAZA", "SUTEMI-WAZA", "OSAEKOMI-WAZA", "SHIME-WAZA", "KANSETSU-WAZA"];
const CORES_GRUPOS: any = { "TE-WAZA": "#6366f1", "KOSHI-WAZA": "#10b981", "ASHI-WAZA": "#f59e0b", "SUTEMI-WAZA": "#ef4444", "OSAEKOMI-WAZA": "#3b82f6", "SHIME-WAZA": "#a855f7", "KANSETSU-WAZA": "#ec4899" };

export default function JudoPlayer() {
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Contexto
  const [atletaAtual, setAtletaAtual] = useState('BRANCO'); 
  const [ladoAtual, setLadoAtual] = useState('DIREITA');   
  const [nomeGolpe, setNomeGolpe] = useState('');          
  const [grupoSelecionado, setGrupoSelecionado] = useState('TE-WAZA'); 
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [motivoShido, setMotivoShido] = useState(DB_SHIDOS[0]);

  // --- NOVO: ESTADO DO MODAL DE PONTUAÇÃO ---
  const [modalAberto, setModalAberto] = useState(false);
  const [registroPendente, setRegistroPendente] = useState<any>(null); // Guarda o golpe enquanto espera a pontuação

  const [eventos, setEventos] = useState(() => {
    const salvos = localStorage.getItem('jaap_dados_v6'); 
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => { localStorage.setItem('jaap_dados_v6', JSON.stringify(eventos)); }, [eventos]);

  // --- LÓGICA DO PLACAR (Atualizada para ler pontuação dentro da técnica) ---
  const placar = useMemo(() => {
    const p = { branco: { ippon:0, waza:0, yuko:0, shido:0 }, azul: { ippon:0, waza:0, yuko:0, shido:0 } };
    eventos.forEach((ev: any) => {
      const quem = ev.atleta === 'BRANCO' ? p.branco : p.azul;
      
      // Conta pontuação vinculada à técnica
      if (ev.resultado === 'IPPON') quem.ippon++;
      if (ev.resultado === 'WAZA-ARI') quem.waza++;
      if (ev.resultado === 'YUKO') quem.yuko++;

      // Conta punições isoladas
      if (ev.categoria === 'PUNICAO') {
        if (ev.tipo === 'SHIDO') quem.shido++;
        if (ev.tipo === 'HANSOKU') quem.shido += 3;
      }
    });
    return p;
  }, [eventos]);

  const tempoDeLuta = useMemo(() => {
    let tempoTotal = 0; let ultimoHajime = null; let isGoldenScore = false;
    const ordenados = [...eventos].sort((a, b) => a.tempo - b.tempo);
    for (const ev of ordenados) {
      if (ev.categoria === 'FLUXO') {
        if (ev.tipo === 'GOLDEN SCORE') isGoldenScore = true;
        if (ev.tipo === 'HAJIME') ultimoHajime = ev.tempo;
        if ((ev.tipo === 'MATE' || ev.tipo === 'SOREMADE') && ultimoHajime !== null) {
          tempoTotal += (ev.tempo - ultimoHajime); ultimoHajime = null;
        }
      }
    }
    if (ultimoHajime !== null && currentTime > ultimoHajime) tempoTotal += (currentTime - ultimoHajime);
    return { total: tempoTotal, isGS: isGoldenScore };
  }, [eventos, currentTime]);

  // --- PASSO 1: INICIAR REGISTRO (Pausa vídeo e abre modal) ---
  const iniciarRegistroTecnica = () => {
    // 1. Cria o objeto base do golpe
    const dadosPreliminares = {
      id: Date.now(),
      tempo: currentTime,
      categoria: 'TECNICA',
      grupo: grupoSelecionado,
      especifico: nomeGolpe || "Técnica Geral",
      atleta: atletaAtual,
      lado: ladoAtual,
      cor: CORES_GRUPOS[grupoSelecionado]
    };

    // 2. Pausa o vídeo para o árbitro decidir
    if (playerRef.current) playerRef.current.pauseVideo();
    setIsPlaying(false);

    // 3. Abre o modal
    setRegistroPendente(dadosPreliminares);
    setModalAberto(true);
  };

  // --- PASSO 2: CONFIRMAR PONTUAÇÃO (Salva tudo) ---
  const confirmarPontuacao = (resultado: string) => {
    if (!registroPendente) return;

    const eventoFinal = {
      ...registroPendente,
      resultado: resultado // 'NADA', 'YUKO', 'WAZA-ARI', 'IPPON'
    };

    setEventos([eventoFinal, ...eventos]);
    
    // Limpeza
    setModalAberto(false);
    setRegistroPendente(null);
    setNomeGolpe(''); 
    setSugestoes([]);
    
    // Opcional: Dar play automático após escolher? (Deixei pausado para análise com calma)
    // if (playerRef.current) playerRef.current.playVideo();
  };

  const cancelarRegistro = () => {
    setModalAberto(false);
    setRegistroPendente(null);
  };

  // Outros registros simples
  const registrarFluxo = (tipo: string) => setEventos([{id: Date.now(), tempo: currentTime, categoria: 'FLUXO', tipo, atleta: '-', lado: '-', cor: '#555'}, ...eventos]);
  const registrarPunicao = (tipo: string, atleta: string) => setEventos([{id: Date.now(), tempo: currentTime, categoria: 'PUNICAO', tipo, especifico: motivoShido, atleta, lado: '-', cor: '#fbbf24'}, ...eventos]);

  // Helpers
  useEffect(() => {
    if (nomeGolpe.length > 1) {
      const matches = Object.keys(DB_GOLPES).filter(k => k.toLowerCase().includes(nomeGolpe.toLowerCase()));
      setSugestoes(matches.slice(0, 5));
      const exact = matches.find(k => k.toLowerCase() === nomeGolpe.toLowerCase());
      if (exact) setGrupoSelecionado(DB_GOLPES[exact]);
    } else setSugestoes([]);
  }, [nomeGolpe]);

  useEffect(() => {
    let af: number;
    const loop = () => { if(playerRef.current && isPlaying) { setCurrentTime(playerRef.current.getCurrentTime()); af = requestAnimationFrame(loop); }};
    if(isPlaying) loop();
    return () => cancelAnimationFrame(af);
  }, [isPlaying]);

  const onReady = (e: any) => { playerRef.current = e.target; setDuration(e.target.getDuration()); };
  const togglePlay = () => isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo();
  const irPara = (t: number) => { playerRef.current.seekTo(t, true); playerRef.current.playVideo(); };
  const formatTime = (s: number) => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

  const baixarCSV = () => {
    let csv = "data:text/csv;charset=utf-8,Tempo (s),Categoria,Técnica,Resultado,Atleta,Lado,Detalhe\n";
    eventos.forEach((ev: any) => {
      // Formatação segura para CSV
      csv += `${ev.tempo.toFixed(3).replace('.', ',')},${ev.categoria},${ev.especifico || ev.tipo || '-'},${ev.resultado || '-'},${ev.atleta},${ev.lado},${ev.grupo || ev.tipo}\n`;
    });
    const link = document.createElement("a"); link.href = encodeURI(csv); link.download = `jaap_pro_luta.csv`; link.click();
  };

  return (
    <div style={{ maxWidth: '1600px', width: '95%', margin: '0 auto', fontFamily: 'sans-serif', color: 'white', paddingBottom: '100px', position: 'relative' }}>
      
      {/* --- MODAL DE DECISÃO (OVERLAY) --- */}
      {modalAberto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '16px', width: '500px', textAlign: 'center', border: '2px solid #444', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <h2 style={{marginTop: 0, color: '#fbbf24'}}>RESULTADO DA AÇÃO</h2>
            <div style={{fontSize: '18px', marginBottom: '20px', color: '#ccc'}}>
              {registroPendente?.atleta} atacou com <strong style={{color: 'white'}}>{registroPendente?.especifico}</strong>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
              <button onClick={() => confirmarPontuacao('NADA')} style={{padding: '20px', fontSize: '16px', background: '#374151', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>SEM PONTUAÇÃO</button>
              <button onClick={() => confirmarPontuacao('YUKO')} style={{padding: '20px', fontSize: '16px', background: '#44403c', color: '#aaa', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>YUKO (Antigo)</button>
              <button onClick={() => confirmarPontuacao('WAZA-ARI')} style={{padding: '20px', fontSize: '18px', background: '#eab308', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>WAZA-ARI</button>
              <button onClick={() => confirmarPontuacao('IPPON')} style={{padding: '20px', fontSize: '20px', background: '#fff', color: '#000', border: '4px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>IPPON!</button>
            </div>

            <button onClick={cancelarRegistro} style={{background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto'}}>
              <X size={18}/> Cancelar Registro
            </button>
          </div>
        </div>
      )}

      {/* PLACAR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px', background: '#000', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #333' }}>
          <div style={{fontSize: '24px', fontWeight: 'bold'}}>⚪ BRANCO</div>
          <div style={{display: 'flex', gap: '20px', marginTop: '10px'}}>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#777'}}>IPPON</div><div style={{fontSize:'32px', fontWeight:'bold'}}>{placar.branco.ippon}</div></div>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#777'}}>WAZA</div><div style={{fontSize:'32px', fontWeight:'bold', color: '#fbbf24'}}>{placar.branco.waza}</div></div>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#777'}}>YUKO</div><div style={{fontSize:'32px', color: '#999'}}>{placar.branco.yuko}</div></div>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#ef4444'}}>SHIDO</div><div style={{fontSize:'32px', color: '#ef4444'}}>{placar.branco.shido}</div></div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{fontSize: '14px', color: tempoDeLuta.isGS ? '#fbbf24' : '#aaa', letterSpacing: '2px', fontWeight: 'bold'}}>{tempoDeLuta.isGS ? "GOLDEN SCORE" : "TEMPO DE LUTA"}</div>
          <div style={{fontSize: '56px', fontFamily: 'monospace', fontWeight: 'bold', color: tempoDeLuta.isGS ? '#fbbf24' : 'white', lineHeight: '1'}}>{formatTime(tempoDeLuta.total)}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid #333' }}>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#3b82f6'}}>🔵 AZUL</div>
          <div style={{display: 'flex', gap: '20px', marginTop: '10px'}}>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#ef4444'}}>SHIDO</div><div style={{fontSize:'32px', color: '#ef4444'}}>{placar.azul.shido}</div></div>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#777'}}>YUKO</div><div style={{fontSize:'32px', color: '#999'}}>{placar.azul.yuko}</div></div>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#777'}}>WAZA</div><div style={{fontSize:'32px', fontWeight:'bold', color: '#fbbf24'}}>{placar.azul.waza}</div></div>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#777'}}>IPPON</div><div style={{fontSize:'32px', fontWeight:'bold'}}>{placar.azul.ippon}</div></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' }}>
        <div>
          <div style={{ border: '2px solid #333', borderRadius: '12px', overflow: 'hidden', background: '#000', marginBottom: '15px' }}>
            <YouTube videoId="Jz6nuq5RBUA" onReady={onReady} onStateChange={onratechange} opts={{ width: '100%', height: '500px', playerVars: { controls: 0, rel: 0 } }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', padding: '15px', background: '#111', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px' }}>
            <button onClick={() => registrarFluxo('HAJIME')} style={{background: '#15803d', color:'white', border:'none', padding:'15px', fontWeight:'bold', cursor:'pointer', borderRadius:'6px'}}><PlayCircle size={24}/> HAJIME</button>
            <button onClick={() => registrarFluxo('MATE')} style={{background: '#b91c1c', color:'white', border:'none', padding:'15px', fontWeight:'bold', cursor:'pointer', borderRadius:'6px'}}><PauseCircle size={24}/> MATE</button>
            <button onClick={() => registrarFluxo('GOLDEN SCORE')} style={{background: '#b45309', color:'white', border:'none', padding:'15px', fontWeight:'bold', cursor:'pointer', borderRadius:'6px'}}><Timer size={24}/> G. SCORE</button>
            <button onClick={() => registrarFluxo('SOREMADE')} style={{background: '#333', color:'white', border:'none', padding:'15px', fontWeight:'bold', cursor:'pointer', borderRadius:'6px'}}><Flag size={24}/> SOREMADE</button>
          </div>

          {/* ARBITRAGEM (SÓ PUNIÇÕES AGORA, PONTOS SÃO NO GOLPE) */}
          <div style={{ background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px' }}>
             <h3 style={{margin:'0 0 15px 0', fontSize:'14px', color:'#aaa', display:'flex', alignItems:'center', gap:'10px'}}><Gavel size={18}/> PUNIÇÕES (SHIDO/HANSOKU)</h3>
             <div style={{display:'flex', gap:'5px', marginBottom: '10px'}}>
               <select style={{flex:2, background:'#333', color:'white', border:'none', padding:'12px', borderRadius:'4px'}} onChange={(e) => setMotivoShido(e.target.value)} value={motivoShido}>{DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}</select>
               <button onClick={() => registrarPunicao('SHIDO', 'BRANCO')} style={{flex:1, background:'#ef4444', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}>SHIDO ⚪</button>
               <button onClick={() => registrarPunicao('SHIDO', 'AZUL')} style={{flex:1, background:'#ef4444', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}>SHIDO 🔵</button>
             </div>
          </div>
          
          {/* COCKPIT TÉCNICO */}
          <div style={{ padding: '20px', background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{margin:'0 0 15px 0', fontSize:'14px', color:'#aaa'}}>REGISTRO TÉCNICO</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button onClick={() => setAtletaAtual('BRANCO')} style={{flex:1, padding:'12px', background: atletaAtual==='BRANCO'?'#999':'#333', border:'none', borderRadius:'4px', color:'white', cursor:'pointer'}}>⚪ BRANCO</button>
              <button onClick={() => setAtletaAtual('AZUL')} style={{flex:1, padding:'12px', background: atletaAtual==='AZUL'?'#2563eb':'#333', border:'none', borderRadius:'4px', color:'white', cursor:'pointer'}}>🔵 AZUL</button>
              <button onClick={() => setLadoAtual('ESQUERDA')} style={{flex:1, padding:'12px', background: ladoAtual==='ESQUERDA'?'#f59e0b':'#333', border:'none', borderRadius:'4px', color:'white', cursor:'pointer'}}><ArrowLeftRight size={14}/> ESQ</button>
              <button onClick={() => setLadoAtual('DIREITA')} style={{flex:1, padding:'12px', background: ladoAtual==='DIREITA'?'#10b981':'#333', border:'none', borderRadius:'4px', color:'white', cursor:'pointer'}}>DIR <ArrowLeftRight size={14}/></button>
            </div>
            
            <div style={{display:'flex', gap:'10px'}}>
              <div style={{flex:2, position:'relative'}}>
                <Search size={16} style={{position:'absolute', top:'15px', left:'10px', color:'#666'}}/>
                <input type="text" placeholder="Técnica (ex: Seoi...)" value={nomeGolpe} onChange={e=>setNomeGolpe(e.target.value)} style={{width:'100%', padding:'15px 15px 15px 35px', background:'#000', border:'1px solid #444', color:'white', borderRadius:'4px', fontSize:'16px'}}/>
                {sugestoes.length > 0 && <div style={{position:'absolute', top:'100%', width:'100%', background:'#333', zIndex:100}}>{sugestoes.map(s=><div key={s} onClick={()=>{setNomeGolpe(s); const exact=Object.keys(DB_GOLPES).find(k=>k.toLowerCase()===s.toLowerCase()); if(exact) setGrupoSelecionado(DB_GOLPES[exact]); setSugestoes([])}} style={{padding:'10px', borderBottom:'1px solid #444', cursor:'pointer'}}>{s}</div>)}</div>}
              </div>
              <button onClick={iniciarRegistroTecnica} style={{flex:1, background:'linear-gradient(to right, #3b82f6, #2563eb)', color:'white', border:'none', borderRadius:'4px', fontWeight:'bold', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                <CheckCircle size={20}/> REGISTRAR
              </button>
            </div>
          </div>
        </div>

        {/* LOG */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
            <h3 style={{margin:0}}>LOG DE AÇÕES</h3>
            <div>
              <button onClick={()=>setEventos([])} style={{background:'none', border:'none', color:'#666', cursor:'pointer', marginRight:'10px'}}><Trash2 size={16}/></button>
              <button onClick={baixarCSV} style={{background:'#2563eb', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}><Download size={16}/></button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '10px' }}>
            {eventos.map((ev: any) => (
              <div key={ev.id} style={{ padding: '12px', marginBottom: '5px', borderRadius: '6px', background: '#1f2937', borderLeft: `4px solid ${ev.cor}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div onClick={() => irPara(ev.tempo)} style={{cursor:'pointer', flex:1}}>
                  <div style={{display:'flex', gap:'10px', fontSize:'12px', color:'#888'}}>
                    <span style={{color:'#fbbf24', fontFamily:'monospace'}}>{ev.tempo.toFixed(1)}s</span>
                    <span style={{textTransform:'uppercase'}}>{ev.lado !== '-' ? ev.lado : ''}</span>
                  </div>
                  <div style={{fontWeight:'bold', color: ev.atleta === 'AZUL' ? '#60a5fa' : 'white'}}>
                    {ev.especifico || ev.tipo}
                  </div>
                  {/* EXIBE RESULTADO OU MOTIVO */}
                  {ev.resultado && ev.resultado !== 'NADA' && <div style={{marginTop:'4px', background: ev.resultado==='IPPON'?'white':'#eab308', color:'black', display:'inline-block', padding:'2px 6px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold'}}>{ev.resultado}</div>}
                  {ev.categoria === 'PUNICAO' && <div style={{fontSize:'11px', color:'#ef4444', marginTop:'2px'}}>{ev.especifico}</div>}
                </div>
                <button onClick={() => setEventos(eventos.filter((e:any) => e.id !== ev.id))} style={{background:'none', border:'none', color:'#444', cursor:'pointer'}}><X size={14}/></button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
