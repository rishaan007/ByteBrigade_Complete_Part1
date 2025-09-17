import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
// import './HackathonTeamBuilder.css'; // Assuming some styles might be shared

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;
    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => setTransformStyle("");

  return (
    <div ref={itemRef} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transform: transformStyle }}>
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, isComingSoon, squaddies, quest, profile, onFindSquaddies }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();
    setCursorPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full">
      <video src={src} loop muted autoPlay playsInline className="absolute left-0 top-0 size-full object-cover object-center" />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>}
        </div>
        {isComingSoon && (
          <div ref={hoverButtonRef} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20">
            <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300" style={{ opacity: hoverOpacity, background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)` }} />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
        {profile && (
          <div>
            <Button onClick={onFindSquaddies} id="realm-btn" title="Enter Arena" containerClass="mt-5 px-5 py-2 text-xs flex-center gap-1" />
          </div>
        )}
        {squaddies && (
          <div>
            <Button onClick={onFindSquaddies} id="realm-btn" title="Find Your Squaddies" containerClass="mt-5 px-5 py-2 text-xs flex-center gap-1" />
          </div>
        )}
        {quest && (
          <div>
            <Button id="realm-btn" title="Quest Log" containerClass="mt-5 px-5 py-2 text-xs flex-center gap-1" />
          </div>
        )}
      </div>
    </div>
  );
};

const Features = ({ onFindSquaddies }) => (
  <section  className="bg-black pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <p className="font-circular-web text-lg text-blue-50">Lore</p>
        <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
          Gear up, join forces, and level up your coding journey with collaborative challenges!
        </p>
      </div>
      <div id="about">
      <BentoTilt  className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard src="videos/feature-1.mp4" title={<>Abo<b>u</b>t</>} description="Byte Brigade is a community-driven platform where tech enthusiasts, coders, and innovators discover hackathons, collaborate on projects, gain mentorship, and showcase their skills—turning ideas into real-world solutions." />
      </BentoTilt>
      </div>
      <div id = "features" className="grid h-auto w-full grid-cols-1 gap-7 md:h-[135vh] md:grid-cols-2 md:grid-rows-3">
        <BentoTilt className="bento-tilt_1 h-96 md:h-auto md:row-span-1 md:col-span-1">
          <BentoCard src="videos/feature-2.mp4" title={<>Are<b>n</b>a</>} description="Enter the arena, equip your skills, and rise as a coding legend!" profile onFindSquaddies={onFindSquaddies} />
        </BentoTilt>
        <BentoTilt className="bento-tilt_1 h-96 md:h-auto md:row-span-1 md:col-span-1">
          <BentoCard src="videos/feature-3.mp4" title={<>Ass<b>emb</b>le</>} description="Assemble your squad! Search for teammates by skills, experience, and team size, and level up together" squaddies onFindSquaddies={onFindSquaddies} />
        </BentoTilt>
        <BentoTilt className="bento-tilt_1 h-96 md:h-auto md:col-span-1">
          <BentoCard src="videos/feature-4.mp4" title={<>az<b>u</b>l</>} description="Your AI guide for hackathons and teammates." isComingSoon />
        </BentoTilt>
        <BentoTilt className="bento-tilt_2 h-96 md:h-auto">
          <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">M<b>o</b>re co<b>m</b>ing s<b>o</b>on.</h1>
            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>
        <BentoTilt className="bento-tilt_2 h-96 md:h-auto">
          <video src="videos/feature-5.mp4" loop muted autoPlay playsInline className="size-full object-cover object-center" />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
