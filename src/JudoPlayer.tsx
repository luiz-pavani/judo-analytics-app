import React, { useRef, useState, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Trash2, ArrowLeftRight, CheckCircle, X, Search, PlayCircle, PauseCircle, AlertTriangle, Gavel, Timer, Flag } from 'lucide-react';

// --- BANCO DE DADOS: MOTIVOS DE SHIDO (IJF) ---
const DB_SHIDOS = [
  "Non-combativity (Passividade)",
  "False Attack (Falso Ataque)",
  "Stepping out (Saída de Área)",
  "Defensive Posture (Postura Defensiva)",
  "Grip Avoidance (Evitar Pegada)",
  "Illegal Grip (Pegada Ilegal)",
  "Fingers inside sleeve (Dedos na manga)",
  "Disarranging Judogi (Desarrumar Gi)",
  "Undetermined (Outros)"
];

// --- CÉREBRO TÉCNICO (100 GOLPES) ---
const DB_GOLPES: Record<string, string> = {
  // TE-WAZA
  "Seoi-nage": "TE-WAZA", "Ippon-seoi-nage": "TE-WAZA", "Seoi-otoshi": "TE-WAZA", "Tai-otoshi": "TE-WAZA", "Kata-guruma": "TE-WAZA", "Uki-otoshi": "TE-WAZA", "Sumi-otoshi": "TE-WAZA", "Sukui-nage": "TE-WAZA", "Obi-otoshi": "TE-WAZA", "Yama-arashi": "TE-WAZA", "Morote-gari": "TE-WAZA", "Kuchiki-taoshi": "TE-WAZA", "Kibisu-gaeshi": "TE-WAZA", "Uchi-mata-sukashi": "TE-WAZA", "Kouchi-gaeshi": "TE-WAZA",
  // KOSHI-WAZA
  "Uki-goshi": "KOSHI-WAZA", "O-goshi": "KOSHI-WAZA", "Koshi-guruma": "KOSHI-WAZA", "Tsurikomi-goshi": "KOSHI-WAZA", "Sode-tsurikomi-goshi": "KOSHI-WAZA", "Harai-goshi": "KOSHI-WAZA", "Tsuri-goshi": "KOSHI-WAZA", "Hane-goshi": "KOSHI-WAZA", "Utsuri-goshi": "KOSHI-WAZA", "Ushiro-goshi": "KOSHI-WAZA",
  // ASHI-WAZA
  "De-ashi-harai": "ASHI-WAZA", "Hiza-guruma": "ASHI-WAZA", "Sasae-tsurikomi-ashi": "ASHI-WAZA", "O-soto-gari": "ASHI-WAZA", "O-uchi-gari": "ASHI-WAZA", "Ko-soto-gari": "ASHI-WAZA", "Ko-uchi-gari": "ASHI-WAZA", "Okuri-ashi-harai": "ASHI-WAZA", "Uchi-mata": "ASHI-WAZA", "Ko-soto-gake": "ASHI-WAZA", "Ashi-guruma": "ASHI-WAZA", "Harai-tsurikomi-ashi": "ASHI-WAZA", "O-guruma": "ASHI-WAZA", "O-soto-guruma": "ASHI-WAZA", "O-soto-otoshi": "ASHI-WAZA", "Tsubame-gaeshi": "ASHI-WAZA", "O-soto-gaeshi": "ASHI-WAZA", "O-uchi-gaeshi": "ASHI-WAZA", "Hane-goshi-gaeshi": "ASHI-WAZA", "Harai-goshi-gaeshi": "ASHI-WAZA", "Uchi-mata-gaeshi": "ASHI-WAZA",
  // SUTEMI-WAZA
  "Tomoe-nage": "SUTEMI-WAZA", "Sumi-gaeshi": "SUTEMI-WAZA", "Hikikomi-gaeshi": "SUTEMI-WAZA", "Tawara-gaeshi": "SUTEMI-WAZA", "Ura-nage": "SUTEMI-WAZA", "Yoko-otoshi": "SUTEMI-WAZA", "Tani-otoshi": "SUTEMI-WAZA", "Hane-makikomi": "SUTEMI-WAZA", "Soto-makikomi": "SUTEMI-WAZA", "Uchi-makikomi": "SUTEMI-WAZA", "Uki-waza": "SUTEMI-WAZA", "Yoko-wakare": "SUTEMI-WAZA", "Yoko-guruma": "SUTEMI-WAZA", "Yoko-gake": "SUTEMI-WAZA", "Daki-wakare": "SUTEMI-WAZA", "Osoto-makikomi": "SUTEMI-WAZA", "Uchi-mata-makikomi": "SUTEMI-WAZA", "Harai-makikomi": "SUTEMI-WAZA", "Ko-uchi-makikomi": "SUTEMI-WAZA", "Kani-basami": "SUTEMI-WAZA", "Kawazu-gake": "SUTEMI-WAZA",
  // NE-WAZA
  "Kesa-gatame": "OSAEKOMI-WAZA", "Kata-gatame": "OSAEKOMI-WAZA", "Kami-shiho-gatame": "OSAEKOMI-WAZA", "Yoko-shiho-gatame": "OSAEKOMI-WAZA", "Tate-shiho-gatame": "OSAEKOMI-WAZA",
  "Nami-juji-jime": "SHIME-WAZA", "Gyaku-juji-jime": "SHIME-WAZA", "Kata-juji-jime": "SHIME-WAZA", "Hadaka-jime": "SHIME-WAZA", "Sankaku-jime": "SHIME-WAZA",
  "Ude-garami": "KANSETSU-WAZA", "Ude-hishigi-juji-gatame": "KANSETSU-WAZA"
};

