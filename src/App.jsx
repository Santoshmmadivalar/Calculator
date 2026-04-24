import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { History as HistoryIcon, Trash2 } from 'lucide-react';

const buttons = [
  { id: 'clear', label: 'AC', color: 'text-purpleGlow drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' },
  { id: 'del', label: 'C', color: 'text-purpleGlow drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' },
  { id: 'percent', label: '%', color: 'text-cyanGlow drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' },
  { id: 'divide', label: '÷', color: 'text-cyanGlow drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' },
  { id: '7', label: '7' },
  { id: '8', label: '8' },
  { id: '9', label: '9' },
  { id: 'multiply', label: '×', color: 'text-cyanGlow drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' },
  { id: '4', label: '4' },
  { id: '5', label: '5' },
  { id: '6', label: '6' },
  { id: 'subtract', label: '−', color: 'text-cyanGlow drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' },
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
  { id: 'add', label: '+', color: 'text-cyanGlow drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' },
  { id: '0', label: '0', colSpan: 2 },
  { id: 'decimal', label: '.' },
  { id: 'equals', label: '=', color: 'text-white bg-indigoAccent/80 border !border-indigoAccent/50 shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:shadow-[0_0_40px_rgba(99,102,241,1)]' },
];

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // Mouse Parallax Effect hook
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);

  // Pointer position for cursor glow
  const pointerX = useMotionValue(-1000);
  const pointerY = useMotionValue(-1000);

  const springConfigParallax = { damping: 30, stiffness: 100 };
  const cursorXConfig = useSpring(parallaxX, springConfigParallax);
  const cursorYConfig = useSpring(parallaxY, springConfigParallax);

  const pointerXSpring = useSpring(pointerX, { damping: 25, stiffness: 200 });
  const pointerYSpring = useSpring(pointerY, { damping: 25, stiffness: 200 });

  useEffect(() => {
    fetchHistory();
    const handleMouseMove = (e) => {
      // Parallax
      const px = (e.clientX / window.innerWidth - 0.5) * 60; // Max shift 30px
      const py = (e.clientY / window.innerHeight - 0.5) * 60;
      parallaxX.set(px);
      parallaxY.set(py);

      // Pointer
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (key === 'Enter') { e.preventDefault(); handlePress('equals'); }
      else if (key === 'Backspace') handlePress('del');
      else if (key === 'Escape') handlePress('clear');
      else if ('0123456789'.includes(key)) handlePress(key, key);
      else if (key === '+') handlePress('add', '+');
      else if (key === '-') handlePress('subtract', '−');
      else if (key === '*') handlePress('multiply', '×');
      else if (key === '/') { e.preventDefault(); handlePress('divide', '÷'); }
      else if (key === '.') handlePress('decimal', '.');
      else if (key === '%') handlePress('percent', '%');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, result]);

  const fetchHistory = () => {
    try {
      const data = JSON.parse(localStorage.getItem('calcHistory') || '[]');
      setHistory(data);
    } catch (e) {
      setHistory([]);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('calcHistory');
    setHistory([]);
  };

  const handlePress = (id, label) => {
    if (id === 'clear') {
      setInput('');
      setResult('');
    } else if (id === 'del') {
      setInput((prev) => prev.slice(0, -1));
    } else if (id === 'equals') {
      if (!input) return;
      try {
        let evalStr = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        // Evaluate safely with standard JS functions
        const calcResult = new Function('return ' + evalStr)();
        const finalRes = Number.isInteger(calcResult) ? calcResult : parseFloat(calcResult.toFixed(8));
        setResult('=' + finalRes);
        
        // Save to Local Storage
        const currentHistory = JSON.parse(localStorage.getItem('calcHistory') || '[]');
        const newItem = { expression: input, result: finalRes, _id: Date.now() };
        const newHistory = [newItem, ...currentHistory].slice(0, 50); // Keep last 50
        localStorage.setItem('calcHistory', JSON.stringify(newHistory));
        setHistory(newHistory);
      } catch (err) {
        setResult('Error');
      }
    } else {
      if (result) {
        setInput(result.startsWith('=') ? result.substring(1) + label : label);
        setResult('');
      } else {
        setInput((prev) => prev + label);
      }
    }
  };

  const particles = Array.from({ length: 60 });

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 text-neutral-100 overflow-hidden font-sans">
      
      {/* 🔹 Mouse Cursor Glow 🔹 */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px] bg-cyanGlow/20 rounded-full blur-[100px] z-50 mix-blend-screen"
        style={{
          x: pointerXSpring,
          y: pointerYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* 🔹 Background Visuals 🔹 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-grid opacity-30 mask-image"></div>
        
        {/* Animated Aurora Blobs combined w/ mouse parallax */}
        <motion.div
           style={{ x: cursorXConfig, y: cursorYConfig }}
           className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vh] bg-purpleGlow opacity-30 blur-[140px] rounded-full animate-aurora mix-blend-screen"
        />
        <motion.div
           style={{ x: cursorXConfig, y: cursorYConfig, animationDelay: '2s' }}
           className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vh] bg-cyanGlow opacity-20 blur-[150px] rounded-full animate-aurora mix-blend-screen"
        />
        <motion.div
           style={{ x: cursorXConfig, y: cursorYConfig, animationDelay: '4s' }}
           className="absolute top-[20%] right-[10%] w-[40vw] h-[40vh] bg-indigoAccent opacity-20 blur-[120px] rounded-full animate-aurora mix-blend-screen"
        />

        {/* Floating Particles (Starts) */}
        {particles.map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: Math.random() * window.innerHeight, 
              x: Math.random() * window.innerWidth,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight * 1.5 - window.innerHeight * 0.25],
              x: [null, Math.random() * window.innerWidth * 1.5 - window.innerWidth * 0.25],
            }}
            transition={{
              duration: Math.random() * 40 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ 
              width: Math.random() * 2 + 1, 
              height: Math.random() * 2 + 1,
              filter: `blur(${Math.random()}px)`
            }}
          />
        ))}
      </div>

      {/* 🔹 Anti-Gravity Calculator App 🔹 */}
      <motion.div 
        // Entire calc scales up slightly on load and floats up gently
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[380px] flex flex-col gap-6 drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)]"
      >
        
        {/* Top Header */}
        <div className="flex justify-between items-center w-full px-5 text-white/60 relative z-20">
          <div className="text-xs font-semibold tracking-[0.3em] uppercase drop-shadow-lg flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-cyanGlow shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
             <span><span className="text-cyanGlow">Nexus</span> Calc</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.15, rotate: 15, color: '#22d3ee' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md cursor-pointer transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            <HistoryIcon size={16} />
          </motion.button>
        </div>

        {/* Calc Board Wrapper */}
        <motion.div 
          className="relative group"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Subtle Outer Glow specific to calculator bound */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-cyanGlow/30 via-indigoAccent/20 to-purpleGlow/30 blur-2xl pointer-events-none scale-105 opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
          
          <AnimatePresence mode="wait">
            {!showHistory ? (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="glass-panel p-6 space-y-6"
              >
                {/* Value Display */}
                <div className="flex flex-col items-end justify-end h-[140px] bg-[#020617]/60 rounded-[24px] p-5 shadow-[inset_0_4px_25px_rgba(0,0,0,1)] border border-white/10 relative overflow-hidden backdrop-blur-xl">
                  
                  {/* Inner ambient light */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-cyanGlow/10 blur-[50px] pointer-events-none rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purpleGlow/10 blur-[40px] pointer-events-none rounded-full"></div>

                  <motion.div 
                    className="text-right text-white/50 text-xl tracking-widest w-full overflow-hidden text-ellipsis whitespace-nowrap mb-1 font-light"
                    layout
                  >
                    {input || '0'}
                  </motion.div>
                  <div className={`text-right text-5xl font-semibold tracking-wider flex items-end justify-end w-full truncate ${result === 'Error' ? 'text-purpleGlow drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'}`}>
                    {result}
                  </div>
                </div>

                {/* Number Keypad */}
                <div className="grid grid-cols-4 gap-4 relative">
                  {buttons.map((btn) => (
                    <motion.button
                      key={btn.id}
                      whileHover={{ y: -4, scale: 1.05 }}
                      whileTap={{ y: 2, scale: 0.95, boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.9)' }}
                      onClick={() => handlePress(btn.id, btn.label)}
                      className={`
                        relative flex items-center justify-center p-4 
                        rounded-2xl text-2xl font-medium bg-[#020617]/30 backdrop-blur-md
                        border border-white/10 shadow-btn
                        transition-all duration-300 overflow-hidden
                        hover:bg-white/10 hover:border-cyanGlow/50 hover:shadow-btn-hover
                        group/btn
                        ${btn.color || 'text-neutral-200'}
                        ${btn.colSpan ? 'col-span-2 aspect-auto' : 'aspect-square'}
                      `}
                    >
                      {/* Button reflection highlight */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">{btn.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="glass-panel p-6 h-[585px] flex flex-col"
              >
                 <div className="flex justify-between items-center mb-6 pl-2 pr-1">
                  <h2 className="text-xl font-medium tracking-wide text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Memory Log</h2>
                  {history.length > 0 && (
                    <motion.button 
                      whileHover={{ scale: 1.15, rotate: -10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleClearHistory} 
                      className="text-purpleGlow p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-3">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-40 mt-[-50px]">
                      <HistoryIcon size={60} className="mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                      <p className="text-sm tracking-[0.2em] uppercase font-light">Memory Empty</p>
                    </div>
                  ) : (
                    history.map((item, idx) => (
                      <motion.div 
                        key={item._id || idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        className="bg-[#020617]/40 p-4 rounded-2xl border border-white/10 flex flex-col items-end gap-1 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] cursor-default transition-colors relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        <span className="text-white/50 text-sm font-light tracking-wide">{item.expression}</span>
                        <span className="text-cyanGlow text-2xl font-semibold tracking-wide drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                          ={item.result}
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
