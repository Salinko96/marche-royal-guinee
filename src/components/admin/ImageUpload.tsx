'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImagePlus, ChevronLeft, ChevronRight, Film, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

interface FileStatus {
  file: File;
  state: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm';
const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

const BLOB_API_VERSION = '12';

function isVideo(url: string) {
  return /\.(mp4|mov|webm)(\?|$)/i.test(url);
}

/**
 * Upload un fichier directement vers Vercel Blob via XHR
 * Contourne la limite 4.5MB des fonctions serverless Vercel
 */
async function uploadToBlob(
  file: File,
  onProgress: (pct: number) => void,
  signal?: AbortSignal
): Promise<string> {
  // 1. Obtenir un token signé depuis notre serveur (sans envoyer le fichier)
  const tokenRes = await fetch(
    `/api/admin/upload?filename=${encodeURIComponent(file.name)}`,
    { credentials: 'include', signal }
  );

  if (!tokenRes.ok) {
    let errMsg = `Erreur serveur (HTTP ${tokenRes.status})`;
    try {
      const errJson = await tokenRes.json();
      errMsg = errJson.error || errMsg;
    } catch { /* réponse non-JSON */ }
    throw new Error(errMsg);
  }

  const { token, pathname, uploadUrl } = await tokenRes.json() as {
    token: string;
    pathname: string;
    uploadUrl: string;
  };

  if (!token || !uploadUrl) {
    throw new Error('Réponse token invalide depuis le serveur');
  }

  console.log('[Upload] Token obtenu, envoi vers Vercel Blob:', pathname);

  // 2. Upload direct navigateur → Vercel Blob via XHR (avec vraie progression)
  return new Promise<string>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Annulé', 'AbortError'));
      return;
    }

    const xhr = new XMLHttpRequest();
    const storeId = token.split('_')[3] ?? '';
    const requestId = `${storeId}:${Date.now()}:${Math.random().toString(16).slice(2)}`;

    // Suivi de la progression réelle
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && e.total > 0) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(pct);
      }
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as { url?: string };
          if (data.url) {
            onProgress(100);
            resolve(data.url);
          } else {
            reject(new Error('URL manquante dans la réponse Vercel Blob'));
          }
        } catch {
          reject(new Error(`Réponse invalide (HTTP ${xhr.status})`));
        }
      } else {
        let detail = `HTTP ${xhr.status}`;
        try {
          const errData = JSON.parse(xhr.responseText) as { error?: { message?: string } };
          detail = errData?.error?.message ?? detail;
        } catch { /* ignore */ }
        reject(new Error(`Upload échoué: ${detail}`));
      }
    };

    xhr.onerror = () => reject(new Error('Erreur réseau lors de l\'upload'));
    xhr.ontimeout = () => reject(new Error('Timeout upload (> 5 min)'));

    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new DOMException('Annulé', 'AbortError'));
      });
    }

    xhr.open('PUT', uploadUrl, true);
    xhr.timeout = 5 * 60 * 1000; // 5 minutes max

    // Headers requis par l'API Vercel Blob
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader('x-api-version', BLOB_API_VERSION);
    xhr.setRequestHeader('x-api-blob-request-id', requestId);
    xhr.setRequestHeader('x-api-blob-request-attempt', '0');
    xhr.setRequestHeader('x-content-length', String(file.size));

    xhr.send(file);
  });
}

