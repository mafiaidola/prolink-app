'use client';

import { cn } from '@/lib/utils';
import type { AnimatedBackground as AnimatedBackgroundType } from '@/lib/types';
import { useEffect } from 'react';
import { DeepHoleBackground } from './deep-hole-background';

const AnimatedBackground = ({ type }: { type: AnimatedBackgroundType }) => {
  useEffect(() => {
    // Cleanup function to remove styles or scripts if component unmounts
    return () => {
      const existingScript = document.getElementById('particles-js-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [type]);

  if (type === 'none' || !type) return null;
  
  if (type === 'deep-hole') {
    return <DeepHoleBackground />;
  }

  if (type === 'solaris') {
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

  if (type === 'star-wars') {
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


  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden', `bg-anim-${type}`)}>
      <style jsx global>{`
        /* Common keyframes */
        @keyframes animStar { from { transform: translateY(0px); } to { transform: translateY(-2000px); } }
        @keyframes move-particles { 0% { transform: translate(0, 0); } 100% { transform: translate(100vw, 100vh); } }
        @keyframes gradient-animation { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes aurora-animation { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes move-lines { 0% { background-position: 0 0; } 100% { background-position: 100% 100%; } }
        @keyframes move-cells { 0% { background-position: 0 0; } 100% { background-position: 40px 40px; } }
        @keyframes move-circles { 0% { background-position: 0 0; } 100% { background-position: 100% 100%; } }

        /* Individual background styles */
        .bg-anim-particles {
          background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
          height: 100%;
          width: 100%;
        }
        .bg-anim-particles::after {
          content: '';
          position: absolute;
          width: 1px; height: 1px;
          background: white;
          box-shadow: 
            19vw 11vh 1px 1px #fff, 83vw 3vh 1px 0px #fff, 6vw 43vh 0px 1px #fff, 52vw 21vh 1px 1px #fff, 
            92vw 31vh 0px 0px #fff, 4vw 61vh 0px 1px #fff, 93vw 94vh 0px 1px #fff, 63vw 69vh 0px 1px #fff, 
            11vw 79vh 0px 1px #fff, 3vw 6vh 0px 0px #fff, 39vw 90vh 1px 0px #fff, 75vw 73vh 1px 1px #fff, 
            2vw 21vh 1px 1px #fff, 89vw 26vh 0px 1px #fff, 67vw 2vh 0px 1px #fff, 19vw 97vh 1px 1px #fff, 
            46vw 82vh 0px 1px #fff, 5vw 81vh 1px 0px #fff, 63vw 40vh 0px 0px #fff, 38vw 98vh 0px 0px #fff, 
            86vw 51vh 0px 0px #fff, 74vw 81vh 0px 0px #fff, 51vw 3vh 0px 0px #fff, 2vw 96vh 1px 0px #fff;
          animation: move-particles 150s linear infinite;
        }

        .bg-anim-stars { background-color: #000; height: 100%; width: 100%; }
        .bg-anim-stars::before, .bg-anim-stars::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%; height: 100%;
          background-image: radial-gradient(white, rgba(255,255,255,0)), radial-gradient(white, rgba(255,255,255,0));
          background-repeat: repeat;
        }
        .bg-anim-stars::before {
          background-size: 1px 1px, 2px 2px;
          background-position: 50% 50%, 20% 80%;
          animation: animStar 60s linear infinite;
        }
        .bg-anim-stars::after {
          background-size: 1px 1px, 2px 2px;
          background-position: 10% 90%, 80% 30%;
          animation: animStar 120s linear infinite;
        }
        
        .bg-anim-waves {
          background: #3a3d98;
          background: linear-gradient( to right bottom, #4649ad, #3a3d98 50%, #2e307e );
          height: 100%;
          width: 100%;
        }
        .bg-anim-waves::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 200%;
          height: 200%;
          background: repeating-radial-gradient(circle at 0 0, transparent 0, #3a3d98 40px), 
                      repeating-linear-gradient(#4649ad, #2e307e);
          mix-blend-mode: screen;
          animation: waves-animation 10s linear infinite;
        }
        @keyframes waves-animation { to { transform: translate(-50%, -50%) rotate(360deg); } }
        
        .bg-anim-electric {
          background-color: #000;
          height: 100%;
          width: 100%;
        }
        .bg-anim-electric::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(transparent, transparent 1px, rgba(170, 0, 255, 0.5) 1px, rgba(170, 0, 255, 0.5) 2px);
          animation: electric-animation 2s linear infinite;
        }
        @keyframes electric-animation { 0% { transform: translateY(0); } 100% { transform: translateY(-50px); } }

        .bg-anim-gradient {
          background: linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradient-animation 15s ease infinite;
          height: 100%;
          width: 100%;
        }
        
        .bg-anim-aurora {
          background: radial-gradient(ellipse at 50% 0%, #6d28d9, transparent 50%),
                      radial-gradient(ellipse at 60% 100%, #d946ef, transparent 50%),
                      radial-gradient(ellipse at 100% 50%, #2563eb, transparent 50%),
                      radial-gradient(ellipse at 0% 50%, #db2777, transparent 50%),
                      #1e1b4b;
          background-size: 200% 200%;
          animation: aurora-animation 20s ease-in-out infinite alternate;
          height: 100%;
          width: 100%;
        }

        .bg-anim-lines {
          background-color: #1a2a6c;
          background-image: linear-gradient(315deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%);
          background-size: 200% 200%;
          animation: move-lines 10s linear infinite alternate;
          height: 100%;
          width: 100%;
        }

        .bg-anim-cells {
            background-color: #000;
            background-image:
                linear-gradient(45deg, #303030 25%, transparent 25%), 
                linear-gradient(-45deg, #303030 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #303030 75%),
                linear-gradient(-45deg, transparent 75%, #303030 75%);
            background-size: 20px 20px;
            animation: move-cells 5s linear infinite;
            height: 100%;
            width: 100%;
        }

        .bg-anim-circles {
            background: radial-gradient(circle, #f0f0f0 10%, transparent 11%),
                        radial-gradient(circle, #f0f0f0 10%, transparent 11%) 15px 15px,
                        #ffffff;
            background-size: 30px 30px;
            animation: move-circles 10s linear infinite;
            height: 100%;
            width: 100%;
        }
      `}</style>
    </div>
  );
};

export { AnimatedBackground };
