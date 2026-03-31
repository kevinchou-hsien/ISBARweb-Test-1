import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  User, 
  Activity, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  RefreshCcw,
  X,
  Info,
  Clock,
  ClipboardList,
  GripVertical,
  Volume2,
  ShieldCheck,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  DndContext, 
  DragEndEvent, 
  useDraggable, 
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { SCENARIOS } from './constants';
import { IsbarCategory, Keyword } from './types';
import { cn } from './lib/utils';

// --- Drag & Drop Components ---

interface DraggableKeywordProps {
  keyword: Keyword;
  isPlaced: boolean;
  isSelected: boolean;
  isSubmitted: boolean;
  onClick: () => void;
  key?: React.Key;
}

function DraggableKeyword({ keyword, isPlaced, isSelected, isSubmitted, onClick }: DraggableKeywordProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: keyword.id,
    disabled: isSubmitted || isPlaced,
    data: keyword
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      whileHover={!isPlaced && !isSubmitted ? { scale: 1.02 } : {}}
      whileTap={!isPlaced && !isSubmitted ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-lg text-sm transition-all border text-left flex items-center justify-between gap-2 touch-none",
        isPlaced 
          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-default"
          : isDragging
            ? "bg-medical-primary/20 border-medical-primary opacity-50 z-50"
            : isSelected
              ? "bg-medical-primary text-white border-medical-primary shadow-md ring-2 ring-medical-primary ring-offset-2"
              : "bg-white text-slate-700 border-slate-300 hover:border-medical-primary hover:text-medical-primary cursor-grab active:cursor-grabbing"
      )}
    >
      <div className="flex items-center gap-2">
        {!isPlaced && !isSubmitted && <GripVertical className="w-3.5 h-3.5 text-slate-400" />}
        <span>{keyword.text}</span>
      </div>
      {isSubmitted && !isPlaced && !keyword.isNoise && (
        <span className="text-[10px] font-bold text-red-500 ml-2 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 whitespace-nowrap">
          應屬 {keyword.category}
        </span>
      )}
    </motion.div>
  );
}

interface DroppableCategoryProps {
  cat: any;
  isSubmitted: boolean;
  placedKeywords: Keyword[];
  selectedKeyword: Keyword | null;
  onCategoryClick: (cat: IsbarCategory) => void;
  onPlacedKeywordClick: (cat: IsbarCategory, kw: Keyword) => void;
  categories: any[];
  showHints: boolean;
  key?: React.Key;
}

