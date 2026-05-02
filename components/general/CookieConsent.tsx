"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getConsent, setConsent } from "@/lib/consent";
import { enableScripts } from "@/lib/enableScripts";

export default function CookieConsent() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (!consent) setVisible(true);
  }, []);

  useEffect(() => {
    if (visible && container.current) {
      gsap.fromTo(
        container.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
      );
    }
  }, [visible]);

  const closeBanner = () => {
    if (!container.current) return;

    gsap.to(container.current, {
      y: 100,
      opacity: 0,
      duration: 0.6,
      ease: "power4.in",
      onComplete: () => setVisible(false),
    });
  };

  const acceptAll = () => {
    setConsent({
      essential: true,
      analytics: true,
      marketing: true,
    });

    enableScripts({ analytics: true, marketing: true });
    closeBanner();
  };

  const savePreferences = () => {
    setConsent({
      essential: true,
      analytics,
      marketing,
    });

    enableScripts({ analytics, marketing });
    closeBanner();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center px-4 pb-6">
      <div
        ref={container}
        className="w-full max-w-4xl rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-6 text-white"
      >
        {!showSettings ? (
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <p className="text-sm opacity-80 text-gray-900">
              We use cookies to improve your experience and power features like
              secure checkout and analytics.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 border border-white/30 rounded-lg"
              >
                Customize
              </button>

              <button
                onClick={acceptAll}
                className="px-4 py-2 bg-white text-black rounded-lg font-medium"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cookie Preferences</h3>

            <div className="flex justify-between">
              <span>Analytics</span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
            </div>

            <div className="flex justify-between">
              <span>Marketing</span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-white/30 rounded-lg"
              >
                Back
              </button>

              <button
                onClick={savePreferences}
                className="px-4 py-2 bg-white text-black rounded-lg"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}