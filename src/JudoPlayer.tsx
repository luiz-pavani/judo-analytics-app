import React, { useRef, useState, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';
import { 
  Play, Pause, Trash2, Download, Video, Film, List, X, 
  Clock, Flag, CheckCircle, ChevronLeft, ChevronRight, Search, 
  MousePointerClick, Gauge, Youtube, Rewind, BarChart2, PieChart,
  Edit2, Bot, Copy, Check, Keyboard, AlertTriangle, AlertOctagon,
  PenTool, ArrowUpRight, Eraser, Palette, Maximize, Save, Eye,
  FileJson, UploadCloud, Printer, SkipBack, SkipForward, Hand,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Compass, Trophy, Layers, Tornado,
  MapPin, Grid, Activity, Triangle, PlayCircle, Users, UserPlus, MonitorPlay
} from 'lucide-react';

// --- DESIGN SYSTEM (v27.1) ---
const THEME = {
  bg: '#020617', // Slate 950
  card: '#1e293b', // Slate 800
  cardBorder: '#334155', // Slate 700
  text: '#f8fafc',
  textDim: '#94a3b8',
  primary: '#3b82f6', // Blue 500
  primaryGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  danger: '#ef4444', 
  success: '#10b981', 
  warning: '#eab308',
  newaza: '#06b6d4', // Cyan 500
  kumi: '#f59e0b', // Amber 500
  tatamiCenter: '#facc15', 
  tatamiDanger: '#ef4444',
  neutral: '#64748b'
};

// --- GLOBAL STYLES ---
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@500;700&display=swap');
  
  body {
    font-family: 'Inter', sans-serif;
    background-color: ${THEME.bg};
    color: ${THEME.text};
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${THEME.cardBorder}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${THEME.neutral}; }
  
  .glass-panel {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .glow-hover:hover {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
    border-color: ${THEME.primary};
  }
  @media print {
    @page { size: A4; margin: 10mm; }
    body { background: white !important; color: black !important; }
    .no-print { display: none !important; }
    .printable-report { display: block !important; position: static !important; width: 100% !important; height: auto !important; background: white !important; color: black !important; padding: 0 !important; overflow: visible !important; }
  }
`;

// --- BANCO DE DADOS ---
const DB_SHIDOS = ["Passividade", "Falso Ataque", "Saída de Área", "Postura Defensiva", "Evitar Pegada", "Pegada Ilegal", "Dedos na manga", "Desarrumar Gi", "Outros"];
const DB_PEGADAS = ["Gola", "Manga", "Gola Alta", "Costas", "Faixa", "Pistola", "Cruzada", "Sem Pegada"];
const DB_FASES = ["Eliminatória", "Oitavas", "Quartas", "Semi-Final", "Final", "Repescagem", "Bronze"];

const DB_NW_ACOES_TOP = ["Virada", "Passagem de Guarda", "Ataque Osaekomi/Shime/Kansetsu", "Domínio pelas costas"];
const DB_NW_ACOES_BOTTOM = ["Guarda", "Raspagem", "Tentativa Finalização", "Escape"];
const DB_NW_DESFECHOS = ["Mate", "Osaekomi ippon", "Osaekomi waza-ari", "Osaekomi yuko", "Osaekomi nada", "Ippon", "Progressão"];

const DB_NE_WAZA_LIST: Record<string, string> = {
  "kesa-gatame": "OSAEKOMI", "kuzure-kesa-gatame": "OSAEKOMI", "ushiro-kesa-gatame": "OSAEKOMI", "kata-gatame": "OSAEKOMI", "kami-shihō-gatame": "OSAEKOMI", "kuzure-kami-shihō-gatame": "OSAEKOMI", "yoko-shihō-gatame": "OSAEKOMI", "tate-shihō-gatame": "OSAEKOMI", "uki-gatame": "OSAEKOMI", "ura-gatame": "OSAEKOMI",
  "nami-jūji-jime": "SHIME", "gyaku-jūji-jime": "SHIME", "kata-jūji-jime": "SHIME", "hadaka-jime": "SHIME", "okuri-eri-jime": "SHIME", "kataha-jime": "SHIME", "katate-jime": "SHIME", "ryōte-jime": "SHIME", "sode-guruma-jime": "SHIME", "tsukkomi-jime": "SHIME", "sankaku-jime": "SHIME", "dō-jime": "SHIME",
  "ude-garami": "KANSETSU", "ude-hishigi-jūji-gatame": "KANSETSU", "ude-hishigi-ude-gatame": "KANSETSU", "ude-hishigi-hiza-gatame": "KANSETSU", "ude-hishigi-waki-gatame": "KANSETSU", "ude-hishigi-hara-gatame": "KANSETSU", "ude-hishigi-ashi-gatame": "KANSETSU", "ude-hishigi-te-gatame": "KANSETSU", "ude-hishigi-sankaku-gatame": "KANSETSU", "ashi-garami": "KANSETSU"
};

const DB_GOLPES: Record<string, string> = {
  "seoi-nage": "TE-WAZA", "ippon-seoi-nage": "TE-WAZA", "seoi-otoshi": "TE-WAZA", "tai-otoshi": "TE-WAZA", "kata-guruma": "TE-WAZA", "sukui-nage": "TE-WAZA", "obi-otoshi": "TE-WAZA", "uki-otoshi": "TE-WAZA", "sumi-otoshi": "TE-WAZA", "yama-arashi": "TE-WAZA", "obi-tori-gaeshi": "TE-WAZA", "morote-gari": "TE-WAZA", "kuchiki-taoshi": "TE-WAZA", "kibisu-gaeshi": "TE-WAZA", "uchi-mata-sukashi": "TE-WAZA", "kouchi-gaeshi": "TE-WAZA",
  "uki-goshi": "KOSHI-WAZA", "ō-goshi": "KOSHI-WAZA", "koshi-guruma": "KOSHI-WAZA", "tsurikomi-goshi": "KOSHI-WAZA", "sode-tsurikomi-goshi": "KOSHI-WAZA", "harai-goshi": "KOSHI-WAZA", "tsuri-goshi": "KOSHI-WAZA", "hane-goshi": "KOSHI-WAZA", "utsuri-goshi": "KOSHI-WAZA", "ushiro-goshi": "KOSHI-WAZA",
  "de-ashi-harai": "ASHI-WAZA", "hiza-guruma": "ASHI-WAZA", "sasae-tsurikomi-ashi": "ASHI-WAZA", "ō-soto-gari": "ASHI-WAZA", "ō-uchi-gari": "ASHI-WAZA", "ko-soto-gari": "ASHI-WAZA", "ko-uchi-gari": "ASHI-WAZA", "okuri-ashi-harai": "ASHI-WAZA", "uchi-mata": "ASHI-WAZA", "ko-soto-gake": "ASHI-WAZA", "ashi-guruma": "ASHI-WAZA", "harai-tsurikomi-ashi": "ASHI-WAZA", "ō-guruma": "ASHI-WAZA", "ō-soto-guruma": "ASHI-WAZA", "ō-soto-otoshi": "ASHI-WAZA", "tsubame-gaeshi": "ASHI-WAZA", "ō-soto-gaeshi": "ASHI-WAZA", "ō-uchi-gaeshi": "ASHI-WAZA", "hane-goshi-gaeshi": "ASHI-WAZA", "harai-goshi-gaeshi": "ASHI-WAZA", "uchi-mata-gaeshi": "ASHI-WAZA",
  "tomoe-nage": "SUTEMI-WAZA", "sumi-gaeshi": "SUTEMI-WAZA", "hikikomi-gaeshi": "SUTEMI-WAZA", "tawara-gaeshi": "SUTEMI-WAZA", "ura-nage": "SUTEMI-WAZA", "yoko-otoshi": "SUTEMI-WAZA", "tani-otoshi": "SUTEMI-WAZA", "hane-makikomi": "SUTEMI-WAZA", "soto-makikomi": "SUTEMI-WAZA", "uchi-makikomi": "SUTEMI-WAZA", "uki-waza": "SUTEMI-WAZA", "yoko-wakare": "SUTEMI-WAZA", "yoko-guruma": "SUTEMI-WAZA", "yoko-gake": "SUTEMI-WAZA", "daki-wakare": "SUTEMI-WAZA", "ō-soto-makikomi": "SUTEMI-WAZA", "uchi-mata-makikomi": "SUTEMI-WAZA", "harai-makikomi": "SUTEMI-WAZA", "ko-uchi-makikomi": "SUTEMI-WAZA", "kani-basami": "SUTEMI-WAZA", "kawazu-gake": "SUTEMI-WAZA"
};

const CORES_GRUPOS: any = { "TE-WAZA": "#6366f1", "KOSHI-WAZA": "#10b981", "ASHI-WAZA": "#f59e0b", "SUTEMI-WAZA": "#ef4444", "OSAEKOMI-WAZA": "#3b82f6", "SHIME-WAZA": "#a855f7", "KANSETSU-WAZA": "#ec4899" };

// --- TYPES ---
type PlaylistItem = { id: string; type: 'YOUTUBE' | 'FILE'; name: string; };
type LoopRange = { start: number; end: number } | null;
type VideoMetadata = { eventName: string; date: string; category: string; phase: string; location: string; whiteId?: string; blueId?: string };
type Coordinate = { x: number; y: number };
type Athlete = { id: string; name: string; country: string; club: string };

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

  // --- STATE: ACTION PLAYER ---
  const [playlistMode, setPlaylistMode] = useState(false);
  const [playlistQueue, setPlaylistQueue] = useState<any[]>([]);
  const [playlistQueueIndex, setPlaylistQueueIndex] = useState(0);

  // --- STATE: ATHLETES ---
  const [athletes, setAthletes] = useState<Athlete[]>(() => {
      try { return JSON.parse(localStorage.getItem('smaartpro_athletes_v27') || '[]'); } catch { return []; }
  });
  const [modalAthletes, setModalAthletes] = useState(false);
  const [newAthleteName, setNewAthleteName] = useState('');
  const [newAthleteCountry, setNewAthleteCountry] = useState('');
  const [newAthleteClub, setNewAthleteClub] = useState('');

  // --- STATE: METADATA ---
  const [metadataMap, setMetadataMap] = useState<Record<string, VideoMetadata>>({}); 
  const [modalMetadata, setModalMetadata] = useState(false);
  const [metaEvent, setMetaEvent] = useState('');
  const [metaDate, setMetaDate] = useState('');
  const [metaCat, setMetaCat] = useState('');
  const [metaPhase, setMetaPhase] = useState('');
  const [metaWhiteId, setMetaWhiteId] = useState('');
  const [metaBlueId, setMetaBlueId] = useState('');

  // --- DRAWING STATE ---
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawTool, setDrawTool] = useState<'PEN' | 'ARROW' | 'ANGLE'>('PEN');
  const [drawColor, setDrawColor] = useState('#eab308');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{x:number, y:number} | null>(null);
  const [currentStrokes, setCurrentStrokes] = useState<any[]>([]); 
  const [tempPoints, setTempPoints] = useState<any[]>([]);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  // --- UI STATE ---
  const [modalAberto, setModalAberto] = useState(false);
  const [modalIA, setModalIA] = useState(false);
  const [modalHelp, setModalHelp] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState('TODOS');

  // --- STATE: MODALS DATA ---
  const [modalKumi, setModalKumi] = useState(false);
  const [kumiAtleta, setKumiAtleta] = useState('BRANCO');
  const [kumiBase, setKumiBase] = useState('Ai-yotsu');
  const [kumiDir, setKumiDir] = useState('Gola');
  const [kumiEsq, setKumiEsq] = useState('Manga');

  const [modalNeWaza, setModalNeWaza] = useState(false);
  const [nwAtleta, setNwAtleta] = useState('BRANCO');
  const [nwEntrada, setNwEntrada] = useState('DIRETA'); 
  const [nwPosicao, setNwPosicao] = useState('POR CIMA'); 
  const [nwAcao, setNwAcao] = useState(DB_NW_ACOES_TOP[0]);
  const [nwTecnica, setNwTecnica] = useState('');
  const [nwDesfecho, setNwDesfecho] = useState('Mate');

  const [modalAtleta, setModalAtleta] = useState('BRANCO');
  const [modalLado, setModalLado] = useState('DIREITA');
  const [modalNome, setModalNome] = useState('');
  const [modalGrupo, setModalGrupo] = useState('TE-WAZA');
  const [modalDirecao, setModalDirecao] = useState('FRENTE');
  const [modalXY, setModalXY] = useState<Coordinate | null>(null);
  const [motivoShido, setMotivoShido] = useState(DB_SHIDOS[0]);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [tempoCapturado, setTempoCapturado] = useState(0);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [resultadoPreSelecionado, setResultadoPreSelecionado] = useState<string | null>(null);
  const [punicaoMode, setPunicaoMode] = useState<string | null>(null);

  // --- DB ---
  const [eventos, setEventos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('smaartpro_db_v27') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('smaartpro_db_v27', JSON.stringify(eventos)); }, [eventos]);
  
  useEffect(() => {
      const savedMeta = localStorage.getItem('smaartpro_meta_v27');
      if (savedMeta) setMetadataMap(JSON.parse(savedMeta));
  }, []);
  useEffect(() => { localStorage.setItem('smaartpro_meta_v27', JSON.stringify(metadataMap)); }, [metadataMap]);
  useEffect(() => { localStorage.setItem('smaartpro_athletes_v27', JSON.stringify(athletes)); }, [athletes]);

  useEffect(() => {
    if (modalNome.length > 1) {
      const matches = Object.keys(DB_GOLPES).filter(k => k.toLowerCase().includes(modalNome.toLowerCase()));
      setSugestoes(matches.slice(0, 5));
      const exact = matches.find(k => k.toLowerCase() === modalNome.toLowerCase());
      if (exact) setModalGrupo(DB_GOLPES[exact] as any);
    } else {
      setSugestoes([]);
    }
  }, [modalNome]);

  // ==================================================================================
  // 1. CÁLCULOS
  // ==================================================================================
  const currentVideo = useMemo(() => playlist[currentVideoIndex] || { id: '', type: 'YOUTUBE', name: '' }, [playlist, currentVideoIndex]);
  const currentMetadata = useMemo(() => metadataMap[currentVideo.id] || { eventName: 'Evento não definido', date: new Date().toLocaleDateString(), category: 'Geral', phase: 'Luta', location: '' }, [metadataMap, currentVideo.id]);
  
  const athleteWhite = useMemo(() => athletes.find(a => a.id === currentMetadata.whiteId), [athletes, currentMetadata]);
  const athleteBlue = useMemo(() => athletes.find(a => a.id === currentMetadata.blueId), [athletes, currentMetadata]);
  const nameWhite = athleteWhite ? `${athleteWhite.name} (${athleteWhite.country})` : 'BRANCO';
  const nameBlue = athleteBlue ? `${athleteBlue.name} (${athleteBlue.country})` : 'AZUL';
  const labelWhite = athleteWhite ? athleteWhite.name.split(' ')[0].toUpperCase() : 'BRANCO';
  const labelBlue = athleteBlue ? athleteBlue.name.split(' ')[0].toUpperCase() : 'AZUL';

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
      if (ev.categoria === 'NE-WAZA') { 
          if (ev.resultado.includes('ippon') || ev.resultado.includes('Ippon')) q.ippon++;
          if (ev.resultado.includes('waza-ari')) q.waza++;
          if (ev.resultado.includes('yuko')) q.yuko++;
      }
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
    return { groupData, vol };
  }, [eventos, currentVideo.name]);

  const radarStats = useMemo(() => {
     const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'TECNICA');
     const calcRadar = (atleta: string) => {
         const evsAtleta = evs.filter((e:any) => e.atleta === atleta);
         const counts: any = { FRENTE: 0, TRAS: 0, ESQUERDA: 0, DIREITA: 0 };
         evsAtleta.forEach((e:any) => { if(e.direcao) counts[e.direcao] = (counts[e.direcao] || 0) + 1; });
         const total = evsAtleta.length || 1;
         return { FRENTE: (counts.FRENTE / total), TRAS: (counts.TRAS / total), ESQUERDA: (counts.ESQUERDA / total), DIREITA: (counts.DIREITA / total) };
     };
     return { white: calcRadar('BRANCO'), blue: calcRadar('AZUL') };
  }, [eventos, currentVideo.name]);

  const momentumData = useMemo(() => {
    const buckets: any = {};
    const evs = eventos.filter((e:any) => e.videoId === currentVideo.name && (e.categoria === 'TECNICA' || e.categoria === 'NE-WAZA'));
    evs.forEach((e:any) => {
        const minuto = Math.floor(e.tempo / 60);
        if(!buckets[minuto]) buckets[minuto] = { branco: 0, azul: 0 };
        if(e.atleta === 'BRANCO') buckets[minuto].branco++;
        if(e.atleta === 'AZUL') buckets[minuto].azul++;
    });
    const maxMin = Math.ceil(duration / 60) || 1;
    const result = [];
    for(let i=0; i<maxMin; i++) { result.push({ min: i, ...buckets[i] || { branco: 0, azul: 0 } }); }
    return result;
  }, [eventos, currentVideo.name, duration]);

  const filteredEventos = useMemo(() => {
      const vidEvents = eventos.filter((e:any) => e.videoId === currentVideo.name);
      if (activeFilter === 'TODOS') return vidEvents;
      if (activeFilter === 'PONTOS') return vidEvents.filter((e:any) => (e.categoria==='TECNICA' && e.resultado !== 'NADA') || (e.categoria==='NE-WAZA' && e.resultado!=='Mate'));
      if (activeFilter === 'PUNICAO') return vidEvents.filter((e:any) => e.categoria === 'PUNICAO');
      if (activeFilter === 'NE-WAZA') return vidEvents.filter((e:any) => e.categoria === 'NE-WAZA');
      if (activeFilter === 'BRANCO') return vidEvents.filter((e:any) => e.atleta === 'BRANCO');
      if (activeFilter === 'AZUL') return vidEvents.filter((e:any) => e.atleta === 'AZUL');
      return vidEvents;
  }, [eventos, currentVideo.name, activeFilter]);

  // ==================================================================================
  // 2. FUNÇÕES
  // ==================================================================================
  
  const formatTimeVideo = (s: number) => `${Math.floor(Math.abs(s)/60)}:${Math.floor(Math.abs(s)%60).toString().padStart(2,'0')}`;

  const saveAthlete = () => { if(!newAthleteName) return; const newAthlete = { id: Date.now().toString(), name: newAthleteName, country: newAthleteCountry || '???', club: newAthleteClub }; setAthletes([...athletes, newAthlete]); setNewAthleteName(''); setNewAthleteCountry(''); setNewAthleteClub(''); };
  const deleteAthlete = (id: string) => { setAthletes(athletes.filter(a => a.id !== id)); };

  const openMetadataModal = () => { setMetaEvent(currentMetadata.eventName); setMetaDate(currentMetadata.date); setMetaCat(currentMetadata.category); setMetaPhase(currentMetadata.phase); setMetaWhiteId(currentMetadata.whiteId || ''); setMetaBlueId(currentMetadata.blueId || ''); setModalMetadata(true); };
  const saveMetadata = () => { const newMeta = { eventName: metaEvent, date: metaDate, category: metaCat, phase: metaPhase, location: '', whiteId: metaWhiteId, blueId: metaBlueId }; setMetadataMap(prev => ({ ...prev, [currentVideo.id]: newMeta })); setModalMetadata(false); };
  const applyMetadataToAll = () => { if (confirm("Aplicar estes dados para TODOS os vídeos da playlist?")) { const newMap = { ...metadataMap }; const commonMeta = { eventName: metaEvent, date: metaDate, category: metaCat, phase: metaPhase, location: '', whiteId: metaWhiteId, blueId: metaBlueId }; playlist.forEach(vid => { newMap[vid.id] = commonMeta; }); setMetadataMap(newMap); setModalMetadata(false); alert("Dados replicados!"); } };

  const iniciarPlaylistPlayer = () => { const queue = filteredEventos.sort((a:any, b:any) => a.tempo - b.tempo); if (queue.length === 0) { alert("Nenhum evento filtrado para assistir."); return; } setPlaylistQueue(queue); setPlaylistQueueIndex(0); setPlaylistMode(true); const startTime = Math.max(0, queue[0].tempo - 4); if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current.seekTo(startTime, true); else filePlayerRef.current.currentTime = startTime; setIsPlaying(true); if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current.playVideo(); else filePlayerRef.current.play(); };
  const pararPlaylistPlayer = () => { setPlaylistMode(false); setPlaylistQueue([]); };

  const registrarFluxo = (tipo: string) => setEventos((prev: any[]) => [{ id: Date.now(), videoId: currentVideo.name, tempo: currentTime, categoria: 'FLUXO', tipo, atleta: '-', lado: '-', corTecnica: THEME.neutral }, ...prev]);
  const registrarPunicaoDireto = (tipo: string, atleta: string) => setEventos((prev: any[]) => [{ id: Date.now(), videoId: currentVideo.name, tempo: currentTime, categoria: 'PUNICAO', tipo, especifico: motivoShido, atleta, lado: '-', corTecnica: THEME.warning }, ...prev]);
  
  const abrirKumiKata = () => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); setTempoCapturado(currentTime); setKumiAtleta('BRANCO'); setModalKumi(true); };
  const salvarKumiKata = () => { const detalhe = `${kumiBase} (D:${kumiDir} / E:${kumiEsq})`; const dados = { id: Date.now(), videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'KUMI-KATA', tipo: 'PEGADA', especifico: detalhe, atleta: kumiAtleta, lado: '-', corTecnica: kumiAtleta === 'AZUL' ? THEME.primary : '#ffffff' }; setEventos((prev:any) => [dados, ...prev]); setModalKumi(false); if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.playVideo(); else filePlayerRef.current?.play(); };

  const abrirNeWaza = () => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); setTempoCapturado(currentTime); setNwAtleta('BRANCO'); setNwEntrada('DIRETA'); setNwPosicao('POR CIMA'); setNwAcao(DB_NW_ACOES_TOP[0]); setNwTecnica(''); setNwDesfecho('Mate'); setModalNeWaza(true); };
  const salvarNeWaza = () => { const detalheTecnica = nwTecnica ? ` (${nwTecnica})` : ''; const detalhe = `${nwEntrada} | ${nwPosicao} > ${nwAcao}${detalheTecnica}`; const dados = { id: Date.now(), videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'NE-WAZA', tipo: nwPosicao, especifico: detalhe, resultado: nwDesfecho, atleta: nwAtleta, lado: '-', corTecnica: THEME.newaza }; setEventos((prev:any) => [dados, ...prev]); setModalNeWaza(false); if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.playVideo(); else filePlayerRef.current?.play(); };

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
  const confirmarEContinuar = (resultado: string) => { const dados = { videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'TECNICA', grupo: modalGrupo, especifico: modalNome || "Técnica Geral", atleta: modalAtleta, lado: modalLado, corTecnica: CORES_GRUPOS[modalGrupo], resultado: resultado, direcao: modalDirecao, coordenadas: modalXY }; salvarEFechar(dados); };
  const confirmarPunicao = (atleta: string) => { const dados = { videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'PUNICAO', tipo: punicaoMode, especifico: motivoShido, atleta, lado: '-', corTecnica: THEME.warning }; salvarEFechar(dados); };
  const iniciarRegistroRapido = (resultadoInicial?: string) => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); let t = currentTime; if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) t = youtubePlayerRef.current.getCurrentTime(); else if(filePlayerRef.current) t = filePlayerRef.current.currentTime; setEditingEventId(null); setTempoCapturado(t); setModalAtleta('BRANCO'); setModalNome(''); setModalDirecao('FRENTE'); setModalXY(null); setPunicaoMode(null); setResultadoPreSelecionado(resultadoInicial || null); setModalAberto(true); setTimeout(() => inputRef.current?.focus(), 100); };
  const iniciarRegistroPunicaoTeclado = (tipo: 'SHIDO' | 'HANSOKU') => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); let t = currentTime; if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) t = youtubePlayerRef.current.getCurrentTime(); else if(filePlayerRef.current) t = filePlayerRef.current.currentTime; setEditingEventId(null); setTempoCapturado(t); setPunicaoMode(tipo); setModalAberto(true); };
  const editarEvento = (ev: any) => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current.pauseVideo(); else filePlayerRef.current.pause(); setEditingEventId(ev.id); setTempoCapturado(ev.tempo); setModalAtleta(ev.atleta); setModalLado(ev.lado); if (ev.categoria === 'PUNICAO') { setPunicaoMode(ev.tipo); setMotivoShido(ev.especifico); } else { setPunicaoMode(null); setModalNome(ev.especifico === "Técnica Geral" ? "" : ev.especifico); setModalGrupo(ev.grupo || 'TE-WAZA'); setResultadoPreSelecionado(ev.resultado); setModalDirecao(ev.direcao || 'FRENTE'); setModalXY(ev.coordenadas || null); } setModalAberto(true); };
  
  const handleTatamiClick = (e: React.MouseEvent) => { const rect = e.currentTarget.getBoundingClientRect(); const x = ((e.clientX - rect.left) / rect.width) * 100; const y = ((e.clientY - rect.top) / rect.height) * 100; setModalXY({ x, y }); };
  const clearCanvas = () => { if (canvasRef.current) { const ctx = canvasRef.current.getContext('2d'); if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); } setCurrentStrokes([]); };
  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) => { const headLength = 20; const angle = Math.atan2(toY - fromY, toX - fromX); ctx.beginPath(); ctx.moveTo(fromX, fromY); ctx.lineTo(toX, toY); ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.moveTo(toX, toY); ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6)); ctx.moveTo(toX, toY); ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), y - headLength * Math.sin(angle + Math.PI / 6)); ctx.stroke(); };
  const calculateAngle = (p1: any, p2: any, p3: any) => { const p12 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)); const p23 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2)); const p13 = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2)); const radians = Math.acos((p12*p12 + p23*p23 - p13*p13) / (2 * p12 * p23)); return Math.round(radians * 180 / Math.PI); };
  const redrawStrokes = (strokesToDraw: any[]) => { if (!canvasRef.current) return; const ctx = canvasRef.current.getContext('2d'); if (!ctx) return; ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); strokesToDraw.forEach(stroke => { ctx.strokeStyle = stroke.color; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (stroke.tool === 'PEN') { ctx.beginPath(); if (stroke.points.length > 0) { ctx.moveTo(stroke.points[0].x, stroke.points[0].y); stroke.points.forEach((p:any) => ctx.lineTo(p.x, p.y)); } ctx.stroke(); } else if (stroke.tool === 'ARROW') { if (stroke.points.length >= 2) { const start = stroke.points[0]; const end = stroke.points[stroke.points.length - 1]; drawArrow(ctx, start.x, start.y, end.x, end.y, stroke.color); } } else if (stroke.tool === 'ANGLE') { if (stroke.points.length === 3) { const [p1, p2, p3] = stroke.points; ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.stroke(); ctx.beginPath(); ctx.arc(p2.x, p2.y, 20, 0, 2 * Math.PI); ctx.stroke(); const angle = calculateAngle(p1, p2, p3); ctx.font = "bold 20px Arial"; ctx.fillStyle = stroke.color; ctx.fillText(`${angle}°`, p2.x + 25, p2.y); } } }); };
  const toggleDrawingMode = (loadStrokes?: any[]) => { const newState = !isDrawingMode; setIsDrawingMode(newState); if (newState) { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); if (playerContainerRef.current) { if (playerContainerRef.current.requestFullscreen) { playerContainerRef.current.requestFullscreen().catch(() => setIsDataFullscreen(true)); } else { setIsDataFullscreen(true); } } setTimeout(() => { if(canvasRef.current && canvasRef.current.parentElement) { canvasRef.current.width = canvasRef.current.parentElement.clientWidth; canvasRef.current.height = canvasRef.current.parentElement.clientHeight; if (loadStrokes && loadStrokes.length > 0) { setCurrentStrokes(loadStrokes); redrawStrokes(loadStrokes); } } }, 100); } else { if (document.fullscreenElement) document.exitFullscreen(); setIsDataFullscreen(false); clearCanvas(); } };
  const salvarDesenhoNoLog = () => { if (currentStrokes.length === 0) { alert("Desenhe algo antes de salvar!"); return; } setEventos((prev: any[]) => [{ id: Date.now(), videoId: currentVideo.name, tempo: currentTime, categoria: 'ANALISE', tipo: 'DESENHO', especifico: 'Anotação Tática Visual', atleta: '-', lado: '-', corTecnica: '#a855f7', vetores: currentStrokes }, ...prev]); alert("Anotação Visual Catalogada!"); toggleDrawingMode(); };
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); if (!isDrawingMode || !canvasRef.current) return; const ctx = canvasRef.current.getContext('2d'); if (!ctx) return; const rect = canvasRef.current.getBoundingClientRect(); const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX; const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as any).clientY; const x = clientX - rect.left; const y = clientY - rect.top; if (drawTool === 'ANGLE') { const newPoints = [...tempPoints, {x, y}]; if (newPoints.length < 3) { setTempPoints(newPoints); ctx.fillStyle = drawColor; ctx.beginPath(); ctx.arc(x, y, 5, 0, 2*Math.PI); ctx.fill(); } else { setCurrentStrokes(prev => [...prev, { tool: 'ANGLE', color: drawColor, points: newPoints }]); setTempPoints([]); redrawStrokes([...currentStrokes, { tool: 'ANGLE', color: drawColor, points: newPoints }]); } return; } setIsDrawing(true); setTempPoints([{x, y}]); if (drawTool === 'PEN') { ctx.beginPath(); ctx.moveTo(x, y); ctx.strokeStyle = drawColor; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; } else if (drawTool === 'ARROW') { setStartPos({x, y}); setSnapshot(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)); } };
  const draw = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); if (!isDrawing || !canvasRef.current) return; const ctx = canvasRef.current.getContext('2d'); if (!ctx) return; const rect = canvasRef.current.getBoundingClientRect(); const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX; const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as any).clientY; const x = clientX - rect.left; const y = clientY - rect.top; if (drawTool === 'PEN') { ctx.lineTo(x, y); ctx.stroke(); setTempPoints(prev => [...prev, {x, y}]); } else if (drawTool === 'ARROW' && startPos) { if (snapshot) ctx.putImageData(snapshot, 0, 0); drawArrow(ctx, startPos.x, startPos.y, x, y, drawColor); } };
  const stopDrawing = (e: any) => { e.preventDefault(); if (!isDrawing || !canvasRef.current) return; setIsDrawing(false); const rect = canvasRef.current.getBoundingClientRect(); let finalX = 0, finalY = 0; if (e.type !== 'mouseleave') { const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX; const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY; finalX = clientX - rect.left; finalY = clientY - rect.top; } if (drawTool === 'PEN') { setCurrentStrokes(prev => [...prev, { tool: 'PEN', color: drawColor, points: tempPoints }]); } else if (drawTool === 'ARROW' && startPos) { setCurrentStrokes(prev => [...prev, { tool: 'ARROW', color: drawColor, points: [{x: startPos.x, y: startPos.y}, {x: finalX, y: finalY}] }]); } setSnapshot(null); setStartPos(null); setTempPoints([]); };

  // Loop for playlist logic (player)
  useEffect(() => { let af: number; const loop = () => { if (playlistMode) { const currentEvent = playlistQueue[playlistQueueIndex]; if (currentEvent) { const endTime = currentEvent.tempo + 3; if (currentTime >= endTime) { const nextIndex = playlistQueueIndex + 1; if (nextIndex < playlistQueue.length) { setPlaylistQueueIndex(nextIndex); const nextStartTime = Math.max(0, playlistQueue[nextIndex].tempo - 4); if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current.seekTo(nextStartTime, true); else filePlayerRef.current.currentTime = nextStartTime; } else { pararPlaylistPlayer(); } } } } if (isPlaying) { if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current?.getCurrentTime) setCurrentTime(youtubePlayerRef.current.getCurrentTime()); else if (currentVideo.type === 'FILE' && filePlayerRef.current) setCurrentTime(filePlayerRef.current.currentTime); af = requestAnimationFrame(loop); } if (loopRange && isPlaying) { if (currentTime >= loopRange.end) { if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) youtubePlayerRef.current.seekTo(loopRange.start, true); else if (filePlayerRef.current) filePlayerRef.current.currentTime = loopRange.start; } } }; if (isPlaying) loop(); return () => cancelAnimationFrame(af); }, [isPlaying, currentVideo.type, loopRange, currentTime, playlistMode, playlistQueue, playlistQueueIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalIA || reportMode || modalKumi || modalMetadata || modalNeWaza || modalHelp || modalAthletes) return;
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
  }, [modalAberto, modalIA, isPlaying, currentVideo.type, resultadoPreSelecionado, currentTime, punicaoMode, isDrawingMode, isFightActive, reportMode, modalKumi, modalMetadata, modalNeWaza, modalHelp, modalAthletes]);

  useEffect(() => { const handleResize = () => { setIsMobile(window.innerWidth < 800); if(canvasRef.current && canvasRef.current.parentElement) { canvasRef.current.width = canvasRef.current.parentElement.clientWidth; canvasRef.current.height = canvasRef.current.parentElement.clientHeight; if (currentStrokes.length > 0) redrawStrokes(currentStrokes); } }; window.addEventListener('resize', handleResize); const handleFsChange = () => { if (!document.fullscreenElement && isDrawingMode) { setTimeout(handleResize, 100); } }; document.addEventListener('fullscreenchange', handleFsChange); return () => { window.removeEventListener('resize', handleResize); document.removeEventListener('fullscreenchange', handleFsChange); } }, [isDrawingMode, currentStrokes]);
  const onReady = (e: any) => { youtubePlayerRef.current = e.target; setDuration(e.target.getDuration()); };
  const onStateChange = (e: any) => { setIsPlaying(e.data === 1); if (e.data === 0) proximoVideo(); window.focus(); };
  const onFileEnded = () => proximoVideo();
  
  const getCorBorda = (ev: any) => { if (ev.categoria === 'FLUXO') return THEME.neutral; if (ev.atleta === 'AZUL') return THEME.primary; return '#ffffff'; };
  const SimpleDonut = ({ data }: { data: any[] }) => { let cumPct = 0; if(data.length === 0) return <div style={{width:'100px', height:'100px', borderRadius:'50%', border:`4px solid ${THEME.cardBorder}`, display:'flex', alignItems:'center', justifyContent:'center'}}><PieChart size={20} color={THEME.cardBorder}/></div>; return <div style={{position:'relative', width:'120px', height:'120px', borderRadius:'50%', background: `conic-gradient(${data.map(d => { const str = `${d.color} ${cumPct}% ${cumPct + d.pct}%`; cumPct += d.pct; return str; }).join(', ')})`}}><div style={{position:'absolute', top:'20%', left:'20%', width:'60%', height:'60%', background: THEME.card, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}><PieChart size={24} color={THEME.textDim}/></div></div>; };
  
  // Custom Styles
  const cardStyle: any = { background: THEME.card, border: `1px solid ${THEME.cardBorder}`, borderRadius: '12px', overflow: 'hidden', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' };
  const btnStyle: any = { cursor: 'pointer', border: 'none', borderRadius: '8px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };

  return (
    <div ref={mainContainerRef} tabIndex={0} style={{ maxWidth: '100%', minHeight: '100vh', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: THEME.text, backgroundColor: THEME.bg, padding: '20px', boxSizing: 'border-box', outline: 'none' }}>
      
      {/* GLOBAL STYLES INJECTION */}
      <style>{GLOBAL_STYLES}</style>

      {/* HEADER */}
      <div className="no-print" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0, fontSize: isMobile?'24px':'32px', fontWeight: '800', letterSpacing: '-1px', display: 'flex', alignItems: 'center' }}>
          <div style={{background: THEME.primaryGradient, padding:'8px', borderRadius:'12px', marginRight:'12px', boxShadow:`0 0 20px ${THEME.primary}44`}}><Video size={24} color="white"/></div>
          <div>
            <span style={{ color: 'white' }}>SMAART</span><span style={{ color: THEME.primary }}>PRO</span>
            <div style={{fontSize:'10px', color: THEME.textDim, fontWeight:'400', letterSpacing:'2px', marginTop:'-4px'}}>ELITE JUDO ANALYTICS</div>
          </div>
          <span style={{ fontSize: '10px', color: THEME.text, marginLeft: '12px', background: THEME.cardBorder, padding: '4px 8px', borderRadius: '20px', border:`1px solid rgba(255,255,255,0.1)` }}>v27.1</span>
        </h1>
        
        <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
          <div className="glass-panel" style={{display:'flex', borderRadius:'10px', padding:'4px'}}>
            <button onClick={adicionarYoutube} style={{...btnStyle, background: 'transparent', color: THEME.textDim, padding:'8px 12px', fontSize:'13px'}}>+ YT</button>
            <div style={{width:'1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0'}}></div>
            <button onClick={() => fileInputRef.current.click()} style={{...btnStyle, background: 'transparent', color: THEME.textDim, padding:'8px 12px', fontSize:'13px'}}>+ ARQ</button>
            <input type="file" ref={fileInputRef} style={{display:'none'}} multiple accept="video/*" onChange={handleFileSelect} />
          </div>
          
          <div style={{display:'flex', gap:'8px'}}>
             <button onClick={() => setModalAthletes(true)} className="glow-hover" style={{...btnStyle, background: THEME.card, border: `1px solid ${THEME.cardBorder}`, color: THEME.text, padding:'10px', borderRadius:'10px'}} title="Gerenciar Atletas"><Users size={18}/></button>
             <button onClick={openMetadataModal} className="glow-hover" style={{...btnStyle, background: THEME.card, border: `1px solid ${THEME.cardBorder}`, color: '#f59e0b', padding:'10px', borderRadius:'10px'}} title="Contexto do Campeonato"><Trophy size={18}/></button>
             <button onClick={() => setModalHelp(true)} className="glow-hover" style={{...btnStyle, background: THEME.card, border: `1px solid ${THEME.cardBorder}`, color: THEME.textDim, padding:'10px', borderRadius:'10px'}} title="Atalhos"><Keyboard size={18}/></button>
          </div>

          <div style={{display:'flex', gap:'8px'}}>
             <button onClick={exportarBackup} style={{...btnStyle, background: THEME.card, border: `1px solid ${THEME.cardBorder}`, color: THEME.success, padding:'10px', borderRadius:'10px'}} title="Salvar Backup"><Save size={18}/></button>
             <button onClick={() => backupInputRef.current.click()} style={{...btnStyle, background: THEME.card, border: `1px solid ${THEME.cardBorder}`, color: THEME.warning, padding:'10px', borderRadius:'10px'}} title="Abrir Backup"><UploadCloud size={18}/></button>
             <input type="file" ref={backupInputRef} style={{display:'none'}} accept=".json" onChange={importarBackup} />
          </div>

          <button onClick={gerarPromptIA} style={{...btnStyle, background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', color:'white', padding:'10px 16px', fontSize: '13px', border:'none', boxShadow:'0 4px 12px rgba(168, 85, 247, 0.4)', borderRadius:'10px'}}><Bot size={18}/> AI Report</button>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="no-print" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
        
        {/* LEFT COLUMN (PLAYER + CONTROLS) */}
        <div style={{ flex: 3, width: '100%', display:'flex', flexDirection:'column', gap:'20px' }}>
          
          {/* VIDEO CONTAINER */}
          <div ref={playerContainerRef} style={{ ...cardStyle, position: isDataFullscreen ? 'fixed' : 'relative', top: isDataFullscreen ? 0 : 'auto', left: isDataFullscreen ? 0 : 'auto', width: isDataFullscreen ? '100vw' : '100%', height: isDataFullscreen ? '100vh' : 'auto', paddingTop: isDataFullscreen ? 0 : '56.25%', zIndex: isDataFullscreen ? 999 : 1, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}>
               {/* DRAWING LAYER */}
               {isDrawingMode && (
                 <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', zIndex:20, cursor: drawTool==='PEN' ? 'crosshair' : 'default'}}>
                   <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{width:'100%', height:'100%'}} />
                   <div className="glass-panel" style={{position:'absolute', top:'16px', left:'16px', padding:'8px', borderRadius:'12px', display:'flex', gap:'8px'}}>
                     <button onClick={() => setDrawTool('PEN')} style={{...btnStyle, background: drawTool==='PEN'?THEME.primary:'transparent', color:'white', padding:'8px', borderRadius:'8px'}}><PenTool size={18}/></button>
                     <button onClick={() => setDrawTool('ARROW')} style={{...btnStyle, background: drawTool==='ARROW'?THEME.primary:'transparent', color:'white', padding:'8px', borderRadius:'8px'}}><ArrowUpRight size={18}/></button>
                     <button onClick={() => setDrawTool('ANGLE')} style={{...btnStyle, background: drawTool==='ANGLE'?THEME.primary:'transparent', color:'white', padding:'8px', borderRadius:'8px'}}><Triangle size={18}/></button>
                     <div style={{width:'1px', background:'rgba(255,255,255,0.1)', margin:'0 4px'}}></div>
                     <button onClick={() => setDrawColor('#eab308')} style={{width:'24px', height:'24px', borderRadius:'50%', background:'#eab308', border: drawColor==='#eab308'?'2px solid white':'2px solid transparent'}}></button>
                     <button onClick={() => setDrawColor('#ef4444')} style={{width:'24px', height:'24px', borderRadius:'50%', background:'#ef4444', border: drawColor==='#ef4444'?'2px solid white':'2px solid transparent'}}></button>
                     <button onClick={() => setDrawColor('#3b82f6')} style={{width:'24px', height:'24px', borderRadius:'50%', background:'#3b82f6', border: drawColor==='#3b82f6'?'2px solid white':'2px solid transparent'}}></button>
                     <div style={{width:'1px', background:'rgba(255,255,255,0.1)', margin:'0 4px'}}></div>
                     <button onClick={clearCanvas} style={{...btnStyle, background:'transparent', color:THEME.danger, padding:'8px'}}><Eraser size={18}/></button>
                     <button onClick={salvarDesenhoNoLog} style={{...btnStyle, background:THEME.success, color:'white', padding:'8px'}}><Save size={18}/></button>
                     <button onClick={() => toggleDrawingMode()} style={{...btnStyle, background: 'rgba(255,255,255,0.1)', color:'white', padding:'8px'}}><X size={18}/></button>
                   </div>
                 </div>
               )}
               {!isDrawingMode && <div onClick={toggleVideo} style={{position:'absolute', top:0, left:0, width:'100%', height:'85%', zIndex:10, cursor:'pointer'}}></div>}
               {currentVideo.type === 'YOUTUBE' ? (
                 <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}}><YouTube videoId={currentVideo.id} onReady={onReady} onStateChange={onStateChange} opts={{ width: '100%', height: '100%', playerVars: { autoplay: 0, controls: 0, rel: 0, showinfo: 0, modestbranding: 1, playsinline: 1, fs: 0 } }} style={{width:'100%', height:'100%'}}/></div>
               ) : (
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background:'black' }}><video ref={filePlayerRef} src={currentVideo.id} style={{width:'100%', height:'100%', objectFit:'contain'}} controls={false} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={onFileEnded} onLoadedMetadata={(e:any) => setDuration(e.target.duration)}/></div>
               )}
          </div>

          {/* PRECISION DECK */}
          <div style={{...cardStyle, padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop: `4px solid ${THEME.primary}`}}>
             <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                <button onClick={videoAnterior} disabled={currentVideoIndex===0} style={{...btnStyle, background:'transparent', color:currentVideoIndex===0?THEME.cardBorder:THEME.textDim}}><SkipBack size={20}/></button>
                <div style={{display:'flex', alignItems:'center', background: THEME.bg, padding:'4px', borderRadius:'30px', border:`1px solid ${THEME.cardBorder}`, gap:'6px'}}>
                  <button onClick={() => stepFrame(-1)} style={{...btnStyle, background: 'transparent', color: THEME.textDim, padding:'10px'}} title="-0.05s"><ChevronLeft size={20}/></button>
                  <button onClick={toggleVideo} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: THEME.primary, borderRadius: '50%', border: 'none', cursor: 'pointer', width: '56px', height: '56px', padding: 0, boxShadow: `0 0 25px ${THEME.primary}66`, flexShrink: 0, transition:'transform 0.1s active' }}>
                      {isPlaying ? <Pause size={28} color="white" fill="white" /> : <Play size={28} color="white" fill="white" style={{marginLeft:'4px'}} /> }
                  </button>
                  <button onClick={() => stepFrame(1)} style={{...btnStyle, background: 'transparent', color: THEME.textDim, padding:'10px'}} title="+0.05s"><ChevronRight size={20}/></button>
                </div>
                <button onClick={proximoVideo} disabled={currentVideoIndex===playlist.length-1} style={{...btnStyle, background:'transparent', color:currentVideoIndex===playlist.length-1?THEME.cardBorder:THEME.textDim}}><SkipForward size={20}/></button>
             </div>

             <div style={{display:'flex', gap:'8px', background: THEME.bg, padding:'6px 12px', borderRadius:'10px', border: `1px solid ${loopRange ? THEME.warning : THEME.cardBorder}`}}>
                <button onClick={() => setLoopPoint('A')} style={{...btnStyle, color: loopRange?.start ? THEME.warning : THEME.textDim, fontSize:'12px', fontWeight:'800'}}>A</button>
                <span style={{color:THEME.cardBorder}}>|</span>
                <button onClick={() => setLoopPoint('B')} style={{...btnStyle, color: loopRange?.end ? THEME.warning : THEME.textDim, fontSize:'12px', fontWeight:'800'}}>B</button>
                {loopRange && <button onClick={clearLoop} style={{...btnStyle, color: THEME.danger}}><X size={14}/></button>}
             </div>

             <div style={{display:'flex', gap:'12px'}}>
                <button onClick={() => toggleDrawingMode()} className="glow-hover" style={{...btnStyle, background: isDrawingMode ? THEME.primary : THEME.bg, border:`1px solid ${isDrawingMode ? THEME.primary : THEME.cardBorder}`, color: isDrawingMode ? 'white' : THEME.textDim, padding:'10px', borderRadius:'10px'}}><PenTool size={18}/></button>
                <div style={{width:'1px', background: THEME.cardBorder, height:'24px', alignSelf:'center'}}></div>
                <div style={{display:'flex', background:THEME.bg, borderRadius:'8px', padding:'2px'}}>
                   <button onClick={() => mudarVelocidade(0.25)} style={{...btnStyle, padding:'8px 12px', borderRadius:'6px', background: playbackRate===0.25 ? THEME.warning : 'transparent', color: playbackRate===0.25 ? 'black' : THEME.textDim, fontSize:'12px'}}>0.25x</button>
                   <button onClick={() => mudarVelocidade(1.0)} style={{...btnStyle, padding:'8px 12px', borderRadius:'6px', background: playbackRate===1.0 ? THEME.success : 'transparent', color: playbackRate===1.0 ? 'white' : THEME.textDim, fontSize:'12px'}}>1.0x</button>
                </div>
             </div>
          </div>

          {/* MAIN ACTIONS (BIG CARDS) */}
          <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px'}}>
             <button onClick={() => iniciarRegistroRapido()} style={{...btnStyle, flexDirection:'column', gap:'12px', padding:'24px', background: THEME.primaryGradient, color:'white', fontSize:'20px', borderRadius:'16px', boxShadow: `0 10px 25px -5px ${THEME.primary}66`, border:`1px solid rgba(255,255,255,0.1)`}}>
               <Tornado size={32} strokeWidth={1.5}/> 
               <span style={{fontWeight:'800', letterSpacing:'1px'}}>NAGE-WAZA</span>
             </button>
             
             <button onClick={abrirNeWaza} style={{...btnStyle, flexDirection:'column', gap:'10px', padding:'20px', background: THEME.card, border: `1px solid ${THEME.newaza}`, color: THEME.newaza, fontSize:'14px', borderRadius:'16px', boxShadow: `0 4px 20px -5px ${THEME.newaza}22`}}>
               <Layers size={28}/> <span style={{fontWeight:'700'}}>NE-WAZA</span>
             </button>
             
             <button onClick={abrirKumiKata} style={{...btnStyle, flexDirection:'column', gap:'10px', padding:'20px', background: THEME.card, border: `1px solid ${THEME.kumi}`, color: THEME.kumi, fontSize:'14px', borderRadius:'16px', boxShadow: `0 4px 20px -5px ${THEME.kumi}22`}}>
               <Hand size={28}/> <span style={{fontWeight:'700'}}>KUMI-KATA</span>
             </button>
          </div>

          {/* GAME CONTROLS */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={toggleFightState} style={{...btnStyle, flex:2, background: isFightActive ? '#ef4444' : '#10b981', color:'white', padding:'16px', borderRadius:'12px', fontSize:'16px', fontWeight:'700', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'}}>
              {isFightActive ? <><Pause size={20} fill="white"/> MATE (PAUSE)</> : <><Play size={20} fill="white"/> HAJIME (START)</>}
            </button>
            <button onClick={() => registrarFluxo('GOLDEN SCORE')} style={{...btnStyle, flex:1, background: THEME.warning, color:'#000', padding:'16px', borderRadius:'12px', fontSize:'13px', fontWeight:'700'}}><Clock size={18}/> GS</button>
            <button onClick={() => registrarFluxo('SOREMADE')} style={{...btnStyle, flex:1, background: THEME.card, border:`1px solid ${THEME.cardBorder}`, color:THEME.text, padding:'16px', borderRadius:'12px', fontSize:'13px', fontWeight:'700'}}><Flag size={18}/> END</button>
          </div>

          {/* QUICK SHIDO */}
          <div style={{...cardStyle, padding:'16px', display:'flex', alignItems:'center', gap:'12px'}}>
             <AlertTriangle size={20} color={THEME.textDim}/>
             <select style={{flex:1, background: THEME.bg, color: THEME.text, border:`1px solid ${THEME.cardBorder}`, padding:'12px', borderRadius:'8px', fontSize: '13px', outline:'none'}} onChange={(e) => setMotivoShido(e.target.value)} value={motivoShido}>{DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}</select>
             <button onClick={() => registrarPunicaoDireto('SHIDO', 'BRANCO')} style={{...btnStyle, width:'48px', height:'44px', background:'#e2e8f0', color:'#0f172a', fontSize:'14px', borderRadius:'8px'}}>⚪</button>
             <button onClick={() => registrarPunicaoDireto('SHIDO', 'AZUL')} style={{...btnStyle, width:'48px', height:'44px', background: THEME.primary, color:'white', fontSize:'14px', borderRadius:'8px'}}>🔵</button>
          </div>
        </div>

        {/* RIGHT COLUMN (DASHBOARD + LOG) */}
        <div className="no-print" style={{ flex: 2, width: '100%', display:'flex', flexDirection:'column', gap:'20px' }}>
          
          {/* PLAYLIST (COLLAPSIBLE) */}
          {showPlaylist && (
            <div style={{ ...cardStyle, padding: '12px', maxHeight: '150px', overflowY: 'auto' }}>
              {playlist.map((item, index) => (
                <div key={index} onClick={() => selecionarVideo(index)} style={{ padding: '10px', cursor: 'pointer', background: index === currentVideoIndex ? `${THEME.primary}22` : 'transparent', borderRadius: '6px', marginBottom: '4px', display:'flex', justifyContent:'space-between', alignItems:'center', border: index===currentVideoIndex ? `1px solid ${THEME.primary}66` : '1px solid transparent' }}>
                  <div style={{display:'flex', alignItems:'center', gap:'8px', overflow:'hidden'}}>{item.type === 'YOUTUBE' ? <Video size={14} color={THEME.danger}/> : <Film size={14} color={THEME.primary}/>}<span style={{fontSize:'12px', color: index===currentVideoIndex ? THEME.primary : THEME.text}}>{item.name}</span></div>
                  <button onClick={(e) => removerDaPlaylist(index, e)} style={{background:'none', border:'none', color: THEME.textDim, cursor:'pointer'}}><X size={14}/></button>
                </div>
              ))}
            </div>
          )}

          {/* SCOREBOARD (TV STYLE) */}
          <div style={{ ...cardStyle, padding: '0', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', overflow:'hidden' }}>
            {/* WHITE */}
            <div style={{ background:'white', padding:'20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center', borderRight:`4px solid ${THEME.bg}` }}>
                 <div style={{fontSize:'16px', fontWeight:'900', color:'#0f172a', textTransform:'uppercase', letterSpacing:'-0.5px'}}>{labelWhite}</div>
                 <div style={{fontSize:'10px', color:'#64748b', fontWeight:'600'}}>{athleteWhite?.country || 'BRA'}</div>
                 <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
                    <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: '#64748b', fontWeight:'700'}}>I</div><div style={{fontSize:'28px', fontWeight:'800', color:'#0f172a', lineHeight:'1'}}>{placar.branco.ippon}</div></div>
                    <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: '#eab308', fontWeight:'700'}}>W</div><div style={{fontSize:'28px', fontWeight:'800', color:'#eab308', lineHeight:'1'}}>{placar.branco.waza}</div></div>
                    <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: '#ef4444', fontWeight:'700'}}>S</div><div style={{fontSize:'28px', fontWeight:'800', color:'#ef4444', lineHeight:'1'}}>{placar.branco.shido}</div></div>
                 </div>
            </div>
            {/* TIMER */}
            <div style={{ background: THEME.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{fontSize: '10px', color: tempoDisplay.isGS ? THEME.warning : THEME.textDim, fontWeight: '700', letterSpacing:'1px', marginBottom:'4px'}}>{tempoDisplay.isGS ? 'GOLDEN SCORE' : 'TIME'}</div>
                 <div style={{fontSize: '36px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: tempoDisplay.isGS ? THEME.warning : 'white', letterSpacing:'-2px', lineHeight:'1'}}>{tempoDisplay.time}</div>
            </div>
            {/* BLUE */}
            <div style={{ background: THEME.primary, padding:'20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center', borderLeft:`4px solid ${THEME.bg}` }}>
                 <div style={{fontSize:'16px', fontWeight:'900', color:'white', textTransform:'uppercase', letterSpacing:'-0.5px'}}>{labelBlue}</div>
                 <div style={{fontSize:'10px', color:'rgba(255,255,255,0.7)', fontWeight:'600'}}>{athleteBlue?.country || 'FRA'}</div>
                 <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
                    <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: 'rgba(255,255,255,0.6)', fontWeight:'700'}}>I</div><div style={{fontSize:'28px', fontWeight:'800', color:'white', lineHeight:'1'}}>{placar.azul.ippon}</div></div>
                    <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: '#facc15', fontWeight:'700'}}>W</div><div style={{fontSize:'28px', fontWeight:'800', color:'#facc15', lineHeight:'1'}}>{placar.azul.waza}</div></div>
                    <div style={{textAlign:'center'}}><div style={{fontSize:'9px', color: '#fca5a5', fontWeight:'700'}}>S</div><div style={{fontSize:'28px', fontWeight:'800', color:'#fca5a5', lineHeight:'1'}}>{placar.azul.shido}</div></div>
                 </div>
            </div>
          </div>

          {/* DASHBOARD TABS (SIMULATED) */}
          <div style={{display:'flex', gap:'12px', overflowX:'auto', paddingBottom:'4px'}}>
             <div style={{flex:1, ...cardStyle, padding:'15px', minWidth:'140px'}}>
                <div style={{fontSize:'10px', color: THEME.textDim, fontWeight:'700', marginBottom:'10px', display:'flex', gap:'6px'}}><Compass size={12}/> RADAR</div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                   <div style={{width:'50px', height:'50px', position:'relative'}}>
                      {/* Mini Radar White */}
                      <div style={{position:'absolute', top:0, left:'20px', opacity:radarStats.white.FRENTE}}><ArrowUp size={14} color="white"/></div>
                      <div style={{position:'absolute', bottom:0, left:'20px', opacity:radarStats.white.TRAS}}><ArrowDown size={14} color="white"/></div>
                      <div style={{position:'absolute', top:'20px', left:0, opacity:radarStats.white.ESQUERDA}}><ArrowLeft size={14} color="white"/></div>
                      <div style={{position:'absolute', top:'20px', right:0, opacity:radarStats.white.DIREITA}}><ArrowRight size={14} color="white"/></div>
                   </div>
                   <div style={{width:'1px', height:'40px', background: THEME.cardBorder}}></div>
                   <div style={{width:'50px', height:'50px', position:'relative'}}>
                      {/* Mini Radar Blue */}
                      <div style={{position:'absolute', top:0, left:'20px', opacity:radarStats.blue.FRENTE}}><ArrowUp size={14} color={THEME.primary}/></div>
                      <div style={{position:'absolute', bottom:0, left:'20px', opacity:radarStats.blue.TRAS}}><ArrowDown size={14} color={THEME.primary}/></div>
                      <div style={{position:'absolute', top:'20px', left:0, opacity:radarStats.blue.ESQUERDA}}><ArrowLeft size={14} color={THEME.primary}/></div>
                      <div style={{position:'absolute', top:'20px', right:0, opacity:radarStats.blue.DIREITA}}><ArrowRight size={14} color={THEME.primary}/></div>
                   </div>
                </div>
             </div>

             <div style={{flex:1, ...cardStyle, padding:'15px', minWidth:'140px'}}>
                <div style={{fontSize:'10px', color: THEME.textDim, fontWeight:'700', marginBottom:'10px', display:'flex', gap:'6px'}}><Activity size={12}/> FLUXO</div>
                <div style={{display:'flex', alignItems:'flex-end', height:'40px', gap:'2px', justifyContent:'space-between'}}>
                    {momentumData.slice(-10).map((m: any) => (
                        <div key={m.min} style={{width:'6px', background: m.branco > m.azul ? 'white' : THEME.primary, height: `${Math.min(30, (m.branco+m.azul) * 5 + 4)}px`, borderRadius:'2px', opacity:0.8}}></div>
                    ))}
                </div>
             </div>
             
             <div style={{flex:1, ...cardStyle, padding:'15px', minWidth:'140px', position:'relative'}}>
                <div style={{fontSize:'10px', color: THEME.textDim, fontWeight:'700', marginBottom:'10px', display:'flex', gap:'6px'}}><MapPin size={12}/> MAPA</div>
                <div style={{width:'100%', height:'40px', background: THEME.tatamiCenter, border:`2px solid ${THEME.tatamiDanger}`, position:'relative'}}>
                   {eventos.slice(-5).filter((e:any) => e.coordenadas).map((e:any) => (<div key={e.id} style={{position:'absolute', top:`${e.coordenadas.y}%`, left:`${e.coordenadas.x}%`, width:'6px', height:'6px', background: e.atleta==='BRANCO'?'white':THEME.primary, borderRadius:'50%', border:'1px solid black'}}></div>))}
                </div>
             </div>
          </div>

          {/* TIMELINE (LOG) */}
          <div style={{ flex: 1, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'12px' }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <h3 style={{margin:0, fontSize:'14px', color: 'white', fontWeight:'700', display:'flex', gap:'8px', alignItems:'center'}}><List size={18} color={THEME.primary}/> TIMELINE DA LUTA</h3>
                 <button onClick={playlistMode ? pararPlaylistPlayer : iniciarPlaylistPlayer} style={{...btnStyle, background: playlistMode ? THEME.danger : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${playlistMode ? 'transparent' : THEME.success}`, color: playlistMode ? 'white' : THEME.success, padding:'6px 12px', fontSize:'11px', borderRadius:'20px'}}>
                    {playlistMode ? <><X size={14}/> PARAR PLAY</> : <><PlayCircle size={14}/> ASSISTIR CLIPES</>}
                 </button>
              </div>
              <div style={{display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'4px'}}>
                  {['TODOS', 'PONTOS', 'PUNICAO', 'NE-WAZA', 'BRANCO', 'AZUL'].map(f => (
                      <button key={f} onClick={()=>setActiveFilter(f)} style={{...btnStyle, padding:'6px 10px', fontSize:'10px', borderRadius:'6px', background: activeFilter===f ? THEME.text : 'transparent', border: `1px solid ${activeFilter===f ? 'transparent' : THEME.cardBorder}`, color: activeFilter===f ? THEME.bg : THEME.textDim, fontWeight:'700'}}>{f}</button>
                  ))}
              </div>
            </div>

            <div style={{ ...cardStyle, flex:1, padding: '0', minHeight: '300px', overflowY: 'auto', background: THEME.bg }}>
              {filteredEventos.map((ev: any) => (
                <div key={ev.id} style={{ 
                  padding: '12px 16px', borderBottom: `1px solid ${THEME.cardBorder}`, 
                  background: playlistMode && playlistQueue[playlistQueueIndex]?.id === ev.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  display:'flex', alignItems:'center', justifyContent:'space-between', fontSize: '13px'
                }}>
                  <div onClick={() => irParaEvento(ev)} style={{cursor:'pointer', flex:1, display:'flex', gap:'12px', alignItems:'center'}}>
                    <div style={{fontFamily:'JetBrains Mono, monospace', color: THEME.textDim, fontSize:'11px', minWidth:'40px'}}>{formatTimeVideo(ev.tempo)}</div>
                    
                    {/* ICONE CATEGORIA */}
                    <div style={{width:'24px', display:'flex', justifyContent:'center'}}>
                        {ev.categoria === 'TECNICA' && <Tornado size={16} color={ev.atleta==='BRANCO'?'white':THEME.primary}/>}
                        {ev.categoria === 'PUNICAO' && (ev.tipo === 'SHIDO' ? <AlertTriangle size={16} color={THEME.warning}/> : <AlertOctagon size={16} color={THEME.danger}/>)}
                        {ev.categoria === 'NE-WAZA' && <Layers size={16} color={THEME.newaza}/>}
                        {ev.categoria === 'KUMI-KATA' && <Hand size={16} color={THEME.kumi}/>}
                        {ev.categoria === 'ANALISE' && <PenTool size={16} color="#a855f7"/>}
                        {ev.categoria === 'FLUXO' && <Clock size={16} color={THEME.neutral}/>}
                    </div>

                    <div style={{flex:1}}>
                        <div style={{fontWeight:'600', color: ev.atleta === 'AZUL' ? THEME.primary : 'white', fontSize: '14px', display:'flex', alignItems:'center', gap:'6px'}}>
                            {ev.especifico || ev.tipo}
                            {ev.direcao && <span style={{fontSize:'10px', background: 'rgba(255,255,255,0.1)', padding:'1px 4px', borderRadius:'3px'}}>{ev.direcao === 'FRENTE' ? '⬆' : ev.direcao === 'TRAS' ? '⬇' : ev.direcao === 'ESQUERDA' ? '⬅' : '➡'}</span>}
                        </div>
                        {ev.resultado && ev.resultado !== 'NADA' && ev.resultado !== 'Mate' && <div style={{marginTop:'2px', fontSize:'11px', color: ev.resultado.includes('Ippon') ? THEME.success : THEME.warning, fontWeight:'700', textTransform:'uppercase'}}>{ev.resultado}</div>}
                    </div>
                  </div>

                  <div style={{display:'flex', gap:'4px', opacity:0.5}} className="actions">
                    {ev.categoria === 'ANALISE' ? (
                       <button onClick={() => irParaEvento(ev)} style={{background:'none', border:'none', color: THEME.textDim, cursor:'pointer'}}><Eye size={14}/></button>
                    ) : (
                       <button onClick={() => editarEvento(ev)} style={{background:'none', border:'none', color: THEME.textDim, cursor:'pointer'}}><Edit2 size={14}/></button>
                    )}
                    <button onClick={() => setEventos(eventos.filter((e:any) => e.id !== ev.id))} style={{background:'none', border:'none', color: THEME.textDim, cursor:'pointer'}}><X size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* --- MODAL ATHLETES --- */}
      {modalAthletes && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '500px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: `1px solid ${THEME.cardBorder}` }}>
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
               <h2 style={{margin:0, color: 'white', fontSize:'18px', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700'}}><Users size={20}/> BANCO DE ATLETAS</h2>
               <button onClick={() => setModalAthletes(false)} style={{...btnStyle, background: THEME.cardBorder, color: THEME.textDim, padding:'6px', borderRadius:'50%'}}><X size={18}/></button>
             </div>
             <div style={{background: THEME.bg, padding:'15px', borderRadius:'8px', border:`1px solid ${THEME.cardBorder}`, marginBottom:'20px'}}>
                <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'10px', marginBottom:'10px'}}>
                   <input type="text" placeholder="Nome Completo" value={newAthleteName} onChange={e => setNewAthleteName(e.target.value)} style={{padding:'12px', borderRadius:'6px', border:'none', fontSize:'13px', background: THEME.card, color:'white'}} />
                   <input type="text" placeholder="País (BRA)" value={newAthleteCountry} onChange={e => setNewAthleteCountry(e.target.value)} style={{padding:'12px', borderRadius:'6px', border:'none', fontSize:'13px', background: THEME.card, color:'white'}} />
                   <input type="text" placeholder="Clube" value={newAthleteClub} onChange={e => setNewAthleteClub(e.target.value)} style={{padding:'12px', borderRadius:'6px', border:'none', fontSize:'13px', background: THEME.card, color:'white'}} />
                </div>
                <button onClick={saveAthlete} style={{...btnStyle, width:'100%', padding:'12px', background: THEME.success, color:'white', fontSize:'13px', fontWeight:'700'}}><UserPlus size={16}/> ADICIONAR ATLETA</button>
             </div>
             <div style={{maxHeight:'300px', overflowY:'auto'}}>
                 {athletes.length === 0 && <div style={{textAlign:'center', color: THEME.textDim, fontSize:'12px', padding:'20px'}}>Nenhum atleta cadastrado.</div>}
                 {athletes.map(a => (
                     <div key={a.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', borderBottom:`1px solid ${THEME.cardBorder}`}}>
                         <div>
                             <div style={{fontWeight:'700', color:'white', fontSize:'14px'}}>{a.name}</div>
                             <div style={{fontSize:'11px', color:THEME.textDim}}>{a.country} • {a.club}</div>
                         </div>
                         <button onClick={() => deleteAthlete(a.id)} style={{...btnStyle, background:'transparent', color: THEME.danger}}><Trash2 size={16}/></button>
                     </div>
                 ))}
             </div>
          </div>
        </div>
      )}

      {/* --- MODAL HELP --- */}
      {modalHelp && (
         <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
             <div style={{ ...cardStyle, width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: `1px solid ${THEME.cardBorder}` }}>
                 <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                     <h2 style={{margin:0, color: 'white', fontSize:'18px', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700'}}><Keyboard size={20}/> ATALHOS DE TECLADO</h2>
                     <button onClick={() => setModalHelp(false)} style={{...btnStyle, background: THEME.cardBorder, color: THEME.textDim, padding:'6px', borderRadius:'50%'}}><X size={18}/></button>
                 </div>
                 <div style={{display:'grid', gap:'10px', fontSize:'13px', color: THEME.textDim}}>
                     <div style={{display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${THEME.cardBorder}`, paddingBottom:'5px'}}><span>PLAY / PAUSE</span><span style={{color:'white', fontWeight:'700'}}>P</span></div>
                     <div style={{display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${THEME.cardBorder}`, paddingBottom:'5px'}}><span>HAJIME / MATE</span><span style={{color:'white', fontWeight:'700'}}>ESPAÇO</span></div>
                     <div style={{display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${THEME.cardBorder}`, paddingBottom:'5px'}}><span>REGISTRAR AÇÃO</span><span style={{color:'white', fontWeight:'700'}}>ENTER</span></div>
                     <div style={{display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${THEME.cardBorder}`, paddingBottom:'5px'}}><span>MODO DESENHO</span><span style={{color:'white', fontWeight:'700'}}>D</span></div>
                     <div style={{display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${THEME.cardBorder}`, paddingBottom:'5px'}}><span>IPPON / WAZA-ARI / YUKO</span><span style={{color:'white', fontWeight:'700'}}>I / W / Y</span></div>
                     <div style={{display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${THEME.cardBorder}`, paddingBottom:'5px'}}><span>SHIDO / HANSOKU</span><span style={{color:'white', fontWeight:'700'}}>S / H</span></div>
                 </div>
             </div>
         </div>
      )}

      {/* --- MODAL METADATA --- */}
      {modalMetadata && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: `1px solid ${THEME.cardBorder}` }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2 style={{margin:0, color: '#f59e0b', fontSize:'18px', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700'}}><Trophy size={20}/> CONTEXTO DA LUTA</h2>
              <button onClick={() => setModalMetadata(false)} style={{...btnStyle, background: THEME.cardBorder, color: THEME.textDim, padding:'6px', borderRadius:'50%'}}><X size={18}/></button>
            </div>
            
            <div style={{marginBottom:'15px'}}>
               <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'5px', fontWeight:'600'}}>QUEM É O BRANCO?</div>
               <select value={metaWhiteId} onChange={e => setMetaWhiteId(e.target.value)} style={{width:'100%', padding:'12px', background: 'white', border:`1px solid ${THEME.cardBorder}`, color: 'black', borderRadius:'8px', fontWeight:'700', fontSize:'13px'}}>
                  <option value="">-- Atleta Desconhecido --</option>
                  {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.country})</option>)}
               </select>
            </div>

            <div style={{marginBottom:'15px'}}>
               <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'5px', fontWeight:'600'}}>QUEM É O AZUL?</div>
               <select value={metaBlueId} onChange={e => setMetaBlueId(e.target.value)} style={{width:'100%', padding:'12px', background: THEME.primary, border:`1px solid ${THEME.cardBorder}`, color: 'white', borderRadius:'8px', fontWeight:'700', fontSize:'13px'}}>
                  <option value="">-- Atleta Desconhecido --</option>
                  {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.country})</option>)}
               </select>
            </div>

            <div style={{width:'100%', height:'1px', background: THEME.cardBorder, margin: '20px 0'}}></div>

            <div style={{marginBottom:'15px'}}>
               <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'5px', fontWeight:'600'}}>NOME DO EVENTO</div>
               <input type="text" value={metaEvent} onChange={e => setMetaEvent(e.target.value)} style={{width:'100%', padding:'10px', background: THEME.bg, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px'}} placeholder="Ex: Grand Slam Paris 2025" />
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
               <div>
                  <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'5px', fontWeight:'600'}}>DATA</div>
                  <input type="text" value={metaDate} onChange={e => setMetaDate(e.target.value)} style={{width:'100%', padding:'10px', background: THEME.bg, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px'}} placeholder="DD/MM/AAAA" />
               </div>
               <div>
                  <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'5px', fontWeight:'600'}}>CATEGORIA</div>
                  <input type="text" value={metaCat} onChange={e => setMetaCat(e.target.value)} style={{width:'100%', padding:'10px', background: THEME.bg, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px'}} placeholder="-81kg" />
               </div>
            </div>

            <div style={{marginBottom:'24px'}}>
               <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'5px', fontWeight:'600'}}>FASE DA LUTA</div>
               <select value={metaPhase} onChange={e => setMetaPhase(e.target.value)} style={{width:'100%', padding:'10px', background: THEME.bg, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px'}}>
                  <option value="">Selecione...</option>
                  {DB_FASES.map(f => <option key={f} value={f}>{f}</option>)}
               </select>
            </div>

            <div style={{display:'flex', gap:'10px'}}>
               <button onClick={saveMetadata} style={{...btnStyle, flex:1, padding:'12px', background: THEME.primary, color:'white', fontWeight:'700'}}>SALVAR</button>
               <button onClick={applyMetadataToAll} style={{...btnStyle, flex:1, padding:'12px', background: THEME.bg, border:`1px solid ${THEME.primary}`, color:THEME.primary, fontWeight:'700'}}>APLICAR A TODOS</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL NE-WAZA --- */}
      {modalNeWaza && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: `1px solid ${THEME.cardBorder}` }}>
            <div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:`1px solid ${THEME.cardBorder}`, marginBottom:'20px'}}>
               <button onClick={() => setNwAtleta('BRANCO')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: nwAtleta==='BRANCO'?'#e2e8f0':THEME.bg, color:nwAtleta==='BRANCO'?'#0f172a':THEME.textDim}}>⚪ {labelWhite}</button>
               <button onClick={() => setNwAtleta('AZUL')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: nwAtleta==='AZUL'?THEME.primary:THEME.bg, color:nwAtleta==='AZUL'?'white':THEME.textDim}}>🔵 {labelBlue}</button>
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2 style={{margin:0, color: THEME.newaza, fontSize:'18px', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700'}}><Layers size={20}/> ANÁLISE DE SOLO</h2>
              <button onClick={() => setModalNeWaza(false)} style={{...btnStyle, background: THEME.cardBorder, color: THEME.textDim, padding:'6px', borderRadius:'50%'}}><X size={18}/></button>
            </div>
            
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
               <div>
                  <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>ENTRADA</div>
                  <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                     <button onClick={() => setNwEntrada('DIRETA')} style={{...btnStyle, padding:'8px', background: nwEntrada==='DIRETA'?THEME.success:THEME.bg, color:nwEntrada==='DIRETA'?'white':THEME.textDim, fontSize:'11px'}}>DIRETA (Conexão)</button>
                     <button onClick={() => setNwEntrada('PAUSA')} style={{...btnStyle, padding:'8px', background: nwEntrada==='PAUSA'?THEME.warning:THEME.bg, color:nwEntrada==='PAUSA'?'black':THEME.textDim, fontSize:'11px'}}>PAUSA (Análise)</button>
                  </div>
               </div>
               <div>
                  <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>POSIÇÃO</div>
                  <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                     <button onClick={() => {setNwPosicao('POR CIMA'); setNwAcao(DB_NW_ACOES_TOP[0])}} style={{...btnStyle, padding:'8px', background: nwPosicao==='POR CIMA'?THEME.primary:THEME.bg, color:nwPosicao==='POR CIMA'?'white':THEME.textDim, fontSize:'11px'}}>POR CIMA</button>
                     <button onClick={() => {setNwPosicao('POR BAIXO'); setNwAcao(DB_NW_ACOES_BOTTOM[0])}} style={{...btnStyle, padding:'8px', background: nwPosicao==='POR BAIXO'?THEME.danger:THEME.bg, color:nwPosicao==='POR BAIXO'?'white':THEME.textDim, fontSize:'11px'}}>POR BAIXO</button>
                  </div>
               </div>
            </div>

            <div style={{marginBottom:'15px'}}>
               <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>AÇÃO ESPECÍFICA</div>
               <select value={nwAcao} onChange={(e) => setNwAcao(e.target.value)} style={{width:'100%', background: THEME.bg, color: 'white', padding:'10px', borderRadius:'8px', border:`1px solid ${THEME.newaza}`}}>
                  {(nwPosicao === 'POR CIMA' ? DB_NW_ACOES_TOP : DB_NW_ACOES_BOTTOM).map(a => <option key={a} value={a}>{a}</option>)}
               </select>
            </div>

            <div style={{marginBottom:'15px'}}>
               <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>TÉCNICA NOMEADA (OPCIONAL)</div>
               <select value={nwTecnica} onChange={(e) => setNwTecnica(e.target.value)} style={{width:'100%', background: THEME.bg, color: 'white', padding:'10px', borderRadius:'8px', border:`1px solid ${THEME.cardBorder}`}}>
                  <option value="">-- Nenhuma --</option>
                  {Object.keys(DB_NE_WAZA_LIST).map(t => <option key={t} value={t}>{t} ({DB_NE_WAZA_LIST[t]})</option>)}
               </select>
            </div>

            <div style={{marginBottom:'24px'}}>
               <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>DESFECHO</div>
               <select value={nwDesfecho} onChange={(e) => setNwDesfecho(e.target.value)} style={{width:'100%', background: THEME.bg, color: 'white', padding:'10px', borderRadius:'8px', border:`1px solid ${THEME.cardBorder}`}}>
                  {DB_NW_DESFECHOS.map(d => <option key={d} value={d}>{d}</option>)}
               </select>
            </div>

            <button onClick={salvarNeWaza} style={{...btnStyle, width:'100%', padding:'16px', background: THEME.newazaGradient, color:'white', fontSize:'16px', fontWeight:'700'}}>REGISTRAR SOLO</button>
          </div>
        </div>
      )}

      {/* --- MODAL KUMI-KATA --- */}
      {modalKumi && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: `1px solid ${THEME.cardBorder}` }}>
            
            <div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:`1px solid ${THEME.cardBorder}`, marginBottom:'20px'}}>
               <button onClick={() => setKumiAtleta('BRANCO')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: kumiAtleta==='BRANCO'?'#e2e8f0':THEME.bg, color:kumiAtleta==='BRANCO'?'#0f172a':THEME.textDim}}>⚪ {labelWhite}</button>
               <button onClick={() => setKumiAtleta('AZUL')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: kumiAtleta==='AZUL'?THEME.primary:THEME.bg, color:kumiAtleta==='AZUL'?'white':THEME.textDim}}>🔵 {labelBlue}</button>
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
                  <select value={kumiDir} onChange={(e) => setKumiDir(e.target.value)} style={{width:'100%', background: THEME.bg, color: 'white', padding:'10px', borderRadius:'8px', border:`1px solid #f59e0b`}}>
                     {DB_PEGADAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
               </div>
               <div>
                  <div style={{fontSize:'11px', color: '#8b5cf6', marginBottom:'8px', fontWeight:'600'}}>MÃO ESQUERDA</div>
                  <select value={kumiEsq} onChange={(e) => setKumiEsq(e.target.value)} style={{width:'100%', background: THEME.bg, color: 'white', padding:'10px', borderRadius:'8px', border:`1px solid #8b5cf6`}}>
                     {DB_PEGADAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
               </div>
            </div>

            <button onClick={salvarKumiKata} style={{...btnStyle, width:'100%', padding:'16px', background: THEME.kumiGradient, color:'white', fontSize:'16px', fontWeight:'700'}}>CONFIRMAR PEGADA</button>
          </div>
        </div>
      )}

      {/* --- MODAL REGISTRO (NAGE-WAZA) --- */}
      {modalAberto && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(2, 6, 23, 0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
              <h2 style={{margin:0, color: punicaoMode ? THEME.danger : THEME.primary, fontSize:'20px', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700'}}>
                {punicaoMode ? (punicaoMode==='SHIDO' ? <><AlertTriangle size={24}/> REGISTRAR SHIDO</> : <><AlertOctagon size={24}/> REGISTRAR HANSOKU</>) : <><Tornado size={24}/> {editingEventId ? 'EDITAR (VAR)' : 'NAGE-WAZA'}</>}
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
                <select style={{width:'100%', background: THEME.bg, color: THEME.text, border:`1px solid ${THEME.cardBorder}`, padding:'12px', borderRadius:'8px', fontSize: '14px', outline:'none'}} onChange={(e) => setMotivoShido(e.target.value)} value={motivoShido}>{DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}</select>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div><div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>QUEM?</div><div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:`1px solid ${THEME.cardBorder}`}}><button onClick={()=>setModalAtleta('BRANCO')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalAtleta==='BRANCO'?'#e2e8f0':THEME.bg, color:modalAtleta==='BRANCO'?'#0f172a':THEME.textDim}}>⚪ {labelWhite}</button><button onClick={()=>setModalAtleta('AZUL')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalAtleta==='AZUL'?THEME.primary:THEME.bg, color:modalAtleta==='AZUL'?'white':THEME.textDim}}>🔵 {labelBlue}</button></div></div>
                  <div><div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>LADO?</div><div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:`1px solid ${THEME.cardBorder}`}}><button onClick={()=>setModalLado('ESQUERDA')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalLado==='ESQUERDA'?THEME.warning:THEME.bg, color:modalLado==='ESQUERDA'?'#0f172a':THEME.textDim, fontSize:'11px'}}>ESQ</button><button onClick={()=>setModalLado('DIREITA')} style={{...btnStyle, flex:1, borderRadius:0, padding:'12px', background: modalLado==='DIREITA'?THEME.success:THEME.bg, color:modalLado==='DIREITA'?'white':THEME.textDim, fontSize:'11px'}}>DIR</button></div></div>
                </div>

                <div style={{display:'flex', gap:'20px'}}>
                   <div style={{flex:2}}>
                      <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>TÉCNICA DE ARREMESSO</div>
                      <div style={{position:'relative'}}><Search size={18} style={{position:'absolute', top:'13px', left:'14px', color: THEME.textDim}}/><input ref={inputRef} type="text" placeholder="Digite o nome..." value={modalNome} onChange={e=>setModalNome(e.target.value)} style={{width:'100%', padding:'12px 12px 12px 42px', background: THEME.bg, border:`1px solid ${THEME.cardBorder}`, color: THEME.text, borderRadius:'8px', fontSize:'15px', outline:'none', boxSizing:'border-box'}}/></div>
                      {sugestoes.length > 0 && (<div style={{position:'absolute', width:'100%', background: THEME.card, zIndex:100, border:`1px solid ${THEME.cardBorder}`, borderRadius:'8px', marginTop:'4px', boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.3)', overflow:'hidden'}}>{sugestoes.map(s=>(<div key={s} onClick={()=>{setModalNome(s); const exact=Object.keys(DB_GOLPES).find(k=>k.toLowerCase()===s.toLowerCase()); if(exact) setModalGrupo(DB_GOLPES[exact] as any); setSugestoes([])}} style={{padding:'12px', borderBottom:`1px solid ${THEME.cardBorder}`, cursor:'pointer', display:'flex', justifyContent:'space-between', fontSize:'14px'}}><span>{s}</span><span style={{fontSize:'10px', background:THEME.bg, padding:'2px 6px', borderRadius:'4px', color:THEME.textDim}}>{DB_GOLPES[s]}</span></div>))}</div>)}
                   </div>

                   {/* TATAME INTERATIVO */}
                   <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div style={{fontSize:'10px', color: THEME.textDim, marginBottom:'6px', fontWeight:'600'}}>LOCAL NO TATAME</div>
                      <div onClick={handleTatamiClick} style={{width:'100px', height:'100px', background: THEME.tatamiCenter, border: `4px solid ${THEME.tatamiDanger}`, position:'relative', cursor:'crosshair'}}>
                         <div style={{position:'absolute', top:'50%', left:'50%', width:'4px', height:'4px', background:'white', borderRadius:'50%', transform:'translate(-50%, -50%)', opacity:0.5}}></div>
                         {modalXY && <div style={{position:'absolute', top:`${modalXY.y}%`, left:`${modalXY.x}%`, width:'8px', height:'8px', background:'black', borderRadius:'50%', transform:'translate(-50%, -50%)', border:'1px solid white'}}></div>}
                      </div>
                      <div style={{fontSize:'9px', color: THEME.textDim, marginTop:'4px'}}>{modalXY ? 'Selecionado' : 'Clique para marcar'}</div>
                   </div>

                   {/* D-PAD */}
                   <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div style={{fontSize:'10px', color: THEME.textDim, marginBottom:'6px', fontWeight:'600'}}>DIREÇÃO</div>
                      <div style={{display:'grid', gridTemplateColumns:'24px 24px 24px', gridTemplateRows:'24px 24px 24px', gap:'2px'}}>
                          <div></div>
                          <button onClick={()=>setModalDirecao('FRENTE')} style={{background: modalDirecao==='FRENTE'?THEME.primary:THEME.bg, border:`1px solid ${THEME.cardBorder}`, borderRadius:'4px', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowUp size={14}/></button>
                          <div></div>
                          <button onClick={()=>setModalDirecao('ESQUERDA')} style={{background: modalDirecao==='ESQUERDA'?THEME.primary:THEME.bg, border:`1px solid ${THEME.cardBorder}`, borderRadius:'4px', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowLeft size={14}/></button>
                          <div style={{background:THEME.cardBorder, borderRadius:'50%', width:'10px', height:'10px', margin:'auto'}}></div>
                          <button onClick={()=>setModalDirecao('DIREITA')} style={{background: modalDirecao==='DIREITA'?THEME.primary:THEME.bg, border:`1px solid ${THEME.cardBorder}`, borderRadius:'4px', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowRight size={14}/></button>
                          <div></div>
                          <button onClick={()=>setModalDirecao('TRAS')} style={{background: modalDirecao==='TRAS'?THEME.primary:THEME.bg, border:`1px solid ${THEME.cardBorder}`, borderRadius:'4px', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowDown size={14}/></button>
                          <div></div>
                      </div>
                   </div>
                </div>

                <div style={{marginTop:'24px'}}>
                  <div style={{fontSize:'11px', color: THEME.textDim, marginBottom:'8px', fontWeight:'600'}}>RESULTADO (SELECIONADO: {resultadoPreSelecionado || 'NENHUM'})</div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    <button onClick={() => confirmarEContinuar('NADA')} style={{...btnStyle, padding: '14px', background: resultadoPreSelecionado==='NADA'?THEME.text:THEME.bg, color: resultadoPreSelecionado==='NADA'?'black':THEME.textDim, border:`1px solid ${THEME.cardBorder}`}}>NADA (N)</button>
                    <button onClick={() => confirmarEContinuar('YUKO')} style={{...btnStyle, padding: '14px', background: resultadoPreSelecionado==='YUKO'?THEME.text:THEME.bg, border:`1px solid ${THEME.cardBorder}`, color: resultadoPreSelecionado==='YUKO'?'black':THEME.text}}>YUKO (Y)</button>
                    <button onClick={() => confirmarEContinuar('WAZA-ARI')} style={{...btnStyle, padding: '14px', background: resultadoPreSelecionado==='WAZA-ARI'?THEME.warning:`rgba(234, 179, 8, 0.1)`, border:`1px solid ${THEME.warning}`, color: resultadoPreSelecionado==='WAZA-ARI'?'black':THEME.warning}}>WAZA-ARI (W)</button>
                    <button onClick={() => confirmarEContinuar('IPPON')} style={{...btnStyle, padding: '14px', background: resultadoPreSelecionado==='IPPON'?THEME.text:THEME.bg, color: resultadoPreSelecionado==='IPPON'?'black':THEME.text, border:`2px solid ${THEME.text}`}}>IPPON (I)</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}