function DroppableCategory({ cat, isSubmitted, placedKeywords, selectedKeyword, onCategoryClick, onPlacedKeywordClick, categories, showHints }: DroppableCategoryProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: cat.key,
    disabled: isSubmitted
  });

  return (
    <div 
      ref={setNodeRef}
      onClick={() => onCategoryClick(cat.key)}
      className={cn(
        "group relative border-2 border-dashed rounded-xl p-4 transition-all",
        !isSubmitted && (selectedKeyword || isOver) ? "border-medical-primary bg-medical-primary/5 cursor-pointer" : "border-slate-200",
        isOver ? "ring-2 ring-medical-primary ring-offset-2" : "",
        placedKeywords.length > 0 ? "border-solid border-slate-300 bg-slate-50" : "min-h-[100px]"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-sm",
          cat.color
        )}>
          {cat.label}
        </div>
        {showHints && <span className="font-bold text-slate-700">{cat.full}</span>}
        {!isSubmitted && (selectedKeyword || isOver) && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-auto text-xs font-bold text-medical-primary flex items-center gap-1"
          >
            {isOver ? "放開以放置" : "點擊或拖拽至此"} <ChevronRight className="w-3 h-3" />
          </motion.div>
        )}
      </div>

      <div className="space-y-2">
        {placedKeywords.length === 0 ? (
          <p className="text-slate-400 text-sm italic">尚未填寫內容...</p>
        ) : (
          placedKeywords.map((kw, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={idx}
              className={cn(
                "p-3 rounded-lg border shadow-sm flex flex-col gap-1 transition-all relative group/item",
                isSubmitted 
                  ? kw.category === cat.key 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"
                  : "bg-white border-slate-200"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isSubmitted && (
                    kw.category === cat.key 
                      ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      : <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span className="text-sm text-slate-700 font-medium">{kw.text}</span>
                </div>
                
                {!isSubmitted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlacedKeywordClick(cat.key, kw);
                    }}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    title="移除此關鍵字"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {isSubmitted && kw.category !== cat.key && (
                <p className="text-[10px] text-red-600 font-bold ml-6">
                  建議：此內容在標準 ISBAR 中應歸類於 {kw.category} ({categories.find(c => c.key === kw.category)?.full})
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const currentScenario = SCENARIOS[currentScenarioIndex];
  
  const [shuffledKeywords, setShuffledKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [placedKeywords, setPlacedKeywords] = useState<Record<IsbarCategory, Keyword[]>>({
    I: [],
    S: [],
    B: [],
    A: [],
    R: [],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showScenarioList, setShowScenarioList] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showScript, setShowScript] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [npcFeedback, setNpcFeedback] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(true);
  const [showIntroModal, setShowIntroModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const keyword = active.data.current as Keyword;
      const category = over.id as IsbarCategory;
      
      if (keyword && category) {
        setPlacedKeywords(prev => {
          const newState = { ...prev };
          // Remove from any existing category
          (Object.keys(newState) as IsbarCategory[]).forEach(cat => {
            newState[cat] = newState[cat].filter(k => k.id !== keyword.id);
          });
          // Add to new category
          newState[category] = [...newState[category], keyword];
          return newState;
        });
        setSelectedKeyword(null);
      }
    }
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDifficultySelect = (difficulty: string) => {
    const filteredScenarios = SCENARIOS.filter(s => s.difficulty === difficulty);
    if (filteredScenarios.length > 0) {
      // Try to pick a different one than current if possible
      let nextScenarios = filteredScenarios.filter(s => s.id !== currentScenario.id);
      if (nextScenarios.length === 0) nextScenarios = filteredScenarios;
      
      const randomIndex = Math.floor(Math.random() * nextScenarios.length);
      const scenarioId = nextScenarios[randomIndex].id;
      const globalIndex = SCENARIOS.findIndex(s => s.id === scenarioId);
      setCurrentScenarioIndex(globalIndex);
    }
    setShowDifficultyModal(false);
    setShowScenarioList(false);
  };

  const switchDifficulty = (difficulty: string) => {
    handleDifficultySelect(difficulty);
  };

  const formatTaiwanTime = (date: Date) => {
    return date.toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\//g, '-');
  };

  // Timer logic
  useEffect(() => {
    if (currentScenario.timeLimit && currentScenario.timeLimit > 0 && !isSubmitted && !showNameModal) {
      setTimeLeft(currentScenario.timeLimit);
      setIsTimeUp(false);
    } else {
      setTimeLeft(null);
    }
  }, [currentScenarioIndex, showNameModal]);

  useEffect(() => {
    if (timeLeft === null || isSubmitted || showNameModal) return;

    if (timeLeft <= 0) {
      setIsTimeUp(true);
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, showNameModal]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Shuffle keywords whenever scenario changes or playerName changes
  useEffect(() => {
    const keywords = currentScenario.keywords.map(k => {
      // Replace hardcoded names in keywords with playerName
      let updatedText = k.text;
      if (playerName) {
        // Common patterns for "I am [name]" in the scenarios
        updatedText = updatedText.replace(/護生(小明|小玲|阿強)/g, `護生${playerName}`);
        updatedText = updatedText.replace(/我是(.*)護生(小明|小玲|阿強)/g, `我是$1護生${playerName}`);
      }
      return { ...k, text: updatedText };
    });

    for (let i = keywords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keywords[i], keywords[j]] = [keywords[j], keywords[i]];
    }
    setShuffledKeywords(keywords);
    // Reset game state for new scenario
    setPlacedKeywords({ I: [], S: [], B: [], A: [], R: [] });
    setIsSubmitted(false);
    setScore(0);
    setShowResult(false);
    setSelectedKeyword(null);
    setIsTimeUp(false);
    setNpcFeedback([]);
  }, [currentScenarioIndex, playerName]);

  const categories: { key: IsbarCategory; label: string; full: string; color: string }[] = [
    { key: 'I', label: 'I', full: 'Introduction (介紹)', color: 'bg-blue-500' },
    { key: 'S', label: 'S', full: 'Situation (情境)', color: 'bg-red-500' },
    { key: 'B', label: 'B', full: 'Background (背景)', color: 'bg-orange-500' },
    { key: 'A', label: 'A', full: 'Assessment (評估)', color: 'bg-purple-500' },
    { key: 'R', label: 'R', full: 'Recommendation (建議)', color: 'bg-green-500' },
  ];

  const handleKeywordClick = (keyword: Keyword) => {
    if (isSubmitted) return;
    
    // If it's already placed, we don't allow re-selecting it from the source list
    // to prevent accidental removal. User must click the 'X' in the ISBAR form.
    if (isKeywordPlaced(keyword.id)) {
      return;
    }
    
    setSelectedKeyword(keyword);
  };

  const handleCategoryClick = (category: IsbarCategory) => {
    if (!selectedKeyword || isSubmitted) return;

    // If the keyword was already placed somewhere, remove it from there first
    // (This handles moving between categories)
    setPlacedKeywords(prev => {
      const newState = { ...prev };
      (Object.keys(newState) as IsbarCategory[]).forEach(cat => {
        newState[cat] = newState[cat].filter(k => k.id !== selectedKeyword.id);
      });
      newState[category] = [...newState[category], selectedKeyword];
      return newState;
    });
    
    setSelectedKeyword(null);
  };

  const handlePlacedKeywordClick = (category: IsbarCategory, keyword: Keyword) => {
    if (isSubmitted) return;
    
    // Set as selected keyword
    setSelectedKeyword(keyword);
    
    // We don't necessarily need to remove it immediately if we want to allow "swapping"
    // but the current UI logic works best if we just re-select it.
    // Actually, let's remove it so the user sees it's "picked up"
    setPlacedKeywords(prev => ({
      ...prev,
      [category]: prev[category].filter(k => k.id !== keyword.id)
    }));
  };

  const isKeywordPlaced = (id: string) => {
    return (Object.values(placedKeywords) as Keyword[][]).some(list => list.some(k => k.id === id));
  };

  const allKeywordsPlaced = currentScenario.keywords.length > 0 && 
    currentScenario.keywords.filter(k => !k.isNoise).every(k => isKeywordPlaced(k.id));

  const handleSubmit = () => {
    let totalScore = 0;
    const feedback: string[] = [];
    
    // 1. Basic Category Scoring & Noise Penalty
    const placedAll = (Object.values(placedKeywords).flat() as Keyword[]);
    const noisePlaced = placedAll.filter(k => k.isNoise);
    
    if (noisePlaced.length > 0) {
      feedback.push(`${playerName || '同學'}，交班內容包含了「${noisePlaced[0].text}」等非必要資訊，這會干擾溝通效率，下次記得過濾雜訊。`);
    }

    (Object.entries(placedKeywords) as [IsbarCategory, Keyword[]][]).forEach(([cat, keywords]) => {
      keywords.forEach(k => {
        if (k.isNoise) {
          totalScore -= 10; // Increased penalty for noise to discourage picking them
        } else if (k.category === cat) {
          totalScore += 10;
        }
      });
    });

    // 2. Priority Scoring for 'R'
    const rKeywords = placedKeywords['R'];
    if (rKeywords.length > 1) {
      let priorityCorrect = true;
      for (let i = 0; i < rKeywords.length - 1; i++) {
        const currentP = rKeywords[i].priority || 99;
        const nextP = rKeywords[i+1].priority || 99;
        if (currentP > nextP) {
          priorityCorrect = false;
          break;
        }
      }
      if (priorityCorrect && rKeywords.length === currentScenario.keywords.filter(k => k.category === 'R').length) {
        totalScore += 10; // Bonus for correct priority
      } else if (!priorityCorrect) {
        feedback.push(`${playerName || '同學'}，建議 (Recommendation) 的順序很重要，應該先處理最緊急的事情。`);
      }
    }

    // 3. NPC Feedback for missing critical info
    const allRequired = currentScenario.keywords.filter(k => !k.isNoise);
    const placedIds = (Object.values(placedKeywords) as Keyword[][]).reduce((acc, curr) => [...acc, ...curr], []).map(k => k.id);
    const missing = allRequired.filter(k => !placedIds.includes(k.id));
    
    if (missing.length > 0) {
      const missingCategories = [...new Set(missing.map(m => m.category))];
      feedback.push(`${playerName || '同學'}，你漏掉了 ${missing.length} 項關鍵資訊（如：${missing.slice(0, 2).map(m => m.text).join('、')}${missing.length > 2 ? '等' : ''}）。這些內容分別屬於 ${missingCategories.join('/')} 範疇，建議下次交班時務必包含。`);
    }

    // Normalize score to 0-100
    const maxPossible = (allRequired.length * 10) + (currentScenario.keywords.some(k => k.category === 'R') ? 10 : 0);
    let finalScore = Math.round((totalScore / maxPossible) * 100);
    if (finalScore < 0) finalScore = 0;
    if (finalScore > 100) finalScore = 100;
    
    setScore(finalScore);
    setNpcFeedback(feedback);
    setIsSubmitted(true);
    setShowResult(true);
  };

  const resetGame = () => {
    setPlacedKeywords({ I: [], S: [], B: [], A: [], R: [] });
    setScore(0);
    setShowResult(false);
    setSelectedKeyword(null);
    setIsSubmitted(false);
    setIsTimeUp(false);
    setNpcFeedback([]);
    if (currentScenario.timeLimit) setTimeLeft(currentScenario.timeLimit);
    
    // Re-shuffle on reset
    const keywords = currentScenario.keywords.map(k => {
      let updatedText = k.text;
      if (playerName) {
        updatedText = updatedText.replace(/護生(小明|小玲|阿強)/g, `護生${playerName}`);
        updatedText = updatedText.replace(/我是(.*)護生(小明|小玲|阿強)/g, `我是$1護生${playerName}`);
      }
      return { ...k, text: updatedText };
    });

    for (let i = keywords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keywords[i], keywords[j]] = [keywords[j], keywords[i]];
    }
    setShuffledKeywords(keywords);
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {/* HIS Header */}
      <header className="bg-medical-dark text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg">
            <Stethoscope className="text-medical-dark w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">HIS 臨床護理資訊系統</h1>
            <p className="text-xs opacity-80">實習護生交班訓練模組 v1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowScenarioList(!showScenarioList)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Activity className="w-4 h-4" />
              <span>切換難度：{currentScenario.difficulty}</span>
            </button>
            
            <AnimatePresence>
              {showScenarioList && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden text-slate-900 z-[60]"
                >
                  <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    選擇練習難度
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {['Level 1', 'Level 2', 'Level 3'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => switchDifficulty(diff)}
                        className={cn(
                          "w-full text-left px-4 py-3 text-sm hover:bg-medical-secondary transition-colors flex items-center justify-between",
                          currentScenario.difficulty === diff ? "bg-medical-secondary text-medical-primary font-bold" : "text-slate-700"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            diff === 'Level 1' ? "bg-green-500" : diff === 'Level 2' ? "bg-orange-500" : "bg-red-500"
                          )} />
                          <span>{diff}</span>
                        </div>
                        {currentScenario.difficulty === diff && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowHints(!showHints)}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors border",
              showHints 
                ? "bg-white text-medical-primary border-white" 
                : "bg-white/10 hover:bg-white/20 text-white border-white/20"
            )}
            title={showHints ? "隱藏 ISBAR 提示" : "顯示 ISBAR 提示"}
          >
            {showHints ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => setShowIntroModal(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            title="遊戲簡介與說明"
          >
            <Info className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-6 text-sm border-l border-white/20 pl-6">
            {timeLeft !== null && (
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full font-bold transition-colors",
                timeLeft < 30 ? "bg-red-500 text-white animate-pulse" : "bg-white/10"
              )}>
                <Clock className="w-4 h-4" />
                <span>剩餘時間：{formatTime(timeLeft)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span>{formatTaiwanTime(currentTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>護生：{playerName || '未設定'} ({currentScenario.ward})</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Chart */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <ClipboardList className="w-5 h-5" />
                <span>病歷摘要與護理記錄</span>
              </div>
              <div className="flex gap-2">
                <span className={cn(
                  "text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider",
                  currentScenario.difficulty === 'Level 1' ? "bg-green-100 text-green-700" :
                  currentScenario.difficulty === 'Level 2' ? "bg-orange-100 text-orange-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {currentScenario.difficulty}
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
                  床號: {currentScenario.bedNumber}
                </span>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-500 text-xs">姓名</p>
                  <p className="font-bold">{currentScenario.patientName}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-500 text-xs">年齡/性別</p>
                  <p className="font-bold">{currentScenario.age}歲 / {currentScenario.gender}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-500 text-xs">主訴</p>
                  <p className="font-bold text-red-600">{currentScenario.chiefComplaint}</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-medical-primary rounded-full"></div>
                <div className="pl-4 py-2">
                  <h3 className="text-sm font-bold text-slate-700 mb-2">臨床情境描述：</h3>
                  <div className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
                    {currentScenario.fullStory}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-medical-primary" />
                  提取關鍵字（隨機排列）：
                </h3>
                <div className="flex flex-wrap gap-2">
                  {shuffledKeywords.map((kw) => (
                    <DraggableKeyword
                      key={kw.id}
                      keyword={kw}
                      isPlaced={isKeywordPlaced(kw.id)}
                      isSelected={selectedKeyword?.id === kw.id}
                      isSubmitted={isSubmitted}
                      onClick={() => handleKeywordClick(kw)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}>
            {activeId ? (
              <div className="px-3 py-2 rounded-lg text-sm bg-medical-primary text-white border border-medical-primary shadow-xl z-[100] cursor-grabbing">
                {shuffledKeywords.find((k: Keyword) => k.id === activeId)?.text}
              </div>
            ) : null}
          </DragOverlay>

          {/* Submit Button Area */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              確認交班內容
            </h3>
            <div className="space-y-4">
              <button
                disabled={isSubmitted}
                onClick={handleSubmit}
                className={cn(
                  "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm",
                  !isSubmitted
                    ? "bg-medical-primary hover:bg-medical-dark text-white"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                {isSubmitted ? "交班已送出" : "確認送出交班"}
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {isSubmitted && (
                <button
                  onClick={resetGame}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  重新練習
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: ISBAR Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="bg-medical-dark/5 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-medical-dark">
                <FileText className="w-5 h-5" />
                <span>ISBAR 交班單填寫區</span>
              </div>
              {isSubmitted && (
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="text-slate-500">最終評分:</span>
                  <span className="text-medical-primary text-lg">{score}</span>
                </div>
              )}
            </div>

            <div className="p-6 flex-1 space-y-4 overflow-y-auto">
              {categories.map((cat) => (
                <DroppableCategory 
                  key={cat.key}
                  cat={cat}
                  isSubmitted={isSubmitted}
                  placedKeywords={placedKeywords[cat.key]}
                  selectedKeyword={selectedKeyword}
                  onCategoryClick={handleCategoryClick}
                  onPlacedKeywordClick={handlePlacedKeywordClick}
                  categories={categories}
                  showHints={showHints}
                />
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>提示：請將所有關鍵字分類完畢後，點擊左側「確認送出交班」進行評分。</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Game Introduction Modal */}
      <AnimatePresence>
        {showIntroModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[300] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="bg-medical-primary p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">臨床交班 (ISBAR) 模擬訓練系統</h2>
                    <p className="text-white/70 text-xs">提升臨床溝通能力與病人安全</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowIntroModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-medical-primary rounded-full" />
                    遊戲目標
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    本系統旨在透過模擬真實臨床情境，訓練護生與醫護人員將關鍵資訊正確分類至 <strong>ISBAR</strong> 溝通框架中。精確的交班能確保醫療團隊間資訊傳遞的完整性，是維護病人安全的重要環節。
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-medical-primary rounded-full" />
                    如何操作
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="font-bold text-medical-primary mb-1 text-sm">1. 閱讀資料</div>
                      <p className="text-xs text-slate-500">仔細閱讀左側的「病人資料」與「情境描述」，掌握病情關鍵。</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="font-bold text-medical-primary mb-1 text-sm">2. 分類關鍵字</div>
                      <p className="text-xs text-slate-500">將下方的「關鍵字」拖曳至右側對應的 ISBAR 類別中，或先點選關鍵字再點選類別。</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="font-bold text-medical-primary mb-1 text-sm">3. 難度挑戰</div>
                      <p className="text-xs text-slate-500">可使用右上角「眼睛圖示」隱藏類別名稱，挑戰記憶力與熟練度。</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="font-bold text-medical-primary mb-1 text-sm">4. 送出評分</div>
                      <p className="text-xs text-slate-500">完成分類後點擊「確認送出交班」，系統將根據正確率給予評分與具體回饋。</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-medical-primary rounded-full" />
                    計分標準
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">正確分類關鍵字</span>
                      <span className="font-bold text-green-600">+10 分 / 項</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">包含非必要資訊 (雜訊)</span>
                      <span className="font-bold text-red-600">-10 分 / 項</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">建議 (R) 順序正確獎勵</span>
                      <span className="font-bold text-blue-600">+10 分</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400">
                      * 最終得分將根據情境總分進行百分比換算 (0-100 分)。
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-medical-primary rounded-full" />
                    ISBAR 框架說明
                  </h3>
                  <div className="space-y-2">
                    {[
                      { l: 'I', f: 'Introduction', d: '自我介紹、確認交班對象與病人身份。' },
                      { l: 'S', f: 'Situation', d: '描述目前發生的主要問題或緊急狀況。' },
                      { l: 'B', f: 'Background', d: '提供病人的病史、診斷、用藥與檢查結果。' },
                      { l: 'A', f: 'Assessment', d: '描述病人的生命徵象、評估結果與臨床判斷。' },
                      { l: 'R', f: 'Recommendation', d: '提出具體建議、後續處置或需要協助的事項。' }
                    ].map(item => (
                      <div key={item.l} className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-black shrink-0">{item.l}</div>
                        <div>
                          <div className="font-bold text-sm text-slate-800">{item.f}</div>
                          <p className="text-xs text-slate-500">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setShowIntroModal(false)}
                  className="px-8 py-3 bg-medical-primary hover:bg-medical-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-medical-primary/20"
                >
                  我知道了，開始練習
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name Input Modal */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="w-16 h-16 bg-medical-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-medical-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">歡迎來到臨床交班訓練</h2>
              <p className="text-slate-500 text-center mb-8 text-sm">
                在開始實習之前，請先輸入您的姓名。
              </p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                if (playerName.trim()) {
                  setShowNameModal(false);
                  setShowDifficultyModal(true);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                      護生姓名
                    </label>
                    <input
                      autoFocus
                      id="name"
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="例如：小明"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-medical-primary focus:outline-none transition-all text-lg font-medium"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!playerName.trim()}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg",
                      playerName.trim() 
                        ? "bg-medical-primary hover:bg-medical-dark shadow-medical-primary/20" 
                        : "bg-slate-200 cursor-not-allowed"
                    )}
                  >
                    開始練習
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Difficulty Selection Modal */}
      <AnimatePresence>
        {showDifficultyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[250] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-medical-primary p-8 text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black mb-2">選擇訓練難度</h2>
                <p className="text-white/80">你好，{playerName} 護生。請選擇今天的實習病房與挑戰難度。</p>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { level: 'Level 1', label: '初級訓練', desc: '基礎 ISBAR 分類', icon: <ShieldCheck className="w-6 h-6" />, color: 'green' },
                  { level: 'Level 2', label: '中級挑戰', desc: '包含干擾資訊與排序', icon: <Activity className="w-6 h-6" />, color: 'orange' },
                  { level: 'Level 3', label: '高級實戰', desc: '重症病況與高壓計時', icon: <AlertTriangle className="w-6 h-6" />, color: 'red' },
                ].map((diff) => (
                  <button
                    key={diff.level}
                    onClick={() => handleDifficultySelect(diff.level)}
                    className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-slate-100 hover:border-medical-primary hover:bg-medical-primary/5 transition-all group"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                      diff.level === 'Level 1' ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white" :
                      diff.level === 'Level 2' ? "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white" :
                      "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                    )}>
                      {diff.icon}
                    </div>
                    <h3 className="font-black text-slate-900 mb-1">{diff.level}</h3>
                    <p className="text-xs text-slate-500 mb-3">{diff.label}</p>
                    <p className="text-[10px] text-slate-400 mb-3 italic">{diff.desc}</p>
                    <div className="mt-auto pt-3 border-t border-slate-100 w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      隨機分配劇本
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center my-8"
            >
              {!showScript ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">交班評核結果</h2>
                  <p className="text-slate-600 mb-6 text-sm">
                    系統已根據標準 ISBAR 流程完成評分。請查看右側表格中的具體建議。
                  </p>
                  
                  <div className="bg-slate-50 rounded-xl p-6 mb-8 grid grid-cols-2 gap-4 border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">最終積分</p>
                      <p className="text-3xl font-black text-medical-primary">{score}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">評級</p>
                      <p className={cn(
                        "text-xl font-black",
                        score >= 90 ? "text-green-600" : score >= 70 ? "text-blue-600" : score >= 60 ? "text-orange-500" : "text-red-500"
                      )}>
                        {score >= 90 ? "極佳 (Excellent)" : score >= 70 ? "良好 (Good)" : score >= 60 ? "尚可 (Pass)" : "待加強 (Fail)"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8 text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner",
                        score >= 90 ? "bg-green-100" : score >= 70 ? "bg-blue-100" : score >= 60 ? "bg-orange-100" : "bg-red-100"
                      )}>
                        {score >= 90 ? "😊" : score >= 70 ? "🙂" : score >= 60 ? "🤨" : "🤦"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">資深學姊的表情</p>
                        <p className="text-lg font-bold text-slate-900">
                          {score >= 90 ? "滿意微笑" : score >= 70 ? "點頭提醒" : score >= 60 ? "皺眉嚴肅" : "手扶額頭"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-medical-primary/5 border-l-4 border-medical-primary p-4 rounded-r-lg text-base text-slate-700 italic font-medium leading-relaxed mb-4">
                      {score >= 90 ? `「${playerName || '同學'}，條理分明，重點都有抓到，去休息吧，剩下的交給我。」` : 
                       score >= 70 ? `「${playerName || '同學'}，大致沒問題，但 A (評估) 的部分可以再深入一點，加油。」` : 
                       score >= 60 ? `「${playerName || '同學'}，雖然有交到重點，但雜訊太多，我聽得很辛苦，下次精簡點。」` : 
                       `「${playerName || '同學'}，你這樣交班我不敢接。去把病人狀況搞清楚再來找我。」`}
                    </div>

                    {npcFeedback.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">具體改進建議</p>
                        {npcFeedback.map((f, i) => (
                          <div key={i} className="flex gap-2 items-start text-xs text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          handleDifficultySelect(currentScenario.difficulty);
                          resetGame();
                        }}
                        className="py-4 bg-medical-primary text-white rounded-xl font-black text-lg shadow-lg shadow-medical-primary/20 hover:bg-medical-dark transition-all"
                      >
                        再試一次
                      </button>
                      <button
                        onClick={() => {
                          setShowResult(false);
                          setShowDifficultyModal(true);
                          resetGame();
                        }}
                        className="py-4 bg-white border-2 border-medical-primary text-medical-primary rounded-xl font-black text-lg hover:bg-medical-primary/5 transition-all"
                      >
                        切換難度
                      </button>
                    </div>
                    <button
                      onClick={() => setShowScript(true)}
                      className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-black text-lg hover:bg-slate-200 transition-all"
                    >
                      查看標準交班稿
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-left">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-medical-primary" />
                      標準交班稿 (ISBAR)
                    </h2>
                    <button 
                      onClick={() => setShowScript(false)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-medical-primary/5 border border-medical-primary/20 rounded-2xl p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    {categories.map(cat => {
                      const correctKeywords = currentScenario.keywords
                        .filter(k => k.category === cat.key)
                        .map(k => {
                          let text = k.text;
                          if (playerName) {
                            text = text.replace(/護生(小明|小玲|阿強)/g, `護生${playerName}`);
                            text = text.replace(/我是(.*)護生(小明|小玲|阿強)/g, `我是$1護生${playerName}`);
                          }
                          return text;
                        });
                      
                      return (
                        <div key={cat.key} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-black text-white", cat.color)}>
                              {cat.label}
                            </span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                              {cat.full.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed pl-6 border-l-2 border-slate-200">
                            {correctKeywords.join('，')}。
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 items-start">
                      <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-orange-700 leading-relaxed">
                        提示：請嘗試大聲朗讀這份交班稿。標準的 ISBAR 溝通能確保資訊傳遞的完整性與病人的安全。
                      </p>
                    </div>
                    <button
                      onClick={() => setShowResult(false)}
                      className="w-full py-4 bg-medical-primary hover:bg-medical-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-medical-primary/20"
                    >
                      完成並返回
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto p-6 text-center text-slate-400 text-xs">
        © 2026 護理實習教育平台 - 臨床溝通模擬系統
      </footer>
    </div>
    </DndContext>
  );
}
