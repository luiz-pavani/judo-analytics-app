import React, { useRef, useState, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';
import { Download, Trash2, PlayCircle, PauseCircle, Timer, Flag, Gavel, X, Search, CheckCircle, Link, Upload, Film, Youtube, MousePointerClick, Rewind, Gauge, List, SkipForward, SkipBack } from 'lucide-react';

// --- BANCO DE DADOS (Mantido) ---
const DB_SHIDOS = ["Passividade", "Falso Ataque", "Saída de Área", "Postura Defensiva", "Evitar Pegada", "Pegada Ilegal", "Dedos na manga", "Desarrumar Gi", "Outros"];
const DB_GOLPES: Record<string, string> = {
  // NAGE-WAZA
  "seoi-nage": "TE-WAZA", "ippon-seoi-nage": "TE-WAZA", "seoi-otoshi": "TE-WAZA", "tai-otoshi": "TE-WAZA", "kata-guruma": "TE-WAZA", "sukui-nage": "TE-WAZA", "obi-otoshi": "TE-WAZA", "uki-otoshi": "TE-WAZA", "sumi-otoshi": "TE-WAZA", "yama-arashi": "TE-WAZA", "obi-tori-gaeshi": "TE-WAZA", "morote-gari": "TE-WAZA", "kuchiki-taoshi": "TE-WAZA", "kibisu-gaeshi": "TE-WAZA", "uchi-mata-sukashi": "TE-WAZA", "kouchi-gaeshi": "TE-WAZA",
  "uki-goshi": "KOSHI-WAZA", "ō-goshi": "KOSHI-WAZA", "koshi-guruma": "KOSHI-WAZA", "tsurikomi-goshi": "KOSHI-WAZA", "sode-tsurikomi-goshi": "KOSHI-WAZA", "harai-goshi": "KOSHI-WAZA", "tsuri-goshi": "KOSHI-WAZA", "hane-goshi": "KOSHI-WAZA", "utsuri-goshi": "KOSHI-WAZA", "ushiro-goshi": "KOSHI-WAZA",
  "de-ashi-harai": "ASHI-WAZA", "hiza-guruma": "ASHI-WAZA", "sasae-tsurikomi-ashi": "ASHI-WAZA", "ō-soto-gari": "ASHI-WAZA", "ō-uchi-gari": "ASHI-WAZA", "ko-soto-gari": "ASHI-WAZA", "ko-uchi-gari": "ASHI-WAZA", "okuri-ashi-harai": "ASHI-WAZA", "uchi-mata": "ASHI-WAZA", "ko-soto-gake": "ASHI-WAZA", "ashi-guruma": "ASHI-WAZA", "harai-tsurikomi-ashi": "ASHI-WAZA", "ō-guruma": "ASHI-WAZA", "ō-soto-guruma": "ASHI-WAZA", "ō-soto-otoshi": "ASHI-WAZA", "tsubame-gaeshi": "ASHI-WAZA", "ō-soto-gaeshi": "ASHI-WAZA", "ō-uchi-gaeshi": "ASHI-WAZA", "hane-goshi-gaeshi": "ASHI-WAZA", "harai-goshi-gaeshi": "ASHI-WAZA", "uchi-mata-gaeshi": "ASHI-WAZA",
  "tomoe-nage": "SUTEMI-WAZA", "sumi-gaeshi": "SUTEMI-WAZA", "hikikomi-gaeshi": "SUTEMI-WAZA", "tawara-gaeshi": "SUTEMI-WAZA", "ura-nage": "SUTEMI-WAZA", "yoko-otoshi": "SUTEMI-WAZA", "tani-otoshi": "SUTEMI-WAZA", "hane-makikomi": "SUTEMI-WAZA", "soto-makikomi": "SUTEMI-WAZA", "uchi-makikomi": "SUTEMI-WAZA", "uki-waza": "SUTEMI-WAZA", "yoko-wakare": "SUTEMI-WAZA", "yoko-guruma": "SUTEMI-WAZA", "yoko-gake": "SUTEMI-WAZA", "daki-wakare": "SUTEMI-WAZA", "ō-soto-makikomi": "SUTEMI-WAZA", "uchi-mata-makikomi": "SUTEMI-WAZA", "harai-makikomi": "SUTEMI-WAZA", "ko-uchi-makikomi": "SUTEMI-WAZA", "kani-basami": "SUTEMI-WAZA", "kawazu-gake": "SUTEMI-WAZA",
  // KATAME-WAZA
  "kesa-gatame": "OSAEKOMI-WAZA", "kuzure-kesa-gatame": "OSAEKOMI-WAZA", "ushiro-kesa-gatame": "OSAEKOMI-WAZA", "kata-gatame": "OSAEKOMI-WAZA", "kami-shihō-gatame": "OSAEKOMI-WAZA", "kuzure-kami-shihō-gatame": "OSAEKOMI-WAZA", "yoko-shihō-gatame": "OSAEKOMI-WAZA", "tate-shihō-gatame": "OSAEKOMI-WAZA", "uki-gatame": "OSAEKOMI-WAZA", "ura-gatame": "OSAEKOMI-WAZA",
  "nami-jūji-jime": "SHIME-WAZA", "gyaku-jūji-jime": "SHIME-WAZA", "kata-jūji-jime": "SHIME-WAZA", "hadaka-jime": "SHIME-WAZA", "okuri-eri-jime": "SHIME-WAZA", "kataha-jime": "SHIME-WAZA", "katate-jime": "SHIME-WAZA", "ryōte-jime": "SHIME-WAZA", "sode-guruma-jime": "SHIME-WAZA", "tsukkomi-jime": "SHIME-WAZA", "sankaku-jime": "SHIME-WAZA", "dō-jime": "SHIME-WAZA",
  "ude-garami": "KANSETSU-WAZA", "ude-hishigi-jūji-gatame": "KANSETSU-WAZA", "ude-hishigi-ude-gatame": "KANSETSU-WAZA", "ude-hishigi-hiza-gatame": "KANSETSU-WAZA", "ude-hishigi-waki-gatame": "KANSETSU-WAZA", "ude-hishigi-hara-gatame": "KANSETSU-WAZA", "ude-hishigi-ashi-gatame": "KANSETSU-WAZA", "ude-hishigi-te-gatame": "KANSETSU-WAZA", "ude-hishigi-sankaku-gatame": "KANSETSU-WAZA", "ashi-garami": "KANSETSU-WAZA"
};

const GRUPOS = ["TE-WAZA", "KOSHI-WAZA", "ASHI-WAZA", "SUTEMI-WAZA", "OSAEKOMI-WAZA", "SHIME-WAZA", "KANSETSU-WAZA"];
const CORES_GRUPOS: any = { "TE-WAZA": "#6366f1", "KOSHI-WAZA": "#10b981", "ASHI-WAZA": "#f59e0b", "SUTEMI-WAZA": "#ef4444", "OSAEKOMI-WAZA": "#3b82f6", "SHIME-WAZA": "#a855f7", "KANSETSU-WAZA": "#ec4899" };

// TIPO PARA PLAYLIST
type PlaylistItem = {
  id: string; // URL do blob ou ID do YouTube
  type: 'YOUTUBE' | 'FILE';
  name: string;
};

export default function JudoPlayer() {
  const youtubePlayerRef = useRef<any>(null);
  const filePlayerRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  // --- ESTADO DA PLAYLIST ---
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([{ id: 'kU_gjfnyu6A', type: 'YOUTUBE', name: 'Final Paris 2025' }]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false); // Toggle da sidebar

  // O vídeo atual é derivado da playlist e do índice
  const currentVideo = playlist[currentVideoIndex] || { id: '', type: 'YOUTUBE', name: '' };

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

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
  
  // Dados Internos Modal
  const [modalAtleta, setModalAtleta] = useState('BRANCO');
  const [modalLado, setModalLado] = useState('DIREITA');
  const [modalNome, setModalNome] = useState('');
  const [modalGrupo, setModalGrupo] = useState('TE-WAZA');
  const [tempoCapturado, setTempoCapturado] = useState(0);

  const [eventos, setEventos] = useState(() => {
    const salvos = localStorage.getItem('smaartpro_db_v6');
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => { localStorage.setItem('smaartpro_db_v6', JSON.stringify(eventos)); }, [eventos]);

  // Handlers de Resize e Teclado
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

  // --- GERENCIAMENTO DE PLAYLIST ---
  const handleFileSelect = (e: any) => {
    const files = Array.from(e.target.files);
    const newItems: PlaylistItem[] = files.map((file: any) => ({
      id: URL.createObjectURL(file),
      type: 'FILE',
      name: file.name
    }));
    
    // Se a playlist estava com o vídeo padrão inicial, substitui. Senão, adiciona.
    if (playlist.length === 1 && playlist[0].id === 'kU_gjfnyu6A') {
      setPlaylist(newItems);
      setCurrentVideoIndex(0);
    } else {
      setPlaylist([...playlist, ...newItems]);
    }
    // Abre a sidebar para mostrar que carregou
    setShowPlaylist(true);
  };

  const adicionarYoutube = () => {
    const link = prompt("Cole o Link do YouTube:");
    if (link) {
      const id = link.includes('v=') ? link.split('v=')[1].split('&')[0] : link.split('/').pop() || link;
      const newItem: PlaylistItem = { id, type: 'YOUTUBE', name: `YouTube: ${id}` };
      setPlaylist([...playlist, newItem]);
      setShowPlaylist(true);
    }
  };

  const selecionarVideo = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true); // Auto-play ao trocar
  };

  const proximoVideo = () => {
    if (currentVideoIndex < playlist.length - 1) {
      selecionarVideo(currentVideoIndex + 1);
    }
  };

  const videoAnterior = () => {
    if (currentVideoIndex > 0) {
      selecionarVideo(currentVideoIndex - 1);
    }
  };

  const removerDaPlaylist = (index: number, e: any) => {
    e.stopPropagation();
    const novaLista = playlist.filter((_, i) => i !== index);
    if (novaLista.length === 0) return; // Não deixa esvaziar
    setPlaylist(novaLista);
    if (index === currentVideoIndex) setCurrentVideoIndex(0);
    else if (index < currentVideoIndex) setCurrentVideoIndex(currentVideoIndex - 1);
  };

  // --- LÓGICA DO PLAYER ---
  const onReady = (e: any) => { youtubePlayerRef.current = e.target; setDuration(e.target.getDuration()); };
  const onStateChange = (e: any) => {
    setIsPlaying(e.data === 1);
    if (e.data === 0) proximoVideo(); // Auto-advance no YouTube
  };
  
  // Auto-advance no File Player
  const onFileEnded = () => proximoVideo();

  // Loop de Tempo
  useEffect(() => {
    let af: number;
    const loop = () => {
      if (isPlaying) {
        if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current?.getCurrentTime) {
          setCurrentTime(youtubePlayerRef.current.getCurrentTime());
        } else if (currentVideo.type === 'FILE' && filePlayerRef.current) {
          setCurrentTime(filePlayerRef.current.currentTime);
        }
        af = requestAnimationFrame(loop);
      }
    };
    if (isPlaying) loop();
    return () => cancelAnimationFrame(af);
  }, [isPlaying, currentVideo.type]);

  // Controles Unificados
  const togglePlay = () => {
    if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) {
      isPlaying ? youtubePlayerRef.current.pauseVideo() : youtubePlayerRef.current.playVideo();
    } else if (currentVideo.type === 'FILE' && filePlayerRef.current) {
      isPlaying ? filePlayerRef.current.pause() : filePlayerRef.current.play();
    }
  };

  const irPara = (t: number) => {
    const seekTime = Math.max(0, t - 2);
    if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) {
      youtubePlayerRef.current.seekTo(seekTime, true);
      youtubePlayerRef.current.playVideo();
    } else if (currentVideo.type === 'FILE' && filePlayerRef.current) {
      filePlayerRef.current.currentTime = seekTime;
      filePlayerRef.current.play();
    }
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
      id: Date.now(), videoId: currentVideo.name, // Usa o NOME para identificar no CSV
      tempo: tempoCapturado, categoria: 'TECNICA', grupo: modalGrupo,
      especifico: modalNome || "Técnica Geral", atleta: modalAtleta, lado: modalLado,
      corTecnica: CORES_GRUPOS[modalGrupo], resultado: resultado
    };
    setEventos([novoEvento, ...eventos]);
    setModalAberto(false);
    if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) youtubePlayerRef.current.playVideo();
    else if (currentVideo.type === 'FILE' && filePlayerRef.current) filePlayerRef.current.play();
  };

  const registrarFluxo = (tipo: string) => setEventos([{ id: Date.now(), videoId: currentVideo.name, tempo: currentTime, categoria: 'FLUXO', tipo, atleta: '-', lado: '-', corTecnica: '#555' }, ...eventos]);
  const registrarPunicao = (tipo: string, atleta: string) => setEventos([{ id: Date.now(), videoId: currentVideo.name, tempo: currentTime, categoria: 'PUNICAO', tipo, especifico: motivoShido, atleta, lado: '-', corTecnica: '#fbbf24' }, ...eventos]);

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
  const baixarCSV = () => {
    let csv = "data:text/csv;charset=utf-8,Video;Tempo Video;Tempo Luta;Categoria;Técnica;Resultado;Atleta;Lado;Detalhe\n";
    eventos.forEach((ev: any) => {
      const tr = (ev.tempo - fightStartTime).toFixed(1).replace('.', ',');
      csv += `${ev.videoId};${ev.tempo.toFixed(3).replace('.', ',')};${tr};${ev.categoria};${ev.especifico || ev.tipo || '-'};${ev.resultado || '-'};${ev.atleta};${ev.lado};${ev.grupo || ev.tipo}\n`;
    });
    const link = document.createElement("a"); link.href = encodeURI(csv); link.download = `smaartpro_playlist_${new Date().toISOString().slice(0,10)}.csv`; link.click();
  };
  const getCorBorda = (ev: any) => { if (ev.categoria === 'FLUXO') return '#555'; if (ev.atleta === 'AZUL') return '#2563eb'; return '#ffffff'; };

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', fontFamily: 'sans-serif', color: 'white', padding: '10px', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0, fontSize: isMobile?'22px':'24px', fontWeight: '900', letterSpacing: '-1px', display: 'flex', alignItems: 'baseline' }}>
          <span style={{ color: '#ef4444' }}>SMAART</span><span style={{ color: '#666', margin: '0 5px' }}>|</span><span style={{ color: 'white' }}>PRO</span>
          <span style={{ fontSize: '10px', color: '#666', marginLeft: '8px', fontFamily: 'monospace' }}>v6.0</span>
        </h1>
        <div style={{display:'flex', gap:'10px'}}>
          <div style={{display:'flex', background:'#222', borderRadius:'6px', padding:'2px', border:'1px solid #444'}}>
            <button onClick={adicionarYoutube} style={{background: 'transparent', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'12px'}}>+ YT</button>
            <button onClick={() => fileInputRef.current.click()} style={{background: 'transparent', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', fontSize:'12px'}}>+ ARQ</button>
            <input type="file" ref={fileInputRef} style={{display:'none'}} multiple accept="video/*" onChange={handleFileSelect} />
          </div>
          <button onClick={() => setShowPlaylist(!showPlaylist)} style={{background: showPlaylist?'#2563eb':'#333', color:'white', border:'1px solid #555', padding:'6px 10px', borderRadius:'4px', cursor:'pointer', display:'flex', gap:'5px', alignItems:'center'}}>
            <List size={18}/> Playlist ({playlist.length})
          </button>
          <button onClick={baixarCSV} style={{background:'#333', color:'#ccc', border:'1px solid #555', padding:'6px 10px', borderRadius:'4px', cursor:'pointer'}}><Download size={18}/></button>
        </div>
      </div>

      {/* --- MODAL REGISTRO --- */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
          <div style={{ background: '#1e1e1e', padding: '25px', borderRadius: '16px', width: '100%', maxWidth: '500px', border: '1px solid #444', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2 style={{margin:0, color:'#fbbf24', fontSize:'22px', display:'flex', alignItems:'center', gap:'10px'}}><MousePointerClick /> REGISTRAR</h2>
              <button onClick={() => setModalAberto(false)} style={{background:'none', border:'none', color:'#666', cursor:'pointer'}}><X size={24}/></button>
            </div>
            {/* ... (Conteúdo do modal igual à v5.5) ... */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div><div style={{fontSize:'12px', color:'#888', marginBottom:'5px'}}>QUEM?</div><div style={{display:'flex'}}><button onClick={()=>setModalAtleta('BRANCO')} style={{flex:1, padding:'12px', background: modalAtleta==='BRANCO'?'#e5e7eb':'#333', color:modalAtleta==='BRANCO'?'black':'white', border:'none', borderRadius:'6px 0 0 6px', fontWeight:'bold'}}>⚪</button><button onClick={()=>setModalAtleta('AZUL')} style={{flex:1, padding:'12px', background: modalAtleta==='AZUL'?'#2563eb':'#333', color:'white', border:'none', borderRadius:'0 6px 6px 0', fontWeight:'bold'}}>🔵</button></div></div>
              <div><div style={{fontSize:'12px', color:'#888', marginBottom:'5px'}}>LADO?</div><div style={{display:'flex'}}><button onClick={()=>setModalLado('ESQUERDA')} style={{flex:1, padding:'12px', background: modalLado==='ESQUERDA'?'#f59e0b':'#333', color:'white', border:'none', borderRadius:'6px 0 0 6px', fontSize:'12px'}}>ESQ</button><button onClick={()=>setModalLado('DIREITA')} style={{flex:1, padding:'12px', background: modalLado==='DIREITA'?'#10b981':'#333', color:'white', border:'none', borderRadius:'0 6px 6px 0', fontSize:'12px'}}>DIR</button></div></div>
            </div>
            <div style={{marginBottom:'25px', position:'relative'}}>
              <div style={{fontSize:'12px', color:'#888', marginBottom:'5px'}}>O QUÊ?</div>
              <div style={{position:'relative'}}><Search size={18} style={{position:'absolute', top:'12px', left:'12px', color:'#666'}}/><input ref={inputRef} type="text" placeholder="Comece a digitar..." value={modalNome} onChange={e=>setModalNome(e.target.value)} style={{width:'100%', padding:'12px 12px 12px 40px', background:'#000', border:'1px solid #555', color:'white', borderRadius:'8px', fontSize:'18px', boxSizing:'border-box'}}/></div>
              {sugestoes.length > 0 && (<div style={{position:'absolute', top:'100%', width:'100%', background:'#2d2d2d', zIndex:100, border:'1px solid #444', borderRadius:'0 0 8px 8px', maxHeight:'150px', overflowY:'auto'}}>{sugestoes.map(s=>(<div key={s} onClick={()=>{setModalNome(s); const exact=Object.keys(DB_GOLPES).find(k=>k.toLowerCase()===s.toLowerCase()); if(exact) setModalGrupo(DB_GOLPES[exact] as any); setSugestoes([])}} style={{padding:'12px', borderBottom:'1px solid #444', cursor:'pointer', display:'flex', justifyContent:'space-between'}}><span>{s}</span><span style={{fontSize:'10px', background:'#444', padding:'2px 6px', borderRadius:'4px'}}>{DB_GOLPES[Object.keys(DB_GOLPES).find(k=>k.toLowerCase()===s.toLowerCase())||'']}</span></div>))}</div>)}
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}><button onClick={() => confirmarEContinuar('NADA')} style={{padding: '15px', background: '#374151', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold'}}>NADA</button><button onClick={() => confirmarEContinuar('YUKO')} style={{padding: '15px', background: '#44403c', color: '#aaa', border: 'none', borderRadius: '8px', fontWeight: 'bold'}}>YUKO</button><button onClick={() => confirmarEContinuar('WAZA-ARI')} style={{padding: '15px', background: '#eab308', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold'}}>WAZA-ARI</button><button onClick={() => confirmarEContinuar('IPPON')} style={{padding: '15px', background: '#fff', color: '#000', border: '4px solid #ef4444', borderRadius: '8px', fontWeight: 'bold'}}>IPPON</button></div>
          </div>
        </div>
      )}

      {/* ÁREA PRINCIPAL COM PLAYLIST */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
        
        {/* COLUNA DA ESQUERDA (PLAYER + CONTROLES) */}
        <div style={{ flex: 3, width: '100%' }}>
          
          {/* PLAYER */}
          <div style={{ border: '2px solid #333', borderRadius: '12px', overflow: 'hidden', background: '#000', marginBottom: '15px', position: 'relative', paddingTop: '56.25%', width: '100%' }}>
               {currentVideo.type === 'YOUTUBE' ? (
                 <YouTube videoId={currentVideo.id} onReady={onReady} onStateChange={onStateChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} opts={{ width: '100%', height: '100%', playerVars: { controls: 1, rel: 0 } }} />
               ) : (
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                   <video ref={filePlayerRef} src={currentVideo.id} style={{width:'100%', height:'100%', objectFit:'contain'}} controls onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={onFileEnded} onLoadedMetadata={(e:any) => setDuration(e.target.duration)}/> 
                 </div>
               )}
          </div>

          {/* BARRA DE NAVEGAÇÃO DE VÍDEO */}
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', background:'#111', padding:'10px', borderRadius:'8px', border:'1px solid #333', marginBottom:'15px'}}>
             <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
               <button onClick={videoAnterior} disabled={currentVideoIndex===0} style={{background:'none', border:'none', color:currentVideoIndex===0?'#444':'white', cursor:'pointer'}}><SkipBack/></button>
               <span style={{fontSize:'14px', fontWeight:'bold', color:'#fbbf24', maxWidth:'200px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{currentVideoIndex+1}. {currentVideo.name}</span>
               <button onClick={proximoVideo} disabled={currentVideoIndex===playlist.length-1} style={{background:'none', border:'none', color:currentVideoIndex===playlist.length-1?'#444':'white', cursor:'pointer'}}><SkipForward/></button>
             </div>
             <button onClick={mudarVelocidade} style={{background:'#333', color:'#ccc', border:'1px solid #555', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontSize:'12px', fontWeight:'bold', display:'flex', gap:'5px', alignItems:'center'}}><Gauge size={14}/> {playbackRate}x</button>
          </div>

          {/* BOTÃO MARCAR */}
          <button onClick={iniciarRegistroRapido} style={{width:'100%', padding:'20px', background:'linear-gradient(to right, #2563eb, #3b82f6)', color:'white', border:'none', borderRadius:'12px', fontSize:'20px', fontWeight:'900', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'15px', boxShadow:'0 10px 20px rgba(37, 99, 235, 0.3)', marginBottom:'15px'}}><MousePointerClick size={28}/> MARCAR AÇÃO</button>

          {/* CONTROLES DE FLUXO */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => registrarFluxo('HAJIME')} style={{background: '#15803d', color:'white', border:'none', padding:'15px', fontWeight:'bold', borderRadius:'8px', display:'flex', gap:'5px', justifyContent:'center', alignItems:'center'}}><PlayCircle size={18}/> HAJIME</button>
            <button onClick={() => registrarFluxo('MATE')} style={{background: '#b91c1c', color:'white', border:'none', padding:'15px', fontWeight:'bold', borderRadius:'8px', display:'flex', gap:'5px', justifyContent:'center', alignItems:'center'}}><PauseCircle size={18}/> MATE</button>
            <button onClick={() => registrarFluxo('GOLDEN SCORE')} style={{background: '#b45309', color:'white', border:'none', padding:'10px', fontWeight:'bold', borderRadius:'8px', fontSize:'12px'}}>GOLDEN SCORE</button>
            <button onClick={() => registrarFluxo('SOREMADE')} style={{background: '#333', color:'white', border:'none', padding:'10px', fontWeight:'bold', borderRadius:'8px', fontSize:'12px'}}>SOREMADE</button>
          </div>

          <div style={{ background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', padding: '15px' }}>
             <h3 style={{margin:'0 0 10px 0', fontSize:'12px', color:'#aaa'}}>PUNIÇÕES</h3>
             <div style={{display:'flex', gap:'5px'}}>
               <select style={{flex:1, background:'#333', color:'white', border:'none', padding:'10px', borderRadius:'4px', fontSize: '12px'}} onChange={(e) => setMotivoShido(e.target.value)} value={motivoShido}>{DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}</select>
               <button onClick={() => registrarPunicao('SHIDO', 'BRANCO')} style={{width:'40px', background:'#ef4444', color:'white', border:'none', borderRadius:'4px', fontWeight:'bold'}}>⚪</button>
               <button onClick={() => registrarPunicao('SHIDO', 'AZUL')} style={{width:'40px', background:'#ef4444', color:'white', border:'none', borderRadius:'4px', fontWeight:'bold'}}>🔵</button>
             </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA (PLAYLIST + PLACAR + LOG) */}
        <div style={{ flex: 2, width: '100%' }}>
          
          {/* SIDEBAR PLAYLIST */}
          {showPlaylist && (
            <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '10px', marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' }}>
              <div style={{fontSize:'12px', color:'#aaa', marginBottom:'5px', fontWeight:'bold'}}>FILA DE REPRODUÇÃO</div>
              {playlist.map((item, index) => (
                <div key={index} onClick={() => selecionarVideo(index)} style={{ padding: '8px', cursor: 'pointer', background: index === currentVideoIndex ? '#2563eb' : 'transparent', borderRadius: '4px', marginBottom: '2px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{display:'flex', alignItems:'center', gap:'5px', overflow:'hidden'}}>
                    {item.type === 'YOUTUBE' ? <Youtube size={14}/> : <Film size={14}/>}
                    <span style={{fontSize:'12px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.name}</span>
                  </div>
                  <button onClick={(e) => removerDaPlaylist(index, e)} style={{background:'none', border:'none', color: index===currentVideoIndex?'white':'#666', cursor:'pointer'}}><X size={12}/></button>
                </div>
              ))}
            </div>
          )}

          {/* PLACAR */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', marginBottom: '15px', background: '#000', padding: '10px', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #333' }}>
              <div style={{fontSize: '14px', fontWeight: 'bold'}}>⚪ BRANCO</div>
              <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color:'#777'}}>I</div><div style={{fontSize:'20px', fontWeight:'bold'}}>{placar.branco.ippon}</div></div>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color:'#fbbf24'}}>W</div><div style={{fontSize:'20px', fontWeight:'bold', color: '#fbbf24'}}>{placar.branco.waza}</div></div>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color:'#ef4444'}}>S</div><div style={{fontSize:'20px', color: '#ef4444'}}>{placar.branco.shido}</div></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{fontSize: '10px', color: tempoDeLuta.isGS ? '#fbbf24' : '#aaa', fontWeight: 'bold'}}>{tempoDeLuta.isGS ? "GS" : "TEMPO"}</div>
              <div style={{fontSize: '28px', fontFamily: 'monospace', fontWeight: 'bold', color: tempoDeLuta.isGS ? '#fbbf24' : 'white', lineHeight: '1'}}>{formatTime(tempoDeLuta.total)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid #333' }}>
              <div style={{fontSize: '14px', fontWeight: 'bold', color: '#3b82f6'}}>🔵 AZUL</div>
              <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color:'#ef4444'}}>S</div><div style={{fontSize:'20px', color: '#ef4444'}}>{placar.azul.shido}</div></div>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color:'#fbbf24'}}>W</div><div style={{fontSize:'20px', fontWeight:'bold', color: '#fbbf24'}}>{placar.azul.waza}</div></div>
                 <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color:'#777'}}>I</div><div style={{fontSize:'20px', fontWeight:'bold'}}>{placar.azul.ippon}</div></div>
              </div>
            </div>
          </div>

          {/* LOG */}
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px', alignItems:'center' }}>
            <h3 style={{margin:0, fontSize:'14px'}}>LOG DA LUTA ATUAL</h3>
            <button onClick={()=>setEventos(eventos.filter(e => e.videoId !== currentVideo.name))} style={{background:'none', border:'none', color:'#666', cursor:'pointer'}}><Trash2 size={16}/></button>
          </div>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '5px', maxHeight: '300px', overflowY: 'auto' }}>
            {eventos.filter(e => e.videoId === currentVideo.name).map((ev: any) => (
              <div key={ev.id} style={{ padding: '8px', marginBottom: '5px', borderRadius: '6px', background: '#1f2937', borderLeft: `4px solid ${getCorBorda(ev)}`, display:'flex', alignItems:'center', justifyContent:'space-between', fontSize: '12px' }}>
                <div onClick={() => irPara(ev.tempo)} style={{cursor:'pointer', flex:1}}>
                  <div style={{display:'flex', gap:'8px', fontSize:'10px', color:'#888', alignItems:'center'}}>
                    <span style={{color:'#999', fontFamily:'monospace', display:'flex', alignItems:'center', gap:'3px'}}><Rewind size={10}/> {formatTime(ev.tempo)}</span>
                    <span style={{color:'#fbbf24', fontFamily:'monospace', fontWeight:'bold', background:'#333', padding:'1px 4px', borderRadius:'3px'}}>Luta: {ev.tempo >= fightStartTime ? formatTime(ev.tempo - fightStartTime) : '-'}</span>
                  </div>
                  <div style={{fontWeight:'bold', color: ev.atleta === 'AZUL' ? '#60a5fa' : 'white', fontSize: '13px', marginTop:'2px'}}>{ev.especifico || ev.tipo}</div>
                  {ev.resultado && ev.resultado !== 'NADA' && <div style={{marginTop:'2px', background: ev.resultado==='IPPON'?'white':'#eab308', color:'black', display:'inline-block', padding:'1px 4px', borderRadius:'3px', fontSize:'10px', fontWeight:'bold'}}>{ev.resultado}</div>}
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