import React, { useRef, useState, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';
import { 
  Play, Pause, Trash2, Download, Video, Film, List, X, 
  Clock, Flag, CheckCircle, ChevronLeft, ChevronRight, Search, 
  MousePointerClick, Gauge, Youtube, Rewind, BarChart2, PieChart,
  Edit2, Bot, Copy, Check, Keyboard, AlertTriangle, AlertOctagon,
  PenTool, ArrowUpRight, Eraser, Palette, Maximize, Save, Eye,
  FileJson, UploadCloud, Printer, SkipBack, SkipForward, Hand,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Compass, Trophy // Novo ícone Trophy
} from 'lucide-react';

// --- THEME SYSTEM ---
const THEME = {
  bg: '#0f172a', card: '#1e293b', cardBorder: '#334155', text: '#f8fafc', textDim: '#94a3b8',
  primary: '#3b82f6', primaryHover: '#2563eb', danger: '#ef4444', success: '#10b981', warning: '#eab308', surface: '#020617', neutral: '#64748b'
};

// --- BANCO DE DADOS ---
const DB_SHIDOS = ["Passividade", "Falso Ataque", "Saída de Área", "Postura Defensiva", "Evitar Pegada", "Pegada Ilegal", "Dedos na manga", "Desarrumar Gi", "Outros"];
const DB_PEGADAS = ["Gola", "Manga", "Gola Alta", "Costas", "Faixa", "Pistola", "Cruzada", "Sem Pegada"];
const DB_FASES = ["Eliminatória", "Oitavas", "Quartas", "Semi-Final", "Final", "Repescagem", "Bronze"]; // NOVO
const DB_GOLPES: Record<string, string> = {
  "seoi-nage": "TE-WAZA", "ippon-seoi-nage": "TE-WAZA", "seoi-otoshi": "TE-WAZA", "tai-otoshi": "TE-WAZA", "kata-guruma": "TE-WAZA", "sukui-nage": "TE-WAZA", "obi-otoshi": "TE-WAZA", "uki-otoshi": "TE-WAZA", "sumi-otoshi": "TE-WAZA", "yama-arashi": "TE-WAZA", "obi-tori-gaeshi": "TE-WAZA", "morote-gari": "TE-WAZA", "kuchiki-taoshi": "TE-WAZA", "kibisu-gaeshi": "TE-WAZA", "uchi-mata-sukashi": "TE-WAZA", "kouchi-gaeshi": "TE-WAZA",
  "uki-goshi": "KOSHI-WAZA", "ō-goshi": "KOSHI-WAZA", "koshi-guruma": "KOSHI-WAZA", "tsurikomi-goshi": "KOSHI-WAZA", "sode-tsurikomi-goshi": "KOSHI-WAZA", "harai-goshi": "KOSHI-WAZA", "tsuri-goshi": "KOSHI-WAZA", "hane-goshi": "KOSHI-WAZA", "utsuri-goshi": "KOSHI-WAZA", "ushiro-goshi": "KOSHI-WAZA",
  "de-ashi-harai": "ASHI-WAZA", "hiza-guruma": "ASHI-WAZA", "sasae-tsurikomi-ashi": "ASHI-WAZA", "ō-soto-gari": "ASHI-WAZA", "ō-uchi-gari": "ASHI-WAZA", "ko-soto-gari": "ASHI-WAZA", "ko-uchi-gari": "ASHI-WAZA", "okuri-ashi-harai": "ASHI-WAZA", "uchi-mata": "ASHI-WAZA", "ko-soto-gake": "ASHI-WAZA", "ashi-guruma": "ASHI-WAZA", "harai-tsurikomi-ashi": "ASHI-WAZA", "ō-guruma": "ASHI-WAZA", "ō-soto-guruma": "ASHI-WAZA", "ō-soto-otoshi": "ASHI-WAZA", "tsubame-gaeshi": "ASHI-WAZA", "ō-soto-gaeshi": "ASHI-WAZA", "ō-uchi-gaeshi": "ASHI-WAZA", "hane-goshi-gaeshi": "ASHI-WAZA", "harai-goshi-gaeshi": "ASHI-WAZA", "uchi-mata-gaeshi": "ASHI-WAZA",
  "tomoe-nage": "SUTEMI-WAZA", "sumi-gaeshi": "SUTEMI-WAZA", "hikikomi-gaeshi": "SUTEMI-WAZA", "tawara-gaeshi": "SUTEMI-WAZA", "ura-nage": "SUTEMI-WAZA", "yoko-otoshi": "SUTEMI-WAZA", "tani-otoshi": "SUTEMI-WAZA", "hane-makikomi": "SUTEMI-WAZA", "soto-makikomi": "SUTEMI-WAZA", "uchi-makikomi": "SUTEMI-WAZA", "uki-waza": "SUTEMI-WAZA", "yoko-wakare": "SUTEMI-WAZA", "yoko-guruma": "SUTEMI-WAZA", "yoko-gake": "SUTEMI-WAZA", "daki-wakare": "SUTEMI-WAZA", "ō-soto-makikomi": "SUTEMI-WAZA", "uchi-mata-makikomi": "SUTEMI-WAZA", "harai-makikomi": "SUTEMI-WAZA", "ko-uchi-makikomi": "SUTEMI-WAZA", "kani-basami": "SUTEMI-WAZA", "kawazu-gake": "SUTEMI-WAZA",
  "kesa-gatame": "OSAEKOMI-WAZA", "kuzure-kesa-gatame": "OSAEKOMI-WAZA", "ushiro-kesa-gatame": "OSAEKOMI-WAZA", "kata-gatame": "OSAEKOMI-WAZA", "kami-shihō-gatame": "OSAEKOMI-WAZA", "kuzure-kami-shihō-gatame": "OSAEKOMI-WAZA", "yoko-shihō-gatame": "OSAEKOMI-WAZA", "tate-shihō-gatame": "OSAEKOMI-WAZA", "uki-gatame": "OSAEKOMI-WAZA", "ura-gatame": "OSAEKOMI-WAZA",
  "nami-jūji-jime": "SHIME-WAZA", "gyaku-jūji-jime": "SHIME-WAZA", "kata-jūji-jime": "SHIME-WAZA", "hadaka-jime": "SHIME-WAZA", "okuri-eri-jime": "SHIME-WAZA", "kataha-jime": "SHIME-WAZA", "katate-jime": "SHIME-WAZA", "ryōte-jime": "SHIME-WAZA", "sode-guruma-jime": "SHIME-WAZA", "tsukkomi-jime": "SHIME-WAZA", "sankaku-jime": "SHIME-WAZA", "dō-jime": "SHIME-WAZA",
  "ude-garami": "KANSETSU-WAZA", "ude-hishigi-jūji-gatame": "KANSETSU-WAZA", "ude-hishigi-ude-gatame": "KANSETSU-WAZA", "ude-hishigi-hiza-gatame": "KANSETSU-WAZA", "ude-hishigi-waki-gatame": "KANSETSU-WAZA", "ude-hishigi-hara-gatame": "KANSETSU-WAZA", "ude-hishigi-ashi-gatame": "KANSETSU-WAZA", "ude-hishigi-te-gatame": "KANSETSU-WAZA", "ude-hishigi-sankaku-gatame": "KANSETSU-WAZA", "ashi-garami": "KANSETSU-WAZA"
};

const CORES_GRUPOS: any = { 
  "TE-WAZA": "#6366f1", "KOSHI-WAZA": "#10b981", "ASHI-WAZA": "#f59e0b", 
  "SUTEMI-WAZA": "#ef4444", "OSAEKOMI-WAZA": "#3b82f6", "SHIME-WAZA": "#a855f7", 
  "KANSETSU-WAZA": "#ec4899" 
};

type PlaylistItem = { id: string; type: 'YOUTUBE' | 'FILE'; name: string; };
type LoopRange = { start: number; end: number } | null;
type VideoMetadata = { eventName: string; date: string; category: string; phase: string; location: string }; // NOVO TIPO

export default function JudoPlayer() {
  // --- REFS ---
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null); 
  const youtubePlayerRef = useRef<any>(null);
  const filePlayerRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const backupInputRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- STATE: VIDEO ---
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([{ id: 'kU_gjfnyu6A', type: 'YOUTUBE', name: 'Final Paris 2025' }]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [isDataFullscreen, setIsDataFullscreen] = useState(false); 
  const [loopRange, setLoopRange] = useState<LoopRange>(null);

  // --- STATE: METADADOS (NOVO v21) ---
  const [metadataMap, setMetadataMap] = useState<Record<string, VideoMetadata>>({}); 
  const [modalMetadata, setModalMetadata] = useState(false);
  // Form temporário
  const [metaEvent, setMetaEvent] = useState('');
  const [metaDate, setMetaDate] = useState('');
  const [metaCat, setMetaCat] = useState('');
  const [metaPhase, setMetaPhase] = useState('');

  // --- DRAWING STATE ---
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawTool, setDrawTool] = useState<'PEN' | 'ARROW'>('PEN');
  const [drawColor, setDrawColor] = useState('#eab308');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{x:number, y:number} | null>(null);
  const [currentStrokes, setCurrentStrokes] = useState<any[]>([]); 
  const [tempPoints, setTempPoints] = useState<any[]>([]);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  // --- UI STATE ---
  const [modalAberto, setModalAberto] = useState(false);
  const [modalIA, setModalIA] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  
  // --- KUMI-KATA STATE ---
  const [modalKumi, setModalKumi] = useState(false);
  const [kumiAtleta, setKumiAtleta] = useState('BRANCO');
  const [kumiBase, setKumiBase] = useState('Ai-yotsu');
  const [kumiDir, setKumiDir] = useState('Gola');
  const [kumiEsq, setKumiEsq] = useState('Manga');

  // --- DADOS REGISTRO ---
  const [modalAtleta, setModalAtleta] = useState('BRANCO');
  const [modalLado, setModalLado] = useState('DIREITA');
  const [modalNome, setModalNome] = useState('');
  const [modalGrupo, setModalGrupo] = useState('TE-WAZA');
  const [modalDirecao, setModalDirecao] = useState('FRENTE');
  const [motivoShido, setMotivoShido] = useState(DB_SHIDOS[0]);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [tempoCapturado, setTempoCapturado] = useState(0);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [resultadoPreSelecionado, setResultadoPreSelecionado] = useState<string | null>(null);
  const [punicaoMode, setPunicaoMode] = useState<string | null>(null);

  // --- DATABASE ---
  const [eventos, setEventos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('smaartpro_db_v21') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('smaartpro_db_v21', JSON.stringify(eventos)); }, [eventos]);
  
  // Persistência de Metadados
  useEffect(() => {
      const savedMeta = localStorage.getItem('smaartpro_meta_v21');
      if (savedMeta) setMetadataMap(JSON.parse(savedMeta));
  }, []);
  useEffect(() => { localStorage.setItem('smaartpro_meta_v21', JSON.stringify(metadataMap)); }, [metadataMap]);

  // ==================================================================================
  // 1. CÁLCULOS (MEMO)
  // ==================================================================================
  const currentVideo = useMemo(() => playlist[currentVideoIndex] || { id: '', type: 'YOUTUBE', name: '' }, [playlist, currentVideoIndex]);
  const currentMetadata = useMemo(() => metadataMap[currentVideo.id] || { eventName: 'Evento não definido', date: new Date().toLocaleDateString(), category: 'Geral', phase: 'Luta', location: '' }, [metadataMap, currentVideo.id]);

  const isFightActive = useMemo(() => {
    const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'FLUXO').sort((a:any, b:any) => b.tempo - a.tempo);
    if (evs.length === 0) return false;
    return evs[0].tipo === 'HAJIME';
  }, [eventos, currentVideo.name]);

  const accumulatedFightTime = useMemo(() => {
    let total = 0; let start = null;
    const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'FLUXO').sort((a:any, b:any) => a.tempo - b.tempo);
    for (const ev of evs) {
      if (ev.tipo === 'HAJIME') start = ev.tempo; else if ((ev.tipo === 'MATE' || ev.tipo === 'SOREMADE') && start !== null) { total += (ev.tempo - start); start = null; }
    }
    if (start !== null && currentTime > start) total += (currentTime - start);
    return total;
  }, [eventos, currentTime, currentVideo.name]);

  const tempoDisplay = useMemo(() => {
    const hasHajime = eventos.some((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'FLUXO' && ev.tipo === 'HAJIME');
    if (!hasHajime) return { text: "TEMPO REGULAR", time: "4:00", isGS: false };
    const elapsed = accumulatedFightTime;
    if (elapsed <= 240) return { text: "TEMPO REGULAR", time: `${Math.floor((240-elapsed)/60)}:${Math.floor((240-elapsed)%60).toString().padStart(2,'0')}`, isGS: false };
    else return { text: "GOLDEN SCORE", time: `${Math.floor((elapsed-240)/60)}:${Math.floor((elapsed-240)%60).toString().padStart(2,'0')}`, isGS: true };
  }, [accumulatedFightTime, eventos, currentVideo.name]);

  const fightStartTime = useMemo(() => {
    const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'FLUXO' && ev.tipo === 'HAJIME').sort((a:any,b:any)=>a.tempo-b.tempo);
    return evs.length > 0 ? evs[0].tempo : 0;
  }, [eventos, currentVideo.name]);

  const placar = useMemo(() => {
    const p = { branco: { ippon:0, waza:0, yuko:0, shido:0 }, azul: { ippon:0, waza:0, yuko:0, shido:0 } };
    eventos.filter((ev:any) => ev.videoId === currentVideo.name).forEach((ev: any) => {
      const q = ev.atleta === 'BRANCO' ? p.branco : p.azul;
      if (ev.resultado === 'IPPON') q.ippon++; if (ev.resultado === 'WAZA-ARI') q.waza++; if (ev.resultado === 'YUKO') q.yuko++;
      if (ev.categoria === 'PUNICAO') { if (ev.tipo === 'SHIDO') q.shido++; if (ev.tipo === 'HANSOKU') q.shido += 3; }
    });
    return p;
  }, [eventos, currentVideo.name]);

  const stats = useMemo(() => {
    const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'TECNICA');
    const total = evs.length || 1;
    const groups: any = {};
    evs.forEach((e:any) => { groups[e.grupo] = (groups[e.grupo] || 0) + 1; });
    const groupData = Object.keys(groups).map(g => ({ name: g, val: groups[g], pct: (groups[g]/total)*100, color: CORES_GRUPOS[g] })).sort((a,b)=>b.val-a.val);
    const vol = { branco: evs.filter((e:any)=>e.atleta==='BRANCO').length, azul: evs.filter((e:any)=>e.atleta==='AZUL').length };
    const eff = {
        branco: (evs.filter((e:any)=>e.atleta==='BRANCO' && e.resultado !== 'NADA').length / (vol.branco || 1) * 100).toFixed(0),
        azul: (evs.filter((e:any)=>e.atleta==='AZUL' && e.resultado !== 'NADA').length / (vol.azul || 1) * 100).toFixed(0)
    };
    return { groupData, vol, eff };
  }, [eventos, currentVideo.name]);

  const radarStats = useMemo(() => {
     const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'TECNICA');
     const counts: any = { FRENTE: 0, TRAS: 0, ESQUERDA: 0, DIREITA: 0 };
     evs.forEach((e:any) => { if(e.direcao) counts[e.direcao] = (counts[e.direcao] || 0) + 1; });
     const total = evs.length || 1;
     return {
        FRENTE: (counts.FRENTE / total),
        TRAS: (counts.TRAS / total),
        ESQUERDA: (counts.ESQUERDA / total),
        DIREITA: (counts.DIREITA / total)
     };
  }, [eventos, currentVideo.name]);

  // ==================================================================================
  // 2. FUNÇÕES DE SUPORTE
  // ==================================================================================
  
  const formatTimeVideo = (s: number) => {
    return `${Math.floor(Math.abs(s)/60)}:${Math.floor(Math.abs(s)%60).toString().padStart(2,'0')}`;
  };

  // -- METADATA MANAGEMENT (NOVO v21) --
  const openMetadataModal = () => {
    setMetaEvent(currentMetadata.eventName);
    setMetaDate(currentMetadata.date);
    setMetaCat(currentMetadata.category);
    setMetaPhase(currentMetadata.phase);
    setModalMetadata(true);
  };

  const saveMetadata = () => {
    const newMeta = { eventName: metaEvent, date: metaDate, category: metaCat, phase: metaPhase, location: '' };
    setMetadataMap(prev => ({ ...prev, [currentVideo.id]: newMeta }));
    setModalMetadata(false);
  };

  const applyMetadataToAll = () => {
    if (confirm("Aplicar estes dados (Evento/Data/Categ) para TODOS os vídeos da playlist?")) {
        const newMap = { ...metadataMap };
        const commonMeta = { eventName: metaEvent, date: metaDate, category: metaCat, phase: metaPhase, location: '' };
        playlist.forEach(vid => {
            newMap[vid.id] = commonMeta;
        });
        setMetadataMap(newMap);
        setModalMetadata(false);
        alert("Dados replicados com sucesso!");
    }
  };

  const registrarFluxo = (tipo: string) => setEventos((prev: any[]) => [{ id: Date.now(), videoId: currentVideo.name, tempo: currentTime, categoria: 'FLUXO', tipo, atleta: '-', lado: '-', corTecnica: THEME.neutral }, ...prev]);
  const registrarPunicaoDireto = (tipo: string, atleta: string) => setEventos((prev: any[]) => [{ id: Date.now(), videoId: currentVideo.name, tempo: currentTime, categoria: 'PUNICAO', tipo, especifico: motivoShido, atleta, lado: '-', corTecnica: THEME.warning }, ...prev]);
  
  const abrirKumiKata = () => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); setTempoCapturado(currentTime); setKumiAtleta('BRANCO'); setModalKumi(true); };
  const salvarKumiKata = () => { const detalhe = `${kumiBase} (D:${kumiDir} / E:${kumiEsq})`; const dados = { id: Date.now(), videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'KUMI-KATA', tipo: 'PEGADA', especifico: detalhe, atleta: kumiAtleta, lado: '-', corTecnica: kumiAtleta === 'AZUL' ? THEME.primary : '#ffffff' }; setEventos((prev:any) => [dados, ...prev]); setModalKumi(false); if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.playVideo(); else filePlayerRef.current?.play(); };

  const toggleFightState = () => { if (isFightActive) registrarFluxo('MATE'); else registrarFluxo('HAJIME'); };
  const stepFrame = (frames: number) => { const frameTime = 0.05; const newTime = currentTime + (frames * frameTime); if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) { youtubePlayerRef.current.seekTo(newTime, true); } else if (filePlayerRef.current) { filePlayerRef.current.currentTime = newTime; } setCurrentTime(newTime); };
  const setLoopPoint = (point: 'A' | 'B') => { setLoopRange(prev => { if (point === 'A') return { start: currentTime, end: prev?.end || currentTime + 5 }; if (point === 'B') return { start: prev?.start || Math.max(0, currentTime - 5), end: currentTime }; return prev; }); };
  const clearLoop = () => setLoopRange(null);
  
  const toggleVideo = () => { if (currentVideo.type === 'YOUTUBE') isPlaying ? youtubePlayerRef.current?.pauseVideo() : youtubePlayerRef.current?.playVideo(); else isPlaying ? filePlayerRef.current?.pause() : filePlayerRef.current?.play(); };
  const selecionarVideo = (index: number) => { setCurrentVideoIndex(index); setIsPlaying(true); };
  const proximoVideo = () => { if (currentVideoIndex < playlist.length - 1) selecionarVideo(currentVideoIndex + 1); };
  const videoAnterior = () => { if (currentVideoIndex > 0) selecionarVideo(currentVideoIndex - 1); };
  const removerDaPlaylist = (index: number, e: any) => { e.stopPropagation(); const nova = playlist.filter((_,i)=>i!==index); if(nova.length) setPlaylist(nova); if(index<=currentVideoIndex && currentVideoIndex>0) setCurrentVideoIndex(currentVideoIndex-1); };
  const mudarVelocidade = (rate?: number) => { const r = [0.25, 0.5, 1.0, 1.5, 2.0]; const n = rate || r[(r.indexOf(playbackRate)+1)%r.length]; setPlaybackRate(n); if(currentVideo.type==='YOUTUBE') youtubePlayerRef.current.setPlaybackRate(n); else filePlayerRef.current.playbackRate = n; };
  const handleFileSelect = (e: any) => { const files = Array.from(e.target.files || []); const newItems: PlaylistItem[] = files.map((file: any) => ({ id: URL.createObjectURL(file), type: 'FILE', name: file.name })); if (playlist.length === 1 && playlist[0].id === 'kU_gjfnyu6A') { setPlaylist(newItems); setCurrentVideoIndex(0); } else { setPlaylist([...playlist, ...newItems]); } setShowPlaylist(true); };
  const adicionarYoutube = () => { const link = prompt("Cole o Link do YouTube:"); if (link) { const id = link.includes('v=') ? link.split('v=')[1].split('&')[0] : link.split('/').pop() || link; setPlaylist([...playlist, { id, type: 'YOUTUBE', name: `YouTube: ${id}` }]); setShowPlaylist(true); } };

  const salvarEFechar = (dados: any) => { if (editingEventId) setEventos(eventos.map((ev: any) => ev.id === editingEventId ? { ...ev, ...dados } : ev)); else setEventos([{ id: Date.now(), ...dados }, ...eventos]); setModalAberto(false); if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current.playVideo(); else filePlayerRef.current.play(); };
  
  const confirmarEContinuar = (resultado: string) => { 
     const dados = { 
        videoId: currentVideo.name, 
        tempo: tempoCapturado, 
        categoria: 'TECNICA', 
        grupo: modalGrupo, 
        especifico: modalNome || "Técnica Geral", 
        atleta: modalAtleta, 
        lado: modalLado, 
        corTecnica: CORES_GRUPOS[modalGrupo], 
        resultado: resultado,
        direcao: modalDirecao 
     }; 
     salvarEFechar(dados); 
  };
  
  const confirmarPunicao = (atleta: string) => { const dados = { videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'PUNICAO', tipo: punicaoMode, especifico: motivoShido, atleta, lado: '-', corTecnica: THEME.warning }; salvarEFechar(dados); };
  const iniciarRegistroRapido = (resultadoInicial?: string) => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); let t = currentTime; if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) t = youtubePlayerRef.current.getCurrentTime(); else if(filePlayerRef.current) t = filePlayerRef.current.currentTime; setEditingEventId(null); setTempoCapturado(t); setModalAtleta('BRANCO'); setModalNome(''); setModalDirecao('FRENTE'); setPunicaoMode(null); setResultadoPreSelecionado(resultadoInicial || null); setModalAberto(true); setTimeout(() => inputRef.current?.focus(), 100); };
  const iniciarRegistroPunicaoTeclado = (tipo: 'SHIDO' | 'HANSOKU') => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); let t = currentTime; if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) t = youtubePlayerRef.current.getCurrentTime(); else if(filePlayerRef.current) t = filePlayerRef.current.currentTime; setEditingEventId(null); setTempoCapturado(t); setPunicaoMode(tipo); setModalAberto(true); };
  const editarEvento = (ev: any) => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current.pauseVideo(); else filePlayerRef.current.pause(); setEditingEventId(ev.id); setTempoCapturado(ev.tempo); setModalAtleta(ev.atleta); setModalLado(ev.lado); if (ev.categoria === 'PUNICAO') { setPunicaoMode(ev.tipo); setMotivoShido(ev.especifico); } else { setPunicaoMode(null); setModalNome(ev.especifico === "Técnica Geral" ? "" : ev.especifico); setModalGrupo(ev.grupo || 'TE-WAZA'); setResultadoPreSelecionado(ev.resultado); setModalDirecao(ev.direcao || 'FRENTE'); } setModalAberto(true); };

  const clearCanvas = () => { if (canvasRef.current) { const ctx = canvasRef.current.getContext('2d'); if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); } setCurrentStrokes([]); };
  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) => { const headLength = 20; const angle = Math.atan2(toY - fromY, toX - fromX); ctx.beginPath(); ctx.moveTo(fromX, fromY); ctx.lineTo(toX, toY); ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.moveTo(toX, toY); ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6)); ctx.moveTo(toX, toY); ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), y - headLength * Math.sin(angle + Math.PI / 6)); ctx.stroke(); };
  const redrawStrokes = (strokesToDraw: any[]) => { if (!canvasRef.current) return; const ctx = canvasRef.current.getContext('2d'); if (!ctx) return; ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); strokesToDraw.forEach(stroke => { ctx.strokeStyle = stroke.color; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (stroke.tool === 'PEN') { ctx.beginPath(); if (stroke.points.length > 0) { ctx.moveTo(stroke.points[0].x, stroke.points[0].y); stroke.points.forEach((p:any) => ctx.lineTo(p.x, p.y)); } ctx.stroke(); } else if (stroke.tool === 'ARROW') { if (stroke.points.length >= 2) { const start = stroke.points[0]; const end = stroke.points[stroke.points.length - 1]; drawArrow(ctx, start.x, start.y, end.x, end.y, stroke.color); } } }); };
  const toggleDrawingMode = (loadStrokes?: any[]) => { const newState = !isDrawingMode; setIsDrawingMode(newState); if (newState) { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); if (playerContainerRef.current) { if (playerContainerRef.current.requestFullscreen) { playerContainerRef.current.requestFullscreen().catch(() => setIsDataFullscreen(true)); } else { setIsDataFullscreen(true); } } setTimeout(() => { if(canvasRef.current && canvasRef.current.parentElement) { canvasRef.current.width = canvasRef.current.parentElement.clientWidth; canvasRef.current.height = canvasRef.current.parentElement.clientHeight; if (loadStrokes && loadStrokes.length > 0) { setCurrentStrokes(loadStrokes); redrawStrokes(loadStrokes); } } }, 100); } else { if (document.fullscreenElement) document.exitFullscreen(); setIsDataFullscreen(false); clearCanvas(); } };
  const salvarDesenhoNoLog = () => { if (currentStrokes.length === 0) { alert("Desenhe algo antes de salvar!"); return; } setEventos((prev: any[]) => [{ id: Date.now(), videoId: currentVideo.name, tempo: currentTime, categoria: 'ANALISE', tipo: 'DESENHO', especifico: 'Anotação Tática Visual', atleta: '-', lado: '-', corTecnica: '#a855f7', vetores: currentStrokes }, ...prev]); alert("Anotação Visual Catalogada!"); toggleDrawingMode(); };
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); if (!isDrawingMode || !canvasRef.current) return; const ctx = canvasRef.current.getContext('2d'); if (!ctx) return; const rect = canvasRef.current.getBoundingClientRect(); const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX; const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as any).clientY; const x = clientX - rect.left; const y = clientY - rect.top; setIsDrawing(true); setTempPoints([{x, y}]); if (drawTool === 'PEN') { ctx.beginPath(); ctx.moveTo(x, y); ctx.strokeStyle = drawColor; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; } else if (drawTool === 'ARROW') { setStartPos({x, y}); setSnapshot(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)); } };
  const draw = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); if (!isDrawing || !canvasRef.current) return; const ctx = canvasRef.current.getContext('2d'); if (!ctx) return; const rect = canvasRef.current.getBoundingClientRect(); const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX; const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as any).clientY; const x = clientX - rect.left; const y = clientY - rect.top; if (drawTool === 'PEN') { ctx.lineTo(x, y); ctx.stroke(); setTempPoints(prev => [...prev, {x, y}]); } else if (drawTool === 'ARROW' && startPos) { if (snapshot) ctx.putImageData(snapshot, 0, 0); drawArrow(ctx, startPos.x, startPos.y, x, y, drawColor); } };
  const stopDrawing = (e: any) => { e.preventDefault(); if (!isDrawing || !canvasRef.current) return; setIsDrawing(false); const rect = canvasRef.current.getBoundingClientRect(); let finalX = 0, finalY = 0; if (e.type !== 'mouseleave') { const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX; const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY; finalX = clientX - rect.left; finalY = clientY - rect.top; } if (drawTool === 'PEN') { setCurrentStrokes(prev => [...prev, { tool: 'PEN', color: drawColor, points: tempPoints }]); } else if (drawTool === 'ARROW' && startPos) { setCurrentStrokes(prev => [...prev, { tool: 'ARROW', color: drawColor, points: [{x: startPos.x, y: startPos.y}, {x: finalX, y: finalY}] }]); } setSnapshot(null); setStartPos(null); setTempPoints([]); };

  const irPara = (t: number) => { const st = Math.max(0, t - 2); if (currentVideo.type === 'YOUTUBE') { youtubePlayerRef.current.seekTo(st, true); youtubePlayerRef.current.playVideo(); } else { filePlayerRef.current.currentTime = st; filePlayerRef.current.play(); } setCurrentTime(st); };
  const irParaEvento = (ev: any) => { if (ev.categoria === 'ANALISE' && ev.vetores) { const st = ev.tempo; if (currentVideo.type === 'YOUTUBE') { youtubePlayerRef.current.seekTo(st, true); youtubePlayerRef.current.pauseVideo(); } else { filePlayerRef.current.currentTime = st; filePlayerRef.current.pause(); } setCurrentTime(st); if (!isDrawingMode) toggleDrawingMode(ev.vetores); else redrawStrokes(ev.vetores); } else { const st = Math.max(0, ev.tempo - 3); if (currentVideo.type === 'YOUTUBE') { youtubePlayerRef.current.seekTo(st, true); youtubePlayerRef.current.playVideo(); } else { filePlayerRef.current.currentTime = st; filePlayerRef.current.play(); } setCurrentTime(st); } };

  const baixarCSV = () => { 
      let csv = "data:text/csv;charset=utf-8,Video;Evento;Data;Fase;Tempo Video;Tempo Luta;Categoria;Técnica;Resultado;Atleta;Lado;Direcao;Detalhe\n"; 
      const evsByVid: any = {}; 
      eventos.forEach((ev:any) => { if(!evsByVid[ev.videoId]) evsByVid[ev.videoId]=[]; evsByVid[ev.videoId].push(ev); }); 
      Object.keys(evsByVid).forEach(vid => { 
          const meta = metadataMap[vid] || { eventName: '', date: '', phase: '' };
          const sorted = evsByVid[vid].sort((a:any,b:any)=>a.tempo-b.tempo); 
          const start = sorted.find((e:any)=>e.categoria==='FLUXO'&&e.tipo==='HAJIME')?.tempo || 0; 
          sorted.forEach((e:any) => { csv+=`${e.videoId};${meta.eventName};${meta.date};${meta.phase};${e.tempo.toFixed(3).replace('.',',')};${(e.tempo-start).toFixed(1).replace('.',',')};${e.categoria};${e.especifico||e.tipo||'-'};${e.resultado||'-'};${e.atleta};${e.lado};${e.direcao||'-'};${e.grupo||e.tipo}\n`; }); 
      }); 
      const link = document.createElement("a"); link.href = encodeURI(csv); link.download = `smaartpro_v21_${new Date().toISOString().slice(0,10)}.csv`; link.click(); 
  };
  
  const exportarBackup = () => { const dadosBackup = { version: '21.0', timestamp: new Date().toISOString(), playlist, eventos, metadata: metadataMap }; const blob = new Blob([JSON.stringify(dadosBackup, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `smaartpro_${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(link); link.click(); document.body.removeChild(link); };
  const importarBackup = (e: any) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (event) => { try { const json = JSON.parse(event.target?.result as string); if (json.eventos && Array.isArray(json.eventos)) { if (confirm("ATENÇÃO: Isso substituirá todos os dados atuais. Deseja continuar?")) { setEventos(json.eventos); if (json.playlist) { setPlaylist(json.playlist); setCurrentVideoIndex(0); } if(json.metadata) setMetadataMap(json.metadata); alert("Backup restaurado! 🥋"); } } else alert("Arquivo inválido."); } catch (err) { alert("Erro ao ler JSON."); } }; reader.readAsText(file); e.target.value = null; };
  const imprimirRelatorio = () => { setReportMode(true); setTimeout(() => { window.print(); }, 500); };
  const gerarPromptIA = () => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); const evs = eventos.filter((e:any) => e.videoId === currentVideo.name); const tecnicasBranco = evs.filter((e:any) => e.categoria === 'TECNICA' && e.atleta === 'BRANCO').map((e:any) => e.especifico).join(', '); const tecnicasAzul = evs.filter((e:any) => e.categoria === 'TECNICA' && e.atleta === 'AZUL').map((e:any) => e.especifico).join(', '); const shidosBranco = evs.filter((e:any) => e.categoria === 'PUNICAO' && e.atleta === 'BRANCO').map((e:any) => e.especifico).join(', '); const desenhos = evs.filter((e:any) => e.categoria === 'ANALISE').map((e:any) => formatTimeVideo(e.tempo)).join(', '); const prompt = `Analise a luta de Judô: ${currentVideo.name}. Tempo: ${formatTimeVideo(accumulatedFightTime)}. BRANCO: I${placar.branco.ippon} W${placar.branco.waza} S${placar.branco.shido} (${stats.eff.branco}% efic). AZUL: I${placar.azul.ippon} W${placar.azul.waza} S${placar.azul.shido} (${stats.eff.azul}% efic). Golpes Branco: ${tecnicasBranco}. Golpes Azul: ${tecnicasAzul}. Punições Branco: ${shidosBranco}. ATENÇÃO: O técnico marcou observações visuais (desenhos) nos seguintes momentos: ${desenhos || 'Nenhum'}. Verifique o que ocorreu nesses tempos. Identifique o Tokui-waza e sugira correções táticas.`; setGeneratedPrompt(prompt); setCopied(false); setModalIA(true); };
  const copyToClipboard = () => { navigator.clipboard.writeText(generatedPrompt); setCopied(true); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalIA || reportMode || modalKumi || modalMetadata) return;
      if (modalAberto) { if (e.key === 'Escape') { setModalAberto(false); } if (e.key === 'Enter' && !punicaoMode && modalAberto) confirmarEContinuar(resultadoPreSelecionado || 'NADA'); return; }
      if (document.activeElement?.tagName === 'INPUT') return;
      switch(e.code) {
        case 'Space': e.preventDefault(); toggleFightState(); break; 
        case 'KeyP': e.preventDefault(); toggleVideo(); break;
        case 'KeyD': e.preventDefault(); toggleDrawingMode(); break; 
        case 'KeyI': e.preventDefault(); iniciarRegistroRapido('IPPON'); break;
        case 'KeyW': e.preventDefault(); iniciarRegistroRapido('WAZA-ARI'); break;
        case 'KeyY': e.preventDefault(); iniciarRegistroRapido('YUKO'); break;
        case 'KeyN': e.preventDefault(); iniciarRegistroRapido('NADA'); break;
        case 'KeyS': e.preventDefault(); iniciarRegistroPunicaoTeclado('SHIDO'); break;
        case 'KeyH': e.preventDefault(); iniciarRegistroPunicaoTeclado('HANSOKU'); break;
        case 'Enter': e.preventDefault(); iniciarRegistroRapido(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalAberto, modalIA, isPlaying, currentVideo.type, resultadoPreSelecionado, currentTime, punicaoMode, isDrawingMode, isFightActive, reportMode, modalKumi, modalMetadata]);

  useEffect(() => { const handleResize = () => { setIsMobile(window.innerWidth < 800); if(canvasRef.current && canvasRef.current.parentElement) { canvasRef.current.width = canvasRef.current.parentElement.clientWidth; canvasRef.current.height = canvasRef.current.parentElement.clientHeight; if (currentStrokes.length > 0) redrawStrokes(currentStrokes); } }; window.addEventListener('resize', handleResize); const handleFsChange = () => { if (!document.fullscreenElement && isDrawingMode) { setTimeout(handleResize, 100); } }; document.addEventListener('fullscreenchange', handleFsChange); return () => { window.removeEventListener('resize', handleResize); document.removeEventListener('fullscreenchange', handleFsChange); } }, [isDrawingMode, currentStrokes]);
  const onReady = (e: any) => { youtubePlayerRef.current = e.target; setDuration(e.target.getDuration()); };
  const onStateChange = (e: any) => { setIsPlaying(e.data === 1); if (e.data === 0) proximoVideo(); window.focus(); };
  const onFileEnded = () => proximoVideo();
  useEffect(() => { let af: number; const loop = () => { if (isPlaying) { if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current?.getCurrentTime) setCurrentTime(youtubePlayerRef.current.getCurrentTime()); else if (currentVideo.type === 'FILE' && filePlayerRef.current) setCurrentTime(filePlayerRef.current.currentTime); af = requestAnimationFrame(loop); } if (loopRange && isPlaying) { if (currentTime >= loopRange.end) { if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) youtubePlayerRef.current.seekTo(loopRange.start, true); else if (filePlayerRef.current) filePlayerRef.current.currentTime = loopRange.start; } } }; if (isPlaying) loop(); return () => cancelAnimationFrame(af); }, [isPlaying, currentVideo.type, loopRange, currentTime]);
  const getCorBorda = (ev: any) => { if (ev.categoria === 'FLUXO') return THEME.neutral; if (ev.atleta === 'AZUL') return THEME.primary; return '#ffffff'; };
  const SimpleDonut = ({ data }: { data: any[] }) => { let cumPct = 0; if(data.length === 0) return <div style={{width:'100px', height:'100px', borderRadius:'50%', border:`4px solid ${THEME.cardBorder}`, display:'flex', alignItems:'center', justifyContent:'center'}}><PieChart size={20} color={THEME.cardBorder}/></div>; return <div style={{position:'relative', width:'120px', height:'120px', borderRadius:'50%', background: `conic-gradient(${data.map(d => { const str = `${d.color} ${cumPct}% ${cumPct + d.pct}%`; cumPct += d.pct; return str; }).join(', ')})`}}><div style={{position:'absolute', top:'20%', left:'20%', width:'60%', height:'60%', background: THEME.card, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><PieChart size={24} color={THEME.textDim}/></div></div>; };
  const cardStyle: any = { background: THEME.card, border: `1px solid ${THEME.cardBorder}`, borderRadius: '16px', overflow: 'hidden' };
  const btnStyle: any = { cursor: 'pointer', border: 'none', borderRadius: '8px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' };

  return (
    <div ref={mainContainerRef} tabIndex={0} style={{ maxWidth: '100%', minHeight: '100vh', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: THEME.text, backgroundColor: THEME.bg, padding: '20px', boxSizing: 'border-box', outline: 'none' }}>
      
      {/* CSS IMPRESSÃO */}
      <style>{` @media print { @page { size: A4; margin: 10mm; } body { background: white !important; color: black !important; } .no-print { display: none !important; } .printable-report { display: block !important; position: static !important; width: 100% !important; height: auto !important; background: white !important; color: black !important; padding: 0 !important; overflow: visible !important; } .printable-card { border: 1px solid #ccc !important; background: white !important; color: black !important; box-shadow: none !important; page-break-inside: avoid; margin-bottom: 20px; } } `}</style>

      {/* HEADER */}
      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0, fontSize: isMobile?'22px':'26px', fontWeight: '800', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center' }}>
          <Video size={28} color={THEME.primary} style={{marginRight:'10px'}}/>
          <span style={{ color: THEME.primary }}>SMAART</span><span style={{ color: THEME.textDim, margin: '0 6px', fontWeight:'300' }}>|</span><span style={{ color: 'white' }}>PRO</span>
          <span style={{ fontSize: '11px', color: THEME.textDim, marginLeft: '12px', background: THEME.card, padding: '2px 6px', borderRadius: '4px', border:`1px solid ${THEME.cardBorder}` }}>v21.0 Context</span>
        </h1>
        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
          <div style={{display:'flex', background: THEME.card, borderRadius:'8px', padding:'4px', border:`1px solid ${THEME.cardBorder}`}}>
            <button onClick={adicionarYoutube} style={{...btnStyle, background: 'transparent', color: THEME.textDim, padding:'6px 12px', fontSize:'12px'}}>+ YT</button>
            <div style={{width:'1px', background: THEME.cardBorder, margin: '4px 0'}}></div>
            <button onClick={() => fileInputRef.current.click()} style={{...btnStyle, background: 'transparent', color: THEME.textDim, padding:'6px 12px', fontSize:'12px'}}>+ ARQ</button>
            <input type="file" ref={fileInputRef} style={{display:'none'}} multiple accept="video/*" onChange={handleFileSelect} />
          </div>
          
          <button onClick={openMetadataModal} style={{...btnStyle, background: THEME.card, border: `1px solid ${THEME.cardBorder}`, color: '#f59e0b', padding:'8px'}} title="Contexto do Campeonato"><Trophy size={18}/></button>

          <div style={{display:'flex', background: THEME.card, borderRadius:'8px', padding:'4px', border:`1px solid ${THEME.cardBorder}`}}>
             <button onClick={exportarBackup} style={{...btnStyle, background: 'transparent', color: THEME.success, padding:'6px 12px', fontSize:'12px', fontWeight:'700'}}><FileJson size={16}/> SALVAR</button>
             <div style={{width:'1px', background: THEME.cardBorder, margin: '4px 0'}}></div>
             <button onClick={() => backupInputRef.current.click()} style={{...btnStyle, background: 'transparent', color: THEME.warning, padding:'6px 12px', fontSize:'12px', fontWeight:'700'}}><UploadCloud size={16}/> ABRIR</button>
             <input type="file" ref={backupInputRef} style={{display:'none'}} accept=".json" onChange={importarBackup} />
          </div>

          <button onClick={imprimirRelatorio} style={{...btnStyle, background: 'white', color:'black', padding:'8px 12px', fontSize: '13px', border:'none', fontWeight:'700'}}><Printer size={16}/> RELATÓRIO</button>
          <button onClick={gerarPromptIA} style={{...btnStyle, background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', color:'white', padding:'8px 12px', fontSize: '13px', border:'none', boxShadow:'0 4px 12px rgba(168, 85, 247, 0.4)'}}><Bot size={16}/> AI</button>
          <button onClick={() => setShowPlaylist(!showPlaylist)} style={{...btnStyle, background: showPlaylist ? THEME.primary : THEME.card, color: showPlaylist ? 'white' : THEME.textDim, padding:'8px 12px', fontSize: '13px', border:`1px solid ${showPlaylist ? THEME.primary : THEME.cardBorder}`}}><List size={16}/> {playlist.length}</button>
          <button onClick={baixarCSV} style={{...btnStyle, background: THEME.success, color:'white', padding:'8px 16px', fontSize: '13px'}}><Download size={16}/> CSV</button>
        </div>
      </div>

      {/* --- MODAL METADATA (NOVO v21) --- */}
      {modalMetadata && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: `1px solid ${THEME.cardBorder}` }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2 style={{margin:0, color: '#f59e0b', fontSize:'18px', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700'}}><Trophy size={20}/> DADOS DO EVENTO</h2>
              <button onClick={() => setModalMetadata(false)} style={{...btnStyle, background: THEME.cardBorder, color: THEME.textDim, padding:'6px', borderRadius:'50%'}}><X size={18}/></button>
            </div>
            
            <div style={{marginBottom:'15px'}}>
               <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'5px', fontWeight:'600'}}>NOME DO EVENTO</div>
               <input type="text" value={metaEvent} onChange={e => setMetaEvent(e.target.value)} style={{width:'100%', padding:'10px', background: THEME.surface, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px'}} placeholder="Ex: Grand Slam Paris 2025" />
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
               <div>
                  <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'5px', fontWeight:'600'}}>DATA</div>
                  <input type="text" value={metaDate} onChange={e => setMetaDate(e.target.value)} style={{width:'100%', padding:'10px', background: THEME.surface, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px'}} placeholder="DD/MM/AAAA" />
               </div>
               <div>
                  <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'5px', fontWeight:'600'}}>CATEGORIA</div>
                  <input type="text" value={metaCat} onChange={e => setMetaCat(e.target.value)} style={{width:'100%', padding:'10px', background: THEME.surface, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px'}} placeholder="-81kg" />
               </div>
            </div>

            <div style={{marginBottom:'24px'}}>
               <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'5px', fontWeight:'600'}}>FASE DA LUTA</div>
               <select value={metaPhase} onChange={e => setMetaPhase(e.target.value)} style={{width:'100%', padding:'10px', background: THEME.surface, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px'}}>
                  <option value="">Selecione...</option>
                  {DB_FASES.map(f => <option key={f} value={f}>{f}</option>)}
               </select>
            </div>

            <div style={{display:'flex', gap:'10px'}}>
               <button onClick={saveMetadata} style={{...btnStyle, flex:1, padding:'12px', background: THEME.primary, color:'white', fontWeight:'700'}}>SALVAR NESTE VÍDEO</button>
               <button onClick={applyMetadataToAll} style={{...btnStyle, flex:1, padding:'12px', background: THEME.surface, border:`1px solid ${THEME.primary}`, color:THEME.primary, fontWeight:'700'}}>APLICAR A TODOS</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL KUMI-KATA --- */}
      {modalKumi && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: `1px solid ${THEME.cardBorder}` }}>
            
            <div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:`1px solid ${THEME.cardBorder}`, marginBottom:'20px'}}>
               <button onClick={() => setKumiAtleta('BRANCO')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: kumiAtleta==='BRANCO'?'#e2e8f0':THEME.surface, color:kumiAtleta==='BRANCO'?'#0f172a':THEME.textDim}}>⚪ BRANCO</button>
               <button onClick={() => setKumiAtleta('AZUL')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: kumiAtleta==='AZUL'?THEME.primary:THEME.surface, color:kumiAtleta==='AZUL'?'white':THEME.textDim}}>🔵 AZUL</button>
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2 style={{margin:0, color: '#f59e0b', fontSize:'18px', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700'}}><Hand size={20}/> REGISTRAR PEGADA</h2>
              <button onClick={() => setModalKumi(false)} style={{...btnStyle, background: THEME.cardBorder, color: THEME.textDim, padding:'6px', borderRadius:'50%'}}><X size={18}/></button>
            </div>
            
            <div style={{marginBottom:'20px'}}>
               <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>TIPO DE BASE</div>
               <div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:`1px solid ${THEME.cardBorder}`}}>
                  <button onClick={() => setKumiBase('Ai-yotsu')} style={{...btnStyle, flex:1, padding:'12px', borderRadius:0, background: kumiBase==='Ai-yotsu' ? THEME.primary : 'transparent', color: kumiBase==='Ai-yotsu' ? 'white' : THEME.textDim}}>AI-YOTSU (RvR)</button>
                  <button onClick={() => setKumiBase('Kenka-yotsu')} style={{...btnStyle, flex:1, padding:'12px', borderRadius:0, background: kumiBase==='Kenka-yotsu' ? THEME.danger : 'transparent', color: kumiBase==='Kenka-yotsu' ? 'white' : THEME.textDim}}>KENKA (RvL)</button>
               </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'24px'}}>
               <div>
                  <div style={{fontSize:'11px', color: '#f59e0b', marginBottom:'8px', fontWeight:'600'}}>MÃO DIREITA</div>
                  <select value={kumiDir} onChange={(e) => setKumiDir(e.target.value)} style={{width:'100%', background: THEME.surface, color: 'white', padding:'10px', borderRadius:'8px', border:`1px solid #f59e0b`}}>
                     {DB_PEGADAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
               </div>
               <div>
                  <div style={{fontSize:'11px', color: '#8b5cf6', marginBottom:'8px', fontWeight:'600'}}>MÃO ESQUERDA</div>
                  <select value={kumiEsq} onChange={(e) => setKumiEsq(e.target.value)} style={{width:'100%', background: THEME.surface, color: 'white', padding:'10px', borderRadius:'8px', border:`1px solid #8b5cf6`}}>
                     {DB_PEGADAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
               </div>
            </div>

            <button onClick={salvarKumiKata} style={{...btnStyle, width:'100%', padding:'16px', background: THEME.success, color:'white', fontSize:'16px', fontWeight:'700'}}>CONFIRMAR PEGADA</button>
          </div>
        </div>
      )}

      {/* --- MODO RELATÓRIO (OVERLAY) --- */}
      {reportMode && (
        <div className="printable-report" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'white', zIndex: 99999, padding: '40px', overflowY: 'auto', color:'black' }}>
          <div className="no-print" style={{position:'fixed', top:'20px', right:'20px', display:'flex', gap:'10px'}}>
             <button onClick={() => window.print()} style={{...btnStyle, background:'black', color:'white', padding:'10px 20px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}><Printer size={18}/> IMPRIMIR / PDF</button>
             <button onClick={() => setReportMode(false)} style={{...btnStyle, background:'#e2e8f0', color:'black', padding:'10px', borderRadius:'50%'}}><X size={20}/></button>
          </div>
          <div style={{borderBottom:'2px solid black', paddingBottom:'20px', marginBottom:'30px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
             <div>
                <h1 style={{margin:0, fontSize:'28px', fontWeight:'800', letterSpacing:'-1px'}}>SMAART<span style={{color:'#3b82f6'}}>PRO</span> REPORT</h1>
                <div style={{fontSize:'14px', color:'#666', marginTop:'5px'}}>Análise Tática e Biomecânica de Judô</div>
             </div>
             <div style={{textAlign:'right'}}>
               <div style={{fontSize:'18px', fontWeight:'700'}}>{currentMetadata.eventName}</div>
               <div style={{fontSize:'14px', color:'#666'}}>{currentMetadata.date} - {currentMetadata.category} ({currentMetadata.phase})</div>
             </div>
          </div>
          <div style={{display:'flex', justifyContent:'center', gap:'40px', marginBottom:'40px', padding:'20px', background:'#f8fafc', borderRadius:'12px', border:'1px solid #e2e8f0'}}>
             <div style={{textAlign:'center'}}><div style={{fontSize:'20px', fontWeight:'700', marginBottom:'10px'}}>BRANCO</div><div style={{display:'flex', gap:'15px'}}><div><span style={{fontSize:'12px', display:'block', color:'#666'}}>IPPON</span><span style={{fontSize:'32px', fontWeight:'800'}}>{placar.branco.ippon}</span></div><div><span style={{fontSize:'12px', display:'block', color:'#666'}}>WAZA</span><span style={{fontSize:'32px', fontWeight:'800', color:'#eab308'}}>{placar.branco.waza}</span></div><div><span style={{fontSize:'12px', display:'block', color:'#666'}}>SHIDO</span><span style={{fontSize:'32px', fontWeight:'800', color:'#ef4444'}}>{placar.branco.shido}</span></div></div></div>
             <div style={{width:'2px', background:'#cbd5e1'}}></div>
             <div style={{textAlign:'center'}}><div style={{fontSize:'20px', fontWeight:'700', marginBottom:'10px', color:'#3b82f6'}}>AZUL</div><div style={{display:'flex', gap:'15px'}}><div><span style={{fontSize:'12px', display:'block', color:'#666'}}>IPPON</span><span style={{fontSize:'32px', fontWeight:'800'}}>{placar.azul.ippon}</span></div><div><span style={{fontSize:'12px', display:'block', color:'#666'}}>WAZA</span><span style={{fontSize:'32px', fontWeight:'800', color:'#eab308'}}>{placar.azul.waza}</span></div><div><span style={{fontSize:'12px', display:'block', color:'#666'}}>SHIDO</span><span style={{fontSize:'32px', fontWeight:'800', color:'#ef4444'}}>{placar.azul.shido}</span></div></div></div>
          </div>
          <div style={{marginBottom:'40px'}}><h3 style={{fontSize:'16px', fontWeight:'700', borderBottom:'1px solid #e2e8f0', paddingBottom:'8px', marginBottom:'15px'}}>RESUMO TÁTICO</h3><div style={{fontSize:'14px', lineHeight:'1.6', color:'#334155', background:'#f1f5f9', padding:'20px', borderRadius:'8px'}}>{generatedPrompt || "Nenhuma análise gerada. Clique no botão AI antes de imprimir."}</div></div>
          <div>
             <h3 style={{fontSize:'16px', fontWeight:'700', borderBottom:'1px solid #e2e8f0', paddingBottom:'8px', marginBottom:'15px'}}>TIMELINE DA LUTA</h3>
             <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px'}}>
               <thead><tr style={{background:'#f8fafc', color:'#64748b', textAlign:'left'}}><th style={{padding:'10px', borderBottom:'1px solid #e2e8f0'}}>TEMPO</th><th style={{padding:'10px', borderBottom:'1px solid #e2e8f0'}}>CATEGORIA</th><th style={{padding:'10px', borderBottom:'1px solid #e2e8f0'}}>AÇÃO</th><th style={{padding:'10px', borderBottom:'1px solid #e2e8f0'}}>ATLETA</th><th style={{padding:'10px', borderBottom:'1px solid #e2e8f0'}}>RESULTADO</th></tr></thead>
               <tbody>{eventos.filter((e:any) => e.videoId === currentVideo.name).map((ev:any) => (<tr key={ev.id} style={{borderBottom:'1px solid #f1f5f9'}}><td style={{padding:'10px', fontFamily:'monospace'}}>{formatTimeVideo(ev.tempo)}</td><td style={{padding:'10px', fontSize:'11px', fontWeight:'700', color: ev.categoria==='PUNICAO'?'#ef4444':'#334155'}}>{ev.categoria}</td><td style={{padding:'10px'}}>{ev.especifico || ev.tipo}</td><td style={{padding:'10px'}}>{ev.atleta}</td><td style={{padding:'10px', fontWeight:'700'}}>{ev.resultado !== 'NADA' ? ev.resultado : '-'}</td></tr>))}</tbody>
             </table>
          </div>
        </div>
      )}

      {/* --- MODAL IA (EXISTENTE) --- */}
      {modalIA && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '600px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: `1px solid ${THEME.cardBorder}` }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}><h2 style={{margin:0, color: '#a855f7', fontSize:'20px', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700'}}><Bot size={24}/> RELATÓRIO INTELIGENTE</h2><button onClick={() => setModalIA(false)} style={{...btnStyle, background: THEME.cardBorder, color: THEME.textDim, padding:'8px', borderRadius:'50%'}}><X size={18}/></button></div>
            <div style={{background: THEME.surface, padding:'15px', borderRadius:'8px', border:`1px solid ${THEME.cardBorder}`, color: THEME.textDim, fontSize:'12px', fontFamily:'monospace', whiteSpace:'pre-wrap', maxHeight:'300px', overflowY:'auto', marginBottom:'20px'}}>{generatedPrompt}</div>
            <div style={{display:'flex', justifyContent:'flex-end'}}><button onClick={copyToClipboard} style={{...btnStyle, padding: '12px 24px', background: copied ? THEME.success : '#a855f7', color: 'white', fontSize:'14px'}}>{copied ? <><Check size={18}/> COPIADO!</> : <><Copy size={18}/> COPIAR PARA CHATGPT</>}</button></div>
          </div>
        </div>
      )}

      {/* --- MODAL REGISTRO --- */}
      {modalAberto && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
              <h2 style={{margin:0, color: punicaoMode ? THEME.danger : THEME.primary, fontSize:'20px', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700'}}>
                {punicaoMode ? (punicaoMode==='SHIDO' ? <><AlertTriangle size={24}/> REGISTRAR SHIDO</> : <><AlertOctagon size={24}/> REGISTRAR HANSOKU</>) : <><MousePointerClick size={24}/> {editingEventId ? 'EDITAR (VAR)' : 'REGISTRAR TÉCNICA'}</>}
              </h2>
              <button onClick={() => setModalAberto(false)} style={{...btnStyle, background: THEME.cardBorder, color: THEME.textDim, padding:'8px', borderRadius:'50%'}}><X size={18}/></button>
            </div>
            {punicaoMode ? (
              <div>
                <div style={{fontSize:'12px', color: THEME.textDim, marginBottom:'10px', textAlign:'center', textTransform:'uppercase'}}>Quem cometeu a infração?</div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px'}}>
                  <button onClick={() => confirmarPunicao('BRANCO')} style={{...btnStyle, padding:'30px', background: '#e2e8f0', color: '#0f172a', fontSize:'18px', flexDirection:'column'}}><div style={{width:'40px', height:'40px', borderRadius:'50%', background:'white', border:'4px solid #0f172a'}}></div>BRANCO</button>
                  <button onClick={() => confirmarPunicao('AZUL')} style={{...btnStyle, padding:'30px', background: THEME.primary, color: 'white', fontSize:'18px', flexDirection:'column'}}><div style={{width:'40px', height:'40px', borderRadius:'50%', background:'blue', border:'4px solid white'}}></div>AZUL</button>
                </div>
                <div style={{fontSize:'12px', color: THEME.textDim, marginBottom:'8px'}}>Motivo (Opcional):</div>
                <select style={{width:'100%', background: THEME.surface, color: THEME.text, border:`1px solid ${THEME.cardBorder}`, padding:'12px', borderRadius:'8px', fontSize: '14px', outline:'none'}} onChange={(e) => setMotivoShido(e.target.value)} value={motivoShido}>{DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}</select>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div><div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>QUEM?</div><div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:`1px solid ${THEME.cardBorder}`}}><button onClick={()=>setModalAtleta('BRANCO')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalAtleta==='BRANCO'?'#e2e8f0':THEME.surface, color:modalAtleta==='BRANCO'?'#0f172a':THEME.textDim}}>⚪</button><button onClick={()=>setModalAtleta('AZUL')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalAtleta==='AZUL'?THEME.primary:THEME.surface, color:modalAtleta==='AZUL'?'white':THEME.textDim}}>🔵</button></div></div>
                  <div><div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>LADO?</div><div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:`1px solid ${THEME.cardBorder}`}}><button onClick={()=>setModalLado('ESQUERDA')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalLado==='ESQUERDA'?THEME.warning:THEME.surface, color:modalLado==='ESQUERDA'?'#0f172a':THEME.textDim, fontSize:'11px'}}>ESQ</button><button onClick={()=>setModalLado('DIREITA')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalLado==='DIREITA'?THEME.success:THEME.surface, color:modalLado==='DIREITA'?'white':THEME.textDim, fontSize:'11px'}}>DIR</button></div></div>
                </div>

                <div style={{display:'flex', gap:'20px'}}>
                   <div style={{flex:2}}>
                      <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>TÉCNICA</div>
                      <div style={{position:'relative'}}><Search size={18} style={{position:'absolute', top:'13px', left:'14px', color: THEME.textDim}}/><input ref={inputRef} type="text" placeholder="Digite o nome..." value={modalNome} onChange={e=>setModalNome(e.target.value)} style={{width:'100%', padding:'12px 12px 12px 42px', background: THEME.surface, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px', fontSize:'15px', outline:'none', boxSizing:'border-box'}}/></div>
                      {sugestoes.length > 0 && (<div style={{position:'absolute', width:'100%', background: THEME.card, zIndex:100, border:`1px solid ${THEME.cardBorder}`, borderRadius:'8px', marginTop:'4px', boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.3)', overflow:'hidden'}}>{sugestoes.map(s=>(<div key={s} onClick={()=>{setModalNome(s); const exact=Object.keys(DB_GOLPES).find(k=>k.toLowerCase()===s.toLowerCase()); if(exact) setModalGrupo(DB_GOLPES[exact] as any); setSugestoes([])}} style={{padding:'12px', borderBottom:`1px solid ${THEME.cardBorder}`, cursor:'pointer', display:'flex', justifyContent:'space-between', fontSize:'14px'}}><span>{s}</span><span style={{fontSize:'10px', background:THEME.surface, padding:'2px 6px', borderRadius:'4px', color:THEME.textDim}}>{DB_GOLPES[Object.keys(DB_GOLPES).find(k=>k.toLowerCase()===s.toLowerCase())||'']}</span></div>))}</div>)}
                   </div>

                   {/* NOVO D-PAD DE DIREÇÃO */}
                   <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div style={{fontSize:'10px', color: THEME.textDim, marginBottom:'6px', fontWeight:'600'}}>DIREÇÃO</div>
                      <div style={{display:'grid', gridTemplateColumns:'24px 24px 24px', gridTemplateRows:'24px 24px 24px', gap:'2px'}}>
                          <div></div>
                          <button onClick={()=>setModalDirecao('FRENTE')} style={{background: modalDirecao==='FRENTE'?THEME.primary:THEME.surface, border:`1px solid ${THEME.cardBorder}`, borderRadius:'4px', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowUp size={14}/></button>
                          <div></div>
                          <button onClick={()=>setModalDirecao('ESQUERDA')} style={{background: modalDirecao==='ESQUERDA'?THEME.primary:THEME.surface, border:`1px solid ${THEME.cardBorder}`, borderRadius:'4px', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowLeft size={14}/></button>
                          <div style={{background:THEME.cardBorder, borderRadius:'50%', width:'10px', height:'10px', margin:'auto'}}></div>
                          <button onClick={()=>setModalDirecao('DIREITA')} style={{background: modalDirecao==='DIREITA'?THEME.primary:THEME.surface, border:`1px solid ${THEME.cardBorder}`, borderRadius:'4px', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowRight size={14}/></button>
                          <div></div>
                          <button onClick={()=>setModalDirecao('TRAS')} style={{background: modalDirecao==='TRAS'?THEME.primary:THEME.surface, border:`1px solid ${THEME.cardBorder}`, borderRadius:'4px', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowDown size={14}/></button>
                          <div></div>
                      </div>
                   </div>
                </div>

                <div style={{marginTop:'24px'}}>
                  <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>RESULTADO (SELECIONADO: {resultadoPreSelecionado || 'NENHUM'})</div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    <button onClick={() => confirmarEContinuar('NADA')} style={{...btnStyle, padding: '14px', background: resultadoPreSelecionado==='NADA'?THEME.text:THEME.cardBorder, color: resultadoPreSelecionado==='NADA'?'black':THEME.textDim}}>NADA (N)</button>
                    <button onClick={() => confirmarEContinuar('YUKO')} style={{...btnStyle, padding: '14px', background: resultadoPreSelecionado==='YUKO'?THEME.text:THEME.surface, border:`1px solid ${THEME.cardBorder}`, color: resultadoPreSelecionado==='YUKO'?'black':THEME.text}}>YUKO (Y)</button>
                    <button onClick={() => confirmarEContinuar('WAZA-ARI')} style={{...btnStyle, padding: '14px', background: resultadoPreSelecionado==='WAZA-ARI'?THEME.warning:`rgba(234, 179, 8, 0.1)`, border:`1px solid ${THEME.warning}`, color: resultadoPreSelecionado==='WAZA-ARI'?'black':THEME.warning}}>WAZA-ARI (W)</button>
                    <button onClick={() => confirmarEContinuar('IPPON')} style={{...btnStyle, padding: '14px', background: resultadoPreSelecionado==='IPPON'?THEME.text:THEME.surface, color: resultadoPreSelecionado==='IPPON'?'black':THEME.text, border:`2px solid ${THEME.text}`}}>IPPON (I)</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ÁREA PRINCIPAL */}
      <div className="no-print" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
        
        {/* COLUNA ESQUERDA */}
        <div style={{ flex: 3, width: '100%' }}>
          <div ref={playerContainerRef} style={{ ...cardStyle, position: isDataFullscreen ? 'fixed' : 'relative', top: isDataFullscreen ? 0 : 'auto', left: isDataFullscreen ? 0 : 'auto', width: isDataFullscreen ? '100vw' : '100%', height: isDataFullscreen ? '100vh' : 'auto', paddingTop: isDataFullscreen ? 0 : '56.25%', marginBottom: '20px', zIndex: isDataFullscreen ? 999 : 1 }}>
               
               {/* CAMADA DE DESENHO (CANVAS) */}
               {isDrawingMode && (
                 <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', zIndex:20, cursor: drawTool==='PEN' ? 'crosshair' : 'default'}}>
                   <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{width:'100%', height:'100%'}} />
                   {/* TOOLBAR FLUTUANTE */}
                   <div style={{position:'absolute', top:'10px', left:'10px', background:'rgba(0,0,0,0.8)', padding:'8px', borderRadius:'8px', display:'flex', gap:'8px', backdropFilter:'blur(4px)', border:`1px solid ${THEME.cardBorder}`}}>
                     <button onClick={() => setDrawTool('PEN')} style={{...btnStyle, background: drawTool==='PEN'?THEME.primary:'transparent', color:'white', padding:'6px'}}><PenTool size={18}/></button>
                     <button onClick={() => setDrawTool('ARROW')} style={{...btnStyle, background: drawTool==='ARROW'?THEME.primary:'transparent', color:'white', padding:'6px'}}><ArrowUpRight size={18}/></button>
                     <div style={{width:'1px', background:'white', opacity:0.2, margin:'0 4px'}}></div>
                     <button onClick={() => setDrawColor('#eab308')} style={{width:'20px', height:'20px', borderRadius:'50%', background:'#eab308', border: drawColor==='#eab308'?'2px solid white':'none', cursor:'pointer'}}></button>
                     <button onClick={() => setDrawColor('#ef4444')} style={{width:'20px', height:'20px', borderRadius:'50%', background:'#ef4444', border: drawColor==='#ef4444'?'2px solid white':'none', cursor:'pointer'}}></button>
                     <button onClick={() => setDrawColor('#3b82f6')} style={{width:'20px', height:'20px', borderRadius:'50%', background:'#3b82f6', border: drawColor==='#3b82f6'?'2px solid white':'none', cursor:'pointer'}}></button>
                     <button onClick={() => setDrawColor('#ffffff')} style={{width:'20px', height:'20px', borderRadius:'50%', background:'#ffffff', border: drawColor==='#ffffff'?'2px solid white':'none', cursor:'pointer'}}></button>
                     <div style={{width:'1px', background:'white', opacity:0.2, margin:'0 4px'}}></div>
                     <button onClick={clearCanvas} style={{...btnStyle, background:'transparent', color:THEME.danger, padding:'6px'}}><Eraser size={18}/></button>
                     <button onClick={salvarDesenhoNoLog} style={{...btnStyle, background:THEME.success, color:'white', padding:'6px'}}><Save size={18}/></button>
                     <button onClick={() => toggleDrawingMode()} style={{...btnStyle, background: THEME.surface, color:'white', padding:'6px'}}><X size={18}/></button>
                   </div>
                 </div>
               )}

               {/* OVERLAY DE FOCO (SÓ QUANDO NÃO ESTÁ DESENHANDO) */}
               {!isDrawingMode && <div onClick={toggleVideo} style={{position:'absolute', top:0, left:0, width:'100%', height:'85%', zIndex:10, cursor:'pointer'}}></div>}
               
               {currentVideo.type === 'YOUTUBE' ? (
                 <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}}>
                    <YouTube videoId={currentVideo.id} onReady={onReady} onStateChange={onStateChange} opts={{ width: '100%', height: '100%', playerVars: { autoplay: 0, controls: 1, rel: 0, showinfo: 0, ecver: 2, iv_load_policy: 3, modestbranding: 1, playsinline: 1 } }} style={{width:'100%', height:'100%'}}/>
                 </div>
               ) : (
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background:'black' }}><video ref={filePlayerRef} src={currentVideo.id} style={{width:'100%', height:'100%', objectFit:'contain'}} controls onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={onFileEnded} onLoadedMetadata={(e:any) => setDuration(e.target.duration)}/></div>
               )}
          </div>

          {/* BARRA DE CONTROLE (PRECISION DECK) */}
          <div style={{...cardStyle, padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px', borderTop: `4px solid ${THEME.primary}`}}>
             
             {/* ESQUERDA: VIDEO NAV */}
             <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <button onClick={videoAnterior} disabled={currentVideoIndex===0} style={{...btnStyle, background:'transparent', color:currentVideoIndex===0?THEME.cardBorder:THEME.textDim}}><SkipBack size={18}/></button>
                
                <div style={{display:'flex', alignItems:'center', background: THEME.surface, padding:'4px', borderRadius:'20px', border:`1px solid ${THEME.cardBorder}`, gap:'4px'}}>
                  <button onClick={() => stepFrame(-1)} style={{...btnStyle, background: 'transparent', color: THEME.textDim, padding:'8px'}} title="-0.05s"><ChevronLeft size={18}/></button>
                  
                  {/* BOTÃO PLAY REVISADO */}
                  <button onClick={toggleVideo} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', // GARANTE CENTRALIZAÇÃO
                    background: THEME.primary, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    width: '48px', height: '48px', padding: 0, // AUMENTADO E SEM PADDING
                    boxShadow: `0 0 15px ${THEME.primary}66`,
                    flexShrink: 0
                  }}>
                      {isPlaying ? 
                        <Pause size={24} color="white" fill="white" strokeWidth={2} /> : 
                        <Play size={24} color="white" fill="white" strokeWidth={2} style={{marginLeft:'4px'}} /> // Pequeno ajuste ótico
                      }
                  </button>

                  <button onClick={() => stepFrame(1)} style={{...btnStyle, background: 'transparent', color: THEME.textDim, padding:'8px'}} title="+0.05s"><ChevronRight size={18}/></button>
                </div>

                <button onClick={proximoVideo} disabled={currentVideoIndex===playlist.length-1} style={{...btnStyle, background:'transparent', color:currentVideoIndex===playlist.length-1?THEME.cardBorder:THEME.textDim}}><SkipForward size={18}/></button>
             </div>

             {/* CENTRO: LOOP */}
             <div style={{display:'flex', gap:'8px', background: THEME.surface, padding:'4px 8px', borderRadius:'8px', border: `1px solid ${loopRange ? THEME.warning : THEME.cardBorder}`}}>
                <button onClick={() => setLoopPoint('A')} style={{...btnStyle, color: loopRange?.start ? THEME.warning : THEME.textDim, fontSize:'10px'}}>A</button>
                <span style={{color:THEME.cardBorder}}>|</span>
                <button onClick={() => setLoopPoint('B')} style={{...btnStyle, color: loopRange?.end ? THEME.warning : THEME.textDim, fontSize:'10px'}}>B</button>
                {loopRange && <button onClick={clearLoop} style={{...btnStyle, color: THEME.danger}}><X size={12}/></button>}
             </div>

             {/* DIREITA: TOOLS */}
             <div style={{display:'flex', gap:'8px'}}>
                <button onClick={() => toggleDrawingMode()} style={{...btnStyle, background: isDrawingMode ? THEME.primary : 'transparent', color: isDrawingMode ? 'white' : THEME.textDim}}><PenTool size={16}/></button>
                <div style={{width:'1px', background: THEME.cardBorder, height:'20px', alignSelf:'center'}}></div>
                <button onClick={() => mudarVelocidade(0.25)} style={{...btnStyle, background: playbackRate===0.25 ? THEME.warning : 'transparent', color: playbackRate===0.25 ? 'black' : THEME.textDim, fontSize:'11px', fontWeight:'700'}}>0.25x</button>
                <button onClick={() => mudarVelocidade(1.0)} style={{...btnStyle, background: playbackRate===1.0 ? THEME.success : 'transparent', color: playbackRate===1.0 ? 'white' : THEME.textDim, fontSize:'11px', fontWeight:'700'}}>1.0x</button>
             </div>
          </div>

          <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
             <button onClick={() => iniciarRegistroRapido()} style={{...btnStyle, flex: 2, padding:'24px', background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryHover} 100%)`, color:'white', fontSize:'18px', boxShadow: `0 10px 20px -5px ${THEME.primary}66`}}>
               <CheckCircle size={28}/> WAZA
             </button>
             <button onClick={abrirKumiKata} style={{...btnStyle, flex: 1, padding:'24px', background: THEME.card, border: `1px solid ${THEME.cardBorder}`, color: '#f59e0b', fontSize:'16px'}}>
               <Hand size={24}/> KUMI-KATA
             </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <button onClick={toggleFightState} style={{...btnStyle, background: isFightActive ? THEME.danger : THEME.success, color:'white', padding:'16px'}}>
              {isFightActive ? <><Pause size={20}/> MATE (ESPAÇO)</> : <><Play size={20}/> HAJIME (ESPAÇO)</>}
            </button>
            <div style={{display:'flex', gap:'5px'}}>
               <button onClick={() => registrarFluxo('GOLDEN SCORE')} style={{...btnStyle, flex:1, background: THEME.warning, color:'#000', padding:'12px', fontSize:'13px'}}><Clock size={18}/> GOLDEN SCORE</button>
               <button onClick={() => registrarFluxo('SOREMADE')} style={{...btnStyle, flex:1, background: THEME.surface, border:`1px solid ${THEME.cardBorder}`, color:THEME.text, padding:'12px', fontSize:'13px'}}><Flag size={18}/> SOREMADE</button>
            </div>
          </div>

          <div style={{...cardStyle, padding:'16px'}}>
             <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'10px', fontWeight:'600', display:'flex', gap:'5px', alignItems:'center'}}><Keyboard size={14}/> I=IPPON, W=WAZA, Y=YUKO, N=NADA, S=SHIDO, H=HANSOKU</div>
             <div style={{display:'flex', gap:'8px'}}><select style={{flex:1, background: THEME.surface, color: THEME.text, border:`1px solid ${THEME.cardBorder}`, padding:'10px', borderRadius:'8px', fontSize: '13px', outline:'none'}} onChange={(e) => setMotivoShido(e.target.value)} value={motivoShido}>{DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}</select><button onClick={() => registrarPunicaoDireto('SHIDO', 'BRANCO')} style={{...btnStyle, width:'48px', background:'#e2e8f0', color:'#0f172a', fontSize:'16px'}}>⚪</button><button onClick={() => registrarPunicaoDireto('SHIDO', 'AZUL')} style={{...btnStyle, width:'48px', background: THEME.primary, color:'white', fontSize:'16px'}}>🔵</button></div>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="no-print" style={{ flex: 2, width: '100%', display:'flex', flexDirection:'column', gap:'20px' }}>
          
          {showPlaylist && (
            <div style={{ ...cardStyle, padding: '12px', maxHeight: '200px', overflowY: 'auto' }}>
              <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600', textTransform:'uppercase'}}>Fila de Reprodução</div>
              {playlist.map((item, index) => (
                <div key={index} onClick={() => selecionarVideo(index)} style={{ padding: '10px', cursor: 'pointer', background: index === currentVideoIndex ? `${THEME.primary}22` : 'transparent', borderRadius: '6px', marginBottom: '4px', display:'flex', justifyContent:'space-between', alignItems:'center', border: index===currentVideoIndex ? `1px solid ${THEME.primary}66` : '1px solid transparent' }}>
                  <div style={{display:'flex', alignItems:'center', gap:'8px', overflow:'hidden'}}>{item.type === 'YOUTUBE' ? <Video size={14} color={THEME.danger}/> : <Film size={14} color={THEME.primary}/>}<span style={{fontSize:'13px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color: index===currentVideoIndex ? THEME.primary : THEME.text}}>{item.name}</span></div>
                  <button onClick={(e) => removerDaPlaylist(index, e)} style={{background:'none', border:'none', color: THEME.textDim, cursor:'pointer'}}><X size={14}/></button>
                </div>
              ))}
            </div>
          )}

          {/* PLACAR */}
          <div style={{ ...cardStyle, padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: `1px solid ${THEME.cardBorder}` }}><div style={{fontSize: '14px', fontWeight: '700', color: THEME.text}}>⚪ BRANCO</div><div style={{display: 'flex', gap: '12px', marginTop: '8px'}}><div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.textDim}}>I</div><div style={{fontSize:'24px', fontWeight:'700'}}>{placar.branco.ippon}</div></div><div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.warning}}>W</div><div style={{fontSize:'24px', fontWeight:'700', color: THEME.warning}}>{placar.branco.waza}</div></div><div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.textDim}}>Y</div><div style={{fontSize:'24px', color: THEME.textDim}}>{placar.branco.yuko}</div></div><div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.danger}}>S</div><div style={{fontSize:'24px', color: THEME.danger}}>{placar.branco.shido}</div></div></div></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><div style={{fontSize: '10px', color: tempoDisplay.isGS ? THEME.warning : THEME.textDim, fontWeight: '700', letterSpacing:'1px'}}>{tempoDisplay.text}</div><div style={{fontSize: '32px', fontFamily: 'monospace', fontWeight: '700', color: tempoDisplay.isGS ? THEME.warning : 'white', letterSpacing:'-1px'}}>{tempoDisplay.time}</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: `1px solid ${THEME.cardBorder}` }}><div style={{fontSize: '14px', fontWeight: '700', color: THEME.primary}}>🔵 AZUL</div><div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
                <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.textDim}}>I</div><div style={{fontSize:'24px', fontWeight:'700'}}>{placar.azul.ippon}</div></div>
                <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.warning}}>W</div><div style={{fontSize:'24px', fontWeight:'700', color: THEME.warning}}>{placar.azul.waza}</div></div>
                <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.textDim}}>Y</div><div style={{fontSize:'24px', color: THEME.textDim}}>{placar.azul.yuko}</div></div>
                <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: THEME.danger}}>S</div><div style={{fontSize:'24px', color: THEME.danger}}>{placar.azul.shido}</div></div>
            </div></div>
          </div>

          {/* DASHBOARD RADAR DE ATAQUE (NOVO v20) */}
          <div style={{ ...cardStyle, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
               <div style={{fontSize:'12px', color: THEME.textDim, fontWeight:'600', display:'flex', alignItems:'center', gap:'6px'}}><Compass size={16}/> RADAR DE ATAQUE</div>
            </div>
            
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', padding:'10px'}}>
               <div style={{display:'grid', gridTemplateColumns:'40px 40px 40px', gridTemplateRows:'40px 40px 40px', gap:'5px'}}>
                   <div></div>
                   <div style={{display:'flex', alignItems:'center', justifyContent:'center', opacity: Math.max(0.2, radarStats.FRENTE)}}><ArrowUp size={24} color={THEME.primary}/></div>
                   <div></div>
                   
                   <div style={{display:'flex', alignItems:'center', justifyContent:'center', opacity: Math.max(0.2, radarStats.ESQUERDA)}}><ArrowLeft size={24} color={THEME.primary}/></div>
                   <div style={{background: THEME.surface, borderRadius:'50%', border:`2px solid ${THEME.cardBorder}`}}></div>
                   <div style={{display:'flex', alignItems:'center', justifyContent:'center', opacity: Math.max(0.2, radarStats.DIREITA)}}><ArrowRight size={24} color={THEME.primary}/></div>

                   <div></div>
                   <div style={{display:'flex', alignItems:'center', justifyContent:'center', opacity: Math.max(0.2, radarStats.TRAS)}}><ArrowDown size={24} color={THEME.primary}/></div>
                   <div></div>
               </div>
            </div>
            
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'10px', color: THEME.textDim}}>
               <span>⬆️ {(radarStats.FRENTE*100).toFixed(0)}%</span>
               <span>⬅️ {(radarStats.ESQUERDA*100).toFixed(0)}%</span>
               <span>➡️ {(radarStats.DIREITA*100).toFixed(0)}%</span>
               <span>⬇️ {(radarStats.TRAS*100).toFixed(0)}%</span>
            </div>
          </div>

          {/* DASHBOARD CLASSICO */}
          <div style={{ ...cardStyle, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{fontSize:'12px', color: THEME.textDim, fontWeight:'600', display:'flex', alignItems:'center', gap:'6px'}}><BarChart2 size={16}/> PERFORMANCE</div>
            <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', color: THEME.textDim}}><span>⚪ {stats.vol.branco}</span><span>🔵 {stats.vol.azul}</span></div>
              <div style={{display:'flex', height:'8px', borderRadius:'4px', overflow:'hidden', background: THEME.surface}}><div style={{width: `${(stats.vol.branco / (stats.vol.branco + stats.vol.azul || 1)) * 100}%`, background: 'white'}}></div><div style={{flex:1, background: THEME.primary}}></div></div>
            </div>
            <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
              <SimpleDonut data={stats.groupData}/>
              <div style={{flex:1, display:'flex', flexDirection:'column', gap:'4px'}}>{stats.groupData.slice(0,4).map((g:any) => (<div key={g.name} style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'11px'}}><div style={{width:'8px', height:'8px', borderRadius:'50%', background:g.color}}></div><span style={{color:THEME.text, flex:1}}>{g.name}</span><span style={{color:THEME.textDim}}>{g.val}</span></div>))}</div>
            </div>
          </div>

          {/* LOG */}
          <div style={{ flex: 1, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px', alignItems:'center' }}>
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}><h3 style={{margin:0, fontSize:'13px', color: THEME.textDim, fontWeight:'600'}}>TIMELINE</h3><Keyboard size={12} color={THEME.textDim}/></div>
              <button onClick={()=>setEventos(eventos.filter((e:any) => e.videoId !== currentVideo.name))} style={{background:'none', border:'none', color: THEME.textDim, cursor:'pointer'}}><Trash2 size={16}/></button>
            </div>
            <div style={{ ...cardStyle, flex:1, padding: '8px', minHeight: '200px', overflowY: 'auto', background: THEME.surface }}>
              {eventos.filter(e => e.videoId === currentVideo.name).map((ev: any) => (
                <div key={ev.id} style={{ 
                  padding: '10px 12px', marginBottom: '6px', borderRadius: '8px', 
                  background: THEME.card, borderLeft: `4px solid ${ev.corTecnica || getCorBorda(ev)}`, 
                  display:'flex', alignItems:'center', justifyContent:'space-between', fontSize: '13px', border: `1px solid ${THEME.cardBorder}`
                }}>
                  <div onClick={() => irParaEvento(ev)} style={{cursor:'pointer', flex:1}}>
                    <div style={{display:'flex', gap:'8px', fontSize:'11px', color: THEME.textDim, alignItems:'center', marginBottom:'4px'}}>
                      <span style={{fontFamily:'monospace', display:'flex', alignItems:'center', gap:'4px'}}><Rewind size={10}/> {formatTimeVideo(ev.tempo)}</span>
                      <span style={{color: THEME.warning, fontWeight:'700', background:`${THEME.warning}22`, padding:'1px 5px', borderRadius:'3px'}}>
                        {ev.tempo >= fightStartTime ? formatTimeVideo(ev.tempo - fightStartTime) : '-'}
                      </span>
                    </div>
                    <div style={{fontWeight:'600', color: ev.atleta === 'AZUL' ? THEME.primary : (ev.categoria==='FLUXO' ? THEME.textDim : 'white'), fontSize: '14px'}}>
                      {ev.categoria === 'ANALISE' && <span style={{marginRight:'5px'}}>🖌️</span>}
                      {ev.categoria === 'KUMI-KATA' && <span style={{marginRight:'5px'}}>✋</span>}
                      {ev.especifico || ev.tipo}
                      {ev.direcao && <span style={{marginLeft:'5px', fontSize:'10px', background: THEME.surface, padding:'2px 4px', borderRadius:'3px'}}>{ev.direcao === 'FRENTE' ? '⬆️' : ev.direcao === 'TRAS' ? '⬇️' : ev.direcao === 'ESQUERDA' ? '⬅️' : '➡️'}</span>}
                    </div>
                    {ev.resultado && ev.resultado !== 'NADA' && <div style={{marginTop:'4px', background: ev.resultado==='IPPON'?'white':THEME.warning, color: 'black', display:'inline-block', padding:'2px 6px', borderRadius:'4px', fontSize:'10px', fontWeight:'800'}}>{ev.resultado}</div>}
                  </div>
                  <div style={{display:'flex', gap:'5px'}}>
                    {ev.categoria === 'ANALISE' ? (
                       <button onClick={() => irParaEvento(ev)} style={{background:'none', border:'none', color: THEME.textDim, cursor:'pointer'}}><Eye size={14}/></button>
                    ) : (
                       <button onClick={() => editarEvento(ev)} style={{background:'none', border:'none', color: THEME.textDim, cursor:'pointer'}}><Edit2 size={14}/></button>
                    )}
                    <button onClick={() => setEventos(eventos.filter((e:any) => e.id !== ev.id))} style={{background:'none', border:'none', color: THEME.cardBorder, cursor:'pointer'}}><X size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}