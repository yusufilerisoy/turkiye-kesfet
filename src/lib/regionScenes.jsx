/* regionScenes.jsx — 7 bölgenin sulu boya stilinde sahne illüstrasyonları
   Her sahne: <svg viewBox="0 0 600 220"> formatında, design palet'i ile uyumlu.
   Master component <RegionScene region="..."/> ilgili bölgenin sahnesini render eder.
*/

/* ========== KARADENİZ — sis, yeşil dağlar, çay tarlası, yağmur ========== */
const RegionSceneKaradenizScene = () => (
  <svg viewBox="0 0 600 220" width="100%">
    <defs>
      <linearGradient id="kdSky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#E0E5DA"/>
        <stop offset="1" stopColor="#B7C4A8"/>
      </linearGradient>
    </defs>
    <rect width="600" height="220" fill="url(#kdSky)"/>
    {/* Sis */}
    <ellipse cx="180" cy="100" rx="180" ry="20" fill="#FAF6EC" opacity=".7"/>
    <ellipse cx="420" cy="120" rx="160" ry="16" fill="#FAF6EC" opacity=".55"/>
    {/* Dağlar */}
    <path d="M0 160 L80 70 L150 130 L230 50 L320 130 L400 80 L500 140 L600 90 L600 220 L0 220 Z" fill="#3F5F3E"/>
    <path d="M0 160 L80 70 L150 130 L230 50 L320 130 L400 80 L500 140 L600 90 L600 220 L0 220 Z" fill="#2E7D32" opacity=".6"/>
    {/* Çay tarlası */}
    <path d="M0 220 L0 180 Q150 165 300 180 Q450 195 600 175 L600 220 Z" fill="#5C8D2E"/>
    {Array.from({ length: 20 }).map((_, i) => (
      <ellipse key={i} cx={30 + i * 30} cy={195 + (i%3)*4} rx="14" ry="3" fill="#3F6B1F" opacity=".7"/>
    ))}
    {/* Yağmur */}
    {Array.from({ length: 24 }).map((_, i) => (
      <line key={i} x1={(i*27)%600} y1={(i*13)%80} x2={(i*27)%600 - 4} y2={(i*13)%80 + 12}
        stroke="#FAF6EC" strokeWidth="1.2" opacity=".4"/>
    ))}
    {/* Ev */}
    <g transform="translate(440, 130)">
      <polygon points="0,20 25,0 50,20" fill="#5D2E2E"/>
      <rect x="6" y="20" width="38" height="22" fill="#E8D9B5" stroke="#5D2E2E" strokeWidth="1"/>
      <rect x="20" y="28" width="10" height="14" fill="#5D2E2E"/>
    </g>
  </svg>
);

