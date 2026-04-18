'use client';

import {
  useState, useRef, useCallback, useEffect,
  type MouseEvent, type TouchEvent,
} from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Props {
  images: string[];
  productName: string;
}

// ─── Distance entre deux doigts ──────────────────────────────────────────────
function dist(a: { clientX: number; clientY: number }, b: { clientX: number; clientY: number }) {
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LIGHTBOX FULLSCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function Lightbox({
  images, activeIdx, onClose, onNext, onPrev,
}: {
  images: string[]; activeIdx: number;
  onClose: () => void; onNext: () => void; onPrev: () => void;
}) {
  const [scale, setScale]   = useState(1);
  const [pan, setPan]       = useState({ x: 0, y: 0 });
  const touchRef            = useRef({ startX: 0, startY: 0, panX: 0, panY: 0, dist: 0, baseScale: 1, fingers: 0 });
  const lastTap             = useRef(0);

  const resetZoom = useCallback(() => { setScale(1); setPan({ x: 0, y: 0 }); }, []);
  const next = () => { resetZoom(); onNext(); };
  const prev = () => { resetZoom(); onPrev(); };
  const toggleZoom = () => scale > 1 ? resetZoom() : setScale(2.5);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]); // eslint-disable-line react-hooks/exhaustive-deps

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => {
      const n = e.deltaY < 0 ? Math.min(s * 1.15, 6) : Math.max(s / 1.15, 1);
      if (n <= 1) setPan({ x: 0, y: 0 });
      return n;
    });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = touchRef.current;
    t.fingers = e.touches.length;
    if (e.touches.length === 1) {
      t.startX = e.touches[0].clientX; t.startY = e.touches[0].clientY;
      t.panX = pan.x; t.panY = pan.y;
      const now = Date.now();
      if (now - lastTap.current < 280) toggleZoom();
      lastTap.current = now;
    }
    if (e.touches.length === 2) {
      t.dist = dist(e.touches[0], e.touches[1]);
      t.baseScale = scale;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = touchRef.current;
    if (e.touches.length === 2) {
      const d = dist(e.touches[0], e.touches[1]);
      const n = Math.min(Math.max(t.baseScale * (d / t.dist), 1), 6);
      setScale(n);
      if (n <= 1) setPan({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && scale > 1) {
      setPan({ x: t.panX + e.touches[0].clientX - t.startX, y: t.panY + e.touches[0].clientY - t.startY });
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const t = touchRef.current;
    if (t.fingers === 1 && scale <= 1) {
      const dx = (e.changedTouches[0]?.clientX ?? t.startX) - t.startX;
      if (Math.abs(dx) > 55) dx < 0 ? next() : prev();
    }
    if (scale <= 1) setPan({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center select-none">

      {/* Fermer */}
      <button onClick={onClose}
        className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition backdrop-blur-sm"
        aria-label="Fermer">
        <X className="h-6 w-6" />
      </button>

      {/* Compteur */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white/80 text-sm px-4 py-1.5 rounded-full backdrop-blur-sm z-10">
        {activeIdx + 1} / {images.length}
      </div>

      {/* Flèches */}
      {images.length > 1 && (<>
        <button onClick={e => { e.stopPropagation(); prev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 backdrop-blur-sm transition">
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button onClick={e => { e.stopPropagation(); next(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 backdrop-blur-sm transition">
          <ChevronRight className="h-7 w-7" />
        </button>
      </>)}

      {/* Contrôles zoom */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <button onClick={() => setScale(s => Math.max(s / 1.3, 1))} disabled={scale <= 1}
          className="bg-white/10 hover:bg-white/25 disabled:opacity-30 text-white rounded-full p-2.5 backdrop-blur-sm transition">
          <ZoomOut className="h-5 w-5" />
        </button>
        <span className="text-white/60 text-xs w-12 text-center tabular-nums">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(s * 1.3, 6))} disabled={scale >= 6}
          className="bg-white/10 hover:bg-white/25 disabled:opacity-30 text-white rounded-full p-2.5 backdrop-blur-sm transition">
          <ZoomIn className="h-5 w-5" />
        </button>
        {scale > 1 && (
          <button onClick={resetZoom}
            className="bg-white/10 hover:bg-white/25 text-white text-xs px-3 py-2 rounded-full backdrop-blur-sm transition">
            Réinitialiser
          </button>
        )}
      </div>

      {/* Image zoomable */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={onWheel}
        onDoubleClick={toggleZoom}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        style={{ touchAction: scale > 1 ? 'none' : 'pan-y', cursor: scale > 1 ? 'grab' : 'zoom-in' }}
      >
        <div style={{
          transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
          transition: scale === 1 ? 'transform 0.3s ease' : 'none',
          willChange: 'transform',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIdx]}
            alt={`${activeIdx + 1}`}
            draggable={false}
            style={{ maxWidth: '88vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 8, display: 'block', pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* Miniatures en bas dans la lightbox */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20 max-w-xs overflow-x-auto px-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => { resetZoom(); setActiveIdx(i); }}
              className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === activeIdx ? 'border-[#D4A418] scale-110' : 'border-white/20 opacity-60 hover:opacity-100'}`}
              style={{ width: 44, height: 44 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // helper pour activeIdx dans lightbox (besoin de setter)
  function setActiveIdx(i: number) { onClose(); /* handled by parent */ void i; }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GALERIE PRINCIPALE — style Amazon
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProductImageViewer({ images, productName }: Props) {
  const [activeIdx, setActiveIdx]     = useState(0);
  const [lightboxOpen, setLightbox]   = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Zoom Amazon : position de la lentille
  const [lensPos, setLensPos]   = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const mainRef                 = useRef<HTMLDivElement>(null);

  // Swipe mobile (galerie)
  const swipe = useRef({ startX: 0, startY: 0 });

  const goNext = useCallback(() => setActiveIdx(i => (i + 1) % images.length), [images.length]);
  const goPrev = useCallback(() => setActiveIdx(i => (i - 1 + images.length) % images.length), [images.length]);

  const openLightbox = (idx: number) => { setLightboxIdx(idx); setLightbox(true); };

  // ─── Zoom Amazon : suivi souris ───────────────────────────────────────────
  const ZOOM_FACTOR = 2.5;
  const LENS = 120; // taille lentille px

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = mainRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(Math.max(e.clientX - rect.left, LENS / 2), rect.width  - LENS / 2);
    const y = Math.min(Math.max(e.clientY - rect.top,  LENS / 2), rect.height - LENS / 2);
    setLensPos({ x, y });
  };

  // Ratio pour afficher la bonne portion dans le panneau de droite
  const zoomBgX = lensPos.x && mainRef.current
    ? (lensPos.x / mainRef.current.offsetWidth)  * 100
    : 50;
  const zoomBgY = lensPos.y && mainRef.current
    ? (lensPos.y / mainRef.current.offsetHeight) * 100
    : 50;

  // ─── Swipe mobile ─────────────────────────────────────────────────────────
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    swipe.current.startX = e.touches[0].clientX;
    swipe.current.startY = e.touches[0].clientY;
  };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const dx = e.changedTouches[0].clientX - swipe.current.startX;
    const dy = e.changedTouches[0].clientY - swipe.current.startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? goNext() : goPrev();
  };

  const img = images[activeIdx] ?? '';

  return (
    <div className="w-full">
      <div className="flex gap-4">

        {/* ── Miniatures verticales (desktop) ─────────────────────────────── */}
        {images.length > 1 && (
          <div className="hidden sm:flex flex-col gap-2 w-[72px] flex-shrink-0">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                onMouseEnter={() => setActiveIdx(i)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all duration-150 bg-white ${
                  i === activeIdx
                    ? 'border-[#B8860B] shadow-md shadow-amber-200/60 scale-[1.04]'
                    : 'border-gray-200 hover:border-[#B8860B]/60 opacity-75 hover:opacity-100'
                }`}
                style={{ width: 72, height: 72 }}
                aria-label={`Image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${productName} - vue ${i + 1}`}
                  fill
                  sizes="72px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}

        {/* ── Image principale + zoom Amazon ──────────────────────────────── */}
        <div className="flex-1 relative">
          {/* Image principale */}
          <div
            ref={mainRef}
            className="relative bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden cursor-zoom-in"
            style={{ aspectRatio: '1 / 1' }}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onClick={() => openLightbox(activeIdx)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              key={img}
              src={img}
              alt={`${productName} - Image ${activeIdx + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6 transition-opacity duration-300"
              priority={activeIdx === 0}
            />

            {/* Lentille zoom */}
            {showZoom && (
              <div
                className="absolute border-2 border-[#B8860B]/50 bg-[#B8860B]/10 rounded pointer-events-none z-10"
                style={{
                  width:  LENS,
                  height: LENS,
                  left:   lensPos.x - LENS / 2,
                  top:    lensPos.y - LENS / 2,
                }}
              />
            )}

            {/* Boutons nav desktop */}
            {images.length > 1 && (<>
              <button
                onClick={e => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 hover:opacity-100 transition z-20"
                aria-label="Précédente">
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 hover:opacity-100 transition z-20"
                aria-label="Suivante">
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </button>
            </>)}

            {/* Indicateur zoom */}
            <div className="absolute bottom-2 right-2 bg-black/30 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 select-none z-10">
              <ZoomIn className="h-3 w-3" />
              Zoom
            </div>

            {/* Points pagination mobile */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden z-10">
                {images.map((_, i) => (
                  <span key={i}
                    className={`rounded-full transition-all ${i === activeIdx ? 'w-5 h-1.5 bg-[#B8860B]' : 'w-1.5 h-1.5 bg-gray-300'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Panneau zoom Amazon (à droite, desktop) ─────────────────── */}
          {showZoom && mainRef.current && (
            <div
              className="hidden lg:block absolute top-0 left-[calc(100%+16px)] z-50 rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white"
              style={{
                width:  mainRef.current.offsetWidth * 0.95,
                height: mainRef.current.offsetHeight * 0.95,
                backgroundImage:    `url(${img})`,
                backgroundSize:     `${ZOOM_FACTOR * 100}%`,
                backgroundPosition: `${zoomBgX}% ${zoomBgY}%`,
                backgroundRepeat:   'no-repeat',
              }}
              aria-hidden
            />
          )}
        </div>
      </div>

      {/* ── Miniatures horizontales mobile ────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-1 snap-x snap-mandatory">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all snap-start bg-white ${
                i === activeIdx
                  ? 'border-[#B8860B] shadow-md scale-[1.05]'
                  : 'border-gray-200 opacity-70'
              }`}
              style={{ width: 64, height: 64 }}
              aria-label={`Image ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* ── Texte aide ────────────────────────────────────────────────────── */}
      <p className="hidden sm:block text-[11px] text-gray-400 mt-2 text-center select-none">
        Survolez pour zoomer · Cliquez pour agrandir en plein écran
      </p>
      <p className="sm:hidden text-[11px] text-gray-400 mt-2 text-center select-none">
        Glissez pour changer · Appuyez pour agrandir
      </p>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          activeIdx={lightboxIdx}
          onClose={() => setLightbox(false)}
          onNext={() => setLightboxIdx(i => (i + 1) % images.length)}
          onPrev={() => setLightboxIdx(i => (i - 1 + images.length) % images.length)}
        />
      )}
    </div>
  );
}
