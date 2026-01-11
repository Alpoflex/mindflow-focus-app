'use client';

import { useState, useRef } from "react";
import { CloudRain, Coffee, Waves, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// Daha güvenilir ses kaynakları (placeholder olarak)
const SOUND_URLS = {
    rain: "https://assets.mixkit.co/active_storage/sfx/1109/1109-preview.mp3", // FIXME check mixkit url
    // Rain icin baska bir url deneyelim, user 'ding' diyor dedi
    // Asagidaki url 'Heavy rain' sesi
    rain_new: "https://cdn.pixabay.com/audio/2022/02/16/audio_d144e05d27.mp3",
    cafe: "https://cdn.pixabay.com/audio/2022/03/24/audio_3cb7c0500f.mp3", // Cafe ambiance
    waves: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0d52ef72f.mp3", // Ocean waves
};

export default function AmbientPlayer() {
    const { t } = useLanguage();
    const [playing, setPlaying] = useState<string | null>(null);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const sounds = [
        { id: "rain", name: t.sounds.rain, icon: CloudRain, url: SOUND_URLS.rain_new },
        { id: "cafe", name: t.sounds.cafe, icon: Coffee, url: SOUND_URLS.cafe },
        { id: "waves", name: t.sounds.waves, icon: Waves, url: SOUND_URLS.waves },
    ];

    const toggleSound = (soundId: string, url: string) => {
        if (playing === soundId) {
            audioRef.current?.pause();
            setPlaying(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.volume = volume;
                audioRef.current.play();
                audioRef.current.loop = true;
            }
            setPlaying(soundId);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (audioRef.current) {
            audioRef.current.volume = newVol;
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 glass rounded-full shadow-2xl z-50">
            <audio ref={audioRef} />

            {sounds.map((sound) => (
                <button
                    key={sound.id}
                    onClick={() => toggleSound(sound.id, sound.url)}
                    className={cn(
                        "p-3 rounded-full transition-all duration-300 relative group",
                        playing === sound.id
                            ? "bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                    )}
                    title={sound.name}
                >
                    <sound.icon size={20} />
                    {playing === sound.id && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-black animate-pulse" />
                    )}
                </button>
            ))}

            <div className="w-px h-6 bg-white/10 mx-2" />

            <div className="flex items-center gap-2 px-2 group">
                <button
                    onClick={() => {
                        if (volume > 0) handleVolumeChange({ target: { value: "0" } } as any)
                        else handleVolumeChange({ target: { value: "0.5" } } as any)
                    }}
                    className="text-white/60 hover:text-white"
                >
                    {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-125 hover:bg-white/30 transition-all"
                />
            </div>
        </div>
    );
}