/* ========== AKDENİZ — parlak deniz, palmiyeler, güneş, turuncu kayalar ========== */
const RegionSceneAkdeniz = () => (
  <svg viewBox="0 0 600 220" width="100%">
    <defs>
      <linearGradient id="akSky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FFE2A8"/>
        <stop offset="0.55" stopColor="#FFCB7B"/>
        <stop offset="1" stopColor="#FFE9C3"/>
      </linearGradient>
      <linearGradient id="akSea" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#1E88E5"/>
        <stop offset="1" stopColor="#0D47A1"/>
      </linearGradient>
      <linearGradient id="akSand" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#F2D9A1"/>
        <stop offset="1" stopColor="#D9B36A"/>
      </linearGradient>
    </defs>
    {/* Gökyüzü */}
    <rect width="600" height="220" fill="url(#akSky)"/>

    {/* Güneş ve halka */}
    <circle cx="500" cy="55" r="42" fill="#FFF7C8" opacity=".55"/>
    <circle cx="500" cy="55" r="28" fill="#FFE08A"/>
    <circle cx="500" cy="55" r="20" fill="#FFD059"/>

    {/* Uzak dağlar (Toroslar — silik mavi) */}
    <path d="M0 130 L60 90 L120 115 L200 75 L280 110 L360 85 L440 108 L520 90 L600 110 L600 150 L0 150 Z"
          fill="#B7CFE3" opacity=".75"/>
    <path d="M0 138 L80 110 L160 130 L240 105 L320 125 L420 105 L520 122 L600 110 L600 155 L0 155 Z"
          fill="#8BAFCE" opacity=".55"/>

    {/* Deniz */}
    <rect x="0" y="120" width="600" height="60" fill="url(#akSea)"/>
    {/* Dalgalar */}
    {Array.from({ length: 18 }).map((_, i) => (
      <path key={i} d={`M${i*36} ${135 + (i%3)*8} q8 -4 16 0 t16 0`}
            fill="none" stroke="#BBDEFB" strokeWidth="1.4" opacity=".75"/>
    ))}

    {/* Antik liman dokusu (sütun + tekne silüeti) */}
    <g transform="translate(60, 95)" opacity=".85">
      <rect x="0" y="0" width="6" height="32" fill="#FAF6EC"/>
      <rect x="-3" y="0" width="12" height="4" fill="#E8D9B5"/>
      <rect x="-3" y="30" width="12" height="4" fill="#E8D9B5"/>
      <rect x="14" y="6" width="6" height="26" fill="#FAF6EC"/>
      <rect x="11" y="6" width="12" height="4" fill="#E8D9B5"/>
    </g>
    <g transform="translate(330, 142)">
      <path d="M0 8 L60 8 L52 18 L8 18 Z" fill="#FAF6EC" stroke="#5D2E2E" strokeWidth="1"/>
      <line x1="30" y1="8" x2="30" y2="-12" stroke="#5D2E2E" strokeWidth="1.5"/>
      <path d="M30 -12 L46 6 L30 6 Z" fill="#C62828"/>
    </g>

    {/* Turuncu kayalar */}
    <path d="M0 165 Q45 145 90 168 Q135 188 175 168 L175 220 L0 220 Z" fill="#D17B3F"/>
    <path d="M0 165 Q45 145 90 168 Q135 188 175 168 L175 220 L0 220 Z" fill="#A85A28" opacity=".55"/>
    <path d="M460 175 Q510 158 560 175 Q590 184 600 178 L600 220 L460 220 Z" fill="#D17B3F"/>
    <path d="M460 175 Q510 158 560 175 Q590 184 600 178 L600 220 L460 220 Z" fill="#A85A28" opacity=".5"/>

    {/* Kum şeridi */}
    <path d="M150 180 Q300 170 470 182 L470 220 L150 220 Z" fill="url(#akSand)"/>

    {/* Palmiyeler */}
    {[
      { x: 100, y: 175, s: 1.0 },
      { x: 230, y: 178, s: 0.85 },
      { x: 380, y: 176, s: 1.1 },
    ].map((p, i) => (
      <g key={i} transform={`translate(${p.x},${p.y}) scale(${p.s})`}>
        {/* gövde */}
        <path d="M0 0 q-2 -22 4 -44" fill="none" stroke="#5D3A1A" strokeWidth="3.5" strokeLinecap="round"/>
        {/* yapraklar */}
        <path d="M4 -44 q-22 -8 -34 -2" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round"/>
        <path d="M4 -44 q22 -10 38 -4" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round"/>
        <path d="M4 -44 q-12 -22 -22 -28" fill="none" stroke="#388E3C" strokeWidth="3" strokeLinecap="round"/>
        <path d="M4 -44 q14 -22 28 -26" fill="none" stroke="#388E3C" strokeWidth="3" strokeLinecap="round"/>
        <path d="M4 -44 q-2 -18 4 -32" fill="none" stroke="#43A047" strokeWidth="3" strokeLinecap="round"/>
        {/* hindistan cevizi */}
        <circle cx="2" cy="-42" r="3" fill="#5D3A1A"/>
        <circle cx="6" cy="-42" r="3" fill="#5D3A1A"/>
      </g>
    ))}
  </svg>
);

