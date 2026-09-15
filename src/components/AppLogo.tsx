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
        {/* Sleek App Icon Background (Neutral Dark Slate - No Red) */}
        <linearGradient id="appBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#252632" />
          <stop offset="50%" stopColor="#1c1d25" />
          <stop offset="100%" stopColor="#14141c" />
        </linearGradient>

        {/* Outer Border Stroke */}
        <linearGradient id="bgBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#48495a" />
          <stop offset="100%" stopColor="#292a36" />
        </linearGradient>

        {/* Soft Golden Ambient Halo behind Doge */}
        <radialGradient id="dogeHalo" cx="50%" cy="54%" r="48%">
          <stop offset="0%" stopColor="#ffc043" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#ff9f1a" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ff9f1a" stopOpacity="0" />
        </radialGradient>

        {/* Shiba Golden Fur Gradient */}
        <linearGradient id="shibaFur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffca68" />
          <stop offset="45%" stopColor="#f3a738" />
          <stop offset="100%" stopColor="#d98218" />
        </linearGradient>

        {/* Dark Fur Accent (Outer ear edge & shadows) */}
        <linearGradient id="furDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#df8719" />
          <stop offset="100%" stopColor="#b6650c" />
        </linearGradient>

        {/* Inner Ear Soft Pink Gradient */}
        <linearGradient id="earInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe4e8" />
          <stop offset="50%" stopColor="#fca5b3" />
          <stop offset="100%" stopColor="#f38497" />
        </linearGradient>

        {/* Anime Eyes Amber-Gold Gradient */}
        <linearGradient id="animeEyeIris" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#211005" />
          <stop offset="40%" stopColor="#3d1d08" />
          <stop offset="70%" stopColor="#9a4d0e" />
          <stop offset="100%" stopColor="#e79026" />
        </linearGradient>

        {/* Drop Shadow for clean depth */}
        <filter id="dogeShadow" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* 1. Base App Icon Container (Simple, Clean, Modern Squircle) */}
      <rect width="512" height="512" rx="116" fill="url(#appBg)" />
      <rect width="502" height="502" x="5" y="5" rx="111" fill="none" stroke="url(#bgBorder)" strokeWidth="3" />

      {/* 2. Soft Ambient Halo */}
      <circle cx="256" cy="275" r="185" fill="url(#dogeHalo)" />

      {/* 3. Anime Doge Character */}
      <g id="anime-doge-head" filter="url(#dogeShadow)">
        {/* --- EARS --- */}
        {/* Left Ear Outer */}
        <path
          d="M 172 195 L 116 88 C 111 78, 125 70, 134 78 L 214 146 Z"
          fill="url(#furDark)"
        />
        {/* Left Ear Base */}
        <path
          d="M 166 198 L 122 94 C 119 86, 129 80, 136 86 L 208 148 Z"
          fill="url(#shibaFur)"
        />
        {/* Left Ear Inner Fluff */}
        <path
          d="M 160 190 L 132 110 C 130 104, 137 101, 142 105 L 194 150 C 182 165, 172 178, 160 190 Z"
          fill="url(#earInner)"
        />
        {/* Left Ear White Fluff Tufts */}
        <path
          d="M 152 170 C 160 160, 175 162, 178 152 C 168 155, 162 148, 155 158 Z"
          fill="#fffdfa"
          opacity="0.9"
        />

        {/* Right Ear Outer */}
        <path
          d="M 340 195 L 396 88 C 401 78, 387 70, 378 78 L 298 146 Z"
          fill="url(#furDark)"
        />
        {/* Right Ear Base */}
        <path
          d="M 346 198 L 390 94 C 393 86, 383 80, 376 86 L 304 148 Z"
          fill="url(#shibaFur)"
        />
        {/* Right Ear Inner Fluff */}
        <path
          d="M 352 190 L 380 110 C 382 104, 375 101, 370 105 L 318 150 C 330 165, 340 178, 352 190 Z"
          fill="url(#earInner)"
        />
        {/* Right Ear White Fluff Tufts */}
        <path
          d="M 360 170 C 352 160, 337 162, 334 152 C 344 155, 350 148, 357 158 Z"
          fill="#fffdfa"
          opacity="0.9"
        />

        {/* --- MAIN HEAD SILHOUETTE --- */}
        {/* Golden Shiba Head Base */}
        <path
          d="M 148 200 
             C 120 230, 95 285, 115 340 
             C 125 365, 150 395, 195 425 
             C 230 445, 282 445, 317 425 
             C 362 395, 387 365, 397 340 
             C 417 285, 392 230, 364 200 
             C 335 170, 305 160, 256 160 
             C 207 160, 177 170, 148 200 Z"
          fill="url(#shibaFur)"
        />

        {/* Cute Anime Cheek Tuft Hair (Left) */}
        <path
          d="M 112 315 C 92 328, 96 348, 122 355 C 104 358, 108 375, 134 376 C 122 384, 132 396, 150 393"
          fill="url(#shibaFur)"
        />
        {/* Cute Anime Cheek Tuft Hair (Right) */}
        <path
          d="M 400 315 C 420 328, 416 348, 390 355 C 408 358, 404 375, 378 376 C 390 384, 380 396, 362 393"
          fill="url(#shibaFur)"
        />

        {/* --- URAJIRO (White/Cream Muzzle & Cheek Fur) --- */}
        <path
          d="M 152 300 
             C 142 350, 170 415, 215 428 
             C 235 434, 277 434, 297 428 
             C 342 415, 370 350, 360 300 
             C 348 290, 328 285, 308 300 
             C 285 315, 270 318, 256 318 
             C 242 318, 227 315, 204 300 
             C 184 285, 164 290, 152 300 Z"
          fill="#fffdf8"
        />

        {/* Chin Fluff Detail */}
        <path
          d="M 236 430 C 248 436, 264 436, 276 430 C 266 438, 246 438, 236 430 Z"
          fill="#ede6d8"
        />

        {/* --- ANIME SHIBA EYEBROW DOTS (Iconic White Marks) --- */}
        <ellipse cx="202" cy="225" rx="13" ry="9" fill="#fffdfa" transform="rotate(-8 202 225)" />
        <ellipse cx="310" cy="225" rx="13" ry="9" fill="#fffdfa" transform="rotate(8 310 225)" />

        {/* --- BIG ANIME DOGE EYES --- */}
        {/* LEFT EYE */}
        <g id="anime-left-eye">
          {/* Eye White */}
          <ellipse cx="198" cy="272" rx="26" ry="30" fill="#ffffff" />
          {/* Iris */}
          <ellipse cx="199" cy="272" rx="23" ry="28" fill="url(#animeEyeIris)" />
          {/* Pupil */}
          <ellipse cx="199" cy="272" rx="13" ry="17" fill="#120803" />
          {/* Warm Amber Crescent Light */}
          <path
            d="M 183 283 C 188 296, 210 296, 215 283 C 210 291, 188 291, 183 283 Z"
            fill="#fdb441"
            opacity="0.85"
          />
          {/* Primary Big Gleam */}
          <circle cx="189" cy="258" r="9" fill="#ffffff" />
          {/* Secondary Star/Sparkle Gleam */}
          <circle cx="211" cy="281" r="5" fill="#ffffff" />
          <circle cx="193" cy="288" r="2.5" fill="#ffffff" opacity="0.8" />
          {/* Anime Upper Eyelash / Lid Line */}
          <path
            d="M 166 265 C 176 242, 216 242, 228 262"
            stroke="#21120a"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Little Eyelash Flick */}
          <path
            d="M 224 256 L 232 250"
            stroke="#21120a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* RIGHT EYE */}
        <g id="anime-right-eye">
          {/* Eye White */}
          <ellipse cx="314" cy="272" rx="26" ry="30" fill="#ffffff" />
          {/* Iris */}
          <ellipse cx="313" cy="272" rx="23" ry="28" fill="url(#animeEyeIris)" />
          {/* Pupil */}
          <ellipse cx="313" cy="272" rx="13" ry="17" fill="#120803" />
          {/* Warm Amber Crescent Light */}
          <path
            d="M 297 283 C 302 296, 324 296, 329 283 C 324 291, 302 291, 297 283 Z"
            fill="#fdb441"
            opacity="0.85"
          />
          {/* Primary Big Gleam */}
          <circle cx="303" cy="258" r="9" fill="#ffffff" />
          {/* Secondary Star/Sparkle Gleam */}
          <circle cx="325" cy="281" r="5" fill="#ffffff" />
          <circle cx="307" cy="288" r="2.5" fill="#ffffff" opacity="0.8" />
          {/* Anime Upper Eyelash / Lid Line */}
          <path
            d="M 346 265 C 336 242, 296 242, 284 262"
            stroke="#21120a"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Little Eyelash Flick */}
          <path
            d="M 288 256 L 280 250"
            stroke="#21120a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* --- ANIME BLUSH CHEEKS --- */}
        <g id="anime-blush" opacity="0.6">
          <ellipse cx="152" cy="322" rx="19" ry="10" fill="#ff7f8a" />
          <line x1="142" y1="318" x2="148" y2="326" stroke="#fa5252" strokeWidth="2" strokeLinecap="round" />
          <line x1="150" y1="318" x2="156" y2="326" stroke="#fa5252" strokeWidth="2" strokeLinecap="round" />
          <line x1="158" y1="318" x2="164" y2="326" stroke="#fa5252" strokeWidth="2" strokeLinecap="round" />

          <ellipse cx="360" cy="322" rx="19" ry="10" fill="#ff7f8a" />
          <line x1="348" y1="318" x2="354" y2="326" stroke="#fa5252" strokeWidth="2" strokeLinecap="round" />
          <line x1="356" y1="318" x2="362" y2="326" stroke="#fa5252" strokeWidth="2" strokeLinecap="round" />
          <line x1="364" y1="318" x2="370" y2="326" stroke="#fa5252" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* --- NOSE --- */}
        <g id="doge-nose">
          {/* Nose Body */}
          <path
            d="M 243 324 
               C 241 316, 250 312, 256 312 
               C 262 312, 271 316, 269 324 
               C 267 334, 259 339, 256 339 
               C 253 339, 245 334, 243 324 Z"
            fill="#1f1a18"
          />
          {/* Top Nose Highlight */}
          <ellipse cx="253" cy="317" rx="4.5" ry="2.2" fill="#ffffff" opacity="0.75" />
        </g>

        {/* --- CUTE ANIME 'ω' SMILING MOUTH --- */}
        <g id="doge-mouth">
          {/* Philtrum line */}
          <line x1="256" y1="339" x2="256" y2="349" stroke="#3d2616" strokeWidth="3.2" strokeLinecap="round" />
          {/* Sweet Anime Cat/Doge Mouth Curves */}
          <path
            d="M 226 352 
               C 234 362, 248 362, 256 349 
               C 264 362, 278 362, 286 352"
            stroke="#3d2616"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cheek Smile Dimple Ticks */}
          <path d="M 224 348 C 223 352, 226 355, 228 355" stroke="#3d2616" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M 288 348 C 289 352, 286 355, 284 355" stroke="#3d2616" strokeWidth="2.8" strokeLinecap="round" fill="none" />

          {/* Tiny Cute Anime Tongue */}
          <path
            d="M 250 357 C 250 367, 262 367, 262 357 Z"
            fill="#ff7b89"
          />
          <path
            d="M 252 357 C 252 362, 260 362, 260 357 Z"
            fill="#ffa6b1"
          />
        </g>

        {/* Little Cute Sparkles around Head (Anime Aesthetic) */}
        <g fill="#fed776" opacity="0.85">
          {/* Top Left Sparkle */}
          <path d="M 120 160 Q 120 172 108 172 Q 120 172 120 184 Q 120 172 132 172 Q 120 172 120 160 Z" />
          {/* Top Right Sparkle */}
          <path d="M 390 160 Q 390 172 378 172 Q 390 172 390 184 Q 390 172 402 172 Q 390 172 390 160 Z" />
        </g>
      </g>
    </svg>
  );
};
