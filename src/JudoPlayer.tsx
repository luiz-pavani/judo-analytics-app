import React, { useRef, useState, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';
// CORREÇÃO: Adicionei TODOS os ícones que são usados no visual para não dar erro de "missing name"
import { 
  Play, Pause, Square, Circle, Trash2, Download, Video, Film, List, X, Plus, 
  Clock, Flag, Check, ChevronLeft, ChevronRight, Search, CheckCircle, 
  MousePointerClick, Gauge, Youtube, Rewind, AlertTriangle 
} from 'lucide-react';

// --- THEME SYSTEM (MODERN SAAS) ---
const THEME = {
  bg: '#0f172a',        
  card: '#1e293b',      
  cardBorder: '#334155',
  text: '#f8fafc',      
  textDim: '#94a3b8',   
  primary: '#3b82f6',   
  primaryHover: '#2563eb',
  danger: '#ef4444',    
  success: '#10b981',   
  warning: '#eab308',   
  surface: '#020617',   
};

// --- BANCO DE DADOS ---
const DB_SHIDOS = ["Passividade", "Falso Ataque", "Saída de Área", "Postura Defensiva", "Evitar Pegada", "Pegada Ilegal", "Dedos na manga", "Desarrumar Gi", "Outros"];
const DB_GOLPES: Record<string, string> = {
  "seoi-nage": "TE-WAZA", "ippon-seoi-nage": "TE-WAZA", "seoi-otoshi": "TE-WAZA", "tai-otoshi": "TE-WAZA", "kata-guruma": "TE-WAZA", "sukui-nage": "TE-WAZA", "obi-otoshi": "TE-WAZA", "uki-otoshi": "TE-WAZA", "sumi-otoshi": "TE-WAZA", "yama-arashi": "TE-WAZA", "obi-tori-gaeshi": "TE-WAZA", "morote-gari": "TE-WAZA", "kuchiki-taoshi": "TE-WAZA", "kibisu-gaeshi": "TE-WAZA", "uchi-mata-sukashi": "TE-WAZA", "kouchi-gaeshi": "TE-WAZA",
  "uki-goshi": "KOSHI-WAZA", "ō-goshi": "KOSHI-WAZA", "koshi-guruma": "KOSHI-WAZA", "tsurikomi-goshi": "KOSHI-WAZA", "sode-tsurikomi-goshi": "KOSHI-WAZA", "harai-goshi": "KOSHI-WAZA", "tsuri-goshi": "KOSHI-WAZA", "hane-goshi": "KOSHI-WAZA", "utsuri-goshi": "KOSHI-WAZA", "ushiro-goshi": "KOSHI-WAZA",
  "de-ashi-harai": "ASHI-WAZA", "hiza-guruma": "ASHI-WAZA", "sasae-tsurikomi-ashi": "ASHI-WAZA", "ō-soto-gari": "ASHI-WAZA", "ō-uchi-gari": "ASHI-WAZA", "ko-soto-gari": "ASHI-WAZA", "ko-uchi-gari": "ASHI-WAZA", "okuri-ashi-harai": "ASHI-WAZA", "uchi-mata": "ASHI-WAZA", "ko-soto-gake": "ASHI-WAZA", "ashi-guruma": "ASHI-WAZA", "harai-tsurikomi-ashi": "ASHI-WAZA", "ō-guruma": "ASHI-WAZA", "ō-soto-guruma": "ASHI-WAZA", "ō-soto-otoshi": "ASHI-WAZA", "tsubame-gaeshi": "ASHI-WAZA", "ō-soto-gaeshi": "ASHI-WAZA", "ō-uchi-gaeshi": "ASHI-WAZA", "hane-goshi-gaeshi": "ASHI-WAZA", "harai-goshi-gaeshi": "ASHI-WAZA", "uchi-mata-gaeshi": "ASHI-WAZA",
  "tomoe-nage": "SUTEMI-WAZA", "sumi-gaeshi": "SUTEMI-WAZA", "hikikomi-gaeshi": "SUTEMI-WAZA", "tawara-gaeshi": "SUTEMI-WAZA", "ura-nage": "SUTEMI-WAZA", "yoko-otoshi": "SUTEMI-WAZA", "tani-otoshi": "SUTEMI-WAZA", "hane-makikomi": "SUTEMI-WAZA", "soto-makikomi": "SUTEMI-WAZA", "uchi-makikomi": "SUTEMI-WAZA", "uki-waza": "SUTEMI-WAZA", "yoko-wakare": "SUTEMI-WAZA", "yoko-guruma": "SUTEMI-WAZA", "yoko-gake": "SUTEMI-WAZA", "daki-wakare": "SUTEMI-WAZA", "ō-soto-makikomi": "SUTEMI-WAZA", "uchi-mata-makikomi": "SUTEMI-WAZA", "harai-makikomi": "SUTEMI-WAZA", "ko-uchi-makikomi": "SUTEMI-WAZA", "kani-basami": "SUTEMI-WAZA", "kawazu-gake": "SUTEMI-WAZA",
  "kesa-gatame": "OSAEKOMI-WAZA", "kuzure-kesa-gatame": "OSAEKOMI-WAZA", "ushiro-kesa-gatame": "OSAEKOMI-WAZA", "kata-gatame": "OSAEKOMI-WAZA", "kami-shihō-gatame": "OSAEKOMI-WAZA", "kuzure-kami-shihō-gatame": "OSAEKOMI-WAZA", "yoko-shihō-gatame": "OSAEKOMI-WAZA", "tate-shihō-gatame": "OSAEKOMI-WAZA", "uki-gatame": "OSAEKOMI-WAZA", "ura-gatame": "OSAEKOMI-WAZA",
  "nami-jūji-jime": "SHIME-WAZA", "gyaku-jūji-jime": "SHIME-WAZA", "kata-jūji-jime": "SHIME-WAZA", "hadaka-jime": "SHIME-WAZA", "okuri-eri-jime": "SHIME-WAZA", "kataha-jime": "SHIME-WAZA", "katate-jime": "SHIME-WAZA", "ryōte-jime": "SHIME-WAZA", "sode-guruma-jime": "SHIME-WAZA", "tsukkomi-jime": "SHIME-WAZA", "sankaku-jime": "SHIME-WAZA", "dō-jime": "SHIME-WAZA",
  "ude-garami": "KANSETSU-WAZA", "ude-hishigi-jūji-gatame": "KANSETSU-WAZA", "ude-hishigi-ude-gatame": "KANSETSU-WAZA", "ude-hishigi-hiza-gatame": "KANSETSU-WAZA", "ude-hishigi-waki-gatame": "KANSETSU-WAZA", "ude-hishigi-hara-gatame": "KANSETSU-WAZA", "ude-hishigi-ashi-gatame": "KANSETSU-WAZA", "ude-hishigi-te-gatame": "KANSETSU-WAZA", "ude-hishigi-sankaku-gatame": "KANSETSU-WAZA", "ashi-garami": "KANSETSU-WAZA"
};

const GRUPOS = ["TE-WAZA", "KOSHI-WAZA", "ASHI-WAZA", "SUTEMI-WAZA", "OSAEKOMI-WAZA", "SHIME-WAZA", "KANSETSU-WAZA"];
const CORES_GRUPOS: any = { "TE-WAZA": "#6366f1", "KOSHI-WAZA": "#10b981", "ASHI-WAZA": "#f59e0b", "SUTEMI-WAZA": "#ef4444", "OSAEKOMI-WAZA": "#3b82f6", "SHIME-WAZA": "#a855f7", "KANSETSU-WAZA": "#ec4899" };

type PlaylistItem = { id: string; type: 'YOUTUBE' | 'FILE'; name: string; };

export default function JudoPlayer() {
  const youtubePlayerRef = useRef<any>(null);
  const filePlayerRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  // STATE: VIDEO & PLAYLIST
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([{ id: 'kU_gjfnyu6A', type: 'YOUTUBE', name: 'Final Paris 2025' }]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const currentVideo = useMemo(() => {
    return playlist[currentVideoIndex] || { id: '', type: 'YOUTUBE', name: '' };
  }, [playlist, currentVideoIndex]);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  // STATE: ANALYTICS
  const [atletaAtual, setAtletaAtual] = useState('BRANCO'); 
  const [ladoAtual, setLadoAtual] = useState('DIREITA');   
  const [nomeGolpe, setNomeGolpe] = useState('');          
  const [grupoSelecionado, setGrupoSelecionado] = useState('TE-WAZA'); 
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [motivoShido, setMotivoShido] = useState(DB_SHIDOS[0]);

  // STATE: MODAL
  const [modalAberto, setModalAberto] = useState(false);
  const [registroPendente, setRegistroPendente] = useState<any>(null);
  const [modalAtleta, setModalAtleta] = useState('BRANCO');
  const [modalLado, setModalLado] = useState('DIREITA');
  const [modalNome, setModalNome] = useState('');
  const [modalGrupo, setModalGrupo] = useState('TE-WAZA');
  const [tempoCapturado, setTempoCapturado] = useState(0);

  // LOAD DATA SAFE
  const [eventos, setEventos] = useState(() => {
    try {
      const salvos = localStorage.getItem('smaartpro_db_v8_fixed');
      return salvos ? JSON.parse(salvos) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => { localStorage.setItem('smaartpro_db_v8_fixed', JSON.stringify(eventos)); }, [eventos]);

  // --- HANDLERS ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !modalAberto) {
        e.preventDefault();
        iniciarRegistroRapido();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalAberto, isPlaying, currentVideo.type]);

  // --- PLAYLIST LOGIC ---
  const handleFileSelect = (e: any) => {
    const files = Array.from(e.target.files);
    const newItems: PlaylistItem[] = files.map((file: any) => ({ id: URL.createObjectURL(file), type: 'FILE', name: file.name }));
    if (playlist.length === 1 && playlist[0].id === 'kU_gjfnyu6A') { setPlaylist(newItems); setCurrentVideoIndex(0); } 
    else { setPlaylist([...playlist, ...newItems]); }
    setShowPlaylist(true);
  };

  const adicionarYoutube = () => {
    const link = prompt("Cole o Link do YouTube:");
    if (link) {
      const id = link.includes('v=') ? link.split('v=')[1].split('&')[0] : link.split('/').pop() || link;
      setPlaylist([...playlist, { id, type: 'YOUTUBE', name: `YouTube: ${id}` }]);
      setShowPlaylist(true);
    }
  };

  const selecionarVideo = (index: number) => { setCurrentVideoIndex(index); setIsPlaying(true); };
  const proximoVideo = () => { if (currentVideoIndex < playlist.length - 1) selecionarVideo(currentVideoIndex + 1); };
  const videoAnterior = () => { if (currentVideoIndex > 0) selecionarVideo(currentVideoIndex - 1); };
  const removerDaPlaylist = (index: number, e: any) => {
    e.stopPropagation();
    const novaLista = playlist.filter((_, i) => i !== index);
    if (novaLista.length === 0) return;
    setPlaylist(novaLista);
    if (index === currentVideoIndex) setCurrentVideoIndex(0);
    else if (index < currentVideoIndex) setCurrentVideoIndex(currentVideoIndex - 1);
  };

  // --- PLAYER LOGIC ---
  const onReady = (e: any) => { youtubePlayerRef.current = e.target; setDuration(e.target.getDuration()); };
  const onStateChange = (e: any) => { setIsPlaying(e.data === 1); if (e.data === 0) proximoVideo(); };
  const onFileEnded = () => proximoVideo();

  useEffect(() => {
    let af: number;
    const loop = () => {
      if (isPlaying) {
        if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current?.getCurrentTime) setCurrentTime(youtubePlayerRef.current.getCurrentTime());
        else if (currentVideo.type === 'FILE' && filePlayerRef.current) setCurrentTime(filePlayerRef.current.currentTime);
        af = requestAnimationFrame(loop);
      }
    };
    if (isPlaying) loop();
    return () => cancelAnimationFrame(af);
  }, [isPlaying, currentVideo.type]);

  const togglePlay = () => {
    if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) {
        isPlaying ? youtubePlayerRef.current.pauseVideo() : youtubePlayerRef.current.playVideo();
    } else if (currentVideo.type === 'FILE' && filePlayerRef.current) {
        isPlaying ? filePlayerRef.current.pause() : filePlayerRef.current.play();
    }
  };

  const irPara = (t: number) => {
    const seekTime = Math.max(0, t - 2);
    if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) { youtubePlayerRef.current.seekTo(seekTime, true); youtubePlayerRef.current.playVideo(); } 
    else if (currentVideo.type === 'FILE' && filePlayerRef.current) { filePlayerRef.current.currentTime = seekTime; filePlayerRef.current.play(); }
    setCurrentTime(seekTime);
  };

  const mudarVelocidade = () => {
    const rates = [0.25, 0.5, 1.0, 1.5, 2.0];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) youtubePlayerRef.current.setPlaybackRate(nextRate);
    else if (currentVideo.type === 'FILE' && filePlayerRef.current) filePlayerRef.current.playbackRate = nextRate;
  };

  // --- REGISTRO ---
  const iniciarRegistroRapido = () => {
    if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) youtubePlayerRef.current.pauseVideo();
    else if (currentVideo.type === 'FILE' && filePlayerRef.current) filePlayerRef.current.pause();
    
    let tempoExato = currentTime;
    if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) tempoExato = youtubePlayerRef.current.getCurrentTime();
    else if (currentVideo.type === 'FILE' && filePlayerRef.current) tempoExato = filePlayerRef.current.currentTime;
    
    setTempoCapturado(tempoExato);
    setModalAberto(true);
    setModalNome('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const confirmarEContinuar = (resultado: string) => {
    const novoEvento = {
      id: Date.now(), videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'TECNICA',
      grupo: modalGrupo, especifico: modalNome || "Técnica Geral", atleta: modalAtleta, lado: modalLado,
      corTecnica: CORES_GRUPOS[modalGrupo], resultado: resultado
    };
    setEventos([novoEvento, ...eventos]);
    setModalAberto(false);
    if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) youtubePlayerRef.current.playVideo();
    else if (currentVideo.type === 'FILE' && filePlayerRef.current) filePlayerRef.current.play();
  };

  const registrarFluxo = (tipo: string) => setEventos([{ id: Date.now(), videoId: currentVideo.name, tempo: currentTime, categoria: 'FLUXO', tipo, atleta: '-', lado: '-', corTecnica: THEME.cardBorder }, ...eventos]);
  const registrarPunicao = (tipo: string, atleta: string) => setEventos([{ id: Date.now(), videoId: currentVideo.name, tempo: currentTime, categoria: 'PUNICAO', tipo, especifico: motivoShido, atleta, lado: '-', corTecnica: THEME.warning }, ...eventos]);

  // Helpers
  useEffect(() => {
    if (modalNome.length > 1) {
      const matches = Object.keys(DB_GOLPES).filter(k => k.toLowerCase().includes(modalNome.toLowerCase()));
      setSugestoes(matches.slice(0, 5));
      const exact = matches.find(k => k.toLowerCase() === modalNome.toLowerCase());
      if (exact) setModalGrupo(DB_GOLPES[exact] as any);
    } else setSugestoes([]);
  }, [modalNome]);

  const fightStartTime = useMemo(() => {
    const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'FLUXO' && ev.tipo === 'HAJIME').sort((a:any,b:any)=>a.tempo-b.tempo);
    return evs.length > 0 ? evs[0].tempo : 0;
  }, [eventos, currentVideo.name]);

  const tempoDeLuta = useMemo(() => {
    let tempoTotal = 0; let ultimoHajime = null; let isGoldenScore = false;
    const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name).sort((a:any, b:any) => a.tempo - b.tempo);
    for (const ev of evs) {
      if (ev.categoria === 'FLUXO') {
        if (ev.tipo === 'GOLDEN SCORE') isGoldenScore = true;
        if (ev.tipo === 'HAJIME') ultimoHajime = ev.tempo;
        if ((ev.tipo === 'MATE' || ev.tipo === 'SOREMADE') && ultimoHajime !== null) { tempoTotal += (ev.tempo - ultimoHajime); ultimoHajime = null; }
      }
    }
    if (ultimoHajime !== null && currentTime > ultimoHajime) tempoTotal += (currentTime - ultimoHajime);
    return { total: tempoTotal, isGS: isGoldenScore };
  }, [eventos, currentTime, currentVideo.name]);

  const placar = useMemo(() => {
    const p = { branco: { ippon:0, waza:0, yuko:0, shido:0 }, azul: { ippon:0, waza:0, yuko:0, shido:0 } };
    eventos.filter((ev:any) => ev.videoId === currentVideo.name).forEach((ev: any) => {
      const quem = ev.atleta === 'BRANCO' ? p.branco : p.azul;
      if (ev.resultado === 'IPPON') quem.ippon++;
      if (ev.resultado === 'WAZA-ARI') quem.waza++;
      if (ev.resultado === 'YUKO') quem.yuko++;
      if (ev.categoria === 'PUNICAO') { if (ev.tipo === 'SHIDO') quem.shido++; if (ev.tipo === 'HANSOKU') quem.shido += 3; }
    });
    return p;
  }, [eventos, currentVideo.name]);

  const formatTime = (s: number) => `${Math.floor(Math.abs(s)/60)}:${Math.floor(Math.abs(s)%60).toString().padStart(2,'0')}`;
  
  // --- FUNÇÃO CORRIGIDA PARA MÚLTIPLOS VÍDEOS ---
  const baixarCSV = () => {
    let csv = "data:text/csv;charset=utf-8,Video;Tempo Video;Tempo Luta;Categoria;Técnica;Resultado;Atleta;Lado;Detalhe\n";
    
    // Agrupa eventos por vídeo
    const eventosPorVideo: Record<string, any[]> = {};
    eventos.forEach((ev: any) => {
      if (!eventosPorVideo[ev.videoId]) eventosPorVideo[ev.videoId] = [];
      eventosPorVideo[ev.videoId].push(ev);
    });

    Object.keys(eventosPorVideo).forEach(vidName => {
      const evs = eventosPorVideo[vidName].sort((a:any,b:any) => a.tempo - b.tempo);
      const firstHajime = evs.find((e:any) => e.categoria === 'FLUXO' && e.tipo === 'HAJIME');
      const zeroTime = firstHajime ? firstHajime.tempo : 0;

      evs.forEach((ev:any) => {
        const tr = (ev.tempo - zeroTime).toFixed(1).replace('.', ',');
        csv += `${ev.videoId};${ev.tempo.toFixed(3).replace('.', ',')};${tr};${ev.categoria};${ev.especifico || ev.tipo || '-'};${ev.resultado || '-'};${ev.atleta};${ev.lado};${ev.grupo || ev.tipo}\n`;
      });
    });

    const link = document.createElement("a"); link.href = encodeURI(csv); link.download = `smaartpro_analytics_${new Date().toISOString().slice(0,10)}.csv`; link.click();
  };
  
  const getCorBorda = (ev: any) => { if (ev.categoria === 'FLUXO') return THEME.cardBorder; if (ev.atleta === 'AZUL') return THEME.primary; return '#ffffff'; };

  // ESTILOS COMUNS (Cards)
  const cardStyle: any = { background: THEME.card, border: `1px solid ${THEME.cardBorder}`, borderRadius: '16px', overflow: 'hidden' };
  const btnStyle: any = { cursor: 'pointer', border: 'none', borderRadius: '8px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' };

  return (
    <div style={{ maxWidth: '100%', minHeight: '100vh', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: THEME.text, backgroundColor: THEME.bg, padding: '20px', boxSizing: 'border-box' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0, fontSize: isMobile?'22px':'26px', fontWeight: '800', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center' }}>
          <Video size={28} color={THEME.primary} style={{marginRight:'10px'}}/>
          <span style={{ color: THEME.primary }}>SMAART</span><span style={{ color: THEME.textDim, margin: '0 6px', fontWeight:'300' }}>|</span><span style={{ color: 'white' }}>PRO</span>
          <span style={{ fontSize: '11px', color: THEME.textDim, marginLeft: '12px', background: THEME.card, padding: '2px 6px', borderRadius: '4px', border:`1px solid ${THEME.cardBorder}` }}>v8.1 Safe</span>
        </h1>
        
        <div style={{display:'flex', gap:'10px'}}>
          <div style={{display:'flex', background: THEME.card, borderRadius:'8px', padding:'4px', border:`1px solid ${THEME.cardBorder}`}}>
            <button onClick={adicionarYoutube} style={{...btnStyle, background: 'transparent', color: THEME.textDim, padding:'6px 12px', fontSize:'12px'}}>+ YT</button>
            <div style={{width:'1px', background: THEME.cardBorder, margin: '4px 0'}}></div>
            <button onClick={() => fileInputRef.current.click()} style={{...btnStyle, background: 'transparent', color: THEME.textDim, padding:'6px 12px', fontSize:'12px'}}>+ ARQ</button>
            <input type="file" ref={fileInputRef} style={{display:'none'}} multiple accept="video/*" onChange={handleFileSelect} />
          </div>
          <button onClick={() => setShowPlaylist(!showPlaylist)} style={{...btnStyle, background: showPlaylist ? THEME.primary : THEME.card, color: showPlaylist ? 'white' : THEME.textDim, padding:'8px 12px', fontSize: '13px', border:`1px solid ${showPlaylist ? THEME.primary : THEME.cardBorder}`}}>
            <List size={16}/> {playlist.length}
          </button>
          <button onClick={baixarCSV} style={{...btnStyle, background: THEME.success, color:'white', padding:'8px 16px', fontSize: '13px'}}>
            <Download size={16}/> CSV
          </button>
        </div>
      </div>

      {/* --- MODAL DE REGISTRO (GLASSMORPHISM) --- */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
              <h2 style={{margin:0, color: THEME.primary, fontSize:'20px', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700'}}>
                <MousePointerClick size={24}/> REGISTRAR AÇÃO
              </h2>
              <button onClick={() => setModalAberto(false)} style={{...btnStyle, background: THEME.cardBorder, color: THEME.textDim, padding:'8px', borderRadius:'50%'}}><X size={18}/></button>
            </div>

            {/* SELEÇÃO ATLETA/LADO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600', letterSpacing:'0.5px'}}>QUEM?</div>
                <div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:`1px solid ${THEME.cardBorder}`}}>
                  <button onClick={()=>setModalAtleta('BRANCO')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalAtleta==='BRANCO'?'#e2e8f0':THEME.surface, color:modalAtleta==='BRANCO'?'#0f172a':THEME.textDim}}>⚪</button>
                  <button onClick={()=>setModalAtleta('AZUL')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalAtleta==='AZUL'?THEME.primary:THEME.surface, color:modalAtleta==='AZUL'?'white':THEME.textDim}}>🔵</button>
                </div>
              </div>
              <div>
                <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600', letterSpacing:'0.5px'}}>LADO?</div>
                <div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:`1px solid ${THEME.cardBorder}`}}>
                  <button onClick={()=>setModalLado('ESQUERDA')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalLado==='ESQUERDA'?THEME.warning:THEME.surface, color:modalLado==='ESQUERDA'?'#0f172a':THEME.textDim, fontSize:'11px'}}>ESQ</button>
                  <button onClick={()=>setModalLado('DIREITA')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalLado==='DIREITA'?THEME.success:THEME.surface, color:modalLado==='DIREITA'?'white':THEME.textDim, fontSize:'11px'}}>DIR</button>
                </div>
              </div>
            </div>

            {/* INPUT TÉCNICA */}
            <div style={{marginBottom:'24px', position:'relative'}}>
              <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600', letterSpacing:'0.5px'}}>TÉCNICA APLICADA</div>
              <div style={{position:'relative'}}>
                <Search size={18} style={{position:'absolute', top:'13px', left:'14px', color: THEME.textDim}}/>
                <input ref={inputRef} type="text" placeholder="Digite o nome (ex: Seoi...)" value={modalNome} onChange={e=>setModalNome(e.target.value)} 
                  style={{width:'100%', padding:'12px 12px 12px 42px', background: THEME.surface, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px', fontSize:'15px', outline:'none', boxSizing:'border-box'}}
                />
              </div>
              {sugestoes.length > 0 && (
                <div style={{position:'absolute', top:'100%', width:'100%', background: THEME.card, zIndex:100, border:`1px solid ${THEME.cardBorder}`, borderRadius:'8px', marginTop:'4px', boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.3)', overflow:'hidden'}}>
                  {sugestoes.map(s=>(
                    <div key={s} onClick={()=>{setModalNome(s); const exact=Object.keys(DB_GOLPES).find(k=>k.toLowerCase()===s.toLowerCase()); if(exact) setModalGrupo(DB_GOLPES[exact] as any); setSugestoes([])}} 
                         style={{padding:'12px', borderBottom:`1px solid ${THEME.cardBorder}`, cursor:'pointer', display:'flex', justifyContent:'space-between', fontSize:'14px'}}>
                      <span>{s}</span><span style={{fontSize:'10px', background:THEME.surface, padding:'2px 6px', borderRadius:'4px', color:THEME.textDim}}>{DB_GOLPES[Object.keys(DB_GOLPES).find(k=>k.toLowerCase()===s.toLowerCase())||'']}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PONTUAÇÃO */}
            <div>
              <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600', letterSpacing:'0.5px'}}>RESULTADO (CONFIRMAR)</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                <button onClick={() => confirmarEContinuar('NADA')} style={{...btnStyle, padding: '14px', background: THEME.cardBorder, color: THEME.textDim}}>NADA</button>
                <button onClick={() => confirmarEContinuar('YUKO')} style={{...btnStyle, padding: '14px', background: THEME.surface, border:`1px solid ${THEME.cardBorder}`, color: THEME.text}}>YUKO</button>
                <button onClick={() => confirmarEContinuar('WAZA-ARI')} style={{...btnStyle, padding: '14px', background: `rgba(234, 179, 8, 0.1)`, border:`1px solid ${THEME.warning}`, color: THEME.warning}}>WAZA-ARI</button>
                <button onClick={() => confirmarEContinuar('IPPON')} style={{...btnStyle, padding: '14px', background: THEME.text, color: '#000', border:`2px solid ${THEME.text}`}}>IPPON</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA PRINCIPAL */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
        
        {/* COLUNA ESQUERDA (PLAYER) */}
        <div style={{ flex: 3, width: '100%' }}>
          
          <div style={{ ...cardStyle, position: 'relative', paddingTop: '56.25%', width: '100%', marginBottom: '20px' }}>
               {currentVideo.type === 'YOUTUBE' ? (
                 <YouTube videoId={currentVideo.id} onReady={onReady} onStateChange={onStateChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} opts={{ width: '100%', height: '100%', playerVars: { controls: 1, rel: 0 } }} />
               ) : (
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background:'black' }}>
                   <video ref={filePlayerRef} src={currentVideo.id} style={{width:'100%', height:'100%', objectFit:'contain'}} controls onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={onFileEnded} onLoadedMetadata={(e:any) => setDuration(e.target.duration)}/> 
                 </div>
               )}
          </div>

          <div style={{...cardStyle, padding:'8px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px'}}>
             <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
               <div style={{display:'flex', gap:'4px'}}>
                 <button onClick={videoAnterior} disabled={currentVideoIndex===0} style={{...btnStyle, background:'transparent', color:currentVideoIndex===0?THEME.cardBorder:THEME.text}}><ChevronLeft size={18}/></button>
                 <button onClick={togglePlay} style={{...btnStyle, background:'transparent', color:THEME.primary}}>{isPlaying ? <Pause size={32} fill={THEME.primary} color={THEME.bg}/> : <Play size={32} fill={THEME.primary} color={THEME.bg}/>}</button>
                 <button onClick={proximoVideo} disabled={currentVideoIndex===playlist.length-1} style={{...btnStyle, background:'transparent', color:currentVideoIndex===playlist.length-1?THEME.cardBorder:THEME.text}}><ChevronRight size={18}/></button>
               </div>
               <div style={{display:'flex', flexDirection:'column'}}>
                 <span style={{fontSize:'13px', fontWeight:'600', color: THEME.text}}>{currentVideoIndex+1}. {currentVideo.name}</span>
                 <span style={{fontSize:'11px', color: THEME.textDim, fontFamily:'monospace'}}>{formatTime(currentTime)} / {formatTime(duration)}</span>
               </div>
             </div>
             <button onClick={mudarVelocidade} style={{...btnStyle, background: THEME.surface, border:`1px solid ${THEME.cardBorder}`, color: THEME.textDim, padding:'4px 10px', fontSize:'11px'}}><Gauge size={14}/> {playbackRate}x</button>
          </div>

          <button onClick={iniciarRegistroRapido} style={{...btnStyle, width:'100%', padding:'24px', background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryHover} 100%)`, color:'white', fontSize:'18px', boxShadow: `0 10px 20px -5px ${THEME.primary}66`, marginBottom:'24px'}}>
            <CheckCircle size={28}/> MARCAR AÇÃO
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <button onClick={() => registrarFluxo('HAJIME')} style={{...btnStyle, background: THEME.success, color:'white', padding:'16px'}}><Play size={20}/> HAJIME</button>
            <button onClick={() => registrarFluxo('MATE')} style={{...btnStyle, background: THEME.danger, color:'white', padding:'16px'}}><Pause size={20}/> MATE</button>
            <button onClick={() => registrarFluxo('GOLDEN SCORE')} style={{...btnStyle, background: THEME.warning, color:'#000', padding:'12px', fontSize:'13px'}}><Clock size={18}/> GOLDEN SCORE</button>
            <button onClick={() => registrarFluxo('SOREMADE')} style={{...btnStyle, background: THEME.surface, border:`1px solid ${THEME.cardBorder}`, color:THEME.text, padding:'12px', fontSize:'13px'}}><Flag size={18}/> SOREMADE</button>
          </div>

          <div style={{...cardStyle, padding:'16px'}}>
             <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'10px', fontWeight:'600', letterSpacing:'0.5px'}}>REGISTRO DE PUNIÇÕES</div>
             <div style={{display:'flex', gap:'8px'}}>
               <select style={{flex:1, background: THEME.surface, color: THEME.text, border:`1px solid ${THEME.cardBorder}`, padding:'10px', borderRadius:'8px', fontSize: '13px', outline:'none'}} onChange={(e) => setMotivoShido(e.target.value)} value={motivoShido}>{DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}</select>
               <button onClick={() => registrarPunicao('SHIDO', 'BRANCO')} style={{...btnStyle, width:'48px', background:'#e2e8f0', color:'#0f172a', fontSize:'16px'}}>⚪</button>
               <button onClick={() => registrarPunicao('SHIDO', 'AZUL')} style={{...btnStyle, width:'48px', background: THEME.primary, color:'white', fontSize:'16px'}}>🔵</button>
             </div>
          </div>
        </div>

        {/* COLUNA DIREITA (SIDEBAR) */}
        <div style={{ flex: 2, width: '100%', display:'flex', flexDirection:'column', gap:'20px' }}>
          
          {/* PLAYLIST */}
          {showPlaylist && (
            <div style={{ ...cardStyle, padding: '12px', maxHeight: '200px', overflowY: 'auto' }}>
              <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600', letterSpacing:'0.5px', textTransform:'uppercase'}}>Fila de Reprodução</div>
              {playlist.map((item, index) => (
                <div key={index} onClick={() => selecionarVideo(index)} style={{ padding: '10px', cursor: 'pointer', background: index === currentVideoIndex ? `${THEME.primary}22` : 'transparent', borderRadius: '6px', marginBottom: '4px', display:'flex', justifyContent:'space-between', alignItems:'center', border: index===currentVideoIndex ? `1px solid ${THEME.primary}66` : '1px solid transparent' }}>
                  <div style={{display:'flex', alignItems:'center', gap:'8px', overflow:'hidden'}}>
                    {item.type === 'YOUTUBE' ? <Video size={14} color={THEME.danger}/> : <Film size={14} color={THEME.primary}/>}
                    <span style={{fontSize:'13px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color: index===currentVideoIndex ? THEME.primary : THEME.text}}>{item.name}</span>
                  </div>
                  <button onClick={(e) => removerDaPlaylist(index, e)} style={{background:'none', border:'none', color: THEME.textDim, cursor:'pointer'}}><X size={14}/></button>
                </div>
              ))}
            </div>
          )}

          {/* PLACAR */}
          <div style={{ ...cardStyle, padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: `1px solid ${THEME.cardBorder}` }}>
              <div style={{fontSize: '14px', fontWeight: '700', color: THEME.text}}>⚪ BRANCO</div>
              <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.textDim}}>I</div><div style={{fontSize:'24px', fontWeight:'700'}}>{placar.branco.ippon}</div></div>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.warning}}>W</div><div style={{fontSize:'24px', fontWeight:'700', color: THEME.warning}}>{placar.branco.waza}</div></div>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.textDim}}>Y</div><div style={{fontSize:'24px', color: THEME.textDim}}>{placar.branco.yuko}</div></div>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.danger}}>S</div><div style={{fontSize:'24px', color: THEME.danger}}>{placar.branco.shido}</div></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{fontSize: '10px', color: tempoDeLuta.isGS ? THEME.warning : THEME.textDim, fontWeight: '700', letterSpacing:'1px'}}>{tempoDeLuta.isGS ? "GOLDEN SCORE" : "TEMPO"}</div>
              <div style={{fontSize: '32px', fontFamily: 'monospace', fontWeight: '700', color: tempoDeLuta.isGS ? THEME.warning : 'white', letterSpacing:'-1px'}}>{formatTime(tempoDeLuta.total)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: `1px solid ${THEME.cardBorder}` }}>
              <div style={{fontSize: '14px', fontWeight: '700', color: THEME.primary}}>🔵 AZUL</div>
              <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.danger}}>S</div><div style={{fontSize:'24px', color: THEME.danger}}>{placar.azul.shido}</div></div>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.textDim}}>Y</div><div style={{fontSize:'24px', color: THEME.textDim}}>{placar.azul.yuko}</div></div>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.warning}}>W</div><div style={{fontSize:'24px', fontWeight:'700', color: THEME.warning}}>{placar.azul.waza}</div></div>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.textDim}}>I</div><div style={{fontSize:'24px', fontWeight:'700'}}>{placar.azul.ippon}</div></div>
              </div>
            </div>
          </div>

          {/* LOG */}
          <div style={{ flex: 1, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px', alignItems:'center' }}>
              <h3 style={{margin:0, fontSize:'13px', color: THEME.textDim, fontWeight:'600'}}>TIMELINE DA LUTA</h3>
              <button onClick={()=>setEventos(eventos.filter(e => e.videoId !== currentVideo.name))} style={{background:'none', border:'none', color: THEME.textDim, cursor:'pointer'}}><Trash2 size={16}/></button>
            </div>
            <div style={{ ...cardStyle, flex:1, padding: '8px', minHeight: '300px', overflowY: 'auto', background: THEME.surface }}>
              {eventos.filter(e => e.videoId === currentVideo.name).length === 0 && (
                <div style={{textAlign:'center', padding:'40px', color: THEME.cardBorder, fontSize:'14px'}}>Nenhuma ação registrada</div>
              )}
              {eventos.filter(e => e.videoId === currentVideo.name).map((ev: any) => (
                <div key={ev.id} style={{ 
                  padding: '10px 12px', marginBottom: '6px', borderRadius: '8px', 
                  background: THEME.card, borderLeft: `4px solid ${getCorBorda(ev)}`, 
                  display:'flex', alignItems:'center', justifyContent:'space-between', fontSize: '13px', border: `1px solid ${THEME.cardBorder}`
                }}>
                  <div onClick={() => irPara(ev.tempo)} style={{cursor:'pointer', flex:1}}>
                    <div style={{display:'flex', gap:'8px', fontSize:'11px', color: THEME.textDim, alignItems:'center', marginBottom:'4px'}}>
                      <span style={{fontFamily:'monospace', display:'flex', alignItems:'center', gap:'4px'}}><Rewind size={10}/> {formatTime(ev.tempo)}</span>
                      <span style={{color: THEME.warning, fontWeight:'700', background:`${THEME.warning}22`, padding:'1px 5px', borderRadius:'3px'}}>
                        {ev.tempo >= fightStartTime ? formatTime(ev.tempo - fightStartTime) : '-'}
                      </span>
                    </div>
                    <div style={{fontWeight:'600', color: ev.atleta === 'AZUL' ? THEME.primary : 'white', fontSize: '14px'}}>
                      {ev.especifico || ev.tipo}
                    </div>
                    {ev.resultado && ev.resultado !== 'NADA' && <div style={{marginTop:'4px', background: ev.resultado==='IPPON'?'white':THEME.warning, color: 'black', display:'inline-block', padding:'2px 6px', borderRadius:'4px', fontSize:'10px', fontWeight:'800'}}>{ev.resultado}</div>}
                  </div>
                  <button onClick={() => setEventos(eventos.filter((e:any) => e.id !== ev.id))} style={{background:'none', border:'none', color: THEME.cardBorder, cursor:'pointer'}}><X size={14}/></button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}