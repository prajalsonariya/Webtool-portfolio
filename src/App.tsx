import { motion, useScroll, useMotionValueEvent, AnimatePresence, useTransform, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';


export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEngineTab, setActiveEngineTab] = useState(0);

  const engines = [
    {
      id: "rupali",
      name: "Rupali Flow",
      title: "Rupali Flow: Salon Floor Operations",
      subtitle: "High-Volume Service",
      videoSrc: "/videos/RupaliFlow.mp4",
      link: null
    },
    {
      id: "linknyter",
      name: "LinkNyter",
      title: "LinkNyter: Audio Playback Engine",
      subtitle: "High-Speed Asset Distribution",
      videoSrc: "/videos/LinkNyter.mp4",
      link: "https://www.linknyter.com/"
    },
    {
      id: "grainphoto",
      name: "Grain Photo",
      title: "Grain Photo: Photo Engine",
      subtitle: "Instant Visual Delivery",
      videoSrc: "/videos/GrainPhoto.mp4",
      link: null
    }
  ];

  // Hardware-accelerated scroll tracking
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  // Wrap scroll progress in a spring to smooth out rigid mouse-wheel ticks
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });
  
  // --------------------------------------------------------------------------------
  // TIMELINE PHYSICS (PURE VW MATH)
  // --------------------------------------------------------------------------------
  // Track starts at 80vw and ends at 240vw (160vw total length).
  // Nodes are spaced out heavily to prevent overlap: 100vw, 140vw, 180vw, 220vw.
  
  // Start pan: -20vw (brings Node 1 into view).
  // End pan: -170vw (perfectly centers Node 4 at 50vw).
  const timelineX = useTransform(smoothProgress, [0.05, 0.55], ["-20vw", "-170vw"]);
  
  // The line grows exactly 160vw.
  const activeLineWidth = useTransform(smoothProgress, [0.05, 0.55], ["0vw", "160vw"]);

  // State only for active indexing (triggers max 5 times during the whole scroll)
  const [activeMainStage, setActiveMainStage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTimelineStage, setIsTimelineStage] = useState(false);

  // We intentionally use raw scrollYProgress here to prevent JS thread blocking during the physics animation.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let stage = 0;
    if (latest < 0.05) stage = 0; // 0 to 5%
    else if (latest < 0.55) stage = 1; // 5% to 55%
    else if (latest < 0.70) stage = 2; // 55% to 70%
    else if (latest < 0.85) stage = 3; // 70% to 85%
    else stage = 4; // 85% to 100%

    if (stage !== activeMainStage) setActiveMainStage(stage);

    let idx = 0;
    if (latest < 0.216) idx = 0;
    else if (latest < 0.350) idx = 1;
    else if (latest < 0.483) idx = 2;
    else idx = 3;
    
    if (idx !== activeIndex) setActiveIndex(idx);

    const isStage1 = latest >= 0.05 && latest <= 0.55;
    if (isStage1 !== isTimelineStage) setIsTimelineStage(isStage1);
  });

  const scrollToStage = (stageIndex: number) => {
    const percentages = [0, 0.05, 0.55, 0.70, 0.85];
    const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: percentages[stageIndex] * scrollableDistance, behavior: 'smooth' });
  };

  const mainStages = [
    { title: "00", desc: "Custom Software" },
    { title: "01", desc: "The Method" },
    { title: "02", desc: "Proven Engines" },
    { title: "03", desc: "Investment" },
    { title: "04", desc: "Handover" }
  ];

  const processSubStages = [
    { 
      w: "I", t: "On-Site Floor Audit",
      detail: "I stand on your floor, watch your staff work, and map your unwritten operational rules."
    },
    { 
      w: "II", t: "Custom Engineering",
      detail: "Databases and logic architecture built from scratch specifically for your environment."
    },
    { 
      w: "III", t: "Live Integration",
      detail: "Tested alongside your actual team until the interface operates with zero friction."
    },
    { 
      w: "IV", t: "Handover",
      detail: "A standalone desktop or/and mobile tool deployed directly to your workstations."
    }
  ];

  return (
    <div ref={containerRef} className="h-[800vh] bg-[#15120f] text-[#e3dbc8] selection:bg-[#c28e5c]/30 selection:text-[#f4ebd8] font-sans relative">
      
      {/* Cinematic Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none noise-bg z-50" />

      {/* Pinned Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col">
        
        {/* Header */}
        <header className="absolute top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-8 mix-blend-difference pointer-events-none">
          <div className="flex items-center gap-4">
            <img src="/logo_white.png" alt="Solnyter Logo" className="h-5 w-auto object-contain opacity-80" />
            <span className="font-mono text-xs tracking-widest uppercase text-[#8a7b69] hidden md:block">Solnyter</span>
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#8a7b69]">Prajal Sonariya</span>
        </header>

        {/* Right Vertical Scrubber */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 z-50 mix-blend-difference pointer-events-auto">
          {mainStages.map((st, i) => {
            return (
              <div 
                key={i} 
                className="flex flex-col items-center gap-3 group cursor-pointer" 
                onClick={() => scrollToStage(i)}
              >
                <span className={`text-[9px] font-mono transition-opacity duration-300 ${activeMainStage === i ? 'opacity-100 text-[#c28e5c]' : 'opacity-0 group-hover:opacity-50 text-[#bbaea0]'}`}>
                  {st.title}
                </span>
                <div className={`w-[2px] transition-all duration-500 rounded-full ${activeMainStage === i ? 'h-10 bg-[#c28e5c]' : 'h-3 bg-[#4a3d30] group-hover:bg-neutral-500'}`} />
              </div>
            );
          })}
        </div>

        {/* Dynamic Stage Container */}
        <div className="flex-1 relative w-full h-full flex items-center justify-center pt-24 pb-12 px-8 md:px-16 lg:px-24">
          <AnimatePresence mode="wait">
            
            {/* UNIT 0: The Introduction */}
            {activeMainStage === 0 && (
              <motion.div 
                key="stage0" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }} 
                transition={{ duration: 0.8 }} 
                className="w-full h-full flex flex-col relative px-8 pb-12 pt-[15vh]"
              >
                <div className="w-full max-w-5xl relative z-10 flex flex-col justify-center">
                  <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1 }}
                  >
                    <h1 className="text-[2.5rem] md:text-[5.5rem] leading-[1.05] tracking-tight font-serif text-stone-100 mb-8 relative">
                      Stop Adapting Your Business<br />
                      <span className="text-[#a68a61] italic">to Generic Software.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#c8c0b0] font-serif italic max-w-3xl leading-relaxed">
                      I engineer custom operational software directly around your daily workflow.
                    </p>
                  </motion.div>
                </div>
                
                {/* Scroll Indicator / Sub-Hero */}
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center w-full px-8"
                >
                  <span className="font-serif italic text-[#a68a61] text-xl text-center">
                    "You Run the Business. I Build the Engine."
                  </span>
                  <span className="text-sm text-stone-500 mt-4 block not-italic font-sans text-center max-w-xl">
                    I'll manage the entire digital infrastructure so you can focus strictly on commercial expansion.
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* UNITS 1 to 4: The Process */}
            {activeMainStage === 1 && (
              <motion.div key="stage1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="w-full h-full relative">
                
                {/* Header Section */}
                <div className="absolute top-[15vh] w-full flex flex-col items-center text-center">
                  <div className="font-serif text-[#a68a61] text-[10px] tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-2">
                    <span className="text-[10px]">❖</span> THE METHOD
                  </div>
                  <h2 className="text-5xl md:text-[3.5rem] font-serif tracking-tight text-stone-100 mb-4">Build From the Scratch.</h2>
                  <p className="text-md text-[#c8c0b0] font-serif italic max-w-2xl mx-auto">
                    One project at a time. Zero templates. Zero third-party subscriptions.
                  </p>
                </div>

                {/* Timeline Section */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-full h-64 overflow-hidden pointer-events-none"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                  }}
                >
                  {/* Mobile-Only Centered Timeline */}
                  <div className="md:hidden absolute top-[45%] w-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center"
                      >
                        <span className="font-serif text-[0.9rem] tracking-widest text-[#a68a61] mb-3">{processSubStages[activeIndex].w}</span>
                        <h4 className="font-serif italic text-[#e6decb] text-3xl leading-tight">{processSubStages[activeIndex].t}</h4>
                      </motion.div>
                    </AnimatePresence>
                    {/* Progress Dots */}
                    <div className="mt-10 flex gap-2">
                      {processSubStages.map((_, i) => (
                        <div key={i} className={`h-[2px] rounded-full transition-all duration-500 ${activeIndex === i ? 'w-8 bg-[#8a7251]' : 'w-2 bg-[#2a221a]'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Desktop Horizontal Timeline */}
                  <div className="hidden md:block w-full h-full relative">
                    <motion.div 
                      className="absolute w-[300vw] h-full flex items-center"
                      style={{ x: timelineX }} // Buttery smooth 1:1 hardware pan
                    >
                      <div className="w-full relative h-full">
                        {/* Static Track Line (Bounded 85vw to 190vw) */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-[85vw] w-[105vw] h-[1px] bg-[#2a221a]">
                          {/* Start Marker */}
                          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-[#4a3d30] bg-[#0c0a09]" />
                          
                          {/* End Marker */}
                          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-[#4a3d30] bg-[#0c0a09]" />
                        </div>
                        
                        {/* Minimalist Active Line */}
                        <motion.div 
                          className="absolute top-1/2 -translate-y-1/2 left-[85vw] h-[1px] bg-[#8a7251]"
                          style={{ width: activeLineWidth }} 
                        />

                        {/* Nodes */}
                        <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
                          {processSubStages.map((step, i) => {
                            const isCurrentPhase = activeIndex === i;
                            // Exact vw positions matching the timeline math: 100vw, 125vw, 150vw, 175vw
                            const nodeLeft = 100 + (i * 25); 
                            
                            return (
                              <div 
                                key={i} 
                                className="absolute top-0 bottom-0 w-64 flex flex-col justify-center transition-all duration-700 ease-out -translate-x-1/2"
                                style={{
                                  left: `${nodeLeft}vw`,
                                  opacity: isCurrentPhase ? 1 : 0.15
                                }}
                              >
                                {/* Numeral - just above the line */}
                                <div className="absolute bottom-[calc(50%+1.5rem)] w-full text-center">
                                  <span className={`font-serif text-[0.9rem] tracking-widest transition-colors duration-500 ${isCurrentPhase ? 'text-stone-300' : 'text-stone-600'}`}>
                                    {step.w}
                                  </span>
                                </div>

                                {/* Title */}
                                <div className="absolute top-[calc(50%+1.5rem)] w-full flex flex-col items-center text-center">
                                  <h4 className={`font-serif italic mb-1 transition-colors duration-500 ${isCurrentPhase ? 'text-[#e6decb] text-2xl' : 'text-stone-500 text-xl'}`}>
                                    {step.t}
                                  </h4>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Popup Card / Quote Section */}
                <div className="w-full max-w-2xl absolute bottom-[20vh] left-1/2 -translate-x-1/2 flex justify-center">
                  <AnimatePresence>
                    {isTimelineStage && (
                      <motion.div 
                        key={activeIndex}
                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.3 }}
                        className="w-full absolute inset-0 flex items-center justify-center pointer-events-auto text-center"
                      >
                        <p className="text-[1.1rem] text-[#c8c0b0] leading-[1.8] font-serif italic px-8">
                          "{processSubStages[activeIndex].detail}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* UNIT 5: Live Deployed Engines */}
            {activeMainStage === 2 && (
              <motion.div key="stage2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="w-full max-w-7xl flex flex-col justify-center items-center absolute inset-0 m-auto h-fit px-8 md:px-16 lg:px-24">
                <div className="text-center mb-16 space-y-4">
                  <div className="font-serif text-[#a68a61] text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2">
                    <span className="text-[10px]">❖</span> PROVEN PRODUCTION ENGINES
                  </div>
                  <h2 className="text-3xl md:text-[2.5rem] font-serif tracking-tight text-stone-100 max-w-3xl mx-auto leading-tight">
                    Engineered for commercial use.
                  </h2>
                </div>

                <div className="w-full max-w-4xl glass-panel rounded-xl overflow-hidden border-[#3a2f24] flex flex-col md:h-[65vh]">
                  {/* Tabs */}
                  <div className="bg-[#1f1a16]/50 border-b border-[#3a2f24] px-6 py-4 flex items-center gap-4 shrink-0 overflow-x-auto hide-scrollbar">
                    <div className="flex-1 flex gap-4 min-w-max">
                      {engines.map((engine, idx) => (
                        <div 
                          key={engine.id}
                          onClick={() => setActiveEngineTab(idx)}
                          className={`px-4 py-1.5 rounded-sm text-[10px] font-mono flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${activeEngineTab === idx ? 'bg-[#2a221a] text-[#e3dbc8]' : 'text-[#8a7b69] hover:bg-[#2a221a]/50'}`}
                        >
                          {engine.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Info Bar */}
                  <div className="bg-[#120f0c] border-b border-[#3a2f24] px-6 md:px-8 py-5 flex flex-col md:flex-row justify-between md:items-center gap-4 shrink-0 z-20">
                    <div>
                      <h3 className="text-2xl font-serif text-[#f4ebd8]">{engines[activeEngineTab].title}</h3>
                    </div>
                    <div className="flex flex-col items-end pointer-events-auto">
                      {engines[activeEngineTab].link && (
                        <a 
                          href={engines[activeEngineTab].link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#c28e5c]/90 text-[#15120f] text-[10px] font-mono uppercase tracking-widest hover:bg-[#d3c9b5] transition-colors rounded-sm shadow-lg flex items-center gap-2"
                        >
                          Test Live Platform <span className="text-[8px]">↗</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Video Player */}
                  <div className="relative overflow-hidden bg-[#0c0a09] flex flex-col group aspect-video md:aspect-auto md:flex-1">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#c28e5c]/10 blur-[100px] rounded-full pointer-events-none z-10" />
                    <video 
                      key={engines[activeEngineTab].id}
                      src={engines[activeEngineTab].videoSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-contain md:object-cover opacity-70 transition-opacity duration-1000 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* UNIT 3: Pricing */}
            {activeMainStage === 3 && (
              <motion.div key="stage3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8 }} className="w-full h-full flex flex-col items-center justify-center relative px-8">
                <div className="w-full max-w-5xl flex flex-col items-center">
                  <div className="text-center mb-12">
                    <div className="font-serif text-[#a68a61] text-[10px] tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-2">
                      <span className="text-[10px]">❖</span> INVESTMENT
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-100">
                      Clear Terms.
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 w-full">
                    {/* Build Card */}
                    <div className="flex flex-col text-left p-8 border border-[#2a221a] bg-[#120f0c] rounded-md">
                      <div className="border-b border-[#2a221a] pb-6 mb-6">
                        <h3 className="text-xs font-mono text-[#a68a61] mb-2 uppercase tracking-widest">Custom Architecture & Build</h3>
                        <div className="text-4xl font-serif text-[#f4ebd8] mb-2">₹4,00,000</div>
                        <p className="text-xs text-[#8a7b69] font-sans italic">
                          One-time upfront investment.
                        </p>
                      </div>
                      
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-[13px] text-[#c8c0b0] font-light">
                          <div className="text-[#8a7251] leading-none mt-1">❖</div>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Floor Audit:</strong> Physical workflow mapping.</div>
                        </li>
                        <li className="flex items-start gap-3 text-[13px] text-[#c8c0b0] font-light">
                          <div className="text-[#8a7251] leading-none mt-1">❖</div>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Engineering:</strong> Custom database, APIs, and UI.</div>
                        </li>
                        <li className="flex items-start gap-3 text-[13px] text-[#c8c0b0] font-light">
                          <div className="text-[#8a7251] leading-none mt-1">❖</div>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Deployment:</strong> Desktop and mobile web apps.</div>
                        </li>
                        <li className="flex items-start gap-3 text-[13px] text-[#c8c0b0] font-light">
                          <div className="text-[#8a7251] leading-none mt-1">❖</div>
                          <div><strong className="text-[#e6decb] font-serif font-normal">60-Day Buffer:</strong> Friction testing and tweaks.</div>
                        </li>
                        <li className="flex items-start gap-3 text-[13px] text-[#c8c0b0] font-light">
                          <div className="text-[#8a7251] leading-none mt-1">❖</div>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Included Upkeep:</strong> First 2 months of server & DB costs covered.</div>
                        </li>
                      </ul>
                    </div>

                    {/* Infrastructure Card */}
                    <div className="flex flex-col text-left p-8 border border-[#2a221a] bg-[#120f0c] rounded-md">
                      <div className="border-b border-[#2a221a] pb-6 mb-6">
                        <h3 className="text-xs font-mono text-[#a68a61] mb-2 uppercase tracking-widest">Managed Infrastructure</h3>
                        <div className="text-4xl font-serif text-[#f4ebd8] mb-2 flex items-end gap-2">
                          ₹20,000 <span className="text-lg text-[#6b5d4f] italic font-serif pb-1">/ mo</span>
                        </div>
                        <p className="text-xs text-[#8a7b69] font-sans italic">
                          Activates on month three.
                        </p>
                      </div>
                      
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-[13px] text-[#c8c0b0] font-light">
                          <div className="text-[#8a7251] leading-none mt-1">❖</div>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Zero Cloud Cost:</strong> I cover all server & DB fees.</div>
                        </li>
                        <li className="flex items-start gap-3 text-[13px] text-[#c8c0b0] font-light">
                          <div className="text-[#8a7251] leading-none mt-1">❖</div>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Proactive Upkeep:</strong> Security patches & backups.</div>
                        </li>
                        <li className="flex items-start gap-3 text-[13px] text-[#c8c0b0] font-light">
                          <div className="text-[#8a7251] leading-none mt-1">❖</div>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Bug Resolution:</strong> Rapid patching of anomalies.</div>
                        </li>
                        <li className="flex items-start gap-3 text-[13px] text-stone-500 font-light italic">
                          <div className="text-stone-600 leading-none mt-1">❖</div>
                          <div><strong className="text-stone-400 font-serif font-normal not-italic">Note:</strong> New features billed separately.</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* UNIT 4: Action */}
            {activeMainStage === 4 && (
              <motion.div key="stage4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="w-full h-full flex flex-col items-center justify-center">
                <a 
                  href="https://wa.me/919773476854?text=Hey%20Prajal!%20I%20would%20love%20to%20know%20more%20about%20the%20Custom%20Operational%20Tool" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-3xl md:text-5xl font-serif text-[#e6decb] hover:text-stone-100 transition-colors border-b border-[#a68a61] pb-4 pointer-events-auto"
                >
                  Connect with Prajal.
                </a>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