/* ========== İÇ ANADOLU — bozkır, sarı buğday, küçük tepeler ========== */
const RegionSceneIcAnadolu = () => (
  <svg viewBox="0 0 600 220" width="100%">
    <defs>
      <linearGradient id="iaSky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#BFE0F0"/>
        <stop offset="1" stopColor="#F4E4B6"/>
      </linearGradient>
      <linearGradient id="iaField" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#E9C66B"/>
        <stop offset="1" stopColor="#B07C2A"/>
      </linearGradient>
    </defs>
    <rect width="600" height="220" fill="url(#iaSky)"/>

    {/* Güneş — soluk */}
    <circle cx="120" cy="55" r="22" fill="#FFE08A" opacity=".85"/>

    {/* Tek bir küçük bulut */}
    <ellipse cx="430" cy="48" rx="38" ry="9" fill="#FAF6EC" opacity=".75"/>
    <ellipse cx="448" cy="44" rx="22" ry="7" fill="#FAF6EC" opacity=".7"/>

    {/* Uzak küçük tepeler */}
    <path d="M0 145 Q80 118 170 138 Q260 110 360 138 Q460 118 560 138 L600 130 L600 165 L0 165 Z"
          fill="#C19F5C" opacity=".7"/>
    <path d="M0 152 Q90 130 180 148 Q280 128 380 150 Q480 132 600 152 L600 175 L0 175 Z"
          fill="#A88249" opacity=".75"/>

    {/* Tek bir ağaç (silik, sol) */}
    <g transform="translate(70, 132)">
      <rect x="-1.5" y="0" width="3" height="14" fill="#5D3A1A"/>
      <ellipse cx="0" cy="-4" rx="11" ry="9" fill="#7CB342" opacity=".85"/>
    </g>
    {/* Tek ağaç sağ */}
    <g transform="translate(490, 138)">
      <rect x="-1.5" y="0" width="3" height="12" fill="#5D3A1A"/>
      <ellipse cx="0" cy="-3" rx="9" ry="7" fill="#7CB342" opacity=".85"/>
    </g>

    {/* Buğday tarlası (önde) */}
    <path d="M0 220 L0 150 Q150 138 300 150 Q450 165 600 145 L600 220 Z" fill="url(#iaField)"/>

    {/* Tarla sıraları (toprak çizgileri) */}
    {Array.from({ length: 8 }).map((_, i) => (
      <path key={i}
            d={`M0 ${168 + i*7} Q300 ${162 + i*7} 600 ${166 + i*7}`}
            fill="none" stroke="#7C5618" strokeWidth="1.1" opacity=".35"/>
    ))}

    {/* Buğday başakları */}
    {Array.from({ length: 36 }).map((_, i) => {
      const x = 16 + i * 16 + (i % 3) * 2;
      const y = 175 + (i % 4) * 8;
      return (
        <g key={i} transform={`translate(${x},${y})`} opacity=".85">
          <line x1="0" y1="0" x2="0" y2="14" stroke="#8B6724" strokeWidth="1.2"/>
          <ellipse cx="-2" cy="2" rx="2" ry="3" fill="#E8B649"/>
          <ellipse cx="2" cy="4" rx="2" ry="3" fill="#E8B649"/>
          <ellipse cx="-2" cy="6" rx="2" ry="3" fill="#D49A2A"/>
          <ellipse cx="2" cy="8" rx="2" ry="3" fill="#D49A2A"/>
          <ellipse cx="0" cy="-2" rx="1.6" ry="3" fill="#E8B649"/>
        </g>
      );
    })}

    {/* Yol — kıvrımlı */}
    <path d="M260 220 Q300 195 320 175 Q340 158 360 150"
          fill="none" stroke="#D9B36A" strokeWidth="14" opacity=".7" strokeLinecap="round"/>
    <path d="M260 220 Q300 195 320 175 Q340 158 360 150"
          fill="none" stroke="#FAF1D6" strokeWidth="2" strokeDasharray="4 6" opacity=".55"/>
  </svg>
);

