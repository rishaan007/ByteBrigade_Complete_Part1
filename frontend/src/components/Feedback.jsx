import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedTitle from "./AnimatedTitle";

const testimonials = [
  {
    name: "Roney ",
    role: "Full-Stack Developer",
    message: "Byte Brigade helped me find amazing teammates and crush hackathons! ",
    avatar: "https://static.vecteezy.com/system/resources/previews/059/467/716/non_2x/gamer-avatar-with-headphones-and-glasses-white-background-vector.jpg"
  },
  {
    name: "Aniket Sarkar",
    role: "AI Engineer",
    message: "Guided by Azul, I leveled up my coding skills and won prizes! 🏆",
    avatar: "https://img.freepik.com/free-vector/hacker-operating-laptop-cartoon-icon-illustration-technology-icon-concept-isolated-flat-cartoon-style_138676-2387.jpg"
  },
  {
    name: "Trilokeshwar Das",
    role: "Backend Dev",
    message: "Finding the right squad has never been this fun! 🔥",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYUnefsA8WYDUjYmOh_r8QTYOolM2BPRRMlQ&s"
  },
];

export default function TestimonialSlider() {
  const [index, setIndex] = useState(0);

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -100) {
      setIndex((prev) => (prev + 1) % testimonials.length);
    } else if (info.offset.x > 100) {
      setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  return (
    <div id = "feedback" className="w-full max-w-4xl mx-auto py-10 px-4">
      <AnimatedTitle
        title="<b>V</b>ict<b>o</b>ry <br />  <b>V</b>oi<b>c</b>es"
        containerClass="mt-5 !text-black text-center"
      />
      <div className="overflow-hidden relative mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            drag="x"
            onDragEnd={handleDragEnd}
            dragConstraints={{ left: 0, right: 0 }}
            initial={{ x: 400, opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={{ x: -400, opacity: 0, scale: 0.8, rotate: -5 }}
            transition={{ type: "spring", stiffness: 230, damping: 15, mass: 1.5 }}
            className="bg-gradient-to-r from-blue-900 via-black to-green-800 rounded-xl p-6 md:p-8 text-white shadow-2xl flex flex-col items-center cursor-grab"
          >
            <img
              src={testimonials[index].avatar}
              alt={testimonials[index].name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-3xl mb-4 border-indigo-400 border-2"
            />
            <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">"{testimonials[index].message}"</p>
            <h3 className="font-circular-web text-lg text-blue-50">{testimonials[index].name}</h3>
            <span className="text-sm md:text-base text-green-300">{testimonials[index].role}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
