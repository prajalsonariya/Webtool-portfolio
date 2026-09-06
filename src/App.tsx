import { motion, useScroll, useMotionValueEvent, AnimatePresence, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  CheckCircle2, 
  Activity, LayoutGrid, Maximize, Zap, MousePointer2, Layers,
  Terminal, Bird, Compass, Hammer, Clock, Moon
} from 'lucide-react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hardware-accelerated scroll tracking
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  // Buttery-smooth derived transforms (ZERO React re-renders during pan)
  // Stage 1 fades in from 0.05 to 0.10. Timeline stays still.
  // Then from 0.10 to 0.55 (450vh), the timeline pans.
  const timelineX = useTransform(scrollYProgress, [0.10, 0.55], ["37.5%", "-37.5%"]);
  const lineScale = useTransform(scrollYProgress, [0.10, 0.55], [0.125, 1]);
  const lineWidth = useTransform(lineScale, v => `calc(${Math.max(0.125, v) * 100}% - 4rem)`);

  // State only for active indexing (triggers max 5 times during the whole scroll)
  const [activeMainStage, setActiveMainStage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTimelineStage, setIsTimelineStage] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let stage = 0;
    if (latest < 0.05) stage = 0; // 0 to 5%
    else if (latest < 0.55) stage = 1; // 5% to 55%
    else if (latest < 0.70) stage = 2; // 55% to 70%
    else if (latest < 0.85) stage = 3; // 70% to 85%
    else stage = 4; // 85% to 100%

    if (stage !== activeMainStage) setActiveMainStage(stage);

    const isStage1 = latest >= 0.05 && latest <= 0.55;
    if (isStage1 !== isTimelineStage) setIsTimelineStage(isStage1);

    if (isStage1) {
      // Calculate exactly where the physical line is (v)
      // from 0.10 to 0.55, local goes 0 to 1
      const local = Math.max(0, Math.min(1, (latest - 0.10) / 0.45));
      const v = 0.125 + (local * 0.875);
      
      let newPhase = 0;
      // Nodes are physically located at 0.125, 0.375, 0.625, 0.875 of the container width
      if (v >= 0.875) newPhase = 3;
      else if (v >= 0.625) newPhase = 2;
      else if (v >= 0.375) newPhase = 1;
      else newPhase = 0;
      
      if (newPhase !== activeIndex) setActiveIndex(newPhase);
    }
  });

  const scrollToStage = (stageIndex: number) => {
    const percentages = [0, 0.05, 0.55, 0.70, 0.85];
    const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: percentages[stageIndex] * scrollableDistance, behavior: 'smooth' });
  };

  const mainStages = [
    { title: "00", desc: "The Philosophy" },
    { title: "01", desc: "The Craft" },
    { title: "02", desc: "The Arsenal" },
    { title: "03", desc: "The Meaning" },
    { title: "04", desc: "The Commitment" }
  ];

  const processSubStages = [
    { 
      w: "01", t: "The Floor", d: "Deep immersion.",
      detail: "I don't build from a desk. I stand on your floor. I track the paperwork, the bottlenecks, the actual human movement."
    },
    { 
      w: "02", t: "The Forge", d: "5 AM. Blue switches.",
      detail: "Fueled by film scores and early mornings. Architecture, database, and logic engineered from an absolute blank slate."
    },
    { 
      w: "03", t: "The Ghost Run", d: "Catching edge cases.",
      detail: "Live testing alongside your existing system. No assumptions. We watch how real staff interact with the tool in real time."
    },
    { 
      w: "04", t: "The Flight", d: "Opening the wings.",
      detail: "The engine goes live. Built to be autonomous, lightweight, and free. You run your business, the system handles the rest."
    }
  ];

  return (
    <div ref={containerRef} className="h-[800vh] bg-stone-950 text-stone-200 selection:bg-amber-500/30 selection:text-amber-100 font-sans relative">
      
      {/* Cinematic Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none noise-bg z-50" />

      {/* Pinned Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col">
        
        {/* Header */}
        <header className="absolute top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-8 mix-blend-difference pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm border border-stone-500 flex items-center justify-center font-serif italic text-sm">S</div>
            <span className="font-mono text-xs tracking-widest uppercase text-stone-500 hidden md:block">Artisan Architecture</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-stone-500">Est. 2026</span>
        </header>

        {/* Right Vertical Scrubber */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-5 mix-blend-difference">
          {mainStages.map((st, i) => {
            return (
              <div 
                key={i} 
                className="flex flex-col items-center gap-3 group cursor-pointer" 
                onClick={() => scrollToStage(i)}
              >
                <span className={`text-[9px] font-mono transition-opacity duration-300 ${activeMainStage === i ? 'opacity-100 text-amber-500' : 'opacity-0 group-hover:opacity-50 text-stone-400'}`}>
                  {st.title}
                </span>
                <div className={`w-[2px] transition-all duration-500 rounded-full ${activeMainStage === i ? 'h-10 bg-amber-500' : 'h-3 bg-stone-700 group-hover:bg-stone-500'}`} />
              </div>
            );
          })}
        </div>

        {/* Dynamic Stage Container */}
        <div className="flex-1 relative w-full h-full flex items-center justify-center pt-24 pb-12 px-8 md:px-16 lg:px-24">
          <AnimatePresence mode="wait">
            
            {/* UNIT 0: The Problem */}
            {activeMainStage === 0 && (
              <motion.div key="stage0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="w-full max-w-7xl flex flex-col xl:flex-row items-center gap-16 absolute inset-0 m-auto h-fit px-8 md:px-16 lg:px-24">
                <div className="xl:w-1/2 space-y-8">
                  <div className="font-mono text-stone-500 text-xs tracking-widest uppercase flex items-center gap-3">
                    <Hammer size={14} className="text-amber-600" />
                    The Swordmaker
                  </div>
                  <h2 className="text-5xl md:text-6xl font-serif text-stone-100 leading-tight">
                    I don't paint the masterpiece. <br/><span className="text-stone-500 italic">I forge the tools.</span>
                  </h2>
                  <p className="text-stone-400 text-lg leading-relaxed max-w-lg font-light">
                    I despise generalized software. It disrespects the outliers forced to use it. I am not a factory. I take one project at a time, completely immersing myself in your operations to forge a system that fits perfectly in your hand.
                  </p>
                </div>
                
                <div className="xl:w-1/2 w-full flex flex-col gap-6">
                  <div className="glass-panel rounded-lg p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[50px]" />
                    <div className="flex items-center gap-4 mb-8 border-b border-stone-800 pb-4">
                      <div className="w-2 h-2 rounded-full bg-stone-700" />
                      <div className="w-2 h-2 rounded-full bg-stone-700" />
                      <span className="text-[10px] font-mono text-stone-500 tracking-wider">GENERIC_SAAS_BLOAT</span>
                    </div>
                    <div className="space-y-4 opacity-30 grayscale transition-all duration-500 group-hover:opacity-20">
                      <div className="h-3 w-3/4 bg-stone-800 rounded-sm" />
                      <div className="h-3 w-1/2 bg-stone-800 rounded-sm" />
                      <div className="h-3 w-full bg-stone-800 rounded-sm" />
                    </div>
                  </div>

                  <div className="glass-panel rounded-lg p-8 glow border-amber-500/20 relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-600/10 rounded-full blur-[60px]" />
                    <div className="flex items-center gap-4 mb-8 border-b border-amber-900/30 pb-4">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                      <span className="text-[10px] font-mono text-amber-200/70 tracking-wider">SOLNYTER_BESPOKE_ENGINE</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <div className="text-xs text-amber-500/70 uppercase tracking-widest font-mono">Artistic Flow</div>
                        <div className="text-3xl font-serif text-stone-100">Uninterrupted.</div>
                      </div>
                      <Compass className="text-amber-500 opacity-50" size={32} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* UNITS 1 to 4: The Process */}
            {activeMainStage === 1 && (
              <motion.div 
                key="stage1" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.6 }} 
                className="w-full h-full flex flex-col items-center relative absolute inset-0 pt-24 pb-12"
              >
                {/* Title Section */}
                <div className="text-center w-full max-w-3xl shrink-0 z-10 mb-16">
                  <div className="font-mono text-amber-600 text-xs tracking-widest uppercase flex items-center justify-center gap-3 mb-6">
                    <Clock size={14} /> One Project At A Time
                  </div>
                  <h2 className="text-5xl font-serif text-stone-100 mb-6">The Deep Immersion.</h2>
                  <p className="text-stone-400 text-lg mx-auto font-light max-w-xl transition-opacity duration-700" style={{ opacity: isTimelineStage ? 0.2 : 1 }}>
                    I don't fit in a box, and neither does your business. From the 5 AM start to the final deployment, the focus is absolute.
                  </p>
                </div>

                {/* Main Interactive Layout Area */}
                <div className="w-full flex-1 flex flex-col items-center gap-12 relative z-20 max-w-7xl">
                  
                  {/* Timeline Track */}
                  <div 
                    className="w-full h-32 relative flex items-center justify-center overflow-visible shrink-0 pointer-events-none"
                    style={{
                      maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                    }}
                  >
                    <motion.div 
                      className="absolute w-[150vw] max-w-[2000px] flex items-center"
                      style={{ x: timelineX }} // Buttery smooth 1:1 hardware pan
                    >
                      <div className="w-full relative px-8">
                        {/* Background wire */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 h-px bg-stone-800" />
                        
                        {/* Glowing Ember Line */}
                        <motion.div 
                          className="absolute top-1/2 -translate-y-1/2 left-8 h-px bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,1)]"
                          style={{ width: lineWidth }} // Buttery smooth continuous growth
                        />

                        {/* Nodes (Mechanical Keys) */}
                        <div className="grid grid-cols-4 gap-4 relative z-10 w-full">
                          {processSubStages.map((step, i) => {
                            const isActive = i <= activeIndex;
                            const isCurrentPhase = activeIndex === i;
                            
                            return (
                              <div 
                                key={i} 
                                className="flex flex-col items-center text-center relative transition-all duration-700 ease-out"
                                style={{
                                  opacity: isCurrentPhase ? 1 : 0.25,
                                  transform: isCurrentPhase ? 'scale(1)' : 'scale(0.95)'
                                }}
                              >
                                {/* Mechanical Keycap Visual */}
                                <div className={`
                                  w-14 h-14 rounded-lg flex items-center justify-center text-[10px] font-mono mb-6 transition-all duration-300 relative
                                  ${isActive 
                                    ? 'bg-gradient-to-b from-amber-950 to-stone-950 border border-amber-500/30 text-amber-200 translate-y-1' 
                                    : 'bg-gradient-to-b from-stone-800 to-stone-900 border border-stone-700/50 text-stone-600 shadow-[0_4px_0_rgba(28,25,23,1)]'} 
                                `}
                                style={{
                                  boxShadow: isActive ? '0 0 30px rgba(245,158,11,0.15), inset 0 1px 0 rgba(255,255,255,0.05)' : '',
                                  textShadow: isActive ? '0 0 12px rgba(245,158,11,0.9), 0 0 24px rgba(245,158,11,0.4)' : 'none'
                                }}
                                >
                                  {step.w}
                                </div>
                                <h4 className={`font-serif italic mb-2 transition-colors duration-300 ${isCurrentPhase ? 'text-stone-100 text-2xl' : isActive ? 'text-stone-300 text-xl' : 'text-stone-600 text-xl'}`}>{step.t}</h4>
                                <p className={`text-xs font-mono tracking-widest uppercase transition-colors duration-300 ${isActive ? 'text-amber-600/80' : 'text-stone-700'}`}>{step.d}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Popup Card */}
                  <div className="w-full max-w-xl h-48 relative flex justify-center mt-8">
                    <AnimatePresence mode="wait">
                      {isTimelineStage && (
                        <motion.div 
                          key={activeIndex}
                          initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                          transition={{ duration: 0.4 }}
                          className="w-full relative pointer-events-auto text-center"
                        >
                          <p className="text-lg text-stone-300 leading-relaxed font-light px-8">
                            {processSubStages[activeIndex].detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            )}

            {/* UNIT 5: Live Deployed Engines */}
            {activeMainStage === 2 && (
              <motion.div key="stage2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="w-full max-w-7xl flex flex-col justify-center items-center absolute inset-0 m-auto h-fit px-8 md:px-16 lg:px-24">
                <div className="text-center mb-16 space-y-4">
                  <div className="font-mono text-stone-500 text-xs tracking-widest uppercase flex items-center justify-center gap-3">Polymath Arsenal</div>
                  <h2 className="text-5xl md:text-6xl font-serif text-stone-100">Weapons Forged.</h2>
                </div>

                <div className="w-full max-w-4xl glass-panel rounded-xl overflow-hidden border-stone-800 flex flex-col h-[50vh]">
                  <div className="bg-stone-900/50 border-b border-stone-800 px-6 py-4 flex items-center gap-4">
                    <div className="flex-1 flex gap-4">
                      <div className="px-4 py-1.5 rounded-sm bg-stone-800 text-[10px] font-mono text-stone-200 flex items-center gap-2"><LayoutGrid size={12}/> Rupali Flow</div>
                      <div className="px-4 py-1.5 rounded-sm text-[10px] font-mono text-stone-500 hover:bg-stone-800/50 transition-colors cursor-pointer flex items-center gap-2"><Zap size={12}/> LinkNyter</div>
                      <div className="px-4 py-1.5 rounded-sm text-[10px] font-mono text-stone-500 hover:bg-stone-800/50 transition-colors cursor-pointer flex items-center gap-2"><Maximize size={12}/> Grain Photo</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-10 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <div>
                        <h3 className="text-3xl font-serif text-stone-100 mb-2">Rupali Flow Engine</h3>
                        <p className="text-xs text-stone-500 font-mono tracking-widest uppercase">High-Volume Service</p>
                      </div>
                      <div className="px-3 py-1.5 rounded bg-amber-950/30 text-amber-500 text-[10px] font-mono flex items-center gap-2 border border-amber-900/50">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"/> LIVE SYSTEM
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 flex-1 relative z-10">
                      <div className="col-span-2 glass-panel rounded-lg border-stone-800/50 p-6 flex flex-col">
                        <div className="text-[10px] font-mono text-stone-500 mb-6 uppercase tracking-widest">Real-Time Conflict Calendar</div>
                        <div className="flex-1 space-y-4">
                           {[...Array(3)].map((_, i) => (
                             <div key={i} className="w-full h-10 flex items-center gap-4">
                               <div className="text-[10px] font-mono text-stone-600 w-16">{9 + i}:00 AM</div>
                               <div className={`flex-1 h-full rounded-sm ${i % 2 === 0 ? 'bg-amber-900/20 border border-amber-700/30' : 'border border-stone-800 border-dashed'}`} />
                             </div>
                           ))}
                        </div>
                      </div>
                      <div className="col-span-1 flex flex-col gap-8">
                        <div className="flex-1 glass-panel rounded-lg border-stone-800/50 p-6 flex flex-col justify-center">
                           <div className="text-[10px] font-mono text-stone-500 mb-3 tracking-widest uppercase">Automated API</div>
                           <div className="text-4xl font-serif text-stone-100 mb-1">142</div>
                           <div className="text-xs text-stone-600 font-light">Confirmations Sent</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* UNIT 6: The Meaning */}
            {activeMainStage === 3 && (
              <motion.div key="stage3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }} className="w-full max-w-7xl flex flex-col items-center absolute inset-0 m-auto h-fit px-8 md:px-16 lg:px-24">
                <div className="text-center mb-24 space-y-6">
                  <div className="font-mono text-amber-600 text-xs tracking-widest uppercase flex items-center justify-center gap-3"><Moon size={14} /> Solnyter</div>
                  <h2 className="text-5xl md:text-6xl font-serif text-stone-100 leading-tight">Solo struggle to<br/><i className="text-stone-400">true brilliance.</i></h2>
                  <p className="text-stone-400 text-lg max-w-xl mx-auto font-light leading-relaxed">
                    'Sol' for Solo. 'Niter' for Struggle. There are no shortcuts. I handle the entire digital facility from the shadows so you can focus strictly on enjoying your life and your art.
                  </p>
                </div>

                <div className="relative w-full max-w-3xl flex justify-between items-center py-12">
                  <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent -translate-y-1/2" />
                  
                  {[
                    { icon: <Terminal size={24} />, label: "Raw Code", sub: "No templates" },
                    { icon: <CheckCircle2 size={24} />, label: "Precision", sub: "Absolute focus" },
                    { icon: <Bird size={24} />, label: "Autonomy", sub: "Built to fly" }
                  ].map((node, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center group">
                      <div className="w-20 h-20 rounded-xl glass-panel border-stone-800 flex items-center justify-center mb-6 relative hover:-translate-y-2 transition-transform duration-300 bg-stone-900">
                        <div className="text-stone-300 relative z-10 group-hover:text-amber-500 transition-colors">{node.icon}</div>
                      </div>
                      <div className="text-sm font-serif text-stone-200 mb-1 italic">{node.label}</div>
                      <div className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">{node.sub}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* UNIT 7: Commercials */}
            {activeMainStage === 4 && (
              <motion.div key="stage4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="w-full max-w-7xl flex flex-col items-center absolute inset-0 m-auto h-fit px-8 md:px-16 lg:px-24">
                <div className="text-center mb-16 space-y-4">
                  <div className="font-mono text-stone-500 text-xs tracking-widest uppercase flex items-center justify-center gap-2">Investment</div>
                  <h2 className="text-5xl font-serif text-stone-100">Transparent Terms.</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                  <div className="glass-panel p-12 rounded-xl border-stone-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Layers size={80} /></div>
                    <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-6">Upfront Build Fee</div>
                    <div className="text-5xl font-serif text-stone-100 mb-10 tracking-tight">₹4,00,000</div>
                    <ul className="space-y-4 text-sm text-stone-400 font-light">
                      <li className="flex items-center gap-4"><span className="text-amber-600 font-mono">+</span> Deep-dive custom build</li>
                      <li className="flex items-center gap-4"><span className="text-amber-600 font-mono">+</span> Full on-site floor audit</li>
                      <li className="flex items-center gap-4"><span className="text-amber-600 font-mono">+</span> Custom desktop & mobile engine</li>
                      <li className="flex items-center gap-4"><span className="text-amber-600 font-mono">+</span> 60-day real-world buffer included</li>
                    </ul>
                  </div>

                  <div className="glass-panel p-12 rounded-xl border-stone-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={80} /></div>
                    <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-6">Operational Retainer</div>
                    <div className="text-5xl font-serif text-stone-100 mb-3 tracking-tight">₹20,000</div>
                    <div className="text-xs text-stone-600 font-mono mb-8 tracking-widest uppercase">/ month (Begins Month 3)</div>
                    <ul className="space-y-4 text-sm text-stone-400 font-light">
                      <li className="flex items-center gap-4"><span className="text-amber-600 font-mono">+</span> 24/7 server infrastructure</li>
                      <li className="flex items-center gap-4"><span className="text-amber-600 font-mono">+</span> DB sync & API token health</li>
                      <li className="flex items-center gap-4"><span className="text-amber-600 font-mono">+</span> Security & continuous backups</li>
                      <li className="flex items-center gap-4"><span className="text-amber-600 font-mono">+</span> Routine operational tweaks</li>
                    </ul>
                  </div>
                </div>

                <motion.a 
                  href="mailto:contact@prajalsonariya.com"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-16 inline-flex items-center gap-4 px-10 py-5 bg-stone-100 text-stone-950 text-xs font-mono uppercase tracking-widest hover:bg-amber-500 transition-colors pointer-events-auto rounded-sm"
                >
                  Commission A Build
                </motion.a>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