/* ========== EGE — zeytinlikler, yel değirmeni, antik sütun, kıvrımlı yol ========== */
const RegionSceneEge = () => (
  <svg viewBox="0 0 600 220" width="100%">
    <defs>
      <linearGradient id="egSky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FCE9C8"/>
        <stop offset="1" stopColor="#F2C681"/>
      </linearGradient>
      <linearGradient id="egSea" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#5BA8C9"/>
        <stop offset="1" stopColor="#2E6FA0"/>
      </linearGradient>
      <linearGradient id="egGround" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#9BAE5B"/>
        <stop offset="1" stopColor="#6F8334"/>
      </linearGradient>
    </defs>
    <rect width="600" height="220" fill="url(#egSky)"/>

    {/* Güneş alçak */}
    <circle cx="490" cy="78" r="32" fill="#FFD059" opacity=".75"/>
    <circle cx="490" cy="78" r="22" fill="#FFB84D"/>

    {/* Uzak adalar / kıyı silüeti */}
    <path d="M0 120 Q80 102 160 118 Q230 130 290 120 Q360 110 430 122 Q500 130 600 118 L600 140 L0 140 Z"
          fill="#7B98AE" opacity=".5"/>

    {/* Girintili kıyı — Ege denizi */}
    <path d="M0 150 Q60 138 120 148 Q160 158 200 150 Q240 140 280 152 Q320 162 360 150 Q400 140 440 152 Q490 162 540 150 Q580 142 600 148 L600 175 L0 175 Z"
          fill="url(#egSea)"/>
    {/* Dalga çizgileri */}
    {Array.from({ length: 14 }).map((_, i) => (
      <path key={i} d={`M${i*42} ${158 + (i%2)*6} q10 -3 20 0 t20 0`}
            fill="none" stroke="#BBDEFB" strokeWidth="1.2" opacity=".75"/>
    ))}

    {/* Tepe / arazi */}
    <path d="M0 175 Q120 158 240 175 Q360 192 480 170 Q540 158 600 174 L600 220 L0 220 Z"
          fill="url(#egGround)"/>

    {/* Antik sütunlar (sol tepe) */}
    <g transform="translate(50, 135)">
      <rect x="0" y="0" width="6" height="32" fill="#FAF6EC"/>
      <rect x="-3" y="0" width="12" height="3.5" fill="#E8D9B5"/>
      <rect x="-3" y="30" width="12" height="3.5" fill="#E8D9B5"/>
      <rect x="14" y="4" width="6" height="28" fill="#FAF6EC"/>
      <rect x="11" y="4" width="12" height="3.5" fill="#E8D9B5"/>
      <rect x="11" y="30" width="12" height="3.5" fill="#E8D9B5"/>
      <rect x="28" y="8" width="6" height="24" fill="#FAF6EC" opacity=".7"/>
      {/* üst kiriş */}
      <rect x="-4" y="-4" width="38" height="4" fill="#E8D9B5"/>
    </g>

    {/* Yel değirmeni (sağ tepe) */}
    <g transform="translate(420, 130)">
      {/* gövde */}
      <path d="M-12 50 L0 0 L12 50 Z" fill="#FAF6EC" stroke="#5D2E2E" strokeWidth="1"/>
      <rect x="-4" y="32" width="8" height="14" fill="#5D2E2E"/>
      {/* kanatlar */}
      <g transform="translate(0,2)">
        <path d="M0 0 L26 -10 L24 -2 Z" fill="#5D2E2E"/>
        <path d="M0 0 L10 26 L2 24 Z" fill="#5D2E2E"/>
        <path d="M0 0 L-26 10 L-24 2 Z" fill="#5D2E2E"/>
        <path d="M0 0 L-10 -26 L-2 -24 Z" fill="#5D2E2E"/>
        <circle r="3" fill="#B8862F"/>
      </g>
    </g>

    {/* Zeytin ağaçları sıralı */}
    {[
      { x: 110, y: 195, s: 1.0 },
      { x: 175, y: 198, s: 0.9 },
      { x: 240, y: 195, s: 1.05 },
      { x: 305, y: 200, s: 0.95 },
      { x: 360, y: 198, s: 1.0 },
      { x: 510, y: 200, s: 0.95 },
      { x: 565, y: 198, s: 1.0 },
    ].map((t, i) => (
      <g key={i} transform={`translate(${t.x},${t.y}) scale(${t.s})`}>
        <rect x="-1.5" y="-2" width="3" height="14" fill="#5D3A1A"/>
        {/* zeytin tacı */}
        <ellipse cx="-6" cy="-6" rx="9" ry="7" fill="#A4B97D"/>
        <ellipse cx="6" cy="-6" rx="9" ry="7" fill="#A4B97D"/>
        <ellipse cx="0" cy="-12" rx="10" ry="7" fill="#9DB272"/>
        <ellipse cx="0" cy="-8" rx="11" ry="6" fill="#8FA760" opacity=".7"/>
      </g>
    ))}

    {/* Kıvrımlı yol */}
    <path d="M120 220 Q200 200 240 188 Q300 170 360 180 Q420 188 470 200"
          fill="none" stroke="#E8D9B5" strokeWidth="9" opacity=".85" strokeLinecap="round"/>
    <path d="M120 220 Q200 200 240 188 Q300 170 360 180 Q420 188 470 200"
          fill="none" stroke="#FAF6EC" strokeWidth="2" strokeDasharray="4 6" opacity=".7"/>
  </svg>
);

/* ========== MARMARA — boğaz, asılı köprü, fabrikalar, modern şehir ========== */
const RegionSceneMarmara = () => (
  <svg viewBox="0 0 600 220" width="100%">
    <defs>
      <linearGradient id="mrSky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FAD3A2"/>
        <stop offset="0.6" stopColor="#E69E7C"/>
        <stop offset="1" stopColor="#9C5A89"/>
      </linearGradient>
      <linearGradient id="mrSea" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#3F6BAA"/>
        <stop offset="1" stopColor="#1B3A6B"/>
      </linearGradient>
    </defs>
    <rect width="600" height="220" fill="url(#mrSky)"/>

    {/* Akşam güneşi */}
    <circle cx="430" cy="95" r="34" fill="#FFD8A3" opacity=".55"/>
    <circle cx="430" cy="95" r="22" fill="#FFB37A"/>

    {/* Fabrikalar arka planda (sol) */}
    <g transform="translate(20, 110)" opacity=".75">
      <rect x="0" y="14" width="40" height="36" fill="#5D2E2E"/>
      <rect x="44" y="6" width="32" height="44" fill="#3E2723"/>
      <rect x="80" y="20" width="24" height="30" fill="#5D2E2E"/>
      {/* bacalar */}
      <rect x="14" y="-8" width="6" height="22" fill="#3E2723"/>
      <rect x="56" y="-18" width="6" height="24" fill="#3E2723"/>
      {/* duman */}
      <ellipse cx="17" cy="-14" rx="9" ry="4" fill="#FAF6EC" opacity=".55"/>
      <ellipse cx="59" cy="-25" rx="11" ry="5" fill="#FAF6EC" opacity=".5"/>
      {/* küçük pencereler */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={4 + (i%4)*9} y={20 + Math.floor(i/4)*8} width="3" height="3" fill="#FFD059" opacity=".8"/>
      ))}
    </g>

    {/* Modern şehir silüeti — sağ */}
    <g transform="translate(360, 90)" opacity=".9">
      <rect x="0" y="40" width="22" height="40" fill="#3E2723"/>
      <rect x="24" y="20" width="18" height="60" fill="#5D2E2E"/>
      <rect x="44" y="32" width="14" height="48" fill="#3E2723"/>
      <rect x="60" y="10" width="20" height="70" fill="#5D2E2E"/>
      <rect x="82" y="28" width="16" height="52" fill="#3E2723"/>
      <rect x="100" y="42" width="14" height="38" fill="#5D2E2E"/>
      <rect x="116" y="22" width="20" height="58" fill="#3E2723"/>
      <rect x="138" y="34" width="14" height="46" fill="#5D2E2E"/>
      <rect x="154" y="50" width="16" height="30" fill="#3E2723"/>
      {/* pencere ışıkları */}
      {Array.from({ length: 30 }).map((_, i) => (
        <rect key={i}
              x={2 + (i*7) % 168}
              y={24 + ((i*11) % 50)}
              width="2" height="3" fill="#FFD059" opacity=".75"/>
      ))}
    </g>

    {/* Boğaz (deniz) */}
    <rect x="0" y="160" width="600" height="60" fill="url(#mrSea)"/>
    {/* Yansımalar */}
    {Array.from({ length: 14 }).map((_, i) => (
      <line key={i} x1={i*44} y1={172 + (i%3)*6} x2={i*44 + 18} y2={172 + (i%3)*6}
            stroke="#FFD8A3" strokeWidth="1" opacity=".5"/>
    ))}

    {/* Asılı köprü (Boğaziçi tarzı) */}
    <g>
      {/* iki kule */}
      <rect x="178" y="60" width="8" height="100" fill="#3E2723"/>
      <rect x="174" y="60" width="16" height="6" fill="#3E2723"/>
      <rect x="174" y="76" width="16" height="6" fill="#3E2723"/>
      <rect x="378" y="60" width="8" height="100" fill="#3E2723"/>
      <rect x="374" y="60" width="16" height="6" fill="#3E2723"/>
      <rect x="374" y="76" width="16" height="6" fill="#3E2723"/>

      {/* asılı kablolar - parabolik */}
      <path d="M182 66 Q282 145 382 66" fill="none" stroke="#3E2723" strokeWidth="2.5"/>
      <path d="M182 66 Q282 138 382 66" fill="none" stroke="#5D2E2E" strokeWidth="1.5" opacity=".7"/>

      {/* tabliye */}
      <rect x="120" y="156" width="340" height="6" fill="#5D2E2E"/>
      <rect x="120" y="155" width="340" height="2" fill="#FAF6EC" opacity=".5"/>

      {/* dikey askı çubukları */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 184 + i * 11;
        const dropY = 70 + Math.abs(Math.sin((i / 17) * Math.PI)) * 78;
        return <line key={i} x1={x} y1={dropY} x2={x} y2={156} stroke="#5D2E2E" strokeWidth="0.8" opacity=".75"/>;
      })}

      {/* köprü ışıkları */}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={130 + i*24} cy={155} r="1.4" fill="#FFD059"/>
      ))}
    </g>

    {/* Tekneler */}
    <g transform="translate(80, 184)">
      <path d="M0 0 L36 0 L30 8 L6 8 Z" fill="#FAF6EC" stroke="#3E2723" strokeWidth="1"/>
      <rect x="10" y="-8" width="14" height="8" fill="#C62828"/>
    </g>
    <g transform="translate(490, 188)">
      <path d="M0 0 L28 0 L24 6 L4 6 Z" fill="#FAF6EC" stroke="#3E2723" strokeWidth="1"/>
      <rect x="9" y="-6" width="10" height="6" fill="#1976D2"/>
    </g>
  </svg>
);

/* ========== DOĞU ANADOLU — karlı dağlar, Ağrı Dağı (çift zirve), koyun ========== */
const RegionSceneDoguAnadolu = () => (
  <svg viewBox="0 0 600 220" width="100%">
    <defs>
      <linearGradient id="daSky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#9CC4D9"/>
        <stop offset="1" stopColor="#D8E7EF"/>
      </linearGradient>
      <linearGradient id="daSnow" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF"/>
        <stop offset="1" stopColor="#C8DAE6"/>
      </linearGradient>
    </defs>
    <rect width="600" height="220" fill="url(#daSky)"/>

    {/* Soluk güneş */}
    <circle cx="100" cy="50" r="22" fill="#FAF6EC" opacity=".55"/>
    <circle cx="100" cy="50" r="14" fill="#FFE08A" opacity=".75"/>

    {/* Uzak buz mavisi sıradağlar */}
    <path d="M0 120 L60 80 L110 110 L180 70 L240 105 L320 75 L380 110 L460 80 L520 110 L600 85 L600 130 L0 130 Z"
          fill="#7896AC" opacity=".7"/>

    {/* Kar kaplı orta sıradağlar */}
    <path d="M0 145 L70 95 L130 130 L190 90 L250 130 L330 95 L390 130 L470 100 L540 132 L600 110 L600 165 L0 165 Z"
          fill="#5C7385"/>
    {/* Kar sırtları */}
    <path d="M0 145 L70 95 L130 130 L190 90 L250 130 L330 95 L390 130 L470 100 L540 132 L600 110"
          fill="none" stroke="#FFFFFF" strokeWidth="3" opacity=".85"/>

    {/* Ağrı Dağı — büyük çift zirveli */}
    <g transform="translate(280, 40)">
      {/* büyük zirve */}
      <path d="M0 130 L70 0 L140 130 Z" fill="#5C7385"/>
      <path d="M0 130 L70 0 L140 130 Z" fill="#3F5566" opacity=".5"/>
      {/* kar kaplı tepe */}
      <path d="M40 60 L70 0 L100 60 L88 70 L78 58 L62 72 L52 60 Z" fill="url(#daSnow)"/>
      {/* küçük zirve (yandaki) */}
      <path d="M88 130 L130 30 L190 130 Z" fill="#506B7E"/>
      <path d="M88 130 L130 30 L190 130 Z" fill="#3F5566" opacity=".4"/>
      <path d="M115 70 L130 30 L150 70 L142 80 L130 70 L120 78 Z" fill="url(#daSnow)"/>
    </g>

    {/* Ön yayla / kar sahası */}
    <path d="M0 170 Q150 158 300 168 Q450 180 600 165 L600 220 L0 220 Z" fill="#E1ECF2"/>
    <path d="M0 178 Q150 168 300 176 Q450 188 600 174 L600 220 L0 220 Z" fill="#C8DAE6" opacity=".7"/>

    {/* Karanlık çayır lekesi (yer yer) */}
    <path d="M40 195 Q90 188 150 196 Q200 204 240 198 L240 220 L40 220 Z" fill="#7E8E5A" opacity=".55"/>
    <path d="M380 200 Q450 192 540 204 L540 220 L380 220 Z" fill="#7E8E5A" opacity=".5"/>

    {/* Kar taneleri */}
    {Array.from({ length: 26 }).map((_, i) => {
      const x = (i * 47) % 600;
      const y = (i * 23) % 130 + 10;
      return <circle key={i} cx={x} cy={y} r={1 + (i%3)*0.3} fill="#FFFFFF" opacity=".75"/>;
    })}

    {/* Koyun sürüsü */}
    {[
      { x: 110, y: 198 },
      { x: 138, y: 202 },
      { x: 162, y: 199 },
      { x: 410, y: 207 },
      { x: 440, y: 204 },
      { x: 470, y: 209 },
      { x: 500, y: 205 },
    ].map((s, i) => (
      <g key={i} transform={`translate(${s.x},${s.y})`}>
        {/* gövde */}
        <ellipse cx="0" cy="0" rx="9" ry="6" fill="#FAF6EC"/>
        <ellipse cx="-2" cy="-2" rx="3" ry="2.5" fill="#FAF6EC"/>
        {/* kafa */}
        <ellipse cx="7" cy="-2" rx="3" ry="2.5" fill="#3E2723"/>
        {/* bacaklar */}
        <line x1="-4" y1="5" x2="-4" y2="9" stroke="#3E2723" strokeWidth="1.2"/>
        <line x1="4" y1="5" x2="4" y2="9" stroke="#3E2723" strokeWidth="1.2"/>
      </g>
    ))}
  </svg>
);

