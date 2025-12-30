import React, { useRef, useState, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Trash2, ArrowLeftRight, PlayCircle, PauseCircle, Timer, Flag, Gavel, X, Search, CheckCircle, Smartphone } from 'lucide-react';

// --- BANCO DE DADOS: MOTIVOS DE SHIDO (IJF) ---
const DB_SHIDOS = ["Passividade", "Falso Ataque", "Saída de Área", "Postura Defensiva", "Evitar Pegada", "Pegada Ilegal", "Dedos na manga", "Desarrumar Gi", "Outros"];

// --- BANCO DE DADOS: AS 100 TÉCNICAS (KODOKAN) ---
// Grafia oficial: minúsculas e mácrons
const DB_GOLPES: Record<string, string> = {
  // --- NAGE-WAZA (68) ---
  "seoi-nage": "TE-WAZA", "ippon-seoi-nage": "TE-WAZA", "seoi-otoshi": "TE-WAZA", "tai-otoshi": "TE-WAZA", "kata-guruma": "TE-WAZA", "sukui-nage": "TE-WAZA", "obi-otoshi": "TE-WAZA", "uki-otoshi": "TE-WAZA", "sumi-otoshi": "TE-WAZA", "yama-arashi": "TE-WAZA", "obi-tori-gaeshi": "TE-WAZA", "morote-gari": "TE-WAZA", "kuchiki-taoshi": "TE-WAZA", "kibisu-gaeshi": "TE-WAZA", "uchi-mata-sukashi": "TE-WAZA", "kouchi-gaeshi": "TE-WAZA",
  "uki-goshi": "KOSHI-WAZA", "ō-goshi": "KOSHI-WAZA", "koshi-guruma": "KOSHI-WAZA", "tsurikomi-goshi": "KOSHI-WAZA", "sode-tsurikomi-goshi": "KOSHI-WAZA", "harai-goshi": "KOSHI-WAZA", "tsuri-goshi": "KOSHI-WAZA", "hane-goshi": "KOSHI-WAZA", "utsuri-goshi": "KOSHI-WAZA", "ushiro-goshi": "KOSHI-WAZA",
  "de-ashi-harai": "ASHI-WAZA", "hiza-guruma": "ASHI-WAZA", "sasae-tsurikomi-ashi": "ASHI-WAZA", "ō-soto-gari": "ASHI-WAZA", "ō-uchi-gari": "ASHI-WAZA", "ko-soto-gari": "ASHI-WAZA", "ko-uchi-gari": "ASHI-WAZA", "okuri-ashi-harai": "ASHI-WAZA", "uchi-mata": "ASHI-WAZA", "ko-soto-gake": "ASHI-WAZA", "ashi-guruma": "ASHI-WAZA", "harai-tsurikomi-ashi": "ASHI-WAZA", "ō-guruma": "ASHI-WAZA", "ō-soto-guruma": "ASHI-WAZA", "ō-soto-otoshi": "ASHI-WAZA", "tsubame-gaeshi": "ASHI-WAZA", "ō-soto-gaeshi": "ASHI-WAZA", "ō-uchi-gaeshi": "ASHI-WAZA", "hane-goshi-gaeshi": "ASHI-WAZA", "harai-goshi-gaeshi": "ASHI-WAZA", "uchi-mata-gaeshi": "ASHI-WAZA",
  "tomoe-nage": "SUTEMI-WAZA", "sumi-gaeshi": "SUTEMI-WAZA", "hikikomi-gaeshi": "SUTEMI-WAZA", "tawara-gaeshi": "SUTEMI-WAZA", "ura-nage": "SUTEMI-WAZA", "yoko-otoshi": "SUTEMI-WAZA", "tani-otoshi": "SUTEMI-WAZA", "hane-makikomi": "SUTEMI-WAZA", "soto-makikomi": "SUTEMI-WAZA", "uchi-makikomi": "SUTEMI-WAZA", "uki-waza": "SUTEMI-WAZA", "yoko-wakare": "SUTEMI-WAZA", "yoko-guruma": "SUTEMI-WAZA", "yoko-gake": "SUTEMI-WAZA", "daki-wakare": "SUTEMI-WAZA", "ō-soto-makikomi": "SUTEMI-WAZA", "uchi-mata-makikomi": "SUTEMI-WAZA", "harai-makikomi": "SUTEMI-WAZA", "ko-uchi-makikomi": "SUTEMI-WAZA", "kani-basami": "SUTEMI-WAZA", "kawazu-gake": "SUTEMI-WAZA",
  // --- KATAME-WAZA (32) ---
  "kesa-gatame": "OSAEKOMI-WAZA", "kuzure-kesa-gatame": "OSAEKOMI-WAZA", "ushiro-kesa-gatame": "OSAEKOMI-WAZA", "kata-gatame": "OSAEKOMI-WAZA", "kami-shihō-gatame": "OSAEKOMI-WAZA", "kuzure-kami-shihō-gatame": "OSAEKOMI-WAZA", "yoko-shihō-gatame": "OSAEKOMI-WAZA", "tate-shihō-gatame": "OSAEKOMI-WAZA", "uki-gatame": "OSAEKOMI-WAZA", "ura-gatame": "OSAEKOMI-WAZA",
  "nami-jūji-jime": "SHIME-WAZA", "gyaku-jūji-jime": "SHIME-WAZA", "kata-jūji-jime": "SHIME-WAZA", "hadaka-jime": "SHIME-WAZA", "okuri-eri-jime": "SHIME-WAZA", "kataha-jime": "SHIME-WAZA", "katate-jime": "SHIME-WAZA", "ryōte-jime": "SHIME-WAZA", "sode-guruma-jime": "SHIME-WAZA", "tsukkomi-jime": "SHIME-WAZA", "sankaku-jime": "SHIME-WAZA", "dō-jime": "SHIME-WAZA",
  "ude-garami": "KANSETSU-WAZA", "ude-hishigi-jūji-gatame": "KANSETSU-WAZA", "ude-hishigi-ude-gatame": "KANSETSU-WAZA", "ude-hishigi-hiza-gatame": "KANSETSU-WAZA", "ude-hishigi-waki-gatame": "KANSETSU-WAZA", "ude-hishigi-hara-gatame": "KANSETSU-WAZA", "ude-hishigi-ashi-gatame": "KANSETSU-WAZA", "ude-hishigi-te-gatame": "KANSETSU-WAZA", "ude-hishigi-sankaku-gatame": "KANSETSU-WAZA", "ashi-garami": "KANSETSU-WAZA"
};

