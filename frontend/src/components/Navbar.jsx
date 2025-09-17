import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { User, Volume2, VolumeX } from 'lucide-react';

const navItems = ["Home", "About", "Features", "Feedback", "Contact"];

const NavBar = ({ onNavigateToProfile }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const { y: currentScrollY } = useWindowScroll();

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (audioElementRef.current) {
      if (isAudioPlaying) {
        audioElementRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      if (navContainerRef.current) {
        navContainerRef.current.classList.remove("floating-nav");
      }
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      if (navContainerRef.current) {
        navContainerRef.current.classList.add("floating-nav");
      }
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      if (navContainerRef.current) {
        navContainerRef.current.classList.add("floating-nav");
      }
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    if (navContainerRef.current) {
      gsap.to(navContainerRef.current, {
        y: isNavVisible ? 0 : -100,
        opacity: isNavVisible ? 1 : 0,
        duration: 0.2,
      });
    }
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className={clsx(
        "fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700",
        "sm:inset-x-6"
      )}
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo */}
          <div id=" home" className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <img src="/img/logo.png" alt="Logo" className="w-20 h-20 object-contain" />

            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              ByteBrigade
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex h-full items-center">
            <div className="ml-10 flex h-full items-center space-x-6">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn relative text-white transition-colors hover:text-blue-300"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Audio Toggle (Desktop) */}
            <button
              onClick={toggleAudioIndicator}
              className="ml-6 p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              {isAudioPlaying ? (
                <Volume2 className="w-5 h-5 text-white" />
              ) : (
                <VolumeX className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Profile Button (Desktop) */}
            {onNavigateToProfile && (
              <button
                onClick={onNavigateToProfile}
                className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:block">Team Builder</span>
              </button>
            )}
          </div>

          {/* Mobile Right-side Actions */}
          <div className="flex items-center gap-3 sm:hidden">
            {/* Music Button (Mobile) */}
            <button
              onClick={toggleAudioIndicator}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              {isAudioPlaying ? (
                <Volume2 className="w-5 h-5 text-white" />
              ) : (
                <VolumeX className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Profile Button (Mobile) */}
            {onNavigateToProfile && (
              <button
                onClick={onNavigateToProfile}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
              </button>
            )}
          </div>


          {/* Audio Element */}
          <audio
            ref={audioElementRef}
            className="hidden"
            src="/audio/loop.mp3"
            loop
          />
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
