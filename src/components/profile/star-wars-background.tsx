'use client';

export function StarWarsBackground() {
  return (
    <div className="bg-anim-star-wars absolute inset-0 -z-10 overflow-hidden">
      <style jsx global>{`
          .bg-anim-star-wars { background: #000; }
          @keyframes star-wars-anim { from { transform: translateY(0px) } to { transform: translateY(-2000px) } }
          .bg-anim-star-wars .stars { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; }
          .bg-anim-star-wars .stars1 { background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000"><circle cx="200" cy="200" r="1" fill="white"/><circle cx="500" cy="800" r="1" fill="white"/><circle cx="900" cy="400" r="1" fill="white"/><circle cx="1200" cy="1500" r="1" fill="white"/><circle cx="1800" cy="1000" r="1" fill="white"/></svg>'); animation: star-wars-anim 50s linear infinite; }
          .bg-anim-star-wars .stars2 { background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000"><circle cx="100" cy="500" r="1" fill="white"/><circle cx="700" cy="1200" r="1" fill="white"/><circle cx="1400" cy="900" r="1" fill="white"/><circle cx="1700" cy="200" r="1" fill="white"/><circle cx="1900" cy="1600" r="1" fill="white"/></svg>'); animation: star-wars-anim 100s linear infinite; }
          .bg-anim-star-wars .stars3 { background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000"><circle cx="400" cy="100" r="1" fill="white"/><circle cx="800" cy="1400" r="1" fill="white"/><circle cx="1300" cy="600" r="1" fill="white"/><circle cx="1600" cy="1800" r="1" fill="white"/><circle cx="1950" cy="800" r="1" fill="white"/></svg>'); animation: star-wars-anim 150s linear infinite; }
        `}</style>
      <div className="stars stars1"></div>
      <div className="stars stars2"></div>
      <div className="stars stars3"></div>
    </div>
  );
}
