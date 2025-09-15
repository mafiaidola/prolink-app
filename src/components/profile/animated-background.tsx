import { cn } from '@/lib/utils';
import type { AnimatedBackground as AnimatedBackgroundType } from '@/lib/types';

// Simple CSS-only animated backgrounds
const backgroundStyles = {
  particles: {
    container: 'bg-slate-900',
    content: (
      <>
        <div id="particles-js" className="absolute inset-0 z-0" />
        <style jsx>{`
          @keyframes move-particles {
            0% { transform: translate(0, 0); }
            100% { transform: translate(100vw, 100vh); }
          }
          #particles-js {
            background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
            overflow: hidden;
          }
          #particles-js::after {
            content: '';
            position: absolute;
            width: 1px;
            height: 1px;
            background: white;
            box-shadow: 
              /* A lot of particles */
              19vw 11vh 1px 1px #fff, 83vw 3vh 1px 0px #fff, 6vw 43vh 0px 1px #fff, 52vw 21vh 1px 1px #fff, 
              92vw 31vh 0px 0px #fff, 4vw 61vh 0px 1px #fff, 93vw 94vh 0px 1px #fff, 63vw 69vh 0px 1px #fff, 
              11vw 79vh 0px 1px #fff, 3vw 6vh 0px 0px #fff, 39vw 90vh 1px 0px #fff, 75vw 73vh 1px 1px #fff, 
              2vw 21vh 1px 1px #fff, 89vw 26vh 0px 1px #fff, 67vw 2vh 0px 1px #fff, 19vw 97vh 1px 1px #fff, 
              46vw 82vh 0px 1px #fff, 5vw 81vh 1px 0px #fff, 63vw 40vh 0px 0px #fff, 38vw 98vh 0px 0px #fff, 
              86vw 51vh 0px 0px #fff, 74vw 81vh 0px 0px #fff, 51vw 3vh 0px 0px #fff, 2vw 96vh 1px 0px #fff;
            animation: move-particles 150s linear infinite;
          }
        `}</style>
      </>
    ),
  },
  stars: {
    container: 'bg-[#000]',
    content: (
        <>
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <style jsx>{`
            @keyframes animStar {
                from { transform: translateY(0px); }
                to { transform: translateY(-2000px); }
            }
            #stars, #stars2, #stars3 {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                display: block;
                background: transparent;
            }
            #stars {
                background-image: radial-gradient(white, rgba(255,255,255,0)), 
                                  radial-gradient(white, rgba(255,255,255,0));
                background-size: 1px 1px, 2px 2px;
                background-position: 50% 50%, 20% 80%;
                background-repeat: repeat;
                animation: animStar 60s linear infinite;
            }
            #stars2 {
                background-image: radial-gradient(white, rgba(255,255,255,0)), 
                                  radial-gradient(white, rgba(255,255,255,0));
                background-size: 1px 1px, 2px 2px;
                background-position: 10% 90%, 80% 30%;
                background-repeat: repeat;
                animation: animStar 120s linear infinite;
            }
            #stars3 {
                background-image: radial-gradient(white, rgba(255,255,255,0));
                background-size: 3px 3px;
                background-position: 40% 20%;
                background-repeat: repeat;
                animation: animStar 180s linear infinite;
            }
        `}</style>
        </>
    )
  },
  none: { container: '', content: null },
  waves: { container: '', content: null }, // Add other styles here
  electric: { container: '', content: null },
  gradient: { container: '', content: null },
  aurora: { container: '', content: null },
  lines: { container: '', content: null },
  cells: { container: '', content: null },
  circles: { container: '', content: null },
};

type AnimatedBackgroundProps = {
  type: AnimatedBackgroundType;
};

export function AnimatedBackground({ type }: AnimatedBackgroundProps) {
  const background = backgroundStyles[type] || backgroundStyles['none'];

  if (type === 'none') return null;

  return (
    <div className={cn('absolute inset-0 -z-10', background.container)}>
      {background.content}
    </div>
  );
}
