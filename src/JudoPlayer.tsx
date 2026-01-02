import React, { useRef, useState, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';
import { createClient } from '@supabase/supabase-js'; // CLIENTE SUPABASE
import jsPDF from 'jspdf'; // GERADOR DE PDF
import autoTable from 'jspdf-autotable'; // TABELAS PDF
import { 
  Play, Pause, Trash2, Download, Video, Film, List, X, 
  Clock, Flag, CheckCircle, ChevronLeft, ChevronRight, Search, 
  MousePointerClick, Gauge, Youtube, Rewind, BarChart2, PieChart,
  Edit2, Bot, Copy, Check, Keyboard, AlertTriangle, AlertOctagon,
  PenTool, ArrowUpRight, Eraser, Palette, Maximize, Save, Eye,
  FileJson, UploadCloud, Printer, SkipBack, SkipForward, Hand,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Compass, Trophy, Layers, Tornado,
  MapPin, Grid, Activity, Triangle, PlayCircle, Users, UserPlus, MonitorPlay,
  LayoutDashboard, FolderOpen, Shield, Move, Timer, Zap
} from 'lucide-react';

// --- CONFIGURAÇÃO SUPABASE (SUAS CHAVES) ---
const supabaseUrl = 'https://swvkleuxdqvyygelnxgc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3dmtsZXV4ZHF2eXlnZWxueGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNjQ5NjUsImV4cCI6MjA4Mjk0MDk2NX0.GlroeJMkACCt-qqpux1-gzlv9WVl8iD1ELcy_CfBaQg';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- DESIGN SYSTEM (v28.2) ---
const THEME = {
  bg: '#020617', // Slate 950
  card: '#1e293b', // Slate 800
  cardBorder: '#334155', // Slate 700
  text: '#f8fafc',
  textDim: '#94a3b8',
  primary: '#3b82f6', 
  primaryGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  danger: '#ef4444', 
  success: '#10b981', 
  warning: '#eab308',
  newaza: '#06b6d4', 
  newazaGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  kumi: '#f59e0b',
  kumiGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
  .square-map {
    width: 100%;
    max-width: 220px;
    aspect-ratio: 1 / 1;
    position: relative;
    margin: 0 auto;
    background: ${THEME.tatamiCenter};
    border: 8px solid ${THEME.tatamiDanger};
    box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
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

// NOVAS TAGS OPCIONAIS
const DB_DESLOCAMENTO = ["Empurrando", "Puxando", "Rodando", "Estático"];
const DB_CADENCIA = ["Explosivo (<5s)", "Construído (5-15s)", "Lento (>15s)"];
const DB_DEFESA = ["Bloqueio (Força)", "Esquiva (Vazio)", "Tai-sabaki (Giro)", "Antecipação"];

const DB_NW_ACOES_TOP = ["Virada", "Passagem de Guarda", "Ataque Osaekomi/Shime/Kansetsu", "Domínio pelas costas"];
const DB_NW_ACOES_BOTTOM = ["Guarda", "Raspagem", "Tentativa Finalização", "Escape"];
const DB_NW_DESFECHOS = ["Mate", "Osaekomi ippon", "Osaekomi waza-ari", "Osaekomi yuko", "Osaekomi nada", "Ippon", "Progressão"];

const DB_NE_WAZA_LIST: Record<string, string> = { "kesa-gatame": "OSAEKOMI", "kuzure-kesa-gatame": "OSAEKOMI", "ushiro-kesa-gatame": "OSAEKOMI", "kata-gatame": "OSAEKOMI", "kami-shihō-gatame": "OSAEKOMI", "kuzure-kami-shihō-gatame": "OSAEKOMI", "yoko-shihō-gatame": "OSAEKOMI", "tate-shihō-gatame": "OSAEKOMI", "uki-gatame": "OSAEKOMI", "ura-gatame": "OSAEKOMI", "nami-jūji-jime": "SHIME", "gyaku-jūji-jime": "SHIME", "kata-jūji-jime": "SHIME", "hadaka-jime": "SHIME", "okuri-eri-jime": "SHIME", "kataha-jime": "SHIME", "katate-jime": "SHIME", "ryōte-jime": "SHIME", "sode-guruma-jime": "SHIME", "tsukkomi-jime": "SHIME", "sankaku-jime": "SHIME", "dō-jime": "SHIME", "ude-garami": "KANSETSU", "ude-hishigi-jūji-gatame": "KANSETSU", "ude-hishigi-ude-gatame": "KANSETSU", "ude-hishigi-hiza-gatame": "KANSETSU", "ude-hishigi-waki-gatame": "KANSETSU", "ude-hishigi-hara-gatame": "KANSETSU", "ude-hishigi-ashi-gatame": "KANSETSU", "ude-hishigi-te-gatame": "KANSETSU", "ude-hishigi-sankaku-gatame": "KANSETSU", "ashi-garami": "KANSETSU" };
const DB_GOLPES: Record<string, string> = { "seoi-nage": "TE-WAZA", "ippon-seoi-nage": "TE-WAZA", "seoi-otoshi": "TE-WAZA", "tai-otoshi": "TE-WAZA", "kata-guruma": "TE-WAZA", "sukui-nage": "TE-WAZA", "obi-otoshi": "TE-WAZA", "uki-otoshi": "TE-WAZA", "sumi-otoshi": "TE-WAZA", "yama-arashi": "TE-WAZA", "obi-tori-gaeshi": "TE-WAZA", "morote-gari": "TE-WAZA", "kuchiki-taoshi": "TE-WAZA", "kibisu-gaeshi": "TE-WAZA", "uchi-mata-sukashi": "TE-WAZA", "kouchi-gaeshi": "TE-WAZA", "uki-goshi": "KOSHI-WAZA", "ō-goshi": "KOSHI-WAZA", "koshi-guruma": "KOSHI-WAZA", "tsurikomi-goshi": "KOSHI-WAZA", "sode-tsurikomi-goshi": "KOSHI-WAZA", "harai-goshi": "KOSHI-WAZA", "tsuri-goshi": "KOSHI-WAZA", "hane-goshi": "KOSHI-WAZA", "utsuri-goshi": "KOSHI-WAZA", "ushiro-goshi": "KOSHI-WAZA", "de-ashi-harai": "ASHI-WAZA", "hiza-guruma": "ASHI-WAZA", "sasae-tsurikomi-ashi": "ASHI-WAZA", "ō-soto-gari": "ASHI-WAZA", "ō-uchi-gari": "ASHI-WAZA", "ko-soto-gari": "ASHI-WAZA", "ko-uchi-gari": "ASHI-WAZA", "okuri-ashi-harai": "ASHI-WAZA", "uchi-mata": "ASHI-WAZA", "ko-soto-gake": "ASHI-WAZA", "ashi-guruma": "ASHI-WAZA", "harai-tsurikomi-ashi": "ASHI-WAZA", "ō-guruma": "ASHI-WAZA", "ō-soto-guruma": "ASHI-WAZA", "ō-soto-otoshi": "ASHI-WAZA", "tsubame-gaeshi": "ASHI-WAZA", "ō-soto-gaeshi": "ASHI-WAZA", "ō-uchi-gaeshi": "ASHI-WAZA", "hane-goshi-gaeshi": "ASHI-WAZA", "harai-goshi-gaeshi": "ASHI-WAZA", "uchi-mata-gaeshi": "ASHI-WAZA", "tomoe-nage": "SUTEMI-WAZA", "sumi-gaeshi": "SUTEMI-WAZA", "hikikomi-gaeshi": "SUTEMI-WAZA", "tawara-gaeshi": "SUTEMI-WAZA", "ura-nage": "SUTEMI-WAZA", "yoko-otoshi": "SUTEMI-WAZA", "tani-otoshi": "SUTEMI-WAZA", "hane-makikomi": "SUTEMI-WAZA", "soto-makikomi": "SUTEMI-WAZA", "uchi-makikomi": "SUTEMI-WAZA", "uki-waza": "SUTEMI-WAZA", "yoko-wakare": "SUTEMI-WAZA", "yoko-guruma": "SUTEMI-WAZA", "yoko-gake": "SUTEMI-WAZA", "daki-wakare": "SUTEMI-WAZA", "ō-soto-makikomi": "SUTEMI-WAZA", "uchi-mata-makikomi": "SUTEMI-WAZA", "harai-makikomi": "SUTEMI-WAZA", "ko-uchi-makikomi": "SUTEMI-WAZA", "kani-basami": "SUTEMI-WAZA", "kawazu-gake": "SUTEMI-WAZA" };
const CORES_GRUPOS: any = { "TE-WAZA": "#6366f1", "KOSHI-WAZA": "#10b981", "ASHI-WAZA": "#f59e0b", "SUTEMI-WAZA": "#ef4444", "OSAEKOMI-WAZA": "#3b82f6", "SHIME-WAZA": "#a855f7", "KANSETSU-WAZA": "#ec4899" };

// --- TYPES ---
type PlaylistItem = { id: string; type: 'YOUTUBE' | 'FILE'; name: string; };
type LoopRange = { start: number; end: number } | null;
type VideoMetadata = { eventName: string; date: string; category: string; phase: string; location: string; whiteId?: string; blueId?: string };
type Coordinate = { x: number; y: number };
type Athlete = { id: string; name: string; country: string; club: string };
type Mode = 'PLAYER' | 'META';

export default function JudoPlayer() {
  // --- REFS ---
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null); 
  const youtubePlayerRef = useRef<any>(null);
  const filePlayerRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const backupInputRef = useRef<any>(null);
  const metaInputRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- GLOBAL STATE ---
  const [mode, setMode] = useState<Mode>('PLAYER');
  
  // --- STATE: VIDEO & PLAYER ---
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
  const [playlistMode, setPlaylistMode] = useState(false);
  const [playlistQueue, setPlaylistQueue] = useState<any[]>([]);
  const [playlistQueueIndex, setPlaylistQueueIndex] = useState(0);

  // --- STATE: ATHLETES & META (AGORA VINDOS DA NUVEM) ---
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [metadataMap, setMetadataMap] = useState<Record<string, VideoMetadata>>({});
  const [metaFiles, setMetaFiles] = useState<any[]>([]);
  const [targetAthleteId, setTargetAthleteId] = useState<string>('');
  
  // --- STATE: MODALS ---
  const [modalAthletes, setModalAthletes] = useState(false);
  const [newAthleteName, setNewAthleteName] = useState('');
  const [newAthleteCountry, setNewAthleteCountry] = useState('');
  const [newAthleteClub, setNewAthleteClub] = useState('');
  
  const [modalMetadata, setModalMetadata] = useState(false);
  const [metaEvent, setMetaEvent] = useState('');
  const [metaDate, setMetaDate] = useState('');
  const [metaCat, setMetaCat] = useState('');
  const [metaPhase, setMetaPhase] = useState('');
  const [metaWhiteId, setMetaWhiteId] = useState('');
  const [metaBlueId, setMetaBlueId] = useState('');

  // --- STATE: DRAWING ---
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawTool, setDrawTool] = useState<'PEN' | 'ARROW' | 'ANGLE'>('PEN');
  const [drawColor, setDrawColor] = useState('#eab308');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{x:number, y:number} | null>(null);
  const [currentStrokes, setCurrentStrokes] = useState<any[]>([]); 
  const [tempPoints, setTempPoints] = useState<any[]>([]);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  // --- STATE: UI ---
  const [modalAberto, setModalAberto] = useState(false);
  const [modalIA, setModalIA] = useState(false);
  const [modalHelp, setModalHelp] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState('TODOS');

  // --- STATE: INPUTS ---
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
  
  // NOVOS CAMPOS OPCIONAIS (v28.2)
  const [modalDeslocamento, setModalDeslocamento] = useState('');
  const [modalCadencia, setModalCadencia] = useState('');
  const [modalDefesa, setModalDefesa] = useState('');

  const [motivoShido, setMotivoShido] = useState(DB_SHIDOS[0]);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [tempoCapturado, setTempoCapturado] = useState(0);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [resultadoPreSelecionado, setResultadoPreSelecionado] = useState<string | null>(null);
  const [punicaoMode, setPunicaoMode] = useState<string | null>(null);

  // --- EFEITO: CARREGAR DADOS DO SUPABASE AO INICIAR ---
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // 1. Carregar Atletas
    const { data: dbAthletes } = await supabase.from('athletes').select('*');
    if (dbAthletes) setAthletes(dbAthletes);

    // 2. Carregar Eventos
    const { data: dbEvents } = await supabase.from('events').select('*');
    if (dbEvents) {
       const formattedEvents = dbEvents.map(e => ({
          ...e,
          videoId: e.video_id,
          corTecnica: e.cor_tecnica
       }));
       setEventos(formattedEvents);
    }

    // 3. Carregar Metadados
    const { data: dbMeta } = await supabase.from('metadata').select('*');
    if (dbMeta) {
       const map: Record<string, VideoMetadata> = {};
       dbMeta.forEach((m: any) => {
          map[m.video_id] = {
             eventName: m.event_name,
             date: m.date,
             category: m.category,
             phase: m.phase,
             location: m.location,
             whiteId: m.white_id,
             blueId: m.blue_id
          };
       });
       setMetadataMap(map);
    }
  }

  useEffect(() => {
    if (modalNome.length > 1) {
      const matches = Object.keys(DB_GOLPES).filter(k => k.toLowerCase().includes(modalNome.toLowerCase()));
      setSugestoes(matches.slice(0, 5));
      const exact = matches.find(k => k.toLowerCase() === modalNome.toLowerCase());
      if (exact) setModalGrupo(DB_GOLPES[exact] as any);
    } else { setSugestoes([]); }
  }, [modalNome]);

  // ==================================================================================
  // 1. CALCULOS (PLAYER MODE)
  // ==================================================================================
  const currentVideo = useMemo(() => playlist[currentVideoIndex] || { id: '', type: 'YOUTUBE', name: '' }, [playlist, currentVideoIndex]);
  const currentMetadata = useMemo(() => metadataMap[currentVideo.id] || { eventName: 'Evento não definido', date: new Date().toLocaleDateString(), category: 'Geral', phase: 'Luta', location: '' }, [metadataMap, currentVideo.id]);
  const athleteWhite = useMemo(() => athletes.find(a => a.id === currentMetadata.whiteId), [athletes, currentMetadata]);
  const athleteBlue = useMemo(() => athletes.find(a => a.id === currentMetadata.blueId), [athletes, currentMetadata]);
  const labelWhite = athleteWhite ? athleteWhite.name.split(' ')[0].toUpperCase() : 'BRANCO';
  const labelBlue = athleteBlue ? athleteBlue.name.split(' ')[0].toUpperCase() : 'AZUL';

  const isFightActive = useMemo(() => { const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'FLUXO').sort((a:any, b:any) => b.tempo - a.tempo); return evs.length > 0 && evs[0].tipo === 'HAJIME'; }, [eventos, currentVideo.name]);
  const accumulatedFightTime = useMemo(() => {
    let total = 0; let start = null;
    const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'FLUXO').sort((a:any, b:any) => a.tempo - b.tempo);
    for (const ev of evs) { if (ev.tipo === 'HAJIME') start = ev.tempo; else if ((ev.tipo === 'MATE' || ev.tipo === 'SOREMADE') && start !== null) { total += (ev.tempo - start); start = null; } }
    if (start !== null && currentTime > start) total += (currentTime - start);
    return total;
  }, [eventos, currentTime, currentVideo.name]);

  const tempoDisplay = useMemo(() => {
    const elapsed = accumulatedFightTime;
    if (elapsed <= 240) return { text: "TEMPO REGULAR", time: `${Math.floor((240-elapsed)/60)}:${Math.floor((240-elapsed)%60).toString().padStart(2,'0')}`, isGS: false };
    else return { text: "GOLDEN SCORE", time: `${Math.floor((elapsed-240)/60)}:${Math.floor((elapsed-240)%60).toString().padStart(2,'0')}`, isGS: true };
  }, [accumulatedFightTime]);

  const fightStartTime = useMemo(() => {
    const evs = eventos.filter((ev:any) => ev.videoId === currentVideo.name && ev.categoria === 'FLUXO' && ev.tipo === 'HAJIME').sort((a:any,b:any)=>a.tempo-b.tempo);
    return evs.length > 0 ? evs[0].tempo : 0;
  }, [eventos, currentVideo.name]);

  const placar = useMemo(() => {
    const p = { branco: { ippon:0, waza:0, yuko:0, shido:0 }, azul: { ippon:0, waza:0, yuko:0, shido:0 } };
    eventos.filter((ev:any) => ev.videoId === currentVideo.name).forEach((ev: any) => {
      const q = ev.atleta === 'BRANCO' ? p.branco : p.azul;
      if (ev.resultado && (ev.resultado.includes('ippon') || ev.resultado.includes('Ippon'))) q.ippon++;
      if (ev.resultado && ev.resultado.includes('waza-ari')) q.waza++;
      if (ev.resultado && ev.resultado.includes('yuko')) q.yuko++;
      if (ev.categoria === 'PUNICAO') { if (ev.tipo === 'SHIDO') q.shido++; if (ev.tipo === 'HANSOKU') q.shido += 3; }
      if (ev.categoria === 'NE-WAZA') { 
          if (ev.resultado && (ev.resultado.includes('ippon') || ev.resultado.includes('Ippon'))) q.ippon++;
          if (ev.resultado && ev.resultado.includes('waza-ari')) q.waza++;
          if (ev.resultado && ev.resultado.includes('yuko')) q.yuko++;
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
  // 3. META ANALISE
  // ==================================================================================
  const metaDetectedAthletes = useMemo(() => {
      const detected = new Set<string>();
      metaFiles.forEach(f => {
          if (f.metadata) {
              const meta = f.metadata[Object.keys(f.metadata)[0]]; 
              if (meta?.whiteId) detected.add(meta.whiteId);
              if (meta?.blueId) detected.add(meta.blueId);
          }
      });
      return Array.from(detected).map(id => athletes.find(a => a.id === id)).filter(Boolean);
  }, [metaFiles, athletes]);

  const metaStats = useMemo(() => {
      if (!targetAthleteId || metaFiles.length === 0) return null;
      let totalMatches = 0; let totalWins = 0; let totalIppons = 0; let totalWazas = 0; let totalShidos = 0; let totalAttacks = 0;
      const directions = { FRENTE: 0, TRAS: 0, ESQUERDA: 0, DIREITA: 0 };
      const heatPoints: Coordinate[] = [];
      const techniques: Record<string, number> = {};

      metaFiles.forEach(file => {
          totalMatches++;
          const fileEvents = file.eventos || [];
          const fileMeta = file.metadata ? Object.values(file.metadata)[0] as VideoMetadata : null;
          let myColor = '';
          if (fileMeta?.whiteId === targetAthleteId) myColor = 'BRANCO'; else if (fileMeta?.blueId === targetAthleteId) myColor = 'AZUL';
          if (myColor) {
              fileEvents.forEach((ev: any) => {
                  if (ev.atleta === myColor) {
                      if (ev.categoria === 'TECNICA') {
                          totalAttacks++;
                          if (ev.direcao) directions[ev.direcao as keyof typeof directions]++;
                          if (ev.coordenadas) heatPoints.push(ev.coordenadas);
                          if (ev.especifico) techniques[ev.especifico] = (techniques[ev.especifico] || 0) + 1;
                          if (ev.resultado && (ev.resultado.includes('Ippon') || ev.resultado.includes('ippon'))) { totalIppons++; totalWins++; }
                          if (ev.resultado && ev.resultado.includes('waza')) totalWazas++;
                      }
                      if (ev.categoria === 'NE-WAZA' && ev.resultado && (ev.resultado.includes('Ippon') || ev.resultado.includes('ippon'))) { totalIppons++; totalWins++; }
                      if (ev.categoria === 'PUNICAO') totalShidos++;
                  }
              });
          }
      });

      const totalDir = directions.FRENTE + directions.TRAS + directions.ESQUERDA + directions.DIREITA || 1;
      const radar = { FRENTE: directions.FRENTE / totalDir, TRAS: directions.TRAS / totalDir, ESQUERDA: directions.ESQUERDA / totalDir, DIREITA: directions.DIREITA / totalDir };
      const topTechs = Object.entries(techniques).sort((a,b) => b[1] - a[1]).slice(0, 5);
      return { totalMatches, totalWins, totalIppons, totalWazas, totalShidos, totalAttacks, radar, heatPoints, topTechs };
  }, [metaFiles, targetAthleteId]);

  // ==================================================================================
  // 4. FUNÇÕES GERAIS (MODIFICADAS PARA SUPABASE)
  // ==================================================================================
  
  const formatTimeVideo = (s: number) => `${Math.floor(Math.abs(s)/60)}:${Math.floor(Math.abs(s)%60).toString().padStart(2,'0')}`;
  
  // SALVAR ATLETA (NUVEM)
  const saveAthlete = async () => { 
    if(!newAthleteName) return; 
    const newAthlete = { id: Date.now().toString(), name: newAthleteName, country: newAthleteCountry || '???', club: newAthleteClub };
    setAthletes([...athletes, newAthlete]); 
    await supabase.from('athletes').insert([newAthlete]);
    setNewAthleteName(''); setNewAthleteCountry(''); setNewAthleteClub(''); 
  };

  // DELETAR ATLETA (NUVEM)
  const deleteAthlete = async (id: string) => { 
    setAthletes(athletes.filter(a => a.id !== id)); 
    await supabase.from('athletes').delete().eq('id', id);
  };

  const openMetadataModal = () => { setMetaEvent(currentMetadata.eventName); setMetaDate(currentMetadata.date); setMetaCat(currentMetadata.category); setMetaPhase(currentMetadata.phase); setMetaWhiteId(currentMetadata.whiteId || ''); setMetaBlueId(currentMetadata.blueId || ''); setModalMetadata(true); };
  
  // SALVAR METADADOS (NUVEM)
  const saveMetadata = async () => { 
    const newMeta = { eventName: metaEvent, date: metaDate, category: metaCat, phase: metaPhase, location: '', whiteId: metaWhiteId, blueId: metaBlueId };
    setMetadataMap(prev => ({ ...prev, [currentVideo.id]: newMeta })); 
    await supabase.from('metadata').upsert({
       video_id: currentVideo.id,
       event_name: metaEvent,
       date: metaDate,
       category: metaCat,
       phase: metaPhase,
       location: '',
       white_id: metaWhiteId,
       blue_id: metaBlueId
    });
    setModalMetadata(false); 
  };

  const applyMetadataToAll = () => { if (confirm("Aplicar estes dados para TODOS os vídeos da playlist?")) { const newMap = { ...metadataMap }; const commonMeta = { eventName: metaEvent, date: metaDate, category: metaCat, phase: metaPhase, location: '', whiteId: metaWhiteId, blueId: metaBlueId }; playlist.forEach(vid => { newMap[vid.id] = commonMeta; }); setMetadataMap(newMap); setModalMetadata(false); alert("Dados replicados!"); } };

  const iniciarPlaylistPlayer = () => { const queue = filteredEventos.sort((a:any, b:any) => a.tempo - b.tempo); if (queue.length === 0) { alert("Nenhum evento filtrado para assistir."); return; } setPlaylistQueue(queue); setPlaylistQueueIndex(0); setPlaylistMode(true); const startTime = Math.max(0, queue[0].tempo - 4); if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current.seekTo(startTime, true); else filePlayerRef.current.currentTime = startTime; setIsPlaying(true); if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current.playVideo(); else filePlayerRef.current.play(); };
  const pararPlaylistPlayer = () => { setPlaylistMode(false); setPlaylistQueue([]); };

  // REGISTRAR FLUXO (NUVEM)
  const registrarFluxo = async (tipo: string) => {
     const id = Date.now();
     const novo = { id, videoId: currentVideo.name, tempo: currentTime, categoria: 'FLUXO', tipo, atleta: '-', lado: '-', corTecnica: THEME.neutral };
     setEventos(prev => [novo, ...prev]);
     await supabase.from('events').insert([{
        id,
        video_id: currentVideo.name,
        tempo: currentTime,
        categoria: 'FLUXO',
        tipo,
        atleta: '-',
        lado: '-',
        cor_tecnica: THEME.neutral
     }]);
  };

  // REGISTRAR PUNIÇÃO RÁPIDA (NUVEM)
  const registrarPunicaoDireto = async (tipo: string, atleta: string) => {
     const id = Date.now();
     const novo = { id, videoId: currentVideo.name, tempo: currentTime, categoria: 'PUNICAO', tipo, especifico: motivoShido, atleta, lado: '-', corTecnica: THEME.warning };
     setEventos(prev => [novo, ...prev]);
     await supabase.from('events').insert([{
        id,
        video_id: currentVideo.name,
        tempo: currentTime,
        categoria: 'PUNICAO',
        tipo,
        especifico: motivoShido,
        atleta,
        lado: '-',
        cor_tecnica: THEME.warning
     }]);
  };
  
  const abrirKumiKata = () => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); setTempoCapturado(currentTime); setKumiAtleta('BRANCO'); setModalKumi(true); };
  
  // SALVAR KUMI KATA (NUVEM)
  const salvarKumiKata = async () => { 
      const detalhe = `${kumiBase} (D:${kumiDir} / E:${kumiEsq})`; 
      const id = Date.now();
      const dados = { id, videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'KUMI-KATA', tipo: 'PEGADA', especifico: detalhe, atleta: kumiAtleta, lado: '-', corTecnica: kumiAtleta === 'AZUL' ? THEME.primary : '#ffffff' }; 
      setEventos((prev:any) => [dados, ...prev]); 
      
      await supabase.from('events').insert([{
          id, 
          video_id: currentVideo.name, 
          tempo: tempoCapturado, 
          categoria: 'KUMI-KATA', 
          tipo: 'PEGADA', 
          especifico: detalhe, 
          atleta: kumiAtleta, 
          lado: '-', 
          cor_tecnica: kumiAtleta === 'AZUL' ? THEME.primary : '#ffffff'
      }]);

      setModalKumi(false); 
      if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.playVideo(); else filePlayerRef.current?.play(); 
  };

  const abrirNeWaza = () => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); setTempoCapturado(currentTime); setNwAtleta('BRANCO'); setNwEntrada('DIRETA'); setNwPosicao('POR CIMA'); setNwAcao(DB_NW_ACOES_TOP[0]); setNwTecnica(''); setNwDesfecho('Mate'); setModalNeWaza(true); };
  
  // SALVAR NE WAZA (NUVEM)
  const salvarNeWaza = async () => { 
      const detalheTecnica = nwTecnica ? ` (${nwTecnica})` : ''; 
      const detalhe = `${nwEntrada} | ${nwPosicao} > ${nwAcao}${detalheTecnica}`; 
      const id = Date.now();
      const dados = { id, videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'NE-WAZA', tipo: nwPosicao, especifico: detalhe, resultado: nwDesfecho, atleta: nwAtleta, lado: '-', corTecnica: THEME.newaza }; 
      setEventos((prev:any) => [dados, ...prev]); 
      
      await supabase.from('events').insert([{
          id,
          video_id: currentVideo.name,
          tempo: tempoCapturado,
          categoria: 'NE-WAZA',
          tipo: nwPosicao,
          especifico: detalhe,
          resultado: nwDesfecho,
          atleta: nwAtleta,
          lado: '-',
          cor_tecnica: THEME.newaza
      }]);

      setModalNeWaza(false); 
      if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.playVideo(); else filePlayerRef.current?.play(); 
  };

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

  // SALVAR E FECHAR (GERAL / NAGE-WAZA) - NUVEM
  const salvarEFechar = async (dados: any) => { 
    let novoEvento;
    if (editingEventId) {
        // Lógica de Edição (Update)
        const eventoEditado = eventos.map((ev: any) => ev.id === editingEventId ? { ...ev, ...dados } : ev);
        setEventos(eventoEditado);
        
        // Objeto para Supabase (snake_case)
        const dbObj = {
            video_id: dados.videoId,
            tempo: dados.tempo,
            categoria: dados.categoria,
            tipo: dados.tipo,
            especifico: dados.especifico,
            atleta: dados.atleta,
            lado: dados.lado,
            cor_tecnica: dados.corTecnica,
            resultado: dados.resultado,
            direcao: dados.direcao,
            coordenadas: dados.coordenadas,
            deslocamento: dados.deslocamento,
            cadencia: dados.cadencia,
            defesa: dados.defesa,
            vetores: dados.vetores
        };
        // Filtra undefineds para não dar erro
        Object.keys(dbObj).forEach(key => (dbObj as any)[key] === undefined && delete (dbObj as any)[key]);
        
        await supabase.from('events').update(dbObj).eq('id', editingEventId);

    } else {
        // Novo Evento (Insert)
        novoEvento = { id: Date.now(), ...dados };
        setEventos([novoEvento, ...eventos]); 
        
        const dbObj = {
            id: novoEvento.id,
            video_id: novoEvento.videoId,
            tempo: novoEvento.tempo,
            categoria: novoEvento.categoria,
            tipo: novoEvento.tipo,
            especifico: novoEvento.especifico,
            atleta: novoEvento.atleta,
            lado: novoEvento.lado,
            cor_tecnica: novoEvento.corTecnica,
            resultado: novoEvento.resultado,
            direcao: novoEvento.direcao,
            coordenadas: novoEvento.coordenadas,
            deslocamento: novoEvento.deslocamento,
            cadencia: novoEvento.cadencia,
            defesa: novoEvento.defesa,
            vetores: novoEvento.vetores
        };
        await supabase.from('events').insert([dbObj]);
    }
    
    setModalAberto(false); 
    if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current.playVideo(); else filePlayerRef.current.play(); 
  };

  const confirmarEContinuar = (resultado: string) => { 
      const dados = { 
          videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'TECNICA', grupo: modalGrupo, especifico: modalNome || "Técnica Geral", atleta: modalAtleta, lado: modalLado, corTecnica: CORES_GRUPOS[modalGrupo], resultado: resultado, direcao: modalDirecao, coordenadas: modalXY,
          deslocamento: modalDeslocamento, cadencia: modalCadencia, defesa: modalDefesa 
      }; 
      salvarEFechar(dados); 
  };
  const confirmarPunicao = (atleta: string) => { const dados = { videoId: currentVideo.name, tempo: tempoCapturado, categoria: 'PUNICAO', tipo: punicaoMode, especifico: motivoShido, atleta, lado: '-', corTecnica: THEME.warning }; salvarEFechar(dados); };
  const iniciarRegistroRapido = (resultadoInicial?: string) => { 
      if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); 
      let t = currentTime; if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) t = youtubePlayerRef.current.getCurrentTime(); else if(filePlayerRef.current) t = filePlayerRef.current.currentTime; 
      setEditingEventId(null); setTempoCapturado(t); setModalAtleta('BRANCO'); setModalNome(''); setModalDirecao('FRENTE'); setModalXY(null); setPunicaoMode(null); setResultadoPreSelecionado(resultadoInicial || null); 
      setModalDeslocamento(''); setModalCadencia(''); setModalDefesa('');
      setModalAberto(true); setTimeout(() => inputRef.current?.focus(), 100); 
  };
  const iniciarRegistroPunicaoTeclado = (tipo: 'SHIDO' | 'HANSOKU') => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); let t = currentTime; if (currentVideo.type === 'YOUTUBE' && youtubePlayerRef.current) t = youtubePlayerRef.current.getCurrentTime(); else if(filePlayerRef.current) t = filePlayerRef.current.currentTime; setEditingEventId(null); setTempoCapturado(t); setPunicaoMode(tipo); setModalAberto(true); };
  const editarEvento = (ev: any) => { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current.pauseVideo(); else filePlayerRef.current.pause(); setEditingEventId(ev.id); setTempoCapturado(ev.tempo); setModalAtleta(ev.atleta); setModalLado(ev.lado); if (ev.categoria === 'PUNICAO') { setPunicaoMode(ev.tipo); setMotivoShido(ev.especifico); } else { setPunicaoMode(null); setModalNome(ev.especifico === "Técnica Geral" ? "" : ev.especifico); setModalGrupo(ev.grupo || 'TE-WAZA'); setResultadoPreSelecionado(ev.resultado); setModalDirecao(ev.direcao || 'FRENTE'); setModalXY(ev.coordenadas || null); setModalDeslocamento(ev.deslocamento||''); setModalCadencia(ev.cadencia||''); setModalDefesa(ev.defesa||''); } setModalAberto(true); };
  
  const handleTatamiClick = (e: React.MouseEvent) => { const rect = e.currentTarget.getBoundingClientRect(); const x = ((e.clientX - rect.left) / rect.width) * 100; const y = ((e.clientY - rect.top) / rect.height) * 100; setModalXY({ x, y }); };
  const clearCanvas = () => { if (canvasRef.current) { const ctx = canvasRef.current.getContext('2d'); if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); } setCurrentStrokes([]); };
  
  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) => { 
      const headLength = 20; 
      const angle = Math.atan2(toY - fromY, toX - fromX); 
      ctx.beginPath(); ctx.moveTo(fromX, fromY); ctx.lineTo(toX, toY); ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke(); 
      ctx.beginPath(); ctx.moveTo(toX, toY); 
      ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6)); 
      ctx.moveTo(toX, toY); 
      ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6)); 
      ctx.stroke(); 
  };
  
  const calculateAngle = (p1: any, p2: any, p3: any) => { const p12 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)); const p23 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2)); const p13 = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2)); const radians = Math.acos((p12*p12 + p23*p23 - p13*p13) / (2 * p12 * p23)); return Math.round(radians * 180 / Math.PI); };
  
  const redrawStrokes = (strokesToDraw: any[]) => { 
      if (!canvasRef.current) return; const ctx = canvasRef.current.getContext('2d'); if (!ctx) return; 
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); 
      strokesToDraw.forEach(stroke => { 
          ctx.strokeStyle = stroke.color; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; 
          if (stroke.tool === 'PEN') { 
              ctx.beginPath(); if (stroke.points.length > 0) { ctx.moveTo(stroke.points[0].x, stroke.points[0].y); stroke.points.forEach((p:any) => ctx.lineTo(p.x, p.y)); } ctx.stroke(); 
          } else if (stroke.tool === 'ARROW') { 
              if (stroke.points.length >= 2) { const start = stroke.points[0]; const end = stroke.points[stroke.points.length - 1]; drawArrow(ctx, start.x, start.y, end.x, end.y, stroke.color); } 
          } else if (stroke.tool === 'ANGLE') {
              if (stroke.points.length === 3) {
                  const [p1, p2, p3] = stroke.points;
                  ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.stroke();
                  ctx.beginPath(); ctx.arc(p2.x, p2.y, 20, 0, 2 * Math.PI); ctx.stroke();
                  const angle = calculateAngle(p1, p2, p3);
                  ctx.font = "bold 20px Arial"; ctx.fillStyle = stroke.color; ctx.fillText(`${angle}°`, p2.x + 25, p2.y);
              }
          }
      }); 
  };

  const toggleDrawingMode = (loadStrokes?: any[]) => { const newState = !isDrawingMode; setIsDrawingMode(newState); if (newState) { if (currentVideo.type === 'YOUTUBE') youtubePlayerRef.current?.pauseVideo(); else filePlayerRef.current?.pause(); if (playerContainerRef.current) { if (playerContainerRef.current.requestFullscreen) { playerContainerRef.current.requestFullscreen().catch(() => setIsDataFullscreen(true)); } else { setIsDataFullscreen(true); } } setTimeout(() => { if(canvasRef.current && canvasRef.current.parentElement) { canvasRef.current.width = canvasRef.current.parentElement.clientWidth; canvasRef.current.height = canvasRef.current.parentElement.clientHeight; if (loadStrokes && loadStrokes.length > 0) { setCurrentStrokes(loadStrokes); redrawStrokes(loadStrokes); } } }, 100); } else { if (document.fullscreenElement) document.exitFullscreen(); setIsDataFullscreen(false); clearCanvas(); } };
  
  // SALVAR DESENHO (NUVEM)
  const salvarDesenhoNoLog = async () => { 
      if (currentStrokes.length === 0) { alert("Desenhe algo antes de salvar!"); return; } 
      const id = Date.now();
      const novo = { id, videoId: currentVideo.name, tempo: currentTime, categoria: 'ANALISE', tipo: 'DESENHO', especifico: 'Anotação Tática Visual', atleta: '-', lado: '-', corTecnica: '#a855f7', vetores: currentStrokes };
      setEventos((prev: any[]) => [novo, ...prev]); 
      
      await supabase.from('events').insert([{
          id,
          video_id: currentVideo.name,
          tempo: currentTime,
          categoria: 'ANALISE',
          tipo: 'DESENHO',
          especifico: 'Anotação Tática Visual',
          atleta: '-',
          lado: '-',
          cor_tecnica: '#a855f7',
          vetores: currentStrokes
      }]);

      alert("Anotação Visual Catalogada!"); 
      toggleDrawingMode(); 
  };
  
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => { 
      e.preventDefault(); e.stopPropagation(); if (!isDrawingMode || !canvasRef.current) return; 
      const ctx = canvasRef.current.getContext('2d'); if (!ctx) return; 
      const rect = canvasRef.current.getBoundingClientRect(); 
      const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX; 
      const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as any).clientY; 
      const x = clientX - rect.left; const y = clientY - rect.top; 
      
      if (drawTool === 'ANGLE') {
          const newPoints = [...tempPoints, {x, y}];
          if (newPoints.length < 3) {
              setTempPoints(newPoints);
              ctx.fillStyle = drawColor; ctx.beginPath(); ctx.arc(x, y, 5, 0, 2*Math.PI); ctx.fill();
          } else {
              setCurrentStrokes(prev => [...prev, { tool: 'ANGLE', color: drawColor, points: newPoints }]);
              setTempPoints([]);
              redrawStrokes([...currentStrokes, { tool: 'ANGLE', color: drawColor, points: newPoints }]);
          }
          return;
      }

      setIsDrawing(true); setTempPoints([{x, y}]); 
      if (drawTool === 'PEN') { ctx.beginPath(); ctx.moveTo(x, y); ctx.strokeStyle = drawColor; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; } 
      else if (drawTool === 'ARROW') { setStartPos({x, y}); setSnapshot(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)); } 
  };

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

  // --- META UPLOAD ---
  const handleMetaUpload = (e: any) => {
      const files = Array.from(e.target.files);
      const readers = files.map((file: any) => {
          return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (ev) => resolve(JSON.parse(ev.target?.result as string));
              reader.readAsText(file);
          });
      });
      Promise.all(readers).then((results: any[]) => {
          setMetaFiles(results);
          alert(`${results.length} lutas carregadas para Meta-Análise!`);
      });
  };

  return (
    <div ref={mainContainerRef} tabIndex={0} style={{ maxWidth: '100%', minHeight: '100vh', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: THEME.text, backgroundColor: THEME.bg, padding: '20px', boxSizing: 'border-box', outline: 'none' }}>
      
      {/* GLOBAL STYLES INJECTION */}
      <style>{GLOBAL_STYLES}</style>

      {/* HEADER */}
      <div className="no-print" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0, fontSize: isMobile?'24px':'32px', fontWeight: '800', letterSpacing: '-1px', display: 'flex', alignItems: 'center' }}>
          <div style={{background: THEME.primaryGradient, padding:'8px', borderRadius:'12px', marginRight:'12px', boxShadow:`0 0 20px ${THEME.primary}44`}}><Video size={24} color="white"/></div>
          <div><span style={{ color: 'white' }}>SMAART</span><span style={{ color: THEME.primary }}>PRO</span><div style={{fontSize:'10px', color: THEME.textDim, fontWeight:'400', letterSpacing:'2px', marginTop:'-4px'}}>ELITE JUDO ANALYTICS</div></div>
          <span style={{ fontSize: '10px', color: THEME.text, marginLeft: '12px', background: THEME.cardBorder, padding: '4px 8px', borderRadius: '20px', border:`1px solid rgba(255,255,255,0.1)` }}>v28.4</span>
        </h1>
        
        <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
          <div style={{display:'flex', gap:'8px'}}>
             <button onClick={() => setMode('PLAYER')} style={{...btnStyle, background: mode==='PLAYER'?THEME.primary:THEME.card, color: mode==='PLAYER'?'white':THEME.textDim, padding:'10px', borderRadius:'10px'}} title="Modo Player"><MonitorPlay size={18}/></button>
             <button onClick={() => setMode('META')} style={{...btnStyle, background: mode==='META'?THEME.primary:THEME.card, color: mode==='META'?'white':THEME.textDim, padding:'10px', borderRadius:'10px'}} title="Modo Meta-Análise"><LayoutDashboard size={18}/></button>
          </div>
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

          <button onClick={imprimirRelatorio} style={{...btnStyle, background: 'white', color:'black', padding:'10px 12px', fontSize: '13px', border:'none', fontWeight:'700'}}><Printer size={16}/> RELATÓRIO</button>
          <button onClick={gerarPromptIA} style={{...btnStyle, background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', color:'white', padding:'10px 16px', fontSize: '13px', border:'none', boxShadow:'0 4px 12px rgba(168, 85, 247, 0.4)', borderRadius:'10px'}}><Bot size={18}/> AI Report</button>
          <button onClick={() => setShowPlaylist(!showPlaylist)} style={{...btnStyle, background: showPlaylist ? THEME.primary : THEME.card, color: showPlaylist ? 'white' : THEME.textDim, padding:'8px 12px', fontSize: '13px', border:`1px solid ${showPlaylist ? THEME.primary : THEME.cardBorder}`}}><List size={16}/> {playlist.length}</button>
          <button onClick={baixarCSV} style={{...btnStyle, background: THEME.success, color:'white', padding:'8px 16px', fontSize: '13px'}}><Download size={16}/> CSV</button>
        </div>
      </div>

      {/* --- CONTENT SWITCHER --- */}
      {mode === 'META' ? (
         <div className="no-print">
            {/* META DASHBOARD */}
            <div style={{...cardStyle, padding:'30px', minHeight:'80vh'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
                    <div>
                        <h2 style={{fontSize:'24px', fontWeight:'800', marginBottom:'5px'}}>META-ANÁLISE</h2>
                        <div style={{fontSize:'14px', color: THEME.textDim}}>Inteligência de Dados Multi-Luta</div>
                    </div>
                    <div style={{display:'flex', gap:'15px'}}>
                        <button onClick={() => metaInputRef.current.click()} style={{...btnStyle, padding:'12px 20px', background: THEME.primary, color:'white', fontSize:'14px'}}><FolderOpen size={18}/> CARREGAR LUTAS (JSON)</button>
                        <input type="file" ref={metaInputRef} style={{display:'none'}} multiple accept=".json" onChange={handleMetaUpload} />
                        
                        <select value={targetAthleteId} onChange={(e) => setTargetAthleteId(e.target.value)} style={{padding:'10px', borderRadius:'8px', background: THEME.bg, border:`1px solid ${THEME.cardBorder}`, color:'white'}}>
                            <option value="">-- Selecione o Atleta Alvo --</option>
                            {metaDetectedAthletes.map((a:any) => <option key={a.id} value={a.id}>{a.name} ({a.country})</option>)}
                        </select>
                    </div>
                </div>

                {metaFiles.length === 0 ? (
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'400px', border:`2px dashed ${THEME.cardBorder}`, borderRadius:'20px', color:THEME.textDim}}>
                        <UploadCloud size={64} style={{opacity:0.5, marginBottom:'20px'}}/>
                        <div style={{fontSize:'18px', fontWeight:'700'}}>Arraste ou carregue arquivos .JSON aqui</div>
                        <div style={{fontSize:'14px'}}>Analise múltiplas lutas simultaneamente.</div>
                    </div>
                ) : (
                    <>
                       {/* STATS CARDS */}
                       {metaStats ? (
                           <>
                           <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'15px', marginBottom:'30px'}}>
                               <div style={{background: THEME.bg, padding:'20px', borderRadius:'12px', border:`1px solid ${THEME.cardBorder}`}}>
                                   <div style={{fontSize:'12px', color:THEME.textDim}}>TOTAL LUTAS</div>
                                   <div style={{fontSize:'32px', fontWeight:'800'}}>{metaStats.totalMatches}</div>
                               </div>
                               <div style={{background: THEME.bg, padding:'20px', borderRadius:'12px', border:`1px solid ${THEME.cardBorder}`}}>
                                   <div style={{fontSize:'12px', color:THEME.textDim}}>VITÓRIAS (IPPON)</div>
                                   <div style={{fontSize:'32px', fontWeight:'800', color:THEME.success}}>{metaStats.totalWins}</div>
                               </div>
                               <div style={{background: THEME.bg, padding:'20px', borderRadius:'12px', border:`1px solid ${THEME.cardBorder}`}}>
                                   <div style={{fontSize:'12px', color:THEME.textDim}}>TAXA VITÓRIA</div>
                                   <div style={{fontSize:'32px', fontWeight:'800', color:THEME.primary}}>{((metaStats.totalWins / (metaStats.totalMatches || 1))*100).toFixed(0)}%</div>
                               </div>
                               <div style={{background: THEME.bg, padding:'20px', borderRadius:'12px', border:`1px solid ${THEME.cardBorder}`}}>
                                   <div style={{fontSize:'12px', color:THEME.textDim}}>ATAQUES TOTAIS</div>
                                   <div style={{fontSize:'32px', fontWeight:'800'}}>{metaStats.totalAttacks}</div>
                               </div>
                               <div style={{background: THEME.bg, padding:'20px', borderRadius:'12px', border:`1px solid ${THEME.cardBorder}`}}>
                                   <div style={{fontSize:'12px', color:THEME.textDim}}>SHIDOS</div>
                                   <div style={{fontSize:'32px', fontWeight:'800', color:THEME.danger}}>{metaStats.totalShidos}</div>
                               </div>
                           </div>

                           <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px'}}>
                               {/* GLOBAL RADAR */}
                               <div style={{...cardStyle, padding:'20px'}}>
                                   <h3 style={{fontSize:'14px', marginBottom:'20px', display:'flex', gap:'8px'}}><Compass size={18}/> DIREÇÃO PREDOMINANTE</h3>
                                   <div style={{height:'200px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
                                      <div style={{position:'absolute', top:20, opacity:metaStats.radar.FRENTE}}><ArrowUp size={40} color={THEME.primary}/></div>
                                      <div style={{position:'absolute', bottom:20, opacity:metaStats.radar.TRAS}}><ArrowDown size={40} color={THEME.primary}/></div>
                                      <div style={{position:'absolute', left:20, opacity:metaStats.radar.ESQUERDA}}><ArrowLeft size={40} color={THEME.primary}/></div>
                                      <div style={{position:'absolute', right:20, opacity:metaStats.radar.DIREITA}}><ArrowRight size={40} color={THEME.primary}/></div>
                                      <div style={{width:'10px', height:'10px', background:'white', borderRadius:'50%'}}></div>
                                   </div>
                               </div>

                               {/* GLOBAL HEATMAP */}
                               <div style={{...cardStyle, padding:'20px'}}>
                                   <h3 style={{fontSize:'14px', marginBottom:'20px', display:'flex', gap:'8px'}}><MapPin size={18}/> MAPA DE CALOR ACUMULADO</h3>
                                   <div className="square-map">
                                       {metaStats.heatPoints.map((pt:any, i:number) => (
                                           <div key={i} style={{position:'absolute', top:`${pt.y}%`, left:`${pt.x}%`, width:'8px', height:'8px', background: THEME.primary, borderRadius:'50%', transform:'translate(-50%, -50%)', opacity:0.6}}></div>
                                       ))}
                                   </div>
                               </div>
                           </div>

                           {/* TOP TECHNIQUES */}
                           <div style={{marginTop:'30px'}}>
                               <h3 style={{fontSize:'14px', marginBottom:'15px'}}>TOKUI-WAZA (TÉCNICAS FAVORITAS)</h3>
                               {metaStats.topTechs.map(([tech, count]: any) => (
                                   <div key={tech} style={{display:'flex', alignItems:'center', marginBottom:'10px', fontSize:'13px'}}>
                                       <div style={{width:'150px', fontWeight:'600'}}>{tech}</div>
                                       <div style={{flex:1, height:'8px', background:THEME.bg, borderRadius:'4px', overflow:'hidden'}}>
                                           <div style={{width:`${(count / (metaStats.totalAttacks || 1))*100}%`, height:'100%', background:THEME.success}}></div>
                                       </div>
                                       <div style={{width:'40px', textAlign:'right', fontWeight:'700'}}>{count}</div>
                                   </div>
                               ))}
                           </div>
                           </>
                       ) : (
                           <div style={{textAlign:'center', padding:'50px', color:THEME.textDim}}>Selecione um atleta acima para gerar a análise.</div>
                       )}
                    </>
                )}
            </div>
         </div>
      ) : (
         /* PLAYER MODE */
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
                <button onClick={() => registrarFluxo('SOREMADE')} style={{...btnStyle, flex:1, background: THEME.card, border:`1px solid ${THEME.cardBorder}`, color:THEME.text, padding:'16px', borderRadius:'12px', fontSize:'13px', fontWeight:'700'}}><Flag size={18}/> SOREMADE</button>
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
                    <div
                    style={{fontSize:'10px', color: THEME.textDim, fontWeight:'700', marginBottom:'10px', display:'flex', gap:'6px'}}><PieChart size={12}/> VOLUME</div>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                       <SimpleDonut data={stats.groupData} />
                    </div>
                 </div>
              </div>

              {/* --- EVENT LOG & FILTERS --- */}
              <div style={{...cardStyle, flex: 1, display:'flex', flexDirection:'column', overflow:'hidden', minHeight:'300px'}}>
                  {/* Filter Tabs */}
                  <div style={{padding:'12px', borderBottom:`1px solid ${THEME.cardBorder}`, display:'flex', gap:'8px', overflowX:'auto'}}>
                      {['TODOS', 'PONTOS', 'PUNICAO', 'NE-WAZA', 'BRANCO', 'AZUL'].map(f => (
                          <button key={f} onClick={() => setActiveFilter(f)} style={{...btnStyle, padding:'6px 12px', fontSize:'11px', borderRadius:'20px', background: activeFilter===f ? THEME.text : 'transparent', color: activeFilter===f ? THEME.bg : THEME.textDim, border: `1px solid ${activeFilter===f ? 'transparent' : THEME.cardBorder}`}}>{f}</button>
                      ))}
                  </div>

                  {/* List */}
                  <div style={{flex:1, overflowY:'auto', padding:'0'}}>
                      {filteredEventos.length === 0 ? (
                          <div style={{padding:'40px', textAlign:'center', color:THEME.textDim, fontSize:'13px'}}>Nenhum evento registrado.</div>
                      ) : (
                          filteredEventos.sort((a:any, b:any) => b.tempo - a.tempo).map((ev: any) => (
                              <div key={ev.id} onClick={() => editarEvento(ev)} className="glow-hover" style={{padding:'12px 16px', borderBottom:`1px solid ${THEME.cardBorder}`, display:'flex', gap:'12px', alignItems:'center', cursor:'pointer', borderLeft: `4px solid ${ev.corTecnica || THEME.neutral}`, background: ev.id === editingEventId ? `${THEME.primary}22` : 'transparent'}}>
                                  <div style={{fontFamily:'JetBrains Mono', fontSize:'12px', color:THEME.textDim, width:'45px'}}>{formatTimeVideo(ev.tempo)}</div>
                                  <div style={{flex:1}}>
                                      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'2px'}}>
                                          <span style={{fontWeight:'700', fontSize:'13px', color: ev.atleta === 'BRANCO' ? 'white' : (ev.atleta === 'AZUL' ? THEME.primary : THEME.text)}}>{ev.categoria}</span>
                                          {ev.resultado && ev.resultado !== 'NADA' && ev.resultado !== 'Mate' && <span style={{fontSize:'10px', background: THEME.tatamiCenter, color:'black', padding:'2px 6px', borderRadius:'4px', fontWeight:'700'}}>{ev.resultado}</span>}
                                      </div>
                                      <div style={{fontSize:'13px', color:THEME.textDim}}>{ev.especifico || ev.tipo}</div>
                                      {/* Sub-details for Analysis */}
                                      {(ev.direcao || ev.deslocamento) && (
                                          <div style={{display:'flex', gap:'6px', marginTop:'4px'}}>
                                              {ev.direcao && <span style={{fontSize:'10px', border:`1px solid ${THEME.cardBorder}`, padding:'1px 4px', borderRadius:'4px', color:THEME.neutral}}>Dir: {ev.direcao}</span>}
                                              {ev.deslocamento && <span style={{fontSize:'10px', border:`1px solid ${THEME.cardBorder}`, padding:'1px 4px', borderRadius:'4px', color:THEME.neutral}}>Desl: {ev.deslocamento}</span>}
                                          </div>
                                      )}
                                  </div>
                                  <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                                     <button onClick={(e) => { e.stopPropagation(); setEventos(eventos.filter((x:any) => x.id !== ev.id)); }} style={{background:'transparent', border:'none', color:THEME.cardBorder, cursor:'pointer', padding:'4px'}}><Trash2 size={14}/></button>
                                     <button onClick={(e) => { e.stopPropagation(); if(currentVideo.type==='YOUTUBE') youtubePlayerRef.current.seekTo(ev.tempo, true); else filePlayerRef.current.currentTime = ev.tempo; }} style={{background:'transparent', border:'none', color:THEME.primary, cursor:'pointer', padding:'4px'}}><PlayCircle size={14}/></button>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>

            </div> {/* End Right Column */}
         </div>
      )} {/* End Mode Switcher */}

      {/* ================================================================================== */}
      {/* MODAIS (Sistema de Janelas) */}
      {/* ================================================================================== */}

      {/* 1. MODAL PRINCIPAL (TÉCNICA E PUNIÇÃO) */}
      {modalAberto && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(5px)'}}>
          <div style={{background: THEME.bg, width:'90%', maxWidth:'850px', maxHeight:'95vh', overflowY:'auto', borderRadius:'16px', border:`1px solid ${THEME.cardBorder}`, boxShadow:'0 25px 50px -12px rgba(0,0,0,0.5)', display:'flex', flexDirection:'column'}}>
            
            {/* Header Modal */}
            <div style={{padding:'20px', borderBottom:`1px solid ${THEME.cardBorder}`, display:'flex', justifyContent:'space-between', alignItems:'center', background: punicaoMode ? `linear-gradient(to right, ${THEME.bg}, #451a03)` : THEME.bg}}>
              <div>
                 <h2 style={{fontSize:'20px', fontWeight:'800', margin:0, color: punicaoMode ? THEME.warning : 'white', display:'flex', alignItems:'center', gap:'10px'}}>
                    {punicaoMode ? <AlertOctagon size={24}/> : <Zap size={24} color={THEME.primary}/>}
                    {punicaoMode ? 'REGISTRO DE PUNIÇÃO' : 'REGISTRO TÉCNICO'}
                 </h2>
                 <div style={{fontSize:'12px', color: THEME.textDim, marginTop:'4px'}}>Tempo da ação: {formatTimeVideo(tempoCapturado)}</div>
              </div>
              <button onClick={() => setModalAberto(false)} style={{background:'transparent', border:'none', color: THEME.textDim, cursor:'pointer'}}><X size={24}/></button>
            </div>

            <div style={{padding:'24px', display:'flex', gap:'30px', flexDirection: isMobile ? 'column' : 'row'}}>
               
               {/* Coluna Esquerda: Quem e O Quê */}
               <div style={{flex: 1, display:'flex', flexDirection:'column', gap:'20px'}}>
                  
                  {/* Seletor de Atleta */}
                  <div style={{background: THEME.card, padding:'4px', borderRadius:'8px', display:'flex', border:`1px solid ${THEME.cardBorder}`}}>
                     <button onClick={() => setModalAtleta('BRANCO')} style={{flex:1, padding:'12px', background: modalAtleta==='BRANCO' ? 'white' : 'transparent', color: modalAtleta==='BRANCO' ? 'black' : THEME.textDim, borderRadius:'6px', border:'none', fontWeight:'700', transition:'all 0.2s'}}>BRANCO ({labelWhite})</button>
                     <button onClick={() => setModalAtleta('AZUL')} style={{flex:1, padding:'12px', background: modalAtleta==='AZUL' ? THEME.primary : 'transparent', color: modalAtleta==='AZUL' ? 'white' : THEME.textDim, borderRadius:'6px', border:'none', fontWeight:'700', transition:'all 0.2s'}}>AZUL ({labelBlue})</button>
                  </div>

                  {punicaoMode ? (
                     // MODO PUNIÇÃO
                     <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                        <div style={{fontSize:'14px', fontWeight:'700', color:THEME.textDim}}>MOTIVO DO SHIDO</div>
                        <select 
                           value={motivoShido} 
                           onChange={(e) => setMotivoShido(e.target.value)} 
                           style={{padding:'16px', background: THEME.bg, border:`1px solid ${THEME.cardBorder}`, color:'white', borderRadius:'8px', fontSize:'16px', outline:'none'}}
                        >
                           {DB_SHIDOS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div style={{marginTop:'20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                           <button onClick={() => confirmarPunicao('BRANCO')} style={{...btnStyle, padding:'20px', background:THEME.card, border:`1px solid ${THEME.cardBorder}`}}>Punir BRANCO</button>
                           <button onClick={() => confirmarPunicao('AZUL')} style={{...btnStyle, padding:'20px', background:THEME.primary, color:'white'}}>Punir AZUL</button>
                        </div>
                     </div>
                  ) : (
                     // MODO TÉCNICO (NAGE-WAZA)
                     <>
                        {/* Input Técnica com Autocomplete */}
                        <div style={{position:'relative'}}>
                           <div style={{fontSize:'12px', fontWeight:'700', color:THEME.textDim, marginBottom:'8px', display:'flex', justifyContent:'space-between'}}>
                              <span>NOME DA TÉCNICA</span>
                              <span style={{color: CORES_GRUPOS[modalGrupo]}}>{modalGrupo}</span>
                           </div>
                           <div style={{display:'flex', gap:'8px'}}>
                              <div style={{position:'relative', flex:1}}>
                                 <Search size={16} style={{position:'absolute', top:'14px', left:'12px', color:THEME.textDim}}/>
                                 <input 
                                    ref={inputRef}
                                    type="text" 
                                    value={modalNome} 
                                    onChange={(e) => setModalNome(e.target.value)} 
                                    placeholder="Ex: Seoi-nage..." 
                                    style={{width:'100%', padding:'12px 12px 12px 36px', background: THEME.bg, border:`1px solid ${THEME.cardBorder}`, color:'white', borderRadius:'8px', outline:'none', fontSize:'15px', fontWeight:'600'}}
                                 />
                                 {sugestoes.length > 0 && (
                                    <div style={{position:'absolute', top:'100%', left:0, width:'100%', background: THEME.card, border:`1px solid ${THEME.cardBorder}`, borderRadius:'8px', zIndex:10, overflow:'hidden', marginTop:'4px', boxShadow:'0 10px 30px rgba(0,0,0,0.5)'}}>
                                       {sugestoes.map(s => (
                                          <div key={s} onClick={() => { setModalNome(s); setModalGrupo(DB_GOLPES[s] as any); setSugestoes([]); }} style={{padding:'10px 14px', cursor:'pointer', borderBottom:`1px solid rgba(255,255,255,0.05)`, fontSize:'14px', display:'flex', justifyContent:'space-between'}}>
                                             <span>{s}</span>
                                             <span style={{fontSize:'10px', opacity:0.5}}>{DB_GOLPES[s]}</span>
                                          </div>
                                       ))}
                                    </div>
                                 )}
                              </div>
                           </div>
                           
                           {/* Botões de Grupo Rápido */}
                           <div style={{display:'flex', gap:'6px', marginTop:'8px', flexWrap:'wrap'}}>
                              {['TE-WAZA', 'KOSHI-WAZA', 'ASHI-WAZA', 'SUTEMI-WAZA'].map(g => (
                                 <button key={g} onClick={() => setModalGrupo(g)} style={{fontSize:'10px', padding:'4px 8px', borderRadius:'4px', border: modalGrupo===g ? `1px solid ${CORES_GRUPOS[g]}` : `1px solid ${THEME.cardBorder}`, background: modalGrupo===g ? `${CORES_GRUPOS[g]}22` : 'transparent', color: modalGrupo===g ? CORES_GRUPOS[g] : THEME.textDim, cursor:'pointer'}}>{g.split('-')[0]}</button>
                              ))}
                           </div>
                        </div>

                        {/* Dados Avançados (v28.2) */}
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                            <div>
                               <div style={{fontSize:'11px', color:THEME.textDim, marginBottom:'4px'}}>DESLOCAMENTO</div>
                               <select value={modalDeslocamento} onChange={e => setModalDeslocamento(e.target.value)} style={{width:'100%', padding:'8px', background:THEME.bg, border:`1px solid ${THEME.cardBorder}`, borderRadius:'6px', color:'white', fontSize:'12px'}}>
                                  <option value="">- Indefinido -</option>
                                  {DB_DESLOCAMENTO.map(d => <option key={d} value={d}>{d}</option>)}
                               </select>
                            </div>
                            <div>
                               <div style={{fontSize:'11px', color:THEME.textDim, marginBottom:'4px'}}>DEFESA (UKE)</div>
                               <select value={modalDefesa} onChange={e => setModalDefesa(e.target.value)} style={{width:'100%', padding:'8px', background:THEME.bg, border:`1px solid ${THEME.cardBorder}`, borderRadius:'6px', color:'white', fontSize:'12px'}}>
                                  <option value="">- Nenhuma -</option>
                                  {DB_DEFESA.map(d => <option key={d} value={d}>{d}</option>)}
                               </select>
                            </div>
                        </div>

                        {/* Avaliação do Golpe */}
                        <div>
                           <div style={{fontSize:'12px', fontWeight:'700', color:THEME.textDim, marginBottom:'10px'}}>AVALIAÇÃO</div>
                           <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'8px'}}>
                              <button onClick={() => confirmarEContinuar('Ippon')} style={{...btnStyle, padding:'12px', background: THEME.success, color:'white', flexDirection:'column', gap:'4px'}}><span style={{fontSize:'16px'}}>IPPON</span></button>
                              <button onClick={() => confirmarEContinuar('Waza-ari')} style={{...btnStyle, padding:'12px', background: THEME.tatamiCenter, color:'black', flexDirection:'column', gap:'4px'}}><span style={{fontSize:'16px'}}>WAZA</span></button>
                              <button onClick={() => confirmarEContinuar('Yuko')} style={{...btnStyle, padding:'12px', background: THEME.kumi, color:'black', flexDirection:'column', gap:'4px'}}><span style={{fontSize:'16px'}}>YUKO</span></button>
                              <button onClick={() => confirmarEContinuar('NADA')} style={{...btnStyle, padding:'12px', background: THEME.card, border:`1px solid ${THEME.cardBorder}`, color: THEME.textDim, flexDirection:'column', gap:'4px'}}><span style={{fontSize:'16px'}}>NADA</span></button>
                           </div>
                        </div>
                     </>
                  )}
               </div>

               {/* Coluna Direita: Contexto Espacial */}
               {!punicaoMode && (
                  <div style={{width: isMobile ? '100%' : '300px', display:'flex', flexDirection:'column', gap:'20px', borderLeft: isMobile ? 'none' : `1px solid ${THEME.cardBorder}`, paddingLeft: isMobile ? 0 : '30px'}}>
                     
                     {/* Mapa do Tatame */}
                     <div>
                        <div style={{fontSize:'12px', fontWeight:'700', color:THEME.textDim, marginBottom:'10px', display:'flex', justifyContent:'space-between'}}>
                           <span>LOCAL DO ATAQUE</span>
                           {modalXY && <span style={{fontSize:'10px', color:THEME.primary}}>X:{modalXY.x.toFixed(0)} Y:{modalXY.y.toFixed(0)}</span>}
                        </div>
                        <div className="square-map" onClick={handleTatamiClick} style={{cursor:'crosshair'}}>
                           <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'60%', height:'60%', border:`2px dashed rgba(255,255,255,0.3)`}}></div>
                           {modalXY && <div style={{position:'absolute', top:`${modalXY.y}%`, left:`${modalXY.x}%`, width:'12px', height:'12px', background:'red', borderRadius:'50%', transform:'translate(-50%, -50%)', border:'2px solid white', boxShadow:'0 2px 5px rgba(0,0,0,0.5)'}}></div>}
                           <div style={{position:'absolute', bottom:'5px', right:'5px', fontSize:'9px', color:'rgba(0,0,0,0.5)', fontWeight:'800'}}>JUDO TATAMI</div>
                        </div>
                     </div>

                     {/* Direção */}
                     <div>
                        <div style={{fontSize:'12px', fontWeight:'700', color:THEME.textDim, marginBottom:'10px'}}>DIREÇÃO DO DESEQUILÍBRIO</div>
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px'}}>
                           <div></div>
                           <button onClick={() => setModalDirecao('FRENTE')} style={{padding:'10px', borderRadius:'8px', background: modalDirecao==='FRENTE'?THEME.primary:THEME.card, border:`1px solid ${THEME.cardBorder}`, color:'white'}}><ArrowUp size={20}/></button>
                           <div></div>
                           <button onClick={() => setModalDirecao('ESQUERDA')} style={{padding:'10px', borderRadius:'8px', background: modalDirecao==='ESQUERDA'?THEME.primary:THEME.card, border:`1px solid ${THEME.cardBorder}`, color:'white'}}><ArrowLeft size={20}/></button>
                           <div style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:THEME.textDim}}>UKE</div>
                           <button onClick={() => setModalDirecao('DIREITA')} style={{padding:'10px', borderRadius:'8px', background: modalDirecao==='DIREITA'?THEME.primary:THEME.card, border:`1px solid ${THEME.cardBorder}`, color:'white'}}><ArrowRight size={20}/></button>
                           <div></div>
                           <button onClick={() => setModalDirecao('TRAS')} style={{padding:'10px', borderRadius:'8px', background: modalDirecao==='TRAS'?THEME.primary:THEME.card, border:`1px solid ${THEME.cardBorder}`, color:'white'}}><ArrowDown size={20}/></button>
                           <div></div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
            
            {/* Footer Modal */}
            <div style={{padding:'15px 24px', background: THEME.bg, borderTop:`1px solid ${THEME.cardBorder}`, display:'flex', justifyContent:'space-between', borderRadius:'0 0 16px 16px'}}>
               <button onClick={() => setModalAberto(false)} style={{...btnStyle, background:'transparent', color:THEME.textDim}}>Cancelar</button>
               {editingEventId && <button onClick={() => { salvarEFechar(null); setModalAberto(false); }} style={{...btnStyle, background:THEME.success, color:'white', padding:'8px 20px'}}>Salvar Edição</button>}
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL KUMI-KATA (PEGADA) */}
      {modalKumi && (
         <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{background: THEME.bg, width:'400px', padding:'24px', borderRadius:'16px', border:`2px solid ${THEME.kumi}`}}>
               <h3 style={{color:THEME.kumi, marginTop:0, display:'flex', gap:'10px', alignItems:'center'}}><Hand size={24}/> KUMI-KATA ANALYSIS</h3>
               
               <div style={{background: THEME.card, padding:'4px', borderRadius:'8px', display:'flex', marginBottom:'20px'}}>
                  <button onClick={() => setKumiAtleta('BRANCO')} style={{flex:1, padding:'8px', background: kumiAtleta==='BRANCO' ? 'white' : 'transparent', color: kumiAtleta==='BRANCO' ? 'black' : THEME.textDim, borderRadius:'6px', border:'none', fontWeight:'700'}}>BRANCO</button>
                  <button onClick={() => setKumiAtleta('AZUL')} style={{flex:1, padding:'8px', background: kumiAtleta==='AZUL' ? THEME.primary : 'transparent', color: kumiAtleta==='AZUL' ? 'white' : THEME.textDim, borderRadius:'6px', border:'none', fontWeight:'700'}}>AZUL</button>
               </div>

               <label style={{fontSize:'12px', color:THEME.textDim}}>POSTURA (BASE)</label>
               <select value={kumiBase} onChange={(e) => setKumiBase(e.target.value)} style={{width:'100%', padding:'10px', marginBottom:'15px', background:THEME.card, color:'white', border:`1px solid ${THEME.cardBorder}`, borderRadius:'8px'}}>
                  <option value="Ai-yotsu">Ai-yotsu (Espelho)</option>
                  <option value="Kenka-yotsu">Kenka-yotsu (Cruzada)</option>
               </select>

               <div style={{display:'flex', gap:'15px'}}>
                  <div style={{flex:1}}>
                     <label style={{fontSize:'12px', color:THEME.textDim}}>MÃO DIREITA</label>
                     <select value={kumiDir} onChange={(e) => setKumiDir(e.target.value)} style={{width:'100%', padding:'10px', background:THEME.card, color:'white', border:`1px solid ${THEME.cardBorder}`, borderRadius:'8px'}}>
                        {DB_PEGADAS.map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
                  </div>
                  <div style={{flex:1}}>
                     <label style={{fontSize:'12px', color:THEME.textDim}}>MÃO ESQUERDA</label>
                     <select value={kumiEsq} onChange={(e) => setKumiEsq(e.target.value)} style={{width:'100%', padding:'10px', background:THEME.card, color:'white', border:`1px solid ${THEME.cardBorder}`, borderRadius:'8px'}}>
                        {DB_PEGADAS.map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
                  </div>
               </div>

               <div style={{display:'flex', gap:'10px', marginTop:'25px'}}>
                  <button onClick={() => setModalKumi(false)} style={{flex:1, padding:'12px', background:'transparent', border:`1px solid ${THEME.cardBorder}`, color:THEME.textDim, borderRadius:'8px', cursor:'pointer'}}>Cancelar</button>
                  <button onClick={salvarKumiKata} style={{flex:1, padding:'12px', background:THEME.kumi, border:'none', color:'black', borderRadius:'8px', fontWeight:'700', cursor:'pointer'}}>REGISTRAR</button>
               </div>
            </div>
         </div>
      )}

      {/* 3. MODAL NE-WAZA (SOLO) */}
      {modalNeWaza && (
         <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{background: THEME.bg, width:'500px', padding:'24px', borderRadius:'16px', border:`2px solid ${THEME.newaza}`}}>
               <h3 style={{color:THEME.newaza, marginTop:0, display:'flex', gap:'10px', alignItems:'center'}}><Layers size={24}/> NE-WAZA TRACKER</h3>
               
               {/* Atleta Ativo */}
               <div style={{background: THEME.card, padding:'4px', borderRadius:'8px', display:'flex', marginBottom:'20px'}}>
                  <button onClick={() => setNwAtleta('BRANCO')} style={{flex:1, padding:'8px', background: nwAtleta==='BRANCO' ? 'white' : 'transparent', color: nwAtleta==='BRANCO' ? 'black' : THEME.textDim, borderRadius:'6px', border:'none', fontWeight:'700'}}>BRANCO</button>
                  <button onClick={() => setNwAtleta('AZUL')} style={{flex:1, padding:'8px', background: nwAtleta==='AZUL' ? THEME.primary : 'transparent', color: nwAtleta==='AZUL' ? 'white' : THEME.textDim, borderRadius:'6px', border:'none', fontWeight:'700'}}>AZUL</button>
               </div>

               {/* Fluxo de Ação */}
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
                  <div>
                     <label style={{fontSize:'10px', color:THEME.textDim}}>1. ENTRADA</label>
                     <select value={nwEntrada} onChange={(e) => setNwEntrada(e.target.value)} style={{width:'100%', padding:'10px', background:THEME.card, color:'white', border:`1px solid ${THEME.cardBorder}`, borderRadius:'6px'}}>
                        <option>DIRETA</option>
                        <option>TRANSIÇÃO (Tachi-waza)</option>
                        <option>FALHA ADVERSÁRIO</option>
                     </select>
                  </div>
                  <div>
                     <label style={{fontSize:'10px', color:THEME.textDim}}>2. POSIÇÃO RELATIVA</label>
                     <select value={nwPosicao} onChange={(e) => { setNwPosicao(e.target.value); setNwAcao(e.target.value === 'POR CIMA' ? DB_NW_ACOES_TOP[0] : DB_NW_ACOES_BOTTOM[0]); }} style={{width:'100%', padding:'10px', background:THEME.card, color:'white', border:`1px solid ${THEME.cardBorder}`, borderRadius:'6px'}}>
                        <option value="POR CIMA">POR CIMA (Top)</option>
                        <option value="POR BAIXO">POR BAIXO (Bottom/Guard)</option>
                     </select>
                  </div>
               </div>

               <label style={{fontSize:'10px', color:THEME.textDim}}>3. AÇÃO TÁTICA</label>
               <select value={nwAcao} onChange={(e) => setNwAcao(e.target.value)} style={{width:'100%', padding:'10px', marginBottom:'15px', background:THEME.card, color:'white', border:`1px solid ${THEME.cardBorder}`, borderRadius:'6px'}}>
                  {(nwPosicao === 'POR CIMA' ? DB_NW_ACOES_TOP : DB_NW_ACOES_BOTTOM).map(a => <option key={a} value={a}>{a}</option>)}
               </select>

               {/* Se for finalização ou imobilização, pede técnica */}
               {(nwAcao.includes('Osaekomi') || nwAcao.includes('Shime') || nwAcao.includes('Kansetsu') || nwAcao.includes('Finalização')) && (
                  <div style={{marginBottom:'15px'}}>
                     <label style={{fontSize:'10px', color:THEME.textDim}}>TÉCNICA ESPECÍFICA</label>
                     <select value={nwTecnica} onChange={(e) => setNwTecnica(e.target.value)} style={{width:'100%', padding:'10px', background:THEME.card, color:THEME.newaza, fontWeight:'700', border:`1px solid ${THEME.newaza}`, borderRadius:'6px'}}>
                        <option value="">- Selecione -</option>
                        {Object.keys(DB_NE_WAZA_LIST).map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>
               )}

               <label style={{fontSize:'10px', color:THEME.textDim}}>4. DESFECHO (RESULTADO)</label>
               <select value={nwDesfecho} onChange={(e) => setNwDesfecho(e.target.value)} style={{width:'100%', padding:'10px', background:THEME.card, color:'white', border:`1px solid ${THEME.cardBorder}`, borderRadius:'6px'}}>
                  {DB_NW_DESFECHOS.map(d => <option key={d} value={d}>{d}</option>)}
               </select>

               <div style={{display:'flex', gap:'10px', marginTop:'25px'}}>
                  <button onClick={() => setModalNeWaza(false)} style={{flex:1, padding:'12px', background:'transparent', border:`1px solid ${THEME.cardBorder}`, color:THEME.textDim, borderRadius:'8px', cursor:'pointer'}}>Cancelar</button>
                  <button onClick={salvarNeWaza} style={{flex:1, padding:'12px', background:THEME.newaza, border:'none', color:'black', borderRadius:'8px', fontWeight:'700', cursor:'pointer'}}>REGISTRAR SEQUÊNCIA</button>
               </div>
            </div>
         </div>
      )}

      {/* 4. MODAL METADADOS */}
      {modalMetadata && (
         <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', zIndex:2100, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{background: THEME.bg, width:'500px', padding:'30px', borderRadius:'16px', border:`1px solid ${THEME.primary}`}}>
               <h3 style={{marginTop:0, color:THEME.primary}}>Contexto do Evento</h3>
               <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                  <input placeholder="Nome do Campeonato (Ex: Grand Slam Paris)" value={metaEvent} onChange={e => setMetaEvent(e.target.value)} style={{padding:'10px', borderRadius:'6px', border:`1px solid ${THEME.cardBorder}`, background:THEME.card, color:'white'}} />
                  <input type="date" value={metaDate} onChange={e => setMetaDate(e.target.value)} style={{padding:'10px', borderRadius:'6px', border:`1px solid ${THEME.cardBorder}`, background:THEME.card, color:'white'}} />
                  <div style={{display:'flex', gap:'10px'}}>
                     <input placeholder="Categoria (Ex: -73kg)" value={metaCat} onChange={e => setMetaCat(e.target.value)} style={{flex:1, padding:'10px', borderRadius:'6px', border:`1px solid ${THEME.cardBorder}`, background:THEME.card, color:'white'}} />
                     <select value={metaPhase} onChange={e => setMetaPhase(e.target.value)} style={{flex:1, padding:'10px', borderRadius:'6px', border:`1px solid ${THEME.cardBorder}`, background:THEME.card, color:'white'}}>
                        {DB_FASES.map(f => <option key={f} value={f}>{f}</option>)}
                     </select>
                  </div>
                  <div style={{height:'1px', background:THEME.cardBorder, margin:'10px 0'}}></div>
                  <label style={{fontSize:'12px', color:THEME.textDim}}>Atleta Branco (Link Database)</label>
                  <select value={metaWhiteId} onChange={e => setMetaWhiteId(e.target.value)} style={{padding:'10px', borderRadius:'6px', border:`1px solid ${THEME.cardBorder}`, background:THEME.card, color:'white'}}>
                     <option value="">- Selecione -</option>
                     {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.country})</option>)}
                  </select>
                  <label style={{fontSize:'12px', color:THEME.textDim}}>Atleta Azul (Link Database)</label>
                  <select value={metaBlueId} onChange={e => setMetaBlueId(e.target.value)} style={{padding:'10px', borderRadius:'6px', border:`1px solid ${THEME.cardBorder}`, background:THEME.card, color:'white'}}>
                     <option value="">- Selecione -</option>
                     {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.country})</option>)}
                  </select>
               </div>
               <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
                  <button onClick={() => setModalMetadata(false)} style={{flex:1, padding:'12px', background:'transparent', border:`1px solid ${THEME.cardBorder}`, color:THEME.textDim, borderRadius:'8px', cursor:'pointer'}}>Fechar</button>
                  <button onClick={applyMetadataToAll} style={{flex:1, padding:'12px', background:THEME.warning, border:'none', color:'black', borderRadius:'8px', cursor:'pointer', fontSize:'12px'}}>Aplicar a Todos</button>
                  <button onClick={saveMetadata} style={{flex:1, padding:'12px', background:THEME.primary, border:'none', color:'white', borderRadius:'8px', cursor:'pointer'}}>Salvar</button>
               </div>
            </div>
         </div>
      )}

      {/* 5. MODAL ATLETAS (DB) */}
      {modalAthletes && (
         <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.9)', zIndex:2200, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{background: THEME.bg, width:'600px', height:'600px', padding:'30px', borderRadius:'16px', border:`1px solid ${THEME.cardBorder}`, display:'flex', flexDirection:'column'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                  <h2 style={{margin:0}}>Banco de Atletas</h2>
                  <button onClick={() => setModalAthletes(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><X size={24}/></button>
               </div>
               
               <div style={{display:'flex', gap:'10px', marginBottom:'20px', padding:'15px', background:THEME.card, borderRadius:'12px'}}>
                  <input placeholder="Nome Completo" value={newAthleteName} onChange={e => setNewAthleteName(e.target.value)} style={{flex:2, padding:'10px', borderRadius:'6px', border:'none'}} />
                  <input placeholder="País (3 letras)" value={newAthleteCountry} onChange={e => setNewAthleteCountry(e.target.value.toUpperCase().slice(0,3))} style={{flex:1, padding:'10px', borderRadius:'6px', border:'none'}} />
                  <button onClick={saveAthlete} style={{...btnStyle, background:THEME.success, color:'white', padding:'0 20px'}}><UserPlus size={18}/></button>
               </div>

               <div style={{flex:1, overflowY:'auto'}}>
                  {athletes.map(a => (
                     <div key={a.id} style={{display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:`1px solid ${THEME.cardBorder}`, alignItems:'center'}}>
                        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                           <div style={{width:'40px', height:'40px', background:THEME.neutral, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800'}}>{a.country}</div>
                           <div>
                              <div style={{fontWeight:'700'}}>{a.name}</div>
                              <div style={{fontSize:'12px', color:THEME.textDim}}>{a.club || 'Sem clube'}</div>
                           </div>
                        </div>
                        <button onClick={() => deleteAthlete(a.id)} style={{color:THEME.danger, background:'none', border:'none', cursor:'pointer'}}><Trash2 size={16}/></button>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* 6. MODAL HELP (ATALHOS) */}
      {modalHelp && (
         <div onClick={() => setModalHelp(false)} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', zIndex:2500, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{background: THEME.bg, padding:'40px', borderRadius:'20px', border:`1px solid ${THEME.primary}`}}>
               <h2 style={{marginTop:0, color:THEME.primary, display:'flex', alignItems:'center', gap:'10px'}}><Keyboard size={28}/> ATALHOS DE TECLADO</h2>
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', fontSize:'14px'}}>
                  <div><span style={{color:THEME.warning, fontWeight:'800'}}>ESPAÇO</span> - Pause/Play (Hajime/Mate)</div>
                  <div><span style={{color:THEME.warning, fontWeight:'800'}}>P</span> - Pause/Play Vídeo</div>
                  <div><span style={{color:THEME.warning, fontWeight:'800'}}>ENTER</span> - Registrar Nage-Waza</div>
                  <div><span style={{color:THEME.warning, fontWeight:'800'}}>I / W / Y</span> - Registrar Ippon/Waza/Yuko</div>
                  <div><span style={{color:THEME.warning, fontWeight:'800'}}>S</span> - Registrar Shido</div>
                  <div><span style={{color:THEME.warning, fontWeight:'800'}}>D</span> - Modo Desenho</div>
                  <div><span style={{color:THEME.warning, fontWeight:'800'}}>Setas</span> - Navegar Vídeo</div>
               </div>
               <div style={{marginTop:'30px', textAlign:'center', color:THEME.textDim}}>Clique em qualquer lugar para fechar</div>
            </div>
         </div>
      )}

    </div>
  );

  // ==================================================================================
  // 5. FUNÇÕES DE SUPORTE (DEFINIDAS AQUI PARA FUNCIONAR DENTRO DO ESCOPO DO COMPONENTE)
  // ==================================================================================
  
  function exportarBackup() {
      const backupData = {
          version: "28.4",
          date: new Date().toISOString(),
          eventos,
          athletes,
          metadataMap,
          playlist
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SMAARTPRO_BACKUP_${new Date().toLocaleDateString().replace(/\//g,'-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }

  function importarBackup(e: any) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const data = JSON.parse(event.target?.result as string);
              if (data.eventos) setEventos(data.eventos);
              if (data.athletes) setAthletes(data.athletes);
              if (data.metadataMap) setMetadataMap(data.metadataMap);
              if (data.playlist) setPlaylist(data.playlist);
              alert("Backup restaurado com sucesso!");
          } catch (err) {
              alert("Erro ao ler arquivo de backup.");
          }
      };
      reader.readAsText(file);
  }

  function baixarCSV() {
      const headers = ["ID", "Video", "Tempo(s)", "Tempo(Fmt)", "Categoria", "Tipo/Posicao", "Detalhe/Tecnica", "Resultado", "Atleta", "Lado", "Direcao", "X", "Y"];
      const rows = filteredEventos.map((e: any) => [
          e.id, 
          e.videoId, 
          e.tempo.toFixed(2), 
          formatTimeVideo(e.tempo), 
          e.categoria, 
          e.tipo, 
          e.especifico, 
          e.resultado, 
          e.atleta, 
          e.lado,
          e.direcao || '',
          e.coordenadas ? e.coordenadas.x.toFixed(0) : '',
          e.coordenadas ? e.coordenadas.y.toFixed(0) : ''
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map((r:any) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `analise_judo_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
  }

  // --- GERADOR DE PDF PROFISSIONAL (v28.4) ---
  function imprimirRelatorio() {
      const doc = new jsPDF();
      
      // 1. CABEÇALHO
      doc.setFillColor(59, 130, 246); // Primary Blue
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("SMAART PRO ANALYTICS", 14, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text("RELATÓRIO TÉCNICO DE PERFORMANCE - JUDÔ", 14, 28);
      
      doc.setFontSize(8);
      doc.text(`Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`, 14, 35);

      // 2. PLACAR E CONTEXTO
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("RESUMO DO COMBATE", 14, 50);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const infoY = 58;
      doc.text(`Evento: ${currentMetadata.eventName || 'Treino/Não listado'}`, 14, infoY);
      doc.text(`Categoria: ${currentMetadata.category || '-'}`, 14, infoY + 5);
      doc.text(`Fase: ${currentMetadata.phase || '-'}`, 14, infoY + 10);

      const scoreY = 55;
      const col1 = 90;
      const col2 = 150;
      
      // BRANCO
      doc.setFont('helvetica', 'bold');
      doc.text("BRANCO", col1, scoreY);
      doc.setFont('helvetica', 'normal');
      doc.text(labelWhite, col1, scoreY + 5);
      doc.setFontSize(14);
      doc.text(`I:${placar.branco.ippon}  W:${placar.branco.waza}  S:${placar.branco.shido}`, col1, scoreY + 12);
      
      // AZUL
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246); // Azul
      doc.text("AZUL", col2, scoreY);
      doc.setFont('helvetica', 'normal');
      doc.text(labelBlue, col2, scoreY + 5);
      doc.setFontSize(14);
      doc.text(`I:${placar.azul.ippon}  W:${placar.azul.waza}  S:${placar.azul.shido}`, col2, scoreY + 12);

      // 3. ESTATÍSTICAS DE ATAQUE
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text("ESTATÍSTICAS DE VOLUME (NAGE-WAZA)", 14, 85);
      
      let statY = 92;
      stats.groupData.forEach((st: any) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.text(`• ${st.name}: ${st.val} tentativas (${st.pct.toFixed(0)}%)`, 14, statY);
          statY += 5;
      });

      // 4. TABELA DE EVENTOS
      const tableRows = filteredEventos
          .sort((a:any, b:any) => a.tempo - b.tempo)
          .map((ev: any) => [
              formatTimeVideo(ev.tempo),
              ev.atleta === 'BRANCO' ? labelWhite : (ev.atleta === 'AZUL' ? labelBlue : '-'),
              ev.categoria,
              ev.especifico || ev.tipo,
              ev.resultado || '-',
              ev.lado || '-'
          ]);

      autoTable(doc, {
          startY: Math.max(statY + 10, 110),
          head: [['Tempo', 'Atleta', 'Categoria', 'Detalhe / Técnica', 'Resultado', 'Lado']],
          body: tableRows,
          theme: 'grid',
          headStyles: { fillColor: [30, 41, 59] }, // Slate 800
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
              0: { cellWidth: 15 }, // Tempo
              3: { cellWidth: 'auto' } // Detalhe
          }
      });

      // 5. RODAPÉ
      const pageHeight = doc.internal.pageSize.height;
      doc.setFillColor(240, 240, 240);
      doc.rect(0, pageHeight - 20, 210, 20, 'F');
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text("Relatório gerado pelo software SMAART PRO - Desenvolvido para Alta Performance.", 14, pageHeight - 12);
      doc.text("Supervisão: Luiz Pavani - Diretor Educacional", 14, pageHeight - 8);

      doc.save(`Analise_Judo_${currentMetadata.eventName.replace(/ /g,'_')}.pdf`);
  }

  function gerarPromptIA() {
      const summary = `
      Analise de Luta de Judô.
      Evento: ${currentMetadata.eventName} (${currentMetadata.date}).
      Atleta Branco: ${labelWhite} (${placar.branco.ippon} Ippons, ${placar.branco.waza} Wazas, ${placar.branco.shido} Shidos).
      Atleta Azul: ${labelBlue} (${placar.azul.ippon} Ippons, ${placar.azul.waza} Wazas, ${placar.azul.shido} Shidos).
      
      Estatísticas de Ataque:
      ${stats.groupData.map((g:any) => `- ${g.name}: ${g.val} tentativas`).join('\n')}
      
      Principais Ocorrências:
      ${filteredEventos.slice(0, 10).map((e:any) => `- ${formatTimeVideo(e.tempo)}: ${e.atleta} tentou ${e.especifico} (${e.resultado})`).join('\n')}
      
      Gere um relatório técnico tático sugerindo pontos de melhoria para o atleta ${targetAthleteId ? 'selecionado' : 'Branco'}.
      `;
      
      navigator.clipboard.writeText(summary);
      alert("Prompt copiado para a área de transferência! Cole no ChatGPT/Claude.");
  }
}