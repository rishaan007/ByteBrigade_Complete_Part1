import gsap from "gsap";
import { useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";
import React from "react";

const FloatingImage = () => {
  const frameRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((yPos - centerY) / centerY) * -10;
    const rotateY = ((xPos - centerX) / centerX) * 10;
    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;
    if (element) {
      gsap.to(element, {
        duration: 0.3,
        rotateX: 0,
        rotateY: 0,
        ease: "power1.inOut",
      });
    }
  };

  return (
    <div id="story" className="min-h-dvh w-screen bg-black text-blue-50">
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <p className="font-general text-sm uppercase md:text-[10px]">the benifits</p>

        <div className="relative size-full">
          <AnimatedTitle
            title="<b>X</b>P G<b>a</b>ins <br />an<b>d</b> Perks"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
          />
          <div className="story-img-container">
            <div className="story-img-mask">
              <div className="story-img-content">
                <img
                  ref={frameRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  src="/img/entrance.jpg"
                  alt="entrance.jpg"
                  className="object-contain"
                />
              </div>
            </div>
            <svg
              className="invisible absolute size-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="flt_tag">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="8"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  
                            0 1 0 0 0  
                            0 0 1 0 0  
                            0 0 0 19 -9"
                    result="flt_tag"
                  />
                  <feComposite
                    in="SourceGraphic"
                    in2="flt_tag"
                    operator="atop"
                  />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        <div className="-mt-80 flex w-full justify-center md:-mt-64 md:me-44 lg:-mt-72 lg:me-72">
          <div className="flex h-full w-fit flex-col items-center ">

            {/* Responsive black separator */}
            <div className="bg-black my-6 h-2 sm:h-6 md:h-10 lg:h-24 w-full"></div>

            {/* White background scrollable section */}
            <div className="bg-white py-6 w-full">
              <div className="overflow-x-auto cursor-grab active:cursor-grabbing">
                <div className="flex animate-scroll-ltr space-x-10 w-max">
                  {[...Array(2)].map((_, idx) => (
                    <div key={idx} className="flex space-x-10">
                      <div className="p-3 rounded-lg min-w-[250px] text-black">
                        <div className="text-lg font-extrabold">🏆 Level Up Skills:</div>
                        <div className="mt-1 font-normal">
                          Complete hackathons and challenges to gain XP and rank up.
                        </div>
                      </div>
                      <div className="p-3 rounded-lg min-w-[250px] text-black">
                        <div className="text-lg font-extrabold">🛡️ Form Your Squad:</div>
                        <div className="mt-1 font-normal">
                          Team up with fellow devs for co-op coding missions.
                        </div>
                      </div>
                      <div className="p-3 rounded-lg min-w-[250px] text-black">
                        <div className="text-lg font-extrabold">🎓 Mentor Boost:</div>
                        <div className="mt-1 font-normal">
                          Unlock guidance from senior tech heroes to power up your abilities.
                        </div>
                      </div>
                      <div className="p-3 rounded-lg min-w-[250px] text-black">
                        <div className="text-lg font-extrabold">🎖️ Earn Badges & Loot:</div>
                        <div className="mt-1 font-normal">
                          Showcase achievements, badges, and project loot in your profile.
                        </div>
                      </div>
                      <div className="p-3 rounded-lg min-w-[250px] text-black">
                        <div className="text-lg font-extrabold">⚔️ Epic Quests:</div>
                        <div className="mt-1 font-normal">
                          Participate in exclusive challenges, workshops, and real-world missions.
                        </div>
                      </div>
                      <div className="p-3 rounded-lg min-w-[250px] text-black">
                        <div className="text-lg font-extrabold">💎 Unlock Rewards:</div>
                        <div className="mt-1 font-normal">
                          Gain recognition, prizes, and secret opportunities for high scorers.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingImage;
