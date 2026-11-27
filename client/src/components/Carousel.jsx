import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SLIDES = [
  {
    image: "/plu-home-nation-moving-together.jpg",
    title: "Join the Patriotic League",
    subtitle: "Registration is permanently open",
    cta: "Join PLU",
    to: "/register",
  },
  {
    image: "/slide-1-home.webp",
    title: "Verify a membership",
    subtitle: "Public verification, anytime",
    cta: "Verify",
    to: "/verify",
  },
  {
    image: "/plu-logo.png",
    title: "Already a member?",
    subtitle: "Sign in to your dashboard",
    cta: "Sign in",
    to: "/login",
    dark: true,
  },
];

export default function Carousel() {
  const nav = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-plu-black">
      <div
        className="relative h-72 sm:h-80 md:h-96 lg:h-[28rem] cursor-pointer group"
        onClick={() => nav(SLIDES[index].to)}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              i === index ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.opacity = 0; }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${slide.dark ? "from-black/90 via-black/70 to-black/50" : "from-black/85 via-black/40 to-transparent"}`} />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-12 text-white max-w-3xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-2">
                {slide.title}
              </h2>
              <p className="text-base md:text-lg text-white/85 mb-5">{slide.subtitle}</p>
              <div>
                <span className="inline-flex items-center gap-2 bg-plu-yellow text-plu-black font-bold text-base md:text-lg px-6 py-3 rounded-xl group-hover:scale-105 transition-transform shadow-lg">
                  {slide.cta}
                  <span aria-hidden></span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" role="tablist">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIndex(i); }}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === index}
            role="tab"
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-plu-yellow shadow-lg" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