export default function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const updateStatus = (idx: number, patch: Partial<FileStatus>) => {
    setFileStatuses((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    // Validation immédiate côté client
    const valid = selected.filter((f) => {
      if (f.size > MAX_BYTES) {
        setGlobalError(`${f.name} dépasse 100MB`);
        return false;
      }
      return true;
    });
    if (!valid.length) return;

    const slots = images.length;
    const canAdd = maxImages - slots;
    const toUpload = valid.slice(0, canAdd);

    const initialStatuses: FileStatus[] = toUpload.map((file) => ({
      file,
      state: 'pending',
      progress: 0,
    }));

    setFileStatuses(initialStatuses);
    setUploading(true);
    setGlobalError('');

    const ac = new AbortController();
    abortRef.current = ac;

    const newUrls: string[] = [];

    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i];
      updateStatus(i, { state: 'uploading', progress: 0 });

      try {
        const url = await uploadToBlob(
          file,
          (pct) => updateStatus(i, { progress: pct }),
          ac.signal
        );
        updateStatus(i, { state: 'done', progress: 100, url });
        newUrls.push(url);
        console.log('[Upload] Succès:', url);
      } catch (err) {
        if ((err as DOMException).name === 'AbortError') break;
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[Upload] Échec:', msg);
        updateStatus(i, { state: 'error', error: msg });
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls].slice(0, maxImages));
    }

    setUploading(false);
    abortRef.current = null;
    if (inputRef.current) inputRef.current.value = '';

    // Nettoyer les statuts après 3s si tout est OK
    const allOk = initialStatuses.every((_, i) =>
      fileStatuses[i]?.state !== 'error'
    );
    if (allOk) {
      setTimeout(() => setFileStatuses([]), 3000);
    }
  };

  const retryFile = async (idx: number) => {
    const status = fileStatuses[idx];
    if (!status || status.state !== 'error') return;

    updateStatus(idx, { state: 'uploading', progress: 0, error: undefined });
    const ac = new AbortController();

    try {
      const url = await uploadToBlob(
        status.file,
        (pct) => updateStatus(idx, { progress: pct }),
        ac.signal
      );
      updateStatus(idx, { state: 'done', progress: 100, url });
      onChange([...images, url].slice(0, maxImages));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      updateStatus(idx, { state: 'error', error: msg });
    }
  };

  const cancelUpload = () => {
    abortRef.current?.abort();
    setUploading(false);
    setFileStatuses([]);
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const arr = [...images];
    const t = i + dir;
    if (t < 0 || t >= arr.length) return;
    [arr[i], arr[t]] = [arr[t], arr[i]];
    onChange(arr);
  };

  const totalProgress =
    fileStatuses.length === 0
      ? 0
      : Math.round(
          fileStatuses.reduce((sum, s) => sum + s.progress, 0) / fileStatuses.length
        );

  return (
    <div className="space-y-3">
      {/* Zone de drop */}
      <div
        onClick={() =>
          !uploading && images.length < maxImages && inputRef.current?.click()
        }
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          uploading
            ? 'border-amber-300 bg-amber-50 cursor-default'
            : images.length >= maxImages
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50 cursor-pointer'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3 text-amber-600">
            <Loader2 size={32} className="animate-spin" />
            <span className="text-sm font-semibold">
              Upload en cours… {totalProgress}%
            </span>
            <div className="w-full max-w-xs bg-amber-200 rounded-full h-2.5">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); cancelUpload(); }}
              className="text-xs text-amber-700 underline"
            >
              Annuler
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <div className="flex gap-2">
              <ImagePlus size={28} className="text-gray-300" />
              <Film size={28} className="text-gray-300" />
            </div>
            <span className="text-sm font-medium">
              Cliquer pour ajouter photos ou vidéos
            </span>
            <span className="text-xs text-gray-400">
              JPG · PNG · WebP · GIF · MP4 · MOV · WebM — max 100 MB
            </span>
            <span className="text-xs text-gray-400">
              {images.length}/{maxImages} fichiers
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={handleFiles}
        disabled={uploading || images.length >= maxImages}
      />

      {/* Erreur globale */}
      {globalError && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          <AlertCircle size={16} className="shrink-0" />
          {globalError}
        </div>
      )}

      {/* Statuts par fichier */}
      {fileStatuses.length > 0 && (
        <div className="space-y-2">
          {fileStatuses.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm border ${
                s.state === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : s.state === 'done'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
            >
              {s.state === 'done' && <CheckCircle2 size={16} className="shrink-0" />}
              {s.state === 'error' && <AlertCircle size={16} className="shrink-0" />}
              {s.state === 'uploading' && (
                <Loader2 size={16} className="shrink-0 animate-spin" />
              )}
              {s.state === 'pending' && (
                <div className="w-4 h-4 rounded-full border-2 border-current shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{s.file.name}</p>
                {s.state === 'uploading' && (
                  <div className="w-full bg-amber-200 rounded-full h-1 mt-1">
                    <div
                      className="bg-amber-500 h-1 rounded-full transition-all duration-200"
                      style={{ width: `${s.progress}%` }}
                    />
                  </div>
                )}
                {s.state === 'error' && s.error && (
                  <p className="text-xs mt-0.5 text-red-600">{s.error}</p>
                )}
              </div>

              {s.state === 'uploading' && (
                <span className="text-xs font-mono shrink-0">{s.progress}%</span>
              )}
              {s.state === 'error' && (
                <button
                  type="button"
                  onClick={() => retryFile(i)}
                  className="shrink-0 p-1 hover:bg-red-100 rounded"
                  title="Réessayer"
                >
                  <RefreshCw size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Grille de médias */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
            >
              {isVideo(src) ? (
                <video
                  src={src}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  onMouseEnter={(e) =>
                    (e.currentTarget as HTMLVideoElement).play()
                  }
                  onMouseLeave={(e) => {
                    const v = e.currentTarget as HTMLVideoElement;
                    v.pause();
                    v.currentTime = 0;
                  }}
                />
              ) : (
                <img
                  src={src}
                  alt={`Media ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                  {isVideo(src) ? '▶ Vidéo' : 'Principale'}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1 bg-white/90 rounded text-gray-700 disabled:opacity-30 hover:bg-white"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1 bg-red-500 rounded text-white hover:bg-red-600"
                >
                  <X size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  className="p-1 bg-white/90 rounded text-gray-700 disabled:opacity-30 hover:bg-white">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
          {images.length < maxImages && !uploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-amber-400 flex items-center justify-center text-gray-400 hover:text-amber-500 transition-colors"
            >
              <Upload size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
