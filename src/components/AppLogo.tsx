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
        {/* Golden-Yellow Squircle Background Gradients */}
        <linearGradient id="pupSquircleBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#df8600" />
          <stop offset="28%" stopColor="#eca004" />
          <stop offset="70%" stopColor="#f8bb0a" />
          <stop offset="100%" stopColor="#fec913" />
        </linearGradient>

        <linearGradient id="pupSquircleBorder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe682" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#b56e00" stopOpacity="0.4" />
        </linearGradient>

        {/* Chocolate Brown Coat Gradients */}
        <linearGradient id="pupBrown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a492d" />
          <stop offset="60%" stopColor="#63391f" />
          <stop offset="100%" stopColor="#4a2713" />
        </linearGradient>

        <linearGradient id="pupBrownDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#55301a" />
          <stop offset="100%" stopColor="#381d0c" />
        </linearGradient>

        {/* Caramel Tan Eyebrow & Muzzle Highlights */}
        <linearGradient id="pupTan" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d48c52" />
          <stop offset="100%" stopColor="#b46e39" />
        </linearGradient>

        {/* Sparkling Slate/Ice Blue Eyes */}
        <linearGradient id="pupEyeBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2e5473" />
          <stop offset="45%" stopColor="#4f8eb8" />
          <stop offset="85%" stopColor="#87c7ee" />
          <stop offset="100%" stopColor="#b3e1fb" />
        </linearGradient>

        {/* Liver / Chocolate Nose Gradient */}
        <linearGradient id="pupNose" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9b565f" />
          <stop offset="60%" stopColor="#7a3f47" />
          <stop offset="100%" stopColor="#592b31" />
        </linearGradient>

        {/* Happy Pink Tongue Gradient */}
        <linearGradient id="pupTongue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87d95" />
          <stop offset="60%" stopColor="#ea506e" />
          <stop offset="100%" stopColor="#ce3151" />
        </linearGradient>

        {/* Subtle White Fur Shadow */}
        <linearGradient id="whiteFurShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ece4db" />
        </linearGradient>

        {/* Inner Ear Warm Shadow */}
        <linearGradient id="earInnerPup" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a462b" />
          <stop offset="60%" stopColor="#4e2a16" />
          <stop offset="100%" stopColor="#3b1d0e" />
        </linearGradient>

        {/* Soft Drop Shadow for Depth */}
        <filter id="pupDropShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#4a2e00" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* 1. App Icon Squircle Container (Golden Yellow with Rounded Corners) */}
      <rect x="42" y="42" width="428" height="428" rx="104" fill="url(#pupSquircleBg)" />
      <rect x="44" y="44" width="424" height="424" rx="102" fill="none" stroke="url(#pupSquircleBorder)" strokeWidth="3" />

      {/* 2. Puppy Illustration (Australian Shepherd / Border Collie Tri-color Puppy) */}
      <g id="puppy-character" filter="url(#pupDropShadow)">
        
        {/* --- BACK & BODY SITTING CONTOUR --- */}
        {/* Left body flank */}
        <path
          d="M 148 245 C 132 280, 136 345, 154 395 C 160 412, 168 425, 175 435 C 172 380, 185 330, 205 305 Z"
          fill="url(#pupBrown)"
        />

        {/* Right body flank & hindquarter */}
        <path
          d="M 330 240 C 375 270, 395 320, 385 372 C 378 408, 350 435, 318 440 C 342 420, 355 385, 342 340 C 330 300, 310 270, 295 255 Z"
          fill="url(#pupBrownDark)"
        />

        {/* Hind paw on bottom right (white toes peeking) */}
        <g id="hind-paw-right">
          <ellipse cx="335" cy="425" rx="22" ry="16" fill="url(#whiteFurShadow)" stroke="#2b190f" strokeWidth="3.2" />
          <path d="M 326 422 C 327 433, 329 439, 329 441" stroke="#2b190f" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M 342 423 C 343 433, 344 439, 343 441" stroke="#2b190f" strokeWidth="2.8" strokeLinecap="round" />
        </g>

        {/* --- WHITE CHEST & FRONT LEGS --- */}
        {/* Fluffy white bib under neck */}
        <path
          d="M 190 275 
             C 170 300, 142 345, 146 385 
             C 152 425, 178 448, 192 458 
             C 210 445, 218 410, 212 375 
             C 210 350, 222 332, 235 325 
             C 255 315, 268 335, 272 360 
             C 278 400, 266 438, 252 478 
             C 278 480, 308 440, 312 395 
             C 316 350, 295 305, 275 285 Z"
          fill="url(#whiteFurShadow)"
        />

        {/* Brown patch on lower chest / right side */}
        <path
          d="M 248 375 C 275 365, 300 380, 298 408 C 295 425, 282 438, 266 442 C 272 418, 268 395, 248 375 Z"
          fill="url(#pupBrown)"
        />

        {/* Front Left Leg & Paw (Standing firm) */}
        <g id="front-left-paw">
          {/* Leg column */}
          <path
            d="M 160 360 
               C 165 390, 168 415, 154 442 
               C 150 450, 156 462, 168 466 
               C 182 470, 202 468, 206 455 
               C 212 432, 212 400, 205 365 Z"
            fill="#ffffff"
            stroke="#2b190f"
            strokeWidth="3.6"
          />
          {/* Paw toe separations */}
          <path d="M 172 450 C 172 462, 174 466, 176 467" stroke="#2b190f" strokeWidth="3" strokeLinecap="round" />
          <path d="M 188 450 C 189 462, 191 466, 194 467" stroke="#2b190f" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Front Right Leg & Paw (Stepping forward towards viewer) */}
        <g id="front-right-paw">
          <path
            d="M 248 395 
               C 246 428, 235 456, 222 478 
               C 216 488, 224 502, 238 506 
               C 255 510, 275 498, 280 482 
               C 288 455, 292 425, 285 395 Z"
            fill="#ffffff"
            stroke="#2b190f"
            strokeWidth="3.8"
          />
          {/* 4 distinct paw toes & nails */}
          <path d="M 235 488 C 236 498, 239 504, 243 506" stroke="#2b190f" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 252 489 C 253 499, 256 507, 260 508" stroke="#2b190f" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 268 482 C 270 492, 273 499, 275 500" stroke="#2b190f" strokeWidth="3.2" strokeLinecap="round" />
        </g>

        {/* --- HEAD BASE & COAT --- */}
        <g id="puppy-head">
          {/* Chocolate brown head silhouette */}
          <path
            d="M 175 140 
               C 142 165, 138 215, 150 255 
               C 156 275, 172 292, 190 298 
               C 230 312, 285 312, 324 296 
               C 344 288, 360 270, 364 248 
               C 374 205, 364 158, 330 135 
               C 285 110, 220 112, 175 140 Z"
            fill="url(#pupBrown)"
            stroke="#2b190f"
            strokeWidth="4"
          />

          {/* Left Fluffy Folded Ear (Viewer's Left) */}
          <g id="left-ear">
            <path
              d="M 178 135 
                 C 155 125, 130 148, 120 175 
                 C 108 205, 125 240, 142 248 
                 C 152 232, 158 208, 162 188 
                 C 166 168, 174 150, 178 135 Z"
              fill="url(#pupBrownDark)"
              stroke="#2b190f"
              strokeWidth="4"
            />
            {/* Inner ear fold / tuft */}
            <path
              d="M 132 172 C 126 195, 134 220, 145 228 C 148 210, 154 190, 156 178 Z"
              fill="url(#earInnerPup)"
            />
          </g>

          {/* Right Fluffy Folded Ear (Viewer's Right) */}
          <g id="right-ear">
            <path
              d="M 330 135 
                 C 355 125, 380 148, 392 175 
                 C 405 205, 388 240, 370 250 
                 C 360 232, 354 208, 350 188 
                 C 345 168, 335 150, 330 135 Z"
              fill="url(#pupBrownDark)"
              stroke="#2b190f"
              strokeWidth="4"
            />
            {/* Inner ear fold */}
            <path
              d="M 380 172 C 386 195, 378 220, 368 228 C 364 210, 358 190, 356 178 Z"
              fill="url(#earInnerPup)"
            />
          </g>

          {/* Tan Tri-Color Eyebrow Spots (Aussie / Tri-Color marking) */}
          {/* Left eyebrow spot */}
          <ellipse
            cx="186"
            cy="172"
            rx="16"
            ry="11"
            fill="url(#pupTan)"
            transform="rotate(-18 186 172)"
          />
          {/* Right eyebrow spot */}
          <ellipse
            cx="318"
            cy="172"
            rx="16"
            ry="11"
            fill="url(#pupTan)"
            transform="rotate(18 318 172)"
          />

          {/* White Center Blaze (Broad stripe down the forehead to the muzzle) */}
          <path
            d="M 235 118 
               C 248 116, 260 116, 270 118 
               C 275 145, 270 175, 260 200 
               C 278 206, 305 220, 318 245 
               C 328 266, 320 286, 305 300 
               C 278 318, 226 318, 200 300 
               C 184 286, 176 266, 186 245 
               C 198 220, 226 206, 244 200 
               C 235 175, 230 145, 235 118 Z"
            fill="#ffffff"
            stroke="#2b190f"
            strokeWidth="3.6"
          />

          {/* White Neck Spiky Ruff (Extending below cheeks) */}
          <path
            d="M 152 248 
               C 142 260, 134 278, 142 292 
               C 150 288, 155 280, 160 274 
               C 152 290, 150 308, 165 315 
               C 174 308, 180 298, 184 288 Z"
            fill="#ffffff"
            stroke="#2b190f"
            strokeWidth="2.8"
          />
          <path
            d="M 352 248 
               C 362 260, 370 278, 362 292 
               C 354 288, 349 280, 344 274 
               C 352 290, 354 308, 339 315 
               C 330 308, 324 298, 320 288 Z"
            fill="#ffffff"
            stroke="#2b190f"
            strokeWidth="2.8"
          />

          {/* --- BEAUTIFUL BLUE PUPPY EYES --- */}
          {/* Left Eye (Viewer's Left) */}
          <g id="left-eye">
            {/* Dark eye socket / liner */}
            <path
              d="M 166 204 C 172 188, 196 186, 208 200 C 214 208, 212 222, 202 226 C 188 230, 170 224, 166 204 Z"
              fill="#ffffff"
              stroke="#201108"
              strokeWidth="4.2"
            />
            {/* Blue Iris */}
            <ellipse cx="190" cy="207" rx="14" ry="16" fill="url(#pupEyeBlue)" />
            {/* Deep Pupil */}
            <ellipse cx="190" cy="207" rx="8.5" ry="10.5" fill="#120804" />
            {/* Specular Catchlights */}
            <circle cx="185" cy="200" r="4.2" fill="#ffffff" />
            <circle cx="195" cy="214" r="2.2" fill="#ffffff" />
            {/* Top Eyelid Crease */}
            <path d="M 168 194 C 180 186, 198 186, 210 195" fill="none" stroke="#4a2713" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Right Eye (Viewer's Right) */}
          <g id="right-eye">
            {/* Dark eye socket / liner */}
            <path
              d="M 338 204 C 332 188, 308 186, 296 200 C 290 208, 292 222, 302 226 C 316 230, 334 224, 338 204 Z"
              fill="#ffffff"
              stroke="#201108"
              strokeWidth="4.2"
            />
            {/* Blue Iris */}
            <ellipse cx="314" cy="207" rx="14" ry="16" fill="url(#pupEyeBlue)" />
            {/* Deep Pupil */}
            <ellipse cx="314" cy="207" rx="8.5" ry="10.5" fill="#120804" />
            {/* Specular Catchlights */}
            <circle cx="309" cy="200" r="4.2" fill="#ffffff" />
            <circle cx="319" cy="214" r="2.2" fill="#ffffff" />
            {/* Top Eyelid Crease */}
            <path d="M 336 194 C 324 186, 306 186, 294 195" fill="none" stroke="#4a2713" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* --- NOSE (Chocolate / Liver Color) --- */}
          <g id="puppy-nose">
            <path
              d="M 235 240 
                 C 230 230, 274 230, 269 240 
                 C 268 254, 258 266, 252 268 
                 C 246 266, 236 254, 235 240 Z"
              fill="url(#pupNose)"
              stroke="#241107"
              strokeWidth="3.2"
            />
            {/* Nostrils */}
            <ellipse cx="244" cy="248" rx="3.2" ry="4.2" fill="#200d07" />
            <ellipse cx="260" cy="248" rx="3.2" ry="4.2" fill="#200d07" />
            {/* Nose bridge highlight */}
            <path d="M 242 236 C 248 233, 256 233, 262 236" fill="none" stroke="#d58b94" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* Philtrum line below nose */}
          <path d="M 252 268 L 252 278" stroke="#241107" strokeWidth="3" strokeLinecap="round" />

          {/* --- HAPPY SMILING OPEN MOUTH WITH TONGUE --- */}
          <g id="open-mouth">
            {/* Open mouth cavity */}
            <path
              d="M 220 274 
                 C 235 284, 269 284, 284 274 
                 C 294 290, 288 335, 252 344 
                 C 216 335, 210 290, 220 274 Z"
              fill="#2e0d11"
              stroke="#241107"
              strokeWidth="3.6"
            />

            {/* Cute upper puppy teeth peeking out */}
            <path d="M 225 275 L 228 284 L 234 279 Z" fill="#ffffff" />
            <path d="M 279 275 L 276 284 L 270 279 Z" fill="#ffffff" />

            {/* Joyful Pink Tongue Hanging Out */}
            <path
              d="M 230 286 
                 C 225 315, 232 346, 252 352 
                 C 272 346, 279 315, 274 286 
                 C 264 294, 240 294, 230 286 Z"
              fill="url(#pupTongue)"
              stroke="#8a1c32"
              strokeWidth="2.6"
            />
            {/* Tongue midline cleft */}
            <path
              d="M 252 292 C 252 312, 252 334, 252 346"
              fill="none"
              stroke="#b5233d"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Tongue soft highlight gloss */}
            <path
              d="M 238 300 C 236 318, 240 332, 245 338"
              fill="none"
              stroke="#ffadc0"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* Upper lips smile curves */}
            <path
              d="M 204 266 
                 C 216 274, 236 276, 252 278 
                 C 268 276, 288 274, 300 266"
              fill="none"
              stroke="#241107"
              strokeWidth="3.8"
              strokeLinecap="round"
            />
          </g>

          {/* Whiskers */}
          <g stroke="#241107" strokeWidth="1.6" opacity="0.6" strokeLinecap="round">
            <line x1="200" y1="262" x2="168" y2="256" />
            <line x1="202" y1="270" x2="164" y2="272" />
            <line x1="204" y1="278" x2="172" y2="286" />
            
            <line x1="304" y1="262" x2="336" y2="256" />
            <line x1="302" y1="270" x2="340" y2="272" />
            <line x1="300" y1="278" x2="332" y2="286" />
          </g>
        </g>
      </g>
    </svg>
  );
};
