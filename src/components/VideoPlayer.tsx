"use client";

import { useState, useRef, useEffect } from "react";
import { PlayCircle, Pause, Volume2, VolumeX } from "lucide-react";

// ============================================
// PROPS INTERFACE
// ============================================
interface VideoPlayerProps {
  src: string;                    // URL de la vidéo (MP4 ou YouTube)
  poster?: string;                // Image de couverture
  title?: string;                 // Titre affiché au-dessus
  subtitle?: string;              // Sous-titre optionnel
  autoPlay?: boolean;             // Lecture automatique
  loop?: boolean;                 // Boucle
  muted?: boolean;                // Son coupé par défaut
  showControls?: boolean;         // Afficher les contrôles personnalisés
  className?: string;             // Classes CSS additionnelles
  isYouTube?: boolean;            // Si true, traite src comme URL YouTube
}

// ============================================
// COMPOSANT VIDEO PLAYER RÉUTILISABLE
// ============================================
export default function VideoPlayer({
  src,
  poster,
  title,
  subtitle,
  autoPlay = true,
  loop = true,
  muted = true,
  showControls = true,
  className = "",
  isYouTube = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showPlayButton, setShowPlayButton] = useState(!autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Gestion lecture/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowPlayButton(false);
    }
  };

  // Gestion son
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-play au chargement
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // L'autoplay peut être bloqué par le navigateur
        setShowPlayButton(true);
        setIsPlaying(false);
      });
    }
  }, [autoPlay]);

  // Si c'est une vidéo YouTube
  if (isYouTube) {
    // Extraire l'ID YouTube de l'URL
    const getYouTubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(src);
    
    if (!videoId) {
      return (
        <div className={`video-player-error ${className}`}>
          <p className="text-red-500">URL YouTube invalide</p>
        </div>
      );
    }

    return (
      <div className={`video-player-container ${className}`}>
        {title && (
          <h3 className="video-title text-xl font-bold text-gray-900 mb-2">{title}</h3>
        )}
        {subtitle && (
          <p className="video-subtitle text-gray-600 mb-4">{subtitle}</p>
        )}
        <div className="video-wrapper relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${videoId}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || "Vidéo"}
          />
        </div>
      </div>
    );
  }

  // Vidéo MP4 native
  return (
    <div className={`video-player-container ${className}`}>
      {title && (
        <h3 className="video-title text-xl font-bold text-gray-900 mb-2">{title}</h3>
      )}
      {subtitle && (
        <p className="video-subtitle text-gray-600 mb-4">{subtitle}</p>
      )}
      
      <div className="video-wrapper relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black group">
        {/* Élément vidéo */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Bouton Play central */}
        {showPlayButton && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
            aria-label="Lire la vidéo"
          >
            <div className="w-20 h-20 rounded-full bg-[#D4A418]/90 flex items-center justify-center backdrop-blur-sm transform hover:scale-110 transition-transform">
              <PlayCircle className="h-10 w-10 text-black" />
            </div>
          </button>
        )}
        
        {/* Contrôles personnalisés */}
        {showControls && (
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Bouton Mute */}
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center backdrop-blur-sm transition-colors"
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </button>
            
            {/* Bouton Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center backdrop-blur-sm transition-colors"
              aria-label={isPlaying ? "Pause" : "Lire"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <PlayCircle className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// SECTION VIDÉO SHOWCASE (PAGE D'ACCUEIL)
// ============================================
export function VideoShowcaseSection() {
  // ==========================================
  // 🔧 CONFIGURATION DES VIDÉOS
  // Remplacez les URLs ci-dessous par vos vraies vidéos
  // ==========================================
  const mainVideo = {
    src: "https://aigc-files.bigmodel.cn/api/cogvideo/c62a175e-1f1e-11f1-a4db-02e07114cd92_0.mp4", // 🔴 URL de la vidéo principale
    poster: "/Luxury Big Window AG Glass Matte.jpeg", // 🔴 Image de couverture
    title: "Découvrez la Coque AG Glass Premium",
  };

  const thumbnailVideos = [
    {
      src: "https://aigc-files.bigmodel.cn/api/cogvideo/5796cab0-1f20-11f1-913a-f2c33534665f_0.mp4", // 🔴 Vidéo 1
      poster: "/blanche.jpg",
      label: "Montre Richard Mille",
    },
    {
      src: "https://aigc-files.bigmodel.cn/api/cogvideo/6bf984ac-1f20-11f1-913a-f2c33534665f_0.mp4", // 🔴 Vidéo 2
      poster: "/precious duke.jpg",
      label: "Montre Cartier",
    },
    {
      src: "https://aigc-files.bigmodel.cn/api/cogvideo/c62a175e-1f1e-11f1-a4db-02e07114cd92_0.mp4", // 🔴 Vidéo 3
      poster: "/Luxury Big Window AG Glass Matte.jpeg",
      label: "Coque AG Glass",
    },
  ];

  return (
    <section className="video-showcase-section py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4A418]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B8860B]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-4 py-1.5 bg-[#D4A418]/20 text-[#D4A418] border border-[#D4A418]/30 rounded-full text-sm font-medium">
            🎬 Vidéos Produits
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Découvrez nos <span className="text-[#D4A418]">produits en vidéo</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Voyez la qualité de nos montres et accessoires en action. 
            Des vidéos professionnelles pour vous rassurer avant votre achat à Conakry.
          </p>
        </div>

        {/* Main Video Player */}
        <div className="max-w-4xl mx-auto mb-12">
          <VideoPlayer
            src={mainVideo.src}
            poster={mainVideo.poster}
            title={mainVideo.title}
            autoPlay={true}
            loop={true}
            muted={true}
            showControls={true}
            className="video-main"
          />
        </div>

        {/* Thumbnail Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {thumbnailVideos.map((video, index) => (
            <div key={index} className="video-thumbnail group cursor-pointer">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 shadow-lg border border-[#D4A418]/20 hover:border-[#D4A418]/50 transition-all">
                <video
                  src={video.src}
                  poster={video.poster}
                  autoPlay={index === 0}
                  loop={true}
                  muted={true}
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-medium text-sm">{video.label}</p>
                </div>
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#D4A418]/90 flex items-center justify-center">
                    <PlayCircle className="h-6 w-6 text-black" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// BLOC VIDÉO POUR FICHE PRODUIT AG GLASS
// ============================================
export function ProductVideoBlock({ 
  videoSrc, 
  posterSrc 
}: { 
  videoSrc: string; 
  posterSrc: string;
}) {
  return (
    <div className="product-video-block">
      {/* Titre de la section vidéo */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-[#B8860B]" />
          Voir la coque AG Glass en vidéo
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Découvrez la protection premium en action et la qualité de fabrication
        </p>
      </div>

      {/* Lecteur vidéo */}
      <div className="video-wrapper relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-lg group">
        <video
          src={videoSrc}
          poster={posterSrc}
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline
          controls
          className="w-full h-full object-cover"
        />
      </div>

      {/* Texte descriptif sous la vidéo */}
      <div className="mt-4 p-4 bg-[#FFF9E6] rounded-lg border border-[#D4A418]/20">
        <p className="text-gray-700 text-sm">
          <strong className="text-[#B8860B]">✓ Qualité vérifiée :</strong> Cette vidéo montre la véritable coque AG Glass Premium. 
          Vous pouvez voir la finesse du design, la solidité de la protection et la finition matte anti-traces. 
          Commandez en toute confiance avec paiement à la livraison à Conakry.
        </p>
      </div>
    </div>
  );
}