/* ========== GÜNEYDOĞU — pamuk tarlaları, Atatürk Barajı, sıcak güneş ========== */
const RegionSceneGuneydogu = () => (
  <svg viewBox="0 0 600 220" width="100%">
    <defs>
      <linearGradient id="gdSky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FFC872"/>
        <stop offset="0.6" stopColor="#F09A4A"/>
        <stop offset="1" stopColor="#E0D7B4"/>
      </linearGradient>
      <linearGradient id="gdGround" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#C99A5B"/>
        <stop offset="1" stopColor="#8E6131"/>
      </linearGradient>
      <linearGradient id="gdWater" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#3E8DC1"/>
        <stop offset="1" stopColor="#1F5C8A"/>
      </linearGradient>
    </defs>
    <rect width="600" height="220" fill="url(#gdSky)"/>

    {/* Sıcak güneş — büyük, parlak */}
    <circle cx="490" cy="62" r="50" fill="#FFD059" opacity=".4"/>
    <circle cx="490" cy="62" r="36" fill="#FFB04A"/>
    <circle cx="490" cy="62" r="24" fill="#FF8A2F"/>
    {/* güneş ışınları */}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * 30) * Math.PI / 180;
      const x1 = 490 + Math.cos(a) * 42;
      const y1 = 62 + Math.sin(a) * 42;
      const x2 = 490 + Math.cos(a) * 56;
      const y2 = 62 + Math.sin(a) * 56;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                   stroke="#FFB04A" strokeWidth="2" opacity=".55" strokeLinecap="round"/>;
    })}

    {/* Uzak kuru tepeler */}
    <path d="M0 130 Q80 110 160 128 Q230 142 300 125 Q380 108 460 130 Q540 144 600 128 L600 155 L0 155 Z"
          fill="#9C7B45" opacity=".7"/>

    {/* Baraj duvarı (Atatürk Barajı tarzı — eğimli, geniş) */}
    <g transform="translate(0, 110)">
      {/* Barajın sol kanadı */}
      <path d="M0 0 L120 50 L240 30 L240 60 L0 60 Z" fill="#9C7B45"/>
      {/* Baraj duvarı (gri, betonarme) */}
      <path d="M120 50 L240 30 L300 32 L380 50 L380 60 L120 60 Z" fill="#6F6F6F"/>
      <path d="M120 50 L240 30 L300 32 L380 50" fill="none" stroke="#3E2723" strokeWidth="1.5"/>
      {/* baraj üstü çizgileri */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={130 + i*22} y1={48 - (i<5 ? i*1.2 : 0)} x2={130 + i*22} y2={60}
              stroke="#3E2723" strokeWidth="0.6" opacity=".5"/>
      ))}
      {/* baraj suyu sağda — gölet */}
      <path d="M380 50 Q480 38 600 50 L600 60 L380 60 Z" fill="url(#gdWater)"/>
      {/* su yansımaları */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={400 + i*24} y1={54} x2={416 + i*24} y2={54}
              stroke="#BBDEFB" strokeWidth="1" opacity=".7"/>
      ))}
      {/* kapakçık-su akışı */}
      <rect x="180" y="42" width="14" height="18" fill="#1F5C8A"/>
      <path d="M180 60 Q186 70 194 60" fill="#3E8DC1" opacity=".7"/>
    </g>

    {/* Kuru toprak / pamuk tarlası */}
    <path d="M0 220 L0 170 Q150 158 300 168 Q450 178 600 168 L600 220 Z" fill="url(#gdGround)"/>

    {/* Tarla sıraları */}
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i}
            d={`M0 ${182 + i*7} Q300 ${176 + i*7} 600 ${180 + i*7}`}
            fill="none" stroke="#5D3A1A" strokeWidth="1" opacity=".4"/>
    ))}

    {/* Pamuk demetleri */}
    {Array.from({ length: 32 }).map((_, i) => {
      const x = 18 + i * 18 + (i%3)*3;
      const y = 188 + (i%4) * 8;
      return (
        <g key={i} transform={`translate(${x},${y})`}>
          {/* dal */}
          <line x1="0" y1="0" x2="0" y2="6" stroke="#5D3A1A" strokeWidth="1"/>
          <line x1="0" y1="3" x2="-3" y2="-1" stroke="#5D3A1A" strokeWidth="0.8"/>
          <line x1="0" y1="3" x2="3" y2="-1" stroke="#5D3A1A" strokeWidth="0.8"/>
          {/* pamuk topu (4 lobe) */}
          <circle cx="-2" cy="-1" r="2.6" fill="#FAF6EC"/>
          <circle cx="2" cy="-1" r="2.6" fill="#FAF6EC"/>
          <circle cx="0" cy="-3" r="2.6" fill="#FFFFFF"/>
          <circle cx="0" cy="0" r="2.6" fill="#F0E8D0"/>
        </g>
      );
    })}
  </svg>
);

