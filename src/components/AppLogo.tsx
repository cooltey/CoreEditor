import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number | string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-full h-full', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      style={{ display: 'block' }}
    >
      <defs>
        {/* Sleek Dark Minimalist App Squircle Background (No Red) */}
        <linearGradient id="appBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#252632" />
          <stop offset="50%" stopColor="#1b1c24" />
          <stop offset="100%" stopColor="#12131a" />
        </linearGradient>

        {/* Outer Squircle Rim */}
        <linearGradient id="bgBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4c4e61" />
          <stop offset="100%" stopColor="#272834" />
        </linearGradient>

        {/* Warm Ambient Backlight */}
        <radialGradient id="dogeHalo" cx="52%" cy="48%" r="48%">
          <stop offset="0%" stopColor="#ffb938" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>

        {/* Shiba Golden-Honey Fur Gradient */}
        <linearGradient id="shibaFur" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#ffd276" />
          <stop offset="40%" stopColor="#f7ab35" />
          <stop offset="100%" stopColor="#d97a15" />
        </linearGradient>

        {/* Darker Fur Shading (Far ear & head contour) */}
        <linearGradient id="shibaFurDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dc8216" />
          <stop offset="100%" stopColor="#a95507" />
        </linearGradient>

        {/* Soft Urajiro (White/Cream Fur) Gradient */}
        <linearGradient id="urajiroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="85%" stopColor="#fff8ed" />
          <stop offset="100%" stopColor="#faece0" />
        </linearGradient>

        {/* Inner Ear Soft Pastel Pink */}
        <linearGradient id="earInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe9ee" />
          <stop offset="60%" stopColor="#fda4b5" />
          <stop offset="100%" stopColor="#f07e92" />
        </linearGradient>

        {/* Anime Side-Eye Amber Gradient */}
        <linearGradient id="sideEyeIris" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1c0e04" />
          <stop offset="35%" stopColor="#3d1b06" />
          <stop offset="70%" stopColor="#9e4b09" />
          <stop offset="100%" stopColor="#f29d2a" />
        </linearGradient>

        {/* Drop shadow for Doge character */}
        <filter id="dogeShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="-2" dy="12" stdDeviation="14" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* 1. App Icon Base Container (Minimal Dark Squircle) */}
      <rect width="512" height="512" rx="116" fill="url(#appBg)" />
      <rect width="502" height="502" x="5" y="5" rx="111" fill="none" stroke="url(#bgBorder)" strokeWidth="3.5" />

      {/* 2. Soft Ambient Halo Glow */}
      <circle cx="260" cy="256" r="185" fill="url(#dogeHalo)" />

      {/* 3. Anime Doge Side-Profile (Iconic 3/4 Side-Glance) */}
      <g id="side-profile-doge" filter="url(#dogeShadow)">
        
        {/* --- FAR EAR (Right/Back Ear) --- */}
        <g id="far-ear">
          <path
            d="M 305 145 
               L 358 64 
               C 365 54, 380 64, 375 76 
               L 352 165 Z"
            fill="url(#shibaFurDark)"
          />
          <path
            d="M 318 142 
               L 356 78 
               C 360 72, 368 76, 365 85 
               L 348 152 Z"
            fill="url(#earInner)"
            opacity="0.8"
          />
        </g>

        {/* --- MAIN HEAD & BODY SILHOUETTE (Facing Left) --- */}
        <path
          d="M 235 158 
             C 210 162, 178 188, 160 216 
             C 146 238, 130 252, 114 260 
             C 105 264, 106 276, 115 281 
             C 126 288, 142 292, 158 293 
             C 142 308, 145 328, 162 334 
             C 180 340, 195 348, 202 364 
             C 216 398, 235 432, 252 445 
             C 285 450, 350 450, 385 440 
             C 395 410, 402 360, 396 315 
             C 390 260, 372 195, 335 165 
             C 300 140, 262 154, 235 158 Z"
          fill="url(#shibaFur)"
        />

        {/* Back of Neck / Fluffy Fur Curve Details */}
        <path
          d="M 390 295 C 404 312, 402 334, 386 348 C 400 362, 396 385, 380 398"
          fill="none"
          stroke="url(#shibaFurDark)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* --- NEAR EAR (Front Left Ear) --- */}
        <g id="near-ear">
          {/* Ear Outer Shell */}
          <path
            d="M 226 166 
               L 236 62 
               C 239 48, 258 50, 264 64 
               L 298 165 Z"
            fill="url(#shibaFur)"
          />
          {/* Ear Dark Outer Edge Rim */}
          <path
            d="M 258 58 L 298 165 L 286 168 L 250 68 Z"
            fill="url(#shibaFurDark)"
            opacity="0.6"
          />
          {/* Ear Inner Cavity */}
          <path
            d="M 238 158 
               L 246 80 
               C 248 72, 256 74, 258 82 
               L 282 158 Z"
            fill="url(#earInner)"
          />
          {/* Ear White Fluff Tufts */}
          <path
            d="M 238 140 C 248 132, 262 135, 268 126 C 258 128, 250 120, 244 130 Z"
            fill="#ffffff"
            opacity="0.95"
          />
          <path
            d="M 248 155 C 256 148, 270 150, 274 144 C 266 145, 260 140, 255 148 Z"
            fill="#ffffff"
            opacity="0.9"
          />
        </g>

        {/* --- URAJIRO (White/Cream Fur on Muzzle, Cheek, & Throat) --- */}
        <path
          d="M 114 266 
             C 125 268, 145 272, 160 274 
             C 178 276, 202 284, 218 300 
             C 236 318, 248 348, 240 375 
             C 232 402, 240 425, 252 445 
             L 215 440 
             C 192 418, 178 382, 168 352 
             C 158 340, 146 328, 144 312 
             C 130 306, 120 295, 114 280 Z"
          fill="url(#urajiroGrad)"
        />

        {/* Cheek Fluff Outline Soft Definition */}
        <path
          d="M 160 274 C 180 276, 205 284, 218 300 C 235 318, 246 346, 240 375"
          fill="none"
          stroke="#e8dbcd"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Cute Cheek Tufts (Anime Stylized Whisker/Fur Peaks) */}
        <path
          d="M 226 315 C 240 322, 242 334, 230 340 C 242 346, 238 360, 224 362"
          fill="url(#urajiroGrad)"
        />

        {/* --- ICONIC SHIBA EYEBROW DOT (Moro-tsuno) --- */}
        <ellipse
          cx="200"
          cy="188"
          rx="14"
          ry="10"
          fill="#ffffff"
          transform="rotate(-15 200 188)"
        />

        {/* --- THE LEGENDARY ANIME DOGE SIDE-EYE (Glancing at the Viewer) --- */}
        <g id="anime-doge-side-eye">
          {/* Eye Sclera (White) */}
          <path
            d="M 175 224 
               C 182 205, 222 205, 232 225 
               C 236 235, 226 248, 206 250 
               C 186 252, 172 240, 175 224 Z"
            fill="#ffffff"
          />

          {/* Iris (Large, Expressive Anime Amber-Gold) */}
          <ellipse cx="206" cy="227" rx="20" ry="22" fill="url(#sideEyeIris)" />

          {/* Pupil (Deep Espresso Black) */}
          <ellipse cx="207" cy="227" rx="11" ry="14" fill="#0f0502" />

          {/* Crescent Amber Inner Glow */}
          <path
            d="M 194 235 C 198 244, 216 244, 220 235 C 215 240, 198 240, 194 235 Z"
            fill="#feb740"
            opacity="0.9"
          />

          {/* Primary High-Gloss Catchlight (Top-Left Anime Sparkle) */}
          <circle cx="197" cy="216" r="8" fill="#ffffff" />

          {/* Secondary Star/Dot Catchlight (Bottom-Right) */}
          <circle cx="217" cy="235" r="4.5" fill="#ffffff" />
          <circle cx="203" cy="241" r="2.2" fill="#ffffff" opacity="0.8" />

          {/* Anime Upper Eyelash & Eyelid Line */}
          <path
            d="M 166 226 
               C 178 202, 224 200, 238 222"
            stroke="#1d0d05"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cute Anime Eyelash Wing Flick */}
          <path
            d="M 235 218 L 244 212"
            stroke="#1d0d05"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Soft Eyelid Crease Line above Eye */}
          <path
            d="M 182 200 C 196 195, 218 196, 228 205"
            stroke="#b86915"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </g>

        {/* --- ANIME CHEEK BLUSH (Cute subtle pink blush) --- */}
        <g id="anime-blush" opacity="0.75">
          <ellipse cx="196" cy="275" rx="18" ry="9" fill="#ff7f8f" transform="rotate(-6 196 275)" />
          <line x1="187" y1="272" x2="193" y2="279" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="195" y1="272" x2="201" y2="279" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="203" y1="272" x2="209" y2="279" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* --- NOSE (Tip of Snout) --- */}
        <g id="doge-nose">
          <path
            d="M 104 260 
               C 102 254, 112 248, 118 250 
               C 125 252, 127 260, 122 268 
               C 117 274, 106 272, 104 260 Z"
            fill="#1c120c"
          />
          {/* Nose Highlight */}
          <ellipse cx="114" cy="254" rx="4" ry="2" fill="#ffffff" opacity="0.8" />
        </g>

        {/* --- MOUTH (Knowing, subtle Shiba smile smirk) --- */}
        <g id="doge-mouth">
          {/* Upper snout contour line */}
          <path
            d="M 118 266 
               C 132 274, 150 276, 168 280 
               C 180 282, 188 288, 192 296"
            stroke="#452410"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle smirk corner tick */}
          <path
            d="M 190 292 C 194 290, 198 292, 197 296"
            stroke="#452410"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* --- CUTE ANIME SPARKLES (Minimalist Accent) --- */}
        <g fill="#fed776" opacity="0.9">
          {/* Sparkle near eye/cheek */}
          <path d="M 152 188 Q 152 198 142 198 Q 152 198 152 208 Q 152 198 162 198 Q 152 198 152 188 Z" />
          {/* Sparkle behind ear */}
          <path d="M 372 142 Q 372 150 364 150 Q 372 150 372 158 Q 372 150 380 150 Q 372 150 372 142 Z" opacity="0.7" />
        </g>
      </g>
    </svg>
  );
};
