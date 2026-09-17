import { motion, useScroll, useMotionValueEvent, AnimatePresence, useTransform, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';


export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEngineTab, setActiveEngineTab] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

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
  // The container is 300vw wide. 
  // Track starts at 85vw and ends at 190vw (105vw total length).
  // Node 1 is at 100vw. Node 2 at 125vw. Node 3 at 150vw. Node 4 at 175vw.
  
  // To keep the glowing line tip perfectly locked to the center of the screen (50vw), 
  // the camera pan delta MUST exactly match the line growth delta (105vw).
  // Start pan: -35vw (centers the 85vw Start point). 
  // End pan: -140vw (centers the 190vw End point).
  const timelineX = useTransform(smoothProgress, [0.10, 0.55], ["-35vw", "-140vw"]);
  
  // The line grows exactly 105vw, perfectly matching the camera pan speed.
  const activeLineWidth = useTransform(smoothProgress, [0.10, 0.55], ["0vw", "105vw"]);

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
    // Nodes perfectly center at 0.271 (Node 2), 0.378 (Node 3), 0.485 (Node 4)
    if (latest < 0.271) idx = 0;
    else if (latest < 0.378) idx = 1;
    else if (latest < 0.485) idx = 2;
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
      detail: "A web-based system your team opens right from a browser, on the shop computer, a tablet, or a phone. Nothing to install."
    }
  ];

  return (
    <>
    {/* --- DESKTOP LAYOUT --- */}
    <div className="hidden md:block">
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
          <a 
            href="https://www.instagram.com/prajal_sonariya/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-mono tracking-widest uppercase text-[#8a7b69] pointer-events-auto hover:text-white transition-colors cursor-pointer"
          >
            Prajal Sonariya
          </a>
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
                    I'll manage the entire digital infrastructure so you can focus on running your business, not fixing software.
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
                    One project at a time. Zero templates. No shared platforms.
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
                    <span className="text-[10px]">❖</span> REAL SYSTEMS, ALREADY RUNNING
                  </div>
                  <h2 className="text-3xl md:text-[2.5rem] font-serif tracking-tight text-stone-100 max-w-3xl mx-auto leading-tight">
                    Not concepts. Live systems, already running.
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
              <motion.div key="stage3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8 }} className="w-full h-full flex flex-col items-center justify-center relative px-4 lg:px-8">
                <div className="w-full max-w-6xl flex flex-col items-center max-h-[88vh] overflow-y-auto hide-scrollbar pt-3 pb-4">
                  
                  {/* Urgent High-Contrast Gold Founding Offer Strip (Above Heading) */}
                  <div className="w-full mb-8 p-4 sm:p-5 rounded-lg bg-gradient-to-r from-[#b37e4c] via-[#d4a373] to-[#b37e4c] text-[#14100c] shadow-[0_4px_30px_-5px_rgba(194,142,92,0.45)] flex flex-col items-center text-center">
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold text-[#3a2310] mb-1">
                      LIMITED — 3 FOUNDING SPOTS LEFT
                    </span>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-[#14100c] mb-1">
                      Save up to ₹65,000 on your build fee
                    </div>
                    <p className="text-xs sm:text-sm font-serif italic text-[#2c1a0c]">
                      For the first 3 clients only, in exchange for a testimonial and case-study permission.
                    </p>
                  </div>

                  {/* Section Heading & Trust Line */}
                  <div className="text-center mb-8">
                    <div className="font-serif text-[#a68a61] text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center justify-center gap-2">
                      <span className="text-[10px]">❖</span> INVESTMENT
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight text-stone-100 mb-2">
                      Clear Terms.
                    </h2>
                    <p className="text-xs md:text-sm text-[#c8c0b0] font-serif italic max-w-xl mx-auto">
                      Fixed project fees, not hourly estimates. Every client pays the same published price.
                    </p>
                  </div>

                  {/* 3 Rebuilt Tier Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch w-full pt-2">
                    {/* Starter Card */}
                    <div className="flex flex-col text-left p-6 lg:p-8 border border-[#2a221a] bg-[#120f0c] rounded-md transition-all duration-300 hover:border-[#4a3d30]">
                      <div>
                        <h3 className="text-xs font-mono text-[#a68a61] uppercase tracking-widest">Starter</h3>
                        <p className="text-xs text-[#c8c0b0] font-serif italic mt-1 min-h-[1.5rem]">
                          Single-location operations starting custom automation.
                        </p>
                      </div>

                      <div className="my-5">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mb-1">Build Fee</div>
                        <div className="text-3xl xl:text-4xl font-serif text-[#f4ebd8] tracking-tight">₹95,000</div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mt-3 mb-0.5">Monthly Maintenance</div>
                        <div className="text-lg font-serif text-[#f4ebd8] flex items-baseline gap-1 mb-1">
                          ₹6,000 <span className="text-xs text-[#6b5d4f] italic font-serif">/ mo</span>
                        </div>
                        <p className="text-[11px] text-[#8a7b69] font-sans leading-tight">
                          Billed quarterly (₹18,000) · or ₹60,000/year, save ₹12,000
                        </p>
                      </div>

                      <div className="border-b border-[#2a221a] my-5" />
                      
                      <ul className="space-y-3.5 flex-1 text-[12.5px] text-[#c8c0b0] font-light">
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Modules:</strong> 1–2 core operational tools (e.g. inventory + billing)</div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Setup:</strong> Remote requirements-gathering & guided rollout</div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Support:</strong> Direct engineer bug fixes & minor tweaks</div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">WhatsApp:</strong> Standard customer notification triggers</div>
                        </li>
                      </ul>

                      <a 
                        href="https://wa.me/919773476854?text=Hi%20Prajal%2C%20I'm%20interested%20in%20the%20Starter%20tier%20for%20my%20business" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-[#c28e5c]/90 text-[#15120f] text-[10px] font-mono uppercase tracking-widest hover:bg-[#d3c9b5] transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 mt-8 cursor-pointer font-semibold"
                      >
                        Start with Starter <span>↗</span>
                      </a>
                    </div>

                    {/* Growth Card (Recommended & Visually Elevated) */}
                    <div className="relative lg:-translate-y-3 flex flex-col text-left p-7 lg:p-9 border-2 border-[#c28e5c]/80 bg-[#17120d] rounded-md shadow-[0_0_40px_-10px_rgba(194,142,92,0.35)] transition-all duration-300 z-10">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-mono text-[#a68a61] uppercase tracking-widest">Growth</h3>
                          <span className="text-[9px] font-mono tracking-widest uppercase text-[#15120f] bg-[#c28e5c] font-semibold px-2.5 py-0.5 rounded-sm shadow-sm">RECOMMENDED</span>
                        </div>
                        <p className="text-xs text-[#c8c0b0] font-serif italic mt-1 min-h-[1.5rem]">
                          Growing businesses needing a full digital ecosystem.
                        </p>
                      </div>

                      <div className="my-5">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mb-1">Build Fee</div>
                        <div className="text-3xl xl:text-4xl font-serif text-[#f4ebd8] tracking-tight whitespace-nowrap">₹2,25,000</div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mt-3 mb-0.5">Monthly Maintenance</div>
                        <div className="text-lg font-serif text-[#f4ebd8] flex items-baseline gap-1 mb-1">
                          ₹15,000 <span className="text-xs text-[#6b5d4f] italic font-serif">/ mo</span>
                        </div>
                        <p className="text-[11px] text-[#8a7b69] font-sans leading-tight">
                          Billed quarterly (₹45,000) · or ₹1,50,000/year, save ₹30,000
                        </p>
                      </div>

                      <div className="border-b border-[#3a2f24] my-5" />
                      
                      <ul className="space-y-3.5 flex-1 text-[12.5px] text-[#c8c0b0] font-light">
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Modules:</strong> Full ecosystem (staff, inventory, clients, reports)</div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Setup:</strong> On-site floor audit & in-person team training</div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Support:</strong> Priority engineer support & proactive patches</div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">WhatsApp:</strong> Full two-way WhatsApp Business API integration</div>
                        </li>
                      </ul>

                      <a 
                        href="https://wa.me/919773476854?text=Hi%20Prajal%2C%20I'm%20interested%20in%20the%20Growth%20tier%20for%20my%20business" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-[#c28e5c] text-[#15120f] text-[10px] font-mono uppercase tracking-widest hover:bg-[#d3c9b5] transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 mt-8 cursor-pointer font-semibold"
                      >
                        Begin a Growth Project <span>↗</span>
                      </a>
                    </div>

                    {/* Enterprise Card */}
                    <div className="flex flex-col text-left p-6 lg:p-8 border border-[#2a221a] bg-[#120f0c] rounded-md transition-all duration-300 hover:border-[#4a3d30]">
                      <div>
                        <h3 className="text-xs font-mono text-[#a68a61] uppercase tracking-widest">Enterprise</h3>
                        <p className="text-xs text-[#c8c0b0] font-serif italic mt-1 min-h-[1.5rem]">
                          Multi-branch firms and higher-volume commercial enterprises.
                        </p>
                      </div>

                      <div className="my-5">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mb-1">Build Fee</div>
                        <div className="text-3xl xl:text-4xl font-serif text-[#f4ebd8] tracking-tight">From ₹5,00,000</div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mt-3 mb-0.5">Monthly Maintenance</div>
                        <div className="text-lg font-serif text-[#f4ebd8] flex items-baseline gap-1 mb-1">
                          From ₹25,000 <span className="text-xs text-[#6b5d4f] italic font-serif">/ mo</span>
                        </div>
                        <p className="text-[11px] text-[#8a7b69] font-sans leading-tight">
                          Custom quarterly or annual SLA terms
                        </p>
                      </div>

                      <div className="border-b border-[#2a221a] my-5" />
                      
                      <ul className="space-y-3.5 flex-1 text-[12.5px] text-[#c8c0b0] font-light">
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Modules:</strong> Multi-branch sync & bespoke custom architecture</div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Setup:</strong> Dedicated multi-site deployment & migration</div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">Support:</strong> Dedicated engineer SLA & 24/7 uptime monitoring</div>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-[#8a7251] leading-none mt-1 shrink-0">❖</span>
                          <div><strong className="text-[#e6decb] font-serif font-normal">WhatsApp:</strong> Custom multi-agent WhatsApp & ERP integrations</div>
                        </li>
                      </ul>

                      <a 
                        href="https://wa.me/919773476854?text=Hi%2C%20I'd%20like%20to%20discuss%20an%20Enterprise%20project%20for%20our%20business" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-[#c28e5c]/90 text-[#15120f] text-[10px] font-mono uppercase tracking-widest hover:bg-[#d3c9b5] transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 mt-8 cursor-pointer font-semibold"
                      >
                        Discuss Enterprise <span>↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Shared Inclusions Line & Disclaimer */}
                  <div className="mt-8 text-center space-y-2 max-w-2xl mx-auto">
                    <p className="text-xs text-[#c8c0b0] font-sans">
                      Every plan includes hosting, database costs, and routine bug fixes. New feature requests are always quoted separately.
                    </p>
                    <p className="text-[11px] text-[#8a7b69] font-sans italic">
                      <span className="text-[#a68a61] mr-1">❖</span>Domain purchase and WhatsApp Business API/messaging costs are billed directly to your own account — not included in the monthly fee.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* UNIT 4: Action */}
            {activeMainStage === 4 && (
              <motion.div key="stage4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="w-full h-full flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-serif text-[#e6decb] border-b border-[#a68a61] pb-4 mb-6">
                  Connect with Prajal.
                </h2>
                <p className="text-sm md:text-base text-[#c8c0b0] font-serif leading-relaxed max-w-xl mb-8">
                  I'm part of a family-run salon in Surat. Rupali Flow, above, isn't a demo. It's what runs there every day. If your business is still tracked across notebooks, spreadsheets, and WhatsApp groups, I'd like to build you the same kind of system.
                </p>
                <a 
                  href="https://wa.me/919773476854" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-6 py-3 bg-[#c28e5c] text-[#15120f] text-[10px] md:text-xs font-mono uppercase tracking-widest hover:bg-[#d3c9b5] transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 font-semibold pointer-events-auto cursor-pointer mb-4"
                >
                  MESSAGE ON WHATSAPP <span>↗</span>
                </a>
                <p className="text-xs text-[#8a7b69] font-sans pointer-events-auto">
                  or write to <a href="mailto:prajal.sonariya@solnyter.com" className="text-[#c8c0b0] hover:underline">prajal.sonariya@solnyter.com</a> · currently taking new projects, most replies within 24 hours
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
    </div>

      {/* -------------------------------------------------------------------------------- */}
      {/* MOBILE SNAP LAYOUT (Completely independent of framer-motion scroll physics) */}
      {/* -------------------------------------------------------------------------------- */}
      <div className="md:hidden h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory overflow-x-hidden relative hide-scrollbar bg-[#15120f] text-[#e3dbc8] font-sans">
        
        {/* Cinematic Film Grain Overlay */}
        <div className="fixed inset-0 pointer-events-none noise-bg z-40" />

        {/* Header */}
        <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-6 mix-blend-difference pointer-events-none">
          <img src="/logo_white.png" alt="Solnyter Logo" className="h-5 w-auto object-contain opacity-80" />
          <a 
            href="https://www.instagram.com/prajal_sonariya/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-mono tracking-widest uppercase text-[#8a7b69] pointer-events-auto hover:text-white transition-colors cursor-pointer"
          >
            Prajal Sonariya
          </a>
        </header>

        {/* Stage 0 */}
        <section className="h-[100dvh] w-full snap-start shrink-0 flex flex-col justify-center px-8 relative z-10 pt-16">
          <div className="-mt-16">
            <h1 className="text-[2.5rem] leading-[1.05] tracking-tight font-serif text-stone-100 mb-6">
              Stop Adapting<br />Your Business<br />
              <span className="text-[#a68a61] italic">to Generic Software.</span>
            </h1>
            <p className="text-lg text-[#c8c0b0] font-serif italic leading-relaxed">
              I engineer custom operational software directly around your daily workflow.
            </p>
          </div>
          <div className="absolute bottom-16 left-8 right-8 flex flex-col items-start border-l border-[#3a2f24] pl-4">
             <span className="font-serif italic text-[#a68a61] text-lg">"You Run the Business. I Build the Engine."</span>
             <span className="text-xs text-stone-500 mt-2">I'll manage the entire digital infrastructure so you can focus on running your business, not fixing software.</span>
          </div>
        </section>

        {/* Stage 1: The Method */}
        <section className="h-[100dvh] w-full snap-start shrink-0 flex flex-col justify-center relative z-10">
          <div className="text-center px-8 mb-8">
            <div className="font-serif text-[#a68a61] text-[10px] tracking-[0.2em] uppercase mb-3 flex items-center justify-center gap-2">
              <span className="text-[10px]">❖</span> THE METHOD
            </div>
            <h2 className="text-4xl font-serif tracking-tight text-stone-100 mb-3">Build From the Scratch.</h2>
            <p className="text-sm text-[#c8c0b0] font-serif italic">
              One project at a time. Zero templates. No shared platforms.
            </p>
          </div>
          
          <div 
            className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            onScroll={(e) => {
              const el = e.currentTarget;
              const idx = Math.round(el.scrollLeft / el.clientWidth);
              if (idx !== mobileActiveIndex) setMobileActiveIndex(idx);
            }}
          >
            {processSubStages.map((step, i) => (
              <div key={i} className="w-full shrink-0 snap-center flex flex-col items-center justify-center px-12 text-center h-[35vh]">
                <span className="font-serif text-[0.9rem] tracking-widest text-[#a68a61] mb-2">{step.w}</span>
                <h4 className="font-serif italic text-[#e6decb] text-3xl mb-3 leading-tight">{step.t}</h4>
                <p className="text-[#8a7b69] text-xs leading-relaxed max-w-[250px] mx-auto">{step.detail}</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col items-center gap-4 mt-4 opacity-70">
             {/* Progress Dots */}
             <div className="flex gap-2">
               {processSubStages.map((_, i) => (
                 <div key={i} className={`h-[2px] rounded-full transition-all duration-500 ${mobileActiveIndex === i ? 'w-8 bg-[#8a7251]' : 'w-2 bg-[#2a221a]'}`} />
               ))}
             </div>
             <span className="text-[8px] text-[#8a7b69] font-mono tracking-widest uppercase animate-pulse">&larr; Swipe Phases &rarr;</span>
          </div>
        </section>

        {/* Stage 2: Engines */}
        <section className="min-h-[100dvh] h-auto w-full snap-start shrink-0 flex flex-col justify-center px-4 py-24 relative z-10">
          <div className="text-center mb-8 px-4">
            <div className="font-serif text-[#a68a61] text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 mb-3">
              <span className="text-[10px]">❖</span> REAL SYSTEMS, ALREADY RUNNING
            </div>
            <h2 className="text-3xl font-serif tracking-tight text-stone-100 leading-tight">
              Not concepts. Live systems, already running.
            </h2>
          </div>

          <div className="w-full glass-panel rounded-xl overflow-hidden border-[#3a2f24] flex flex-col">
            <div className="bg-[#1f1a16]/50 border-b border-[#3a2f24] px-4 py-3 flex items-center gap-3 overflow-x-auto hide-scrollbar">
              <div className="flex-1 flex gap-3 min-w-max">
                {engines.map((engine, idx) => (
                  <div 
                    key={engine.id}
                    onClick={() => setActiveEngineTab(idx)}
                    className={`px-3 py-1.5 rounded-sm text-[10px] font-mono flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${activeEngineTab === idx ? 'bg-[#2a221a] text-[#e3dbc8]' : 'text-[#8a7b69]'}`}
                  >
                    {engine.name}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#120f0c] border-b border-[#3a2f24] px-5 py-4 flex flex-col gap-3 shrink-0 z-20">
              <h3 className="text-xl font-serif text-[#f4ebd8]">{engines[activeEngineTab].title}</h3>
              {engines[activeEngineTab].link && (
                <a 
                  href={engines[activeEngineTab].link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#c28e5c]/90 text-[#15120f] text-[10px] font-mono uppercase tracking-widest rounded-sm self-start"
                >
                  Test Live Platform ↗
                </a>
              )}
            </div>

            <div className="relative overflow-hidden bg-[#0c0a09] flex flex-col aspect-video">
              <video 
                key={engines[activeEngineTab].id}
                src={engines[activeEngineTab].videoSrc}
                autoPlay muted loop playsInline
                className="w-full h-full object-contain opacity-80"
              />
            </div>
          </div>
        </section>

        {/* Stage 3: Pricing */}
        <section className="min-h-[100dvh] h-auto w-full snap-start shrink-0 flex flex-col justify-center px-6 py-24 relative z-10">
          
          {/* Urgent High-Contrast Gold Founding Offer Strip (Above Heading) */}
          <div className="w-full mb-8 p-5 rounded-lg bg-gradient-to-r from-[#b37e4c] via-[#d4a373] to-[#b37e4c] text-[#14100c] shadow-[0_4px_25px_-5px_rgba(194,142,92,0.4)] flex flex-col items-center text-center">
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase font-bold text-[#3a2310] mb-1">
              LIMITED — 3 FOUNDING SPOTS LEFT
            </span>
            <div className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#14100c] mb-1">
              Save up to ₹65,000 on your build fee
            </div>
            <p className="text-xs font-serif italic text-[#2c1a0c] leading-relaxed">
              For the first 3 clients only, in exchange for a testimonial and case-study permission.
            </p>
          </div>

          {/* Section Heading & Trust Line */}
          <div className="mb-8 text-center">
             <div className="font-serif text-[#a68a61] text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center justify-center gap-2">
               <span className="text-[10px]">❖</span> INVESTMENT
             </div>
             <h2 className="text-3xl font-serif tracking-tight text-stone-100 mb-2">Clear Terms.</h2>
             <p className="text-xs text-[#c8c0b0] font-serif italic max-w-xs mx-auto">
               Fixed project fees, not hourly estimates. Every client pays the same published price.
             </p>
          </div>
          
          <div className="flex flex-col gap-6 w-full">
            {/* Growth Card (Mobile: 1st Priority for Meta Ads / Visitors) */}
            <div className="flex flex-col bg-[#17120d] border-2 border-[#c28e5c]/80 rounded-xl overflow-hidden group shadow-[0_0_35px_-10px_rgba(194,142,92,0.35)]">
              <div className="p-6 border-b border-[#3a2f24] bg-gradient-to-br from-[#1c1712] to-transparent">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[#a68a61] font-mono text-xs tracking-widest uppercase">Growth</h3>
                  <span className="text-[9px] font-mono tracking-widest uppercase text-[#15120f] bg-[#c28e5c] font-semibold px-2.5 py-0.5 rounded-sm shadow-sm">RECOMMENDED</span>
                </div>
                <p className="text-xs text-[#c8c0b0] font-serif italic mb-4">
                  Growing businesses needing a full digital ecosystem.
                </p>

                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mb-1">Build Fee</div>
                <div className="text-3xl font-serif text-[#f4ebd8] mb-3 whitespace-nowrap">₹2,25,000</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mb-0.5">Monthly Maintenance</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-xl font-serif text-[#f4ebd8]">₹15,000</span>
                  <span className="text-xs text-[#8a7b69] font-mono">/mo</span>
                </div>
                <p className="text-[11px] text-[#8a7b69] font-sans leading-tight">
                  Billed quarterly (₹45,000) · or ₹1,50,000/year, save ₹30,000
                </p>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-3.5 text-xs font-sans text-[#c8c0b0] flex-1">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">Modules:</strong> Full ecosystem (staff, inventory, clients, reports)</div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">Setup:</strong> On-site floor audit & in-person team training</div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">Support:</strong> Priority engineer support & proactive patches</div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">WhatsApp:</strong> Full two-way WhatsApp Business API integration</div>
                  </li>
                </ul>

                <a 
                  href="https://wa.me/919773476854?text=Hi%20Prajal%2C%20I'm%20interested%20in%20the%20Growth%20tier%20for%20my%20business" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#c28e5c] text-[#15120f] text-[10px] font-mono uppercase tracking-widest hover:bg-[#d3c9b5] transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 mt-8 cursor-pointer font-semibold"
                >
                  Begin a Growth Project <span>↗</span>
                </a>
              </div>
            </div>

            {/* Starter Card (Mobile: 2nd) */}
            <div className="flex flex-col bg-[#15120f] border border-[#3a2f24] rounded-xl overflow-hidden group">
              <div className="p-6 border-b border-[#3a2f24] bg-gradient-to-br from-[#1c1712] to-transparent">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[#a68a61] font-mono text-xs tracking-widest uppercase">Starter</h3>
                </div>
                <p className="text-xs text-[#c8c0b0] font-serif italic mb-4">
                  Single-location operations starting custom automation.
                </p>

                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mb-1">Build Fee</div>
                <div className="text-3xl font-serif text-[#f4ebd8] mb-3">₹95,000</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mb-0.5">Monthly Maintenance</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-xl font-serif text-[#f4ebd8]">₹6,000</span>
                  <span className="text-xs text-[#8a7b69] font-mono">/mo</span>
                </div>
                <p className="text-[11px] text-[#8a7b69] font-sans leading-tight">
                  Billed quarterly (₹18,000) · or ₹60,000/year, save ₹12,000
                </p>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-3.5 text-xs font-sans text-[#c8c0b0] flex-1">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">Modules:</strong> 1–2 core operational tools (e.g. inventory + billing)</div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">Setup:</strong> Remote requirements-gathering & guided rollout</div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">Support:</strong> Direct engineer bug fixes & minor tweaks</div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">WhatsApp:</strong> Standard customer notification triggers</div>
                  </li>
                </ul>

                <a 
                  href="https://wa.me/919773476854?text=Hi%20Prajal%2C%20I'm%20interested%20in%20the%20Starter%20tier%20for%20my%20business" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#c28e5c]/90 text-[#15120f] text-[10px] font-mono uppercase tracking-widest hover:bg-[#d3c9b5] transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 mt-8 cursor-pointer font-semibold"
                >
                  Start with Starter <span>↗</span>
                </a>
              </div>
            </div>

            {/* Enterprise Card (Mobile: 3rd) */}
            <div className="flex flex-col bg-[#15120f] border border-[#3a2f24] rounded-xl overflow-hidden group">
              <div className="p-6 border-b border-[#3a2f24] bg-gradient-to-br from-[#1c1712] to-transparent">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[#a68a61] font-mono text-xs tracking-widest uppercase">Enterprise</h3>
                </div>
                <p className="text-xs text-[#c8c0b0] font-serif italic mb-4">
                  Multi-branch firms and higher-volume commercial enterprises.
                </p>

                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mb-1">Build Fee</div>
                <div className="text-3xl font-serif text-[#f4ebd8] mb-3">From ₹5,00,000</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8a7b69] mb-0.5">Monthly Maintenance</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-xl font-serif text-[#f4ebd8]">From ₹25,000</span>
                  <span className="text-xs text-[#8a7b69] font-mono">/mo</span>
                </div>
                <p className="text-[11px] text-[#8a7b69] font-sans leading-tight">
                  Custom architectural scope & SLA terms
                </p>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-3.5 text-xs font-sans text-[#c8c0b0] flex-1">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">Modules:</strong> Multi-branch sync & bespoke custom architecture</div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">Setup:</strong> Dedicated multi-site deployment & migration</div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">Support:</strong> Dedicated engineer SLA & 24/7 uptime monitoring</div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a68a61] mt-0.5 shrink-0">●</span>
                    <div><strong className="text-[#e6decb] font-serif font-normal">WhatsApp:</strong> Custom multi-agent WhatsApp & ERP integrations</div>
                  </li>
                </ul>

                <a 
                  href="https://wa.me/919773476854?text=Hi%2C%20I'd%20like%20to%20discuss%20an%20Enterprise%20project%20for%20our%20business" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#c28e5c]/90 text-[#15120f] text-[10px] font-mono uppercase tracking-widest hover:bg-[#d3c9b5] transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 mt-8 cursor-pointer font-semibold"
                >
                  Discuss Enterprise <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Shared Inclusions Line & Disclaimer */}
          <div className="mt-8 text-center space-y-2 max-w-xl mx-auto px-2">
            <p className="text-xs text-[#c8c0b0] font-sans">
              Every plan includes hosting, database costs, and routine bug fixes. New feature requests are always quoted separately.
            </p>
            <p className="text-[11px] text-[#8a7b69] font-sans italic">
              <span className="text-[#a68a61] mr-1">❖</span>Domain purchase and WhatsApp Business API/messaging costs are billed directly to your own account — not included in the monthly fee.
            </p>
          </div>
        </section>

        {/* Stage 4: Contact */}
        <section className="h-[100dvh] w-full snap-start shrink-0 flex flex-col items-center justify-center text-center px-6 relative z-10">
          <h2 className="text-3xl font-serif text-[#e6decb] border-b border-[#a68a61] pb-3 mb-6">
            Connect with Prajal.
          </h2>
          <p className="text-sm text-[#c8c0b0] font-serif leading-relaxed max-w-sm mb-8">
            I'm part of a family-run salon in Surat. Rupali Flow, above, isn't a demo. It's what runs there every day. If your business is still tracked across notebooks, spreadsheets, and WhatsApp groups, I'd like to build you the same kind of system.
          </p>
          <a 
            href="https://wa.me/919773476854" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#c28e5c] text-[#15120f] text-[10px] font-mono uppercase tracking-widest hover:bg-[#d3c9b5] transition-colors rounded-sm shadow-lg flex items-center justify-center gap-2 font-semibold cursor-pointer mb-4"
          >
            MESSAGE ON WHATSAPP <span>↗</span>
          </a>
          <p className="text-xs text-[#8a7b69] font-sans">
            or write to <a href="mailto:prajal.sonariya@solnyter.com" className="text-[#c8c0b0] hover:underline">prajal.sonariya@solnyter.com</a> · currently taking new projects, most replies within 24 hours
          </p>
        </section>
      </div>
    </>
  );
}