const GRUPOS = ["TE-WAZA", "KOSHI-WAZA", "ASHI-WAZA", "SUTEMI-WAZA", "OSAEKOMI-WAZA", "SHIME-WAZA", "KANSETSU-WAZA"];
const CORES_GRUPOS: any = { "TE-WAZA": "#6366f1", "KOSHI-WAZA": "#10b981", "ASHI-WAZA": "#f59e0b", "SUTEMI-WAZA": "#ef4444", "OSAEKOMI-WAZA": "#3b82f6", "SHIME-WAZA": "#a855f7", "KANSETSU-WAZA": "#ec4899" };

export default function JudoPlayer() {
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Contexto de Análise
  const [atletaAtual, setAtletaAtual] = useState('BRANCO'); 
  const [ladoAtual, setLadoAtual] = useState('DIREITA');   
  const [nomeGolpe, setNomeGolpe] = useState('');          
  const [grupoSelecionado, setGrupoSelecionado] = useState('TE-WAZA'); 
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [motivoShido, setMotivoShido] = useState(DB_SHIDOS[0]);

  // Estado Geral de Eventos
  const [eventos, setEventos] = useState(() => {
    const salvos = localStorage.getItem('jaap_dados_v5'); 
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => {
    localStorage.setItem('jaap_dados_v5', JSON.stringify(eventos));
  }, [eventos]);

  // --- CÁLCULO DO TEMPO DE LUTA (CRONÔMETRO VIRTUAL) ---
  const tempoDeLuta = useMemo(() => {
    let tempoTotal = 0;
    let ultimoHajime = null;
    let isGoldenScore = false;

    // Ordena eventos por tempo de vídeo para calcular linearmente
    const eventosOrdenados = [...eventos].sort((a, b) => a.tempo - b.tempo);

    for (const ev of eventosOrdenados) {
      if (ev.categoria === 'FLUXO') {
        if (ev.tipo === 'GOLDEN SCORE') {
          isGoldenScore = true;
          // Opcional: Se quiser resetar o relógio no GS, descomente abaixo
          // tempoTotal = 0; 
        }
        if (ev.tipo === 'HAJIME') {
          ultimoHajime = ev.tempo;
        }
        if (ev.tipo === 'MATE' && ultimoHajime !== null) {
          tempoTotal += (ev.tempo - ultimoHajime);
          ultimoHajime = null;
        }
        if (ev.tipo === 'SOREMADE' && ultimoHajime !== null) {
          tempoTotal += (ev.tempo - ultimoHajime);
          ultimoHajime = null;
        }
      }
    }

    // Se a luta está rolando (teve Hajime mas não teve Mate ainda), soma o tempo atual do vídeo
    if (ultimoHajime !== null && currentTime > ultimoHajime) {
      tempoTotal += (currentTime - ultimoHajime);
    }

    return { total: tempoTotal, isGS: isGoldenScore };
  }, [eventos, currentTime]);


  // --- PLACAR AUTOMÁTICO (Baseado nos eventos) ---
  const placar = useMemo(() => {
    const p = { branco: { ippon:0, waza:0, yuko:0, shido:0 }, azul: { ippon:0, waza:0, yuko:0, shido:0 } };
    eventos.forEach((ev: any) => {
      if (ev.categoria === 'PONTUACAO' || ev.categoria === 'PUNICAO') {
        const quem = ev.atleta === 'BRANCO' ? p.branco : p.azul;
        if (ev.tipo === 'IPPON') quem.ippon++;
        if (ev.tipo === 'WAZA-ARI') quem.waza++;
        if (ev.tipo === 'YUKO') quem.yuko++;
        if (ev.tipo === 'SHIDO') quem.shido++;
        if (ev.tipo === 'HANSOKU') quem.shido += 3; // Hansoku direto
      }
    });
    return p;
  }, [eventos]);


  // --- FUNÇÕES DE REGISTRO ---

  const registrarFluxo = (tipo: string) => {
    const novo = {
      id: Date.now(),
      tempo: currentTime,
      categoria: 'FLUXO',
      tipo: tipo, // HAJIME, MATE, GOLDEN SCORE, SOREMADE
      atleta: '-',
      lado: '-',
      cor: '#555'
    };
    setEventos([novo, ...eventos]);
  };

  const registrarPontuacao = (tipo: string, atleta: string) => {
    const novo = {
      id: Date.now(),
      tempo: currentTime,
      categoria: 'PONTUACAO',
      tipo: tipo,
      atleta: atleta,
      lado: ladoAtual,
      cor: atleta === 'BRANCO' ? '#fff' : '#2563eb'
    };
    setEventos([novo, ...eventos]);
  };

  const registrarPunicao = (tipo: string, atleta: string) => {
    const novo = {
      id: Date.now(),
      tempo: currentTime,
      categoria: 'PUNICAO',
      tipo: tipo,
      especifico: motivoShido, // Salva o motivo
      atleta: atleta,
      lado: '-',
      cor: '#fbbf24' // Amarelo alerta
    };
    setEventos([novo, ...eventos]);
  };

  const registrarTecnica = () => {
    const novo = {
      id: Date.now(),
      tempo: currentTime,
      categoria: 'TECNICA',
      grupo: grupoSelecionado,
      especifico: nomeGolpe || "Geral",
      tipo: grupoSelecionado,
      atleta: atletaAtual,
      lado: ladoAtual,
      cor: CORES_GRUPOS[grupoSelecionado]
    };
    setEventos([novo, ...eventos]);
    setNomeGolpe(''); setSugestoes([]);
  };

  // --- HELPERS E EFEITOS ---
  useEffect(() => {
    if (nomeGolpe.length > 1) {
      const matches = Object.keys(DB_GOLPES).filter(k => k.toLowerCase().includes(nomeGolpe.toLowerCase()));
      setSugestoes(matches.slice(0, 5));
      const exact = matches.find(k => k.toLowerCase() === nomeGolpe.toLowerCase());
      if (exact) setGrupoSelecionado(DB_GOLPES[exact]);
    } else setSugestoes([]);
  }, [nomeGolpe]);

  const togglePlay = () => isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo();
  const onReady = (e: any) => { playerRef.current = e.target; setDuration(e.target.getDuration()); };
  const onStateChange = (e: any) => setIsPlaying(e.data === 1);
  const irPara = (t: number) => { playerRef.current.seekTo(t, true); playerRef.current.playVideo(); };
  
  useEffect(() => {
    let af: number;
    const loop = () => { if(playerRef.current && isPlaying) { setCurrentTime(playerRef.current.getCurrentTime()); af = requestAnimationFrame(loop); }};
    if(isPlaying) loop();
    return () => cancelAnimationFrame(af);
  }, [isPlaying]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const baixarCSV = () => {
    let csv = "data:text/csv;charset=utf-8,Tempo Video (s),Categoria,Tipo/Grupo,Detalhe,Atleta,Lado\n";
    eventos.forEach((ev: any) => {
      csv += `${ev.tempo.toFixed(3).replace('.', ',')},${ev.categoria},${ev.tipo || ev.grupo},${ev.especifico || '-'},${ev.atleta},${ev.lado}\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `jaap_pro_luta.csv`;
    link.click();
  };

  // --- RENDER ---
  return (
    <div style={{ maxWidth: '1600px', width: '95%', margin: '0 auto', fontFamily: 'sans-serif', color: 'white', paddingBottom: '100px' }}>
      
      {/* HEADER: PLACAR ELETRÔNICO GIGANTE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px', background: '#000', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
        
        {/* LADO BRANCO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #333' }}>
          <div style={{fontSize: '24px', fontWeight: 'bold'}}>⚪ BRANCO</div>
          <div style={{display: 'flex', gap: '20px', marginTop: '10px'}}>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#777'}}>IPPON</div><div style={{fontSize:'32px', fontWeight:'bold'}}>{placar.branco.ippon}</div></div>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#777'}}>WAZA</div><div style={{fontSize:'32px', fontWeight:'bold', color: '#fbbf24'}}>{placar.branco.waza}</div></div>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#777'}}>YUKO</div><div style={{fontSize:'32px', color: '#999'}}>{placar.branco.yuko}</div></div>
            <div style={{textAlign: 'center'}}><div style={{fontSize:'12px', color:'#ef4444'}}>SHIDO</div><div style={{fontSize:'32px', color: '#ef4444'}}>{placar.branco.shido}</div></div>
          </div>
        </div>

        {/* CENTRO: CRONÔMETRO DE LUTA (REAL TIME) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{fontSize: '14px', color: tempoDeLuta.isGS ? '#fbbf24' : '#aaa', letterSpacing: '2px', fontWeight: 'bold'}}>
            {tempoDeLuta.isGS ? "GOLDEN SCORE" : "TEMPO DE LUTA"}
          </div>
          <div style={{fontSize: '56px', fontFamily: 'monospace', fontWeight: 'bold', color: tempoDeLuta.isGS ? '#fbbf24' : 'white', lineHeight: '1'}}>
            {formatTime(tempoDeLuta.total)}
          </div>
          <div style={{fontSize: '14px', color: '#555', marginTop: '5px'}}>Video: {formatTime(currentTime)}</div>
        </div>

        {/* LADO AZUL */}
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


      {/* LAYOUT PRINCIPAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' }}>
        
        {/* COLUNA ESQUERDA: VÍDEO + ARBITRAGEM */}
        <div>
          <div style={{ border: '2px solid #333', borderRadius: '12px', overflow: 'hidden', background: '#000', marginBottom: '15px' }}>
            <YouTube videoId="Jz6nuq5RBUA" onReady={onReady} onStateChange={onStateChange} opts={{ width: '100%', height: '500px', playerVars: { controls: 0, rel: 0 } }} />
          </div>

          {/* CONTROLE DE FLUXO (ÁRBITRO CENTRAL) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', padding: '15px', background: '#111', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px' }}>
            <button onClick={() => registrarFluxo('HAJIME')} style={{background: '#15803d', color:'white', border:'none', padding:'15px', fontWeight:'bold', cursor:'pointer', borderRadius:'6px', display:'flex', flexDirection:'column', alignItems:'center'}}>
              <PlayCircle size={24}/> HAJIME
            </button>
            <button onClick={() => registrarFluxo('MATE')} style={{background: '#b91c1c', color:'white', border:'none', padding:'15px', fontWeight:'bold', cursor:'pointer', borderRadius:'6px', display:'flex', flexDirection:'column', alignItems:'center'}}>
              <PauseCircle size={24}/> MATE
            </button>
            <button onClick={() => registrarFluxo('GOLDEN SCORE')} style={{background: '#b45309', color:'white', border:'none', padding:'15px', fontWeight:'bold', cursor:'pointer', borderRadius:'6px', display:'flex', flexDirection:'column', alignItems:'center'}}>
              <Timer size={24}/> G. SCORE
            </button>
            <button onClick={() => registrarFluxo('SOREMADE')} style={{background: '#333', color:'white', border:'none', padding:'15px', fontWeight:'bold', cursor:'pointer', borderRadius:'6px', display:'flex', flexDirection:'column', alignItems:'center'}}>
              <Flag size={24}/> SOREMADE
            </button>
          </div>

          {/* ÁREA DE ARBITRAGEM (PONTOS E PUNIÇÕES) */}
          <div style={{ background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '20px' }}>
             <h3 style={{margin:'0 0 15px 0', fontSize:'14px', color:'#aaa', display:'flex', alignItems:'center', gap:'10px'}}><Gavel size={18}/> MESA DE ARBITRAGEM</h3>
             
             <div style={{display:'grid', gridTemplateColumns:'1fr 1px 1fr', gap:'20px'}}>
               {/* BRANCO */}
               <div>
                 <div style={{marginBottom:'10px', fontWeight:'bold', textAlign:'center'}}>⚪ BRANCO</div>
                 <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'5px', marginBottom:'15px'}}>
                   <button onClick={() => registrarPontuacao('YUKO', 'BRANCO')} style={{padding:'10px', background:'#333', color:'#aaa', border:'none', cursor:'pointer', borderRadius:'4px'}}>YUKO</button>
                   <button onClick={() => registrarPontuacao('WAZA-ARI', 'BRANCO')} style={{padding:'10px', background:'#ca8a04', color:'white', border:'none', cursor:'pointer', borderRadius:'4px'}}>WAZA</button>
                   <button onClick={() => registrarPontuacao('IPPON', 'BRANCO')} style={{padding:'10px', background:'white', color:'black', border:'none', cursor:'pointer', fontWeight:'bold', borderRadius:'4px'}}>IPPON</button>
                 </div>
                 {/* SHIDOS BRANCO */}
                 <div style={{display:'flex', gap:'5px'}}>
                   <select style={{flex:1, background:'#333', color:'white', border:'none', padding:'8px', borderRadius:'4px'}} onChange={(e) => setMotivoShido(e.target.value)} value={motivoShido}>
                     {DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                   <button onClick={() => registrarPunicao('SHIDO', 'BRANCO')} style={{background:'#ef4444', color:'white', border:'none', padding:'8px', borderRadius:'4px', cursor:'pointer'}}>SHIDO</button>
                   <button onClick={() => registrarPunicao('HANSOKU', 'BRANCO')} style={{background:'#7f1d1d', color:'white', border:'none', padding:'8px', borderRadius:'4px', cursor:'pointer'}}>H</button>
                 </div>
               </div>

               <div style={{background:'#333'}}></div>

               {/* AZUL */}
               <div>
                 <div style={{marginBottom:'10px', fontWeight:'bold', textAlign:'center', color:'#3b82f6'}}>🔵 AZUL</div>
                 <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'5px', marginBottom:'15px'}}>
                   <button onClick={() => registrarPontuacao('YUKO', 'AZUL')} style={{padding:'10px', background:'#333', color:'#aaa', border:'none', cursor:'pointer', borderRadius:'4px'}}>YUKO</button>
                   <button onClick={() => registrarPontuacao('WAZA-ARI', 'AZUL')} style={{padding:'10px', background:'#ca8a04', color:'white', border:'none', cursor:'pointer', borderRadius:'4px'}}>WAZA</button>
                   <button onClick={() => registrarPontuacao('IPPON', 'AZUL')} style={{padding:'10px', background:'#2563eb', color:'white', border:'none', cursor:'pointer', fontWeight:'bold', borderRadius:'4px'}}>IPPON</button>
                 </div>
                 {/* SHIDOS AZUL */}
                 <div style={{display:'flex', gap:'5px'}}>
                   <select style={{flex:1, background:'#333', color:'white', border:'none', padding:'8px', borderRadius:'4px'}} onChange={(e) => setMotivoShido(e.target.value)} value={motivoShido}>
                     {DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                   <button onClick={() => registrarPunicao('SHIDO', 'AZUL')} style={{background:'#ef4444', color:'white', border:'none', padding:'8px', borderRadius:'4px', cursor:'pointer'}}>SHIDO</button>
                   <button onClick={() => registrarPunicao('HANSOKU', 'AZUL')} style={{background:'#7f1d1d', color:'white', border:'none', padding:'8px', borderRadius:'4px', cursor:'pointer'}}>H</button>
                 </div>
               </div>
             </div>
          </div>
          
          {/* COCKPIT TÉCNICO (CÓDIGO ANTERIOR REUTILIZADO E COMPACTADO) */}
          <div style={{ padding: '20px', background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{margin:'0 0 15px 0', fontSize:'14px', color:'#aaa'}}>REGISTRO TÉCNICO (BIOMECÂNICA)</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button onClick={() => setAtletaAtual('BRANCO')} style={{flex:1, padding:'10px', background: atletaAtual==='BRANCO'?'#999':'#333', border:'none', borderRadius:'4px', color:'white', cursor:'pointer'}}>🥋 BRANCO</button>
              <button onClick={() => setAtletaAtual('AZUL')} style={{flex:1, padding:'10px', background: atletaAtual==='AZUL'?'#2563eb':'#333', border:'none', borderRadius:'4px', color:'white', cursor:'pointer'}}>🥋 AZUL</button>
              <button onClick={() => setLadoAtual('ESQUERDA')} style={{flex:1, padding:'10px', background: ladoAtual==='ESQUERDA'?'#f59e0b':'#333', border:'none', borderRadius:'4px', color:'white', cursor:'pointer'}}><ArrowLeftRight size={14}/> ESQUERDA</button>
              <button onClick={() => setLadoAtual('DIREITA')} style={{flex:1, padding:'10px', background: ladoAtual==='DIREITA'?'#10b981':'#333', border:'none', borderRadius:'4px', color:'white', cursor:'pointer'}}>DIREITA <ArrowLeftRight size={14}/></button>
            </div>
            
            <div style={{display:'flex', gap:'10px'}}>
              <div style={{flex:2, position:'relative'}}>
                <Search size={16} style={{position:'absolute', top:'12px', left:'10px', color:'#666'}}/>
                <input type="text" placeholder="Técnica (ex: Seoi...)" value={nomeGolpe} onChange={e=>setNomeGolpe(e.target.value)} style={{width:'100%', padding:'10px 10px 10px 35px', background:'#000', border:'1px solid #444', color:'white', borderRadius:'4px'}}/>
                {sugestoes.length > 0 && <div style={{position:'absolute', top:'100%', width:'100%', background:'#333', zIndex:100}}>{sugestoes.map(s=><div key={s} onClick={()=>{setNomeGolpe(s); const exact=Object.keys(DB_GOLPES).find(k=>k.toLowerCase()===s.toLowerCase()); if(exact) setGrupoSelecionado(DB_GOLPES[exact]); setSugestoes([])}} style={{padding:'10px', borderBottom:'1px solid #444', cursor:'pointer'}}>{s}</div>)}</div>}
              </div>
              <button onClick={registrarTecnica} style={{flex:1, background:'linear-gradient(to right, #3b82f6, #2563eb)', color:'white', border:'none', borderRadius:'4px', fontWeight:'bold', cursor:'pointer'}}>REGISTRAR</button>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: LOG COMPLETO */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
            <h3 style={{margin:0}}>LOG DE EVENTOS</h3>
            <div>
              <button onClick={()=>setEventos([])} style={{background:'none', border:'none', color:'#666', cursor:'pointer', marginRight:'10px'}}><Trash2 size={16}/></button>
              <button onClick={baixarCSV} style={{background:'#2563eb', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}><Download size={16}/></button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '10px' }}>
            {eventos.map((ev: any) => (
              <div key={ev.id} style={{ padding: '10px', marginBottom: '5px', borderRadius: '6px', background: '#1f2937', borderLeft: `4px solid ${ev.cor}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div onClick={() => irPara(ev.tempo)} style={{cursor:'pointer', flex:1}}>
                  <div style={{display:'flex', gap:'10px', fontSize:'12px', color:'#888'}}>
                    <span style={{color:'#fbbf24', fontFamily:'monospace'}}>{ev.tempo.toFixed(1)}s</span>
                    <span>{ev.categoria}</span>
                  </div>
                  <div style={{fontWeight:'bold', color: ev.atleta === 'AZUL' ? '#60a5fa' : 'white'}}>
                    {ev.categoria === 'FLUXO' ? ev.tipo : ev.especifico || ev.tipo}
                  </div>
                  {ev.categoria === 'PUNICAO' && <div style={{fontSize:'11px', color:'#ef4444'}}>{ev.especifico}</div>}
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
