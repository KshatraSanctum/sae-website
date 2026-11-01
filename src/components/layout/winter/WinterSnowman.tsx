import React, { useState, useRef, useEffect } from 'react';

export const WinterSnowman: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const autoHideTimerRef = useRef<number | null>(null);

  const triggerReaction = () => {
    setIsActive(true);
    setIsWiggling(true);

    if (autoHideTimerRef.current) {
      window.clearTimeout(autoHideTimerRef.current);
    }

    // Auto-dismiss after 2.8s on mobile/tap
    autoHideTimerRef.current = window.setTimeout(() => {
      setIsActive(false);
      setIsWiggling(false);
    }, 2800);
  };

  const handlePointerDown = () => {
    triggerReaction();
  };

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    if (!autoHideTimerRef.current) {
      setIsActive(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerReaction();
    }
  };

  useEffect(() => {
    return () => {
      if (autoHideTimerRef.current) {
        window.clearTimeout(autoHideTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`winter-snowman-wrapper ${isActive ? 'is-active' : ''} ${isWiggling ? 'is-wiggling' : ''}`}
      onPointerDown={handlePointerDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Festive winter snowman. Tap to say hello!"
    >
      {/* Speech Bubble on Hover or Tap */}
      <div
        className="winter-snowman-bubble"
        aria-hidden={!isActive}
        role="tooltip"
      >
        <span>Warm winter from SAE! ❄️🏎️</span>
      </div>

      <svg
        className="winter-snowman-svg"
        viewBox="0 0 160 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients for snowballs */}
          <radialGradient id="snowGradBottom" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#e0eaff" />
            <stop offset="100%" stopColor="#b6cde8" />
          </radialGradient>
          <radialGradient id="snowGradMid" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#e5efff" />
            <stop offset="100%" stopColor="#bdd4ef" />
          </radialGradient>
          <radialGradient id="snowGradHead" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#eaf1fc" />
            <stop offset="100%" stopColor="#c5dbf5" />
          </radialGradient>

          {/* Top Hat Gradient */}
          <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* SAE Gold Ribbon Gradient */}
          <linearGradient id="saeGoldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#f6b719" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Scarf Gradient */}
          <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="30%" stopColor="#f6b719" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Carrot Nose Gradient */}
          <linearGradient id="carrotGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="70%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          {/* Soft Shadow Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Snow Mound / Drift Base */}
        <ellipse cx="80" cy="178" rx="68" ry="10" fill="rgba(255, 255, 255, 0.12)" filter="url(#softGlow)" />
        <ellipse cx="80" cy="177" rx="56" ry="7" fill="rgba(224, 234, 255, 0.35)" />
        <path
          d="M24 182 C 45 174, 115 174, 136 182 C 146 185, 12 185, 24 182 Z"
          fill="#dbeafe"
          opacity="0.8"
        />

        {/* 2. Twig Arms */}
        {/* Right Arm (resting/balancing) */}
        <g className="winter-arm-right">
          <path
            d="M48 116 L22 108 M22 108 L14 102 M22 108 L18 116"
            stroke="#78350f"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Left Arm (raised waving in the breeze) */}
        <g className="winter-arm-left">
          <path
            d="M112 116 L138 96 M138 96 L146 88 M138 96 L148 102 M138 96 L136 84"
            stroke="#78350f"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 3. Bottom Snowball */}
        <circle cx="80" cy="144" r="34" fill="url(#snowGradBottom)" />
        <path
          d="M52 158 C 60 174, 100 174, 108 158 C 100 166, 60 166, 52 158 Z"
          fill="#94a3b8"
          opacity="0.3"
        />

        {/* 4. Middle Snowball */}
        <circle cx="80" cy="98" r="25" fill="url(#snowGradMid)" />

        {/* Motorsport / Lug Nut Buttons on Middle Ball */}
        <circle cx="80" cy="90" r="2.8" fill="#1e293b" />
        <circle cx="79.2" cy="89.2" r="0.9" fill="#94a3b8" />

        <circle cx="80" cy="101" r="2.8" fill="#1e293b" />
        <circle cx="79.2" cy="100.2" r="0.9" fill="#94a3b8" />

        <circle cx="80" cy="112" r="2.8" fill="#1e293b" />
        <circle cx="79.2" cy="111.2" r="0.9" fill="#94a3b8" />

        {/* 5. Head Snowball */}
        <g className="winter-head-group">
          <circle cx="80" cy="58" r="19" fill="url(#snowGradHead)" />

          {/* Rosy Cheeks */}
          <circle cx="68" cy="62" r="3.2" fill="#f43f5e" opacity="0.22" filter="url(#softGlow)" />
          <circle cx="92" cy="62" r="3.2" fill="#f43f5e" opacity="0.22" filter="url(#softGlow)" />

          {/* Charcoal Eyes with catchlight twinkle */}
          <circle cx="73" cy="54" r="2.5" fill="#0f172a" />
          <circle cx="72.2" cy="53.2" r="0.9" fill="#ffffff" />

          <circle cx="87" cy="54" r="2.5" fill="#0f172a" />
          <circle cx="86.2" cy="53.2" r="0.9" fill="#ffffff" />

          {/* Friendly Pebble Smile */}
          <circle cx="72" cy="66" r="1.3" fill="#1e293b" />
          <circle cx="76" cy="68" r="1.4" fill="#1e293b" />
          <circle cx="80" cy="68.8" r="1.5" fill="#1e293b" />
          <circle cx="84" cy="68" r="1.4" fill="#1e293b" />
          <circle cx="88" cy="66" r="1.3" fill="#1e293b" />

          {/* Carrot Nose pointing slightly right */}
          <polygon
            points="79,59 79,63 96,62"
            fill="url(#carrotGrad)"
            stroke="#ea580c"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* 6. Top Hat with SAE Gold Band */}
          <g className="winter-top-hat">
            <ellipse cx="80" cy="42" rx="24" ry="5.5" fill="url(#hatGrad)" />
            <path
              d="M64 42 L67 17 C 67 16, 93 16, 93 17 L96 42 Z"
              fill="url(#hatGrad)"
            />
            <ellipse cx="80" cy="17" rx="13" ry="3.5" fill="#1e293b" />
            <path
              d="M65.4 36 L66 31 C 73 32, 87 32, 94 31 L94.6 36 C 87 37.5, 73 37.5, 65.4 36 Z"
              fill="url(#saeGoldRibbon)"
            />
            <circle cx="80" cy="34" r="1.8" fill="#ffffff" />
            <circle cx="80" cy="34" r="0.9" fill="#d97706" />
          </g>
        </g>

        {/* 7. Warm SAE Striped Scarf */}
        <path
          d="M63 76 C 63 72, 97 72, 97 76 C 97 82, 63 82, 63 76 Z"
          fill="url(#scarfGrad)"
          stroke="#b45309"
          strokeWidth="0.8"
        />
        <path d="M72 73.5 L73 78.5" stroke="#fef08a" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M80 73 L80 79" stroke="#fef08a" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M88 73.5 L87 78.5" stroke="#fef08a" strokeWidth="2.2" strokeLinecap="round" />

        {/* Fluttering Scarf Tails */}
        <g className="winter-scarf-tail">
          <path
            d="M87 78 C 96 82, 104 90, 114 92 C 108 97, 98 94, 88 84 Z"
            fill="url(#scarfGrad)"
            stroke="#b45309"
            strokeWidth="0.6"
          />
          <path d="M96 84 L97 90" stroke="#fef08a" strokeWidth="2" />
          <path d="M104 88 L105 93" stroke="#fef08a" strokeWidth="2" />
          <path d="M113 91.5 L118 93 M112.5 93 L117 95 M112 94.5 L116 97" stroke="#f6b719" strokeWidth="1.2" strokeLinecap="round" />

          <path
            d="M84 79 C 90 85, 96 92, 102 96 C 98 99, 91 95, 83 83 Z"
            fill="#d97706"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
};
