"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

const Section: React.FC<{
  video: string;
  tag: string;
  title: string;
  description: string;
}> = ({ video, tag, title, description }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "10%"]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.play().catch(() => {});
  }, []);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden text-white"
    >
      {/* Parallax video background */}
      <motion.div
        className="absolute w-full h-[120%] -z-10"
        style={{ top: y }}
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <video
          ref={videoRef}
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>

      {/* Text content — left aligned */}
      <div className="flex flex-col justify-end h-full pb-20 px-6 sm:px-12 md:px-20 lg:px-24">
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="uppercase tracking-[0.2em] text-[10px] sm:text-xs text-white/70 font-light">
            {tag}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-[50ch] leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Controls — bottom left */}
      <div className="absolute bottom-6 left-6 sm:left-12 md:left-20 lg:left-24 flex items-center gap-3 z-20">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
        >
          {isPlaying ? (
            /* Pause icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25zm7 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V5.25z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            /* Play icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 translate-x-px"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Mute / Unmute */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
        >
          {isMuted ? (
            /* Muted icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72z" />
            </svg>
          ) : (
            /* Unmuted icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06z" />
              <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06z" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
};

export default Section;