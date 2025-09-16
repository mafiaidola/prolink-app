'use client';

export function SolarisBackground() {
  return (
    <div className="bg-anim-solaris absolute inset-0 -z-10 overflow-hidden">
      <style jsx global>{`
        .bg-anim-solaris {
          background-color: #000;
        }
        .bg-anim-solaris .sun {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10vmax;
          height: 10vmax;
          background-color: #ff5722;
          border-radius: 50%;
          box-shadow: 0 0 20px 10px #ff5722, 0 0 40px 20px #ffc107, 0 0 60px 40px #ff9800;
          animation: solaris-glow 5s linear infinite;
        }
        .bg-anim-solaris .orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: solaris-orbit 20s linear infinite;
        }
        .bg-anim-solaris .orbit-1 { width: 20vmax; height: 20vmax; animation-duration: 10s; }
        .bg-anim-solaris .orbit-2 { width: 30vmax; height: 30vmax; animation-duration: 15s; }
        .bg-anim-solaris .orbit-3 { width: 40vmax; height: 40vmax; animation-duration: 20s; }

        .bg-anim-solaris .planet {
          position: absolute;
          width: 2vmax;
          height: 2vmax;
          border-radius: 50%;
          top: -1vmax; 
          left: 50%;
          transform-origin: 50% calc(10vmax + 1vmax);
          animation: solaris-planet-orbit 10s linear infinite;
        }
        .orbit-1 .planet { background-color: #4caf50; animation-duration: 10s; }
        .orbit-2 .planet { background-color: #2196f3; top: -1vmax; transform-origin: 50% calc(15vmax + 1vmax); animation-duration: 15s; }
        .orbit-3 .planet { background-color: #9c27b0; top: -1vmax; transform-origin: 50% calc(20vmax + 1vmax); animation-duration: 20s; }

        @keyframes solaris-glow { 0%, 100% { box-shadow: 0 0 20px 10px #ff5722, 0 0 40px 20px #ffc107, 0 0 60px 40px #ff9800, 0 0 80px 60px #ff5722; } 50% { box-shadow: 0 0 25px 12px #ff5722, 0 0 50px 25px #ffc107, 0 0 75px 50px #ff9800, 0 0 100px 75px #ff5722; } }
        @keyframes solaris-orbit { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes solaris-planet-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <div className="sun"></div>
      <div className="orbit orbit-1"><div className="planet"></div></div>
      <div className="orbit orbit-2"><div className="planet"></div></div>
      <div className="orbit orbit-3"><div className="planet"></div></div>
    </div>
  );
}