/* ========== Master component ========== */
const RegionScene = ({ region }) => {
  switch (region) {
    case 'karadeniz':   return <RegionSceneKaradenizScene/>;
    case 'akdeniz':     return <RegionSceneAkdeniz/>;
    case 'icanadolu':   return <RegionSceneIcAnadolu/>;
    case 'ege':         return <RegionSceneEge/>;
    case 'marmara':     return <RegionSceneMarmara/>;
    case 'doguanadolu': return <RegionSceneDoguAnadolu/>;
    case 'guneydogu':   return <RegionSceneGuneydogu/>;
    default:            return <RegionSceneKaradenizScene/>;
  }
};

/* RegionSceneKaradeniz, components.jsx'te zaten "RegionSceneKaradeniz" adıyla
   tanımlandığı için burada onu yeniden export etmiyoruz. window.RegionSceneKaradeniz
   önceden tanımlı kalır. Master <RegionScene/> her durumda yerel ("scene") versiyonu
   kullanır; iki implementasyon birebir aynıdır. */

Object.assign(window, {
  RegionScene,
  RegionSceneAkdeniz,
  RegionSceneIcAnadolu,
  RegionSceneEge,
  RegionSceneMarmara,
  RegionSceneDoguAnadolu,
  RegionSceneGuneydogu,
});