const GRUPOS = ["TE-WAZA", "KOSHI-WAZA", "ASHI-WAZA", "SUTEMI-WAZA", "OSAEKOMI-WAZA", "SHIME-WAZA", "KANSETSU-WAZA"];
const CORES_GRUPOS: any = { "TE-WAZA": "#6366f1", "KOSHI-WAZA": "#10b981", "ASHI-WAZA": "#f59e0b", "SUTEMI-WAZA": "#ef4444", "OSAEKOMI-WAZA": "#3b82f6", "SHIME-WAZA": "#a855f7", "KANSETSU-WAZA": "#ec4899" };

export default function JudoPlayer() {
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Detecção de Mobile (Responsividade)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Contexto
  const [atletaAtual, setAtletaAtual] = useState('BRANCO'); 
  const [ladoAtual, setLadoAtual] = useState('DIREITA');   
  const [nomeGolpe, setNomeGolpe] = useState('');          
  const [grupoSelecionado, setGrupoSelecionado] = useState('TE-WAZA'); 
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [motivoShido, setMotivoShido] = useState(DB_SHIDOS[0]);

  // Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [registroPendente, setRegistroPendente] = useState<any>(null);

  // Banco de Dados Local
  const [eventos, setEventos] = useState(() => {
    const salvos = localStorage.getItem('smaartpro_db_v3');
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => { localStorage.setItem('smaartpro_db_v3', JSON.stringify(eventos)); }, [eventos]);

  // Placar
  const placar = useMemo(() => {
    const p = { branco: { ippon:0, waza:0, yuko:0, shido:0 }, azul: { ippon:0, waza:0, yuko:0, shido:0 } };
    eventos.forEach((ev: any) => {
      const quem = ev.atleta === 'BRANCO' ? p.branco : p.azul;
      if (ev.resultado === 'IPPON') quem.ippon++;
      if (ev.resultado === 'WAZA-ARI') quem.waza++;
      if (ev.resultado === 'YUKO') quem.yuko++;
      if (ev.categoria === 'PUNICAO') {
        if (ev.tipo === 'SHIDO') quem.shido++;
        if (ev.tipo === 'HANSOKU') quem.shido += 3;
      }
    });
    return p;
  }, [eventos]);

  // Tempo
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

  const iniciarRegistroTecnica = () => {
    const dadosPreliminares = {
      id: Date.now(), tempo: currentTime, categoria: 'TECNICA',
      grupo: grupoSelecionado, especifico: nomeGolpe || "Técnica Geral",
      atleta: atletaAtual, lado: ladoAtual, corTecnica: CORES_GRUPOS[grupoSelecionado]
    };
    if (playerRef.current) playerRef.current.pauseVideo();
    setIsPlaying(false);
    setRegistroPendente(dadosPreliminares);
    setModalAberto(true);
  };

  const confirmarPontuacao = (resultado: string) => {
    if (!registroPendente) return;
    setEventos([{ ...registroPendente, resultado: resultado }, ...eventos]);
    setModalAberto(false); setRegistroPendente(null); setNomeGolpe(''); setSugestoes([]);
  };

  const cancelarRegistro = () => { setModalAberto(false); setRegistroPendente(null); };
  const registrarFluxo = (tipo: string) => setEventos([{id: Date.now(), tempo: currentTime, categoria: 'FLUXO', tipo, atleta: '-', lado: '-', corTecnica: '#555'}, ...eventos]);
  const registrarPunicao = (tipo: string, atleta: string) => setEventos([{id: Date.now(), tempo: currentTime, categoria: 'PUNICAO', tipo, especifico: motivoShido, atleta, lado: '-', corTecnica: '#fbbf24'}, ...eventos]);

  useEffect(() => {
    if (nomeGolpe.length > 1) {
      const matches = Object.keys(DB_GOLPES).filter(k => k.toLowerCase().includes(nomeGolpe.toLowerCase()));
      setSugestoes(matches.slice(0, 5));
      const exact = matches.find(k => k.toLowerCase() === nomeGolpe.toLowerCase());
      if (exact) setGrupoSelecionado(DB_GOLPES[exact] as any);
    } else setSugestoes([]);
  }, [nomeGolpe]);

  useEffect(() => {
    let af: number;
    const loop = () => { if(playerRef.current && isPlaying) { setCurrentTime(playerRef.current.getCurrentTime()); af = requestAnimationFrame(loop); }};
    if(isPlaying) loop();
    return () => cancelAnimationFrame(af);
  }, [isPlaying]);

  const onReady = (e: any) => { playerRef.current = e.target; setDuration(e.target.getDuration()); };
  const onStateChange = (e: any) => setIsPlaying(e.data === 1);
  const irPara = (t: number) => { playerRef.current.seekTo(t, true); playerRef.current.playVideo(); };
  const formatTime = (s: number) => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
  
  const baixarCSV = () => {
    let csv = "data:text/csv;charset=utf-8,Tempo (s),Categoria,Técnica,Resultado,Atleta,Lado,Detalhe\n";
    eventos.forEach((ev: any) => csv += `${ev.tempo.toFixed(3).replace('.', ',')},${ev.categoria},${ev.especifico || ev.tipo || '-'},${ev.resultado || '-'},${ev.atleta},${ev.lado},${ev.grupo || ev.tipo}\n`);
    const link = document.createElement("a"); link.href = encodeURI(csv); link.download = `smaartpro_analise_${new Date().toISOString().slice(0,10)}.csv`; link.click();
  };

  const getCorBorda = (ev: any) => {
    if (ev.categoria === 'FLUXO') return '#555';
    if (ev.atleta === 'AZUL') return '#2563eb'; 
    if (ev.atleta === 'BRANCO') return '#ffffff'; 
    return '#555';
  };

  return (
    <div style={{ maxWidth: '100%', width: '100%', margin: '0 auto', fontFamily: 'sans-serif', color: 'white', paddingBottom: '100px', boxSizing: 'border-box', padding: isMobile ? '10px' : '20px' }}>
      
      {/* HEADER MARCA */}
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? '22px' : '28px', fontWeight: '900', letterSpacing: '-1px' }}>
          <span style={{ color: '#ef4444' }}>SMAART</span><span style={{ color: '#666', margin: '0 5px', fontWeight: '300' }}>|</span><span style={{ color: 'white' }}>PRO</span>
          {!isMobile && <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px', letterSpacing: '0px' }}>v3.2 Mobile</span>}
        </h1>
        <button onClick={baixarCSV} style={{background:'#2563eb', color:'white', border:'none', padding:'8px 12px', borderRadius:'4px', cursor:'pointer'}}><Download size={18}/></button>
      </div>

      {/* MODAL RESPONSIVO */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
          <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '400px', textAlign: 'center', border: '1px solid #444' }}>
            <h2 style={{marginTop: 0, color: '#fbbf24', fontSize:'20px'}}>RESULTADO</h2>
            <div style={{fontSize: '16px', marginBottom: '20px', color: '#ccc'}}>
              {registroPendente?.atleta} <br/> <strong style={{color: 'white', fontSize:'18px'}}>{registroPendente?.especifico}</strong>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px'}}>
              <button onClick={() => confirmarPontuacao('NADA')} style={{padding: '15px', background: '#374151', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold'}}>NADA</button>
              <button onClick={() => confirmarPontuacao('YUKO')} style={{padding: '15px', background: '#44403c', color: '#aaa', border: 'none', borderRadius: '8px', fontWeight: 'bold'}}>YUKO</button>
              <button onClick={() => confirmarPontuacao('WAZA-ARI')} style={{padding: '15px', background: '#eab308', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold'}}>WAZA</button>
              <button onClick={() => confirmarPontuacao('IPPON')} style={{padding: '15px', background: '#fff', color: '#000', border: '4px solid #ef4444', borderRadius: '8px', fontWeight: 'bold'}}>IPPON</button>
            </div>
            <button onClick={cancelarRegistro} style={{background: 'transparent', border: 'none', color: '#ef4444', padding:'10px', width:'100%'}}>CANCELAR</button>
          </div>
        </div>
      )}

      {/* PLACAR ADAPTÁVEL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', marginBottom: '15px', background: '#000', padding: isMobile ? '10px 5px' : '15px', borderRadius: '12px', border: '1px solid #333' }}>
        {/* BRANCO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #333' }}>
          <div style={{fontSize: isMobile?'14px':'24px', fontWeight: 'bold'}}>⚪ {isMobile ? '' : 'BRANCO'}</div>
          <div style={{display: 'flex', gap: isMobile?'5px':'20px', marginTop: '5px', flexWrap:'wrap', justifyContent:'center'}}>
             <div style={{textAlign:'center'}}><div style={{fontSize:'10px', color:'#777'}}>I</div><div style={{fontSize:isMobile?'20px':'32px', fontWeight:'bold'}}>{placar.branco.ippon}</div></div>
             <div style={{textAlign:'center'}}><div style={{fontSize:'10px', color:'#fbbf24'}}>W</div><div style={{fontSize:isMobile?'20px':'32px', fontWeight:'bold', color: '#fbbf24'}}>{placar.branco.waza}</div></div>
             <div style={{textAlign:'center'}}><div style={{fontSize:'10px', color:'#999'}}>Y</div><div style={{fontSize:isMobile?'20px':'32px', color: '#999'}}>{placar.branco.yuko}</div></div>
             <div style={{textAlign:'center'}}><div style={{fontSize:'10px', color:'#ef4444'}}>S</div><div style={{fontSize:isMobile?'20px':'32px', color: '#ef4444'}}>{placar.branco.shido}</div></div>
          </div>
        </div>
        {/* TEMPO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{fontSize: isMobile?'10px':'14px', color: tempoDeLuta.isGS ? '#fbbf24' : '#aaa', fontWeight: 'bold'}}>{tempoDeLuta.isGS ? "GS" : "TEMPO"}</div>
          <div style={{fontSize: isMobile?'32px':'56px', fontFamily: 'monospace', fontWeight: 'bold', color: tempoDeLuta.isGS ? '#fbbf24' : 'white', lineHeight: '1'}}>{formatTime(tempoDeLuta.total)}</div>
        </div>
        {/* AZUL */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid #333' }}>
          <div style={{fontSize: isMobile?'14px':'24px', fontWeight: 'bold', color: '#3b82f6'}}>🔵 {isMobile ? '' : 'AZUL'}</div>
          <div style={{display: 'flex', gap: isMobile?'5px':'20px', marginTop: '5px', flexWrap:'wrap', justifyContent:'center'}}>
             <div style={{textAlign:'center'}}><div style={{fontSize:'10px', color:'#ef4444'}}>S</div><div style={{fontSize:isMobile?'20px':'32px', color: '#ef4444'}}>{placar.azul.shido}</div></div>
             <div style={{textAlign:'center'}}><div style={{fontSize:'10px', color:'#999'}}>Y</div><div style={{fontSize:isMobile?'20px':'32px', color: '#999'}}>{placar.azul.yuko}</div></div>
             <div style={{textAlign:'center'}}><div style={{fontSize:'10px', color:'#fbbf24'}}>W</div><div style={{fontSize:isMobile?'20px':'32px', fontWeight:'bold', color: '#fbbf24'}}>{placar.azul.waza}</div></div>
             <div style={{textAlign:'center'}}><div style={{fontSize:'10px', color:'#777'}}>I</div><div style={{fontSize:isMobile?'20px':'32px', fontWeight:'bold'}}>{placar.azul.ippon}</div></div>
          </div>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL RESPONSIVO */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* ÁREA ESQUERDA (VÍDEO E CONTROLES) */}
        <div>
          {/* VÍDEO RESPONSIVO */}
          <div style={{ border: '2px solid #333', borderRadius: '12px', overflow: 'hidden', background: '#000', marginBottom: '15px' }}>
            <YouTube videoId="Jz6nuq5RBUA" onReady={onReady} onStateChange={onStateChange} opts={{ width: '100%', height: isMobile ? '220px' : '500px', playerVars: { controls: 0, rel: 0 } }} />
          </div>

          {/* CONTROLES DE ARBITRAGEM (GRID APERTADA NO MOBILE) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '5px', padding: '10px', background: '#111', borderRadius: '8px', border: '1px solid #333', marginBottom: '15px' }}>
            <button onClick={() => registrarFluxo('HAJIME')} style={{background: '#15803d', color:'white', border:'none', padding:'10px', fontWeight:'bold', borderRadius:'6px', fontSize:isMobile?'10px':'14px'}}><PlayCircle size={isMobile?16:24}/><br/>HAJIME</button>
            <button onClick={() => registrarFluxo('MATE')} style={{background: '#b91c1c', color:'white', border:'none', padding:'10px', fontWeight:'bold', borderRadius:'6px', fontSize:isMobile?'10px':'14px'}}><PauseCircle size={isMobile?16:24}/><br/>MATE</button>
            <button onClick={() => registrarFluxo('GOLDEN SCORE')} style={{background: '#b45309', color:'white', border:'none', padding:'10px', fontWeight:'bold', borderRadius:'6px', fontSize:isMobile?'10px':'14px'}}><Timer size={isMobile?16:24}/><br/>GS</button>
            <button onClick={() => registrarFluxo('SOREMADE')} style={{background: '#333', color:'white', border:'none', padding:'10px', fontWeight:'bold', borderRadius:'6px', fontSize:isMobile?'10px':'14px'}}><Flag size={isMobile?16:24}/><br/>FIM</button>
          </div>

          {/* PUNIÇÕES */}
          <div style={{ background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' }}>
             <h3 style={{margin:'0 0 10px 0', fontSize:'12px', color:'#aaa', display:'flex', alignItems:'center', gap:'5px'}}><Gavel size={14}/> PUNIÇÕES</h3>
             <div style={{display:'flex', gap:'5px'}}>
               <select style={{flex:2, background:'#333', color:'white', border:'none', padding:'10px', borderRadius:'4px', fontSize: isMobile?'12px':'14px'}} onChange={(e) => setMotivoShido(e.target.value)} value={motivoShido}>{DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}</select>
               <button onClick={() => registrarPunicao('SHIDO', 'BRANCO')} style={{flex:1, background:'#ef4444', color:'white', border:'none', borderRadius:'4px', fontWeight:'bold', fontSize:'12px'}}>⚪</button>
               <button onClick={() => registrarPunicao('SHIDO', 'AZUL')} style={{flex:1, background:'#ef4444', color:'white', border:'none', borderRadius:'4px', fontWeight:'bold', fontSize:'12px'}}>🔵</button>
             </div>
          </div>
          
          {/* REGISTRO TÉCNICO */}
          <div style={{ padding: '15px', background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{margin:'0 0 10px 0', fontSize:'12px', color:'#aaa'}}>REGISTRO TÉCNICO</h3>
            {/* LINHA ATLETA / LADO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div style={{display:'flex', gap:'2px'}}>
                  <button onClick={() => setAtletaAtual('BRANCO')} style={{flex:1, padding:'10px', background: atletaAtual==='BRANCO'?'#ddd':'#333', border:'none', borderRadius:'4px 0 0 4px', color:atletaAtual==='BRANCO'?'black':'white', fontWeight:'bold', fontSize:'12px'}}>⚪</button>
                  <button onClick={() => setAtletaAtual('AZUL')} style={{flex:1, padding:'10px', background: atletaAtual==='AZUL'?'#2563eb':'#333', border:'none', borderRadius:'0 4px 4px 0', color:'white', fontWeight:'bold', fontSize:'12px'}}>🔵</button>
              </div>
              <div style={{display:'flex', gap:'2px'}}>
                  <button onClick={() => setLadoAtual('ESQUERDA')} style={{flex:1, padding:'10px', background: ladoAtual==='ESQUERDA'?'#f59e0b':'#333', border:'none', borderRadius:'4px 0 0 4px', color:'white', fontSize:'11px'}}>ESQ</button>
                  <button onClick={() => setLadoAtual('DIREITA')} style={{flex:1, padding:'10px', background: ladoAtual==='DIREITA'?'#10b981':'#333', border:'none', borderRadius:'0 4px 4px 0', color:'white', fontSize:'11px'}}>DIR</button>
              </div>
            </div>
            
            <div style={{display:'flex', gap:'5px', position:'relative'}}>
              <div style={{flex:2, position:'relative'}}>
                <input type="text" placeholder="Golpe..." value={nomeGolpe} onChange={e=>setNomeGolpe(e.target.value)} style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #444', color:'white', borderRadius:'4px', fontSize:'16px'}}/>
                {sugestoes.length > 0 && <div style={{position:'absolute', bottom:'100%', width:'100%', background:'#333', zIndex:100, border:'1px solid #555', maxHeight:'150px', overflowY:'auto'}}>{sugestoes.map(s=><div key={s} onClick={()=>{setNomeGolpe(s); const exact=Object.keys(DB_GOLPES).find(k=>k.toLowerCase()===s.toLowerCase()); if(exact) setGrupoSelecionado(DB_GOLPES[exact] as any); setSugestoes([])}} style={{padding:'10px', borderBottom:'1px solid #444'}}>{s}</div>)}</div>}
              </div>
              <button onClick={iniciarRegistroTecnica} style={{flex:1, background:'linear-gradient(to right, #3b82f6, #2563eb)', color:'white', border:'none', borderRadius:'4px', fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <CheckCircle size={24}/>
              </button>
            </div>
          </div>
        </div>

        {/* ÁREA DIREITA (LOG) */}
        <div style={{ display: 'flex', flexDirection: 'column', height: isMobile ? '300px' : '100%' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px', alignItems:'center' }}>
            <h3 style={{margin:0, fontSize:'14px'}}>LOG ({eventos.length})</h3>
            <button onClick={()=>setEventos([])} style={{background:'none', border:'none', color:'#666'}}><Trash2 size={16}/></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '10px' }}>
            {eventos.map((ev: any) => (
              <div key={ev.id} style={{ 
                padding: '10px', marginBottom: '5px', borderRadius: '6px', 
                background: '#1f2937', 
                borderLeft: `5px solid ${getCorBorda(ev)}`, 
                display:'flex', alignItems:'center', justifyContent:'space-between', fontSize: isMobile ? '12px' : '14px'
              }}>
                <div onClick={() => irPara(ev.tempo)} style={{cursor:'pointer', flex:1}}>
                  <div style={{display:'flex', gap:'8px', fontSize:'10px', color:'#888', alignItems:'center'}}>
                    <span style={{color:'#fbbf24', fontFamily:'monospace'}}>{ev.tempo.toFixed(1)}s</span>
                    <span style={{textTransform:'uppercase'}}>{ev.lado !== '-' ? ev.lado.substring(0,3) : ''}</span>
                    {ev.grupo && <span style={{fontSize:'8px', padding:'1px 4px', borderRadius:'3px', background: ev.corTecnica, color:'white'}}>{ev.grupo.substring(0,2)}</span>}
                  </div>
                  <div style={{fontWeight:'bold', color: ev.atleta === 'AZUL' ? '#60a5fa' : 'white', fontSize: isMobile?'13px':'15px'}}>
                    {ev.especifico || ev.tipo}
                  </div>
                  {ev.resultado && ev.resultado !== 'NADA' && <div style={{marginTop:'2px', background: ev.resultado==='IPPON'?'white':'#eab308', color:'black', display:'inline-block', padding:'1px 4px', borderRadius:'3px', fontSize:'10px', fontWeight:'bold'}}>{ev.resultado}</div>}
                  {ev.categoria === 'PUNICAO' && <div style={{fontSize:'10px', color:'#ef4444'}}>{ev.especifico}</div>}
                </div>
                <button onClick={() => setEventos(eventos.filter((e:any) => e.id !== ev.id))} style={{background:'none', border:'none', color:'#444'}}><X size={14}/></button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
