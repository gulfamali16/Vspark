import React, { useEffect, useRef } from 'react';
export default function ParticlesBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({length:60},()=>({
      x:Math.random()*canvas.width,y:Math.random()*canvas.height,
      vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,
      size:Math.random()*2.5+0.5,opacity:Math.random()*0.3+0.1,
      color:Math.random()>0.5?'59,130,246':'203,213,225', // Light blue and gray
    }));
    let animId;
    function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach((p,i)=>{
        particles.slice(i+1).forEach(p2=>{
          const dx=p.x-p2.x,dy=p.y-p2.y,dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<120){ctx.beginPath();ctx.strokeStyle=`rgba(59,130,246,${0.08*(1-dist/120)})`;ctx.lineWidth=0.5;ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();}
        });
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>canvas.width)p.vx*=-1;
        if(p.y<0||p.y>canvas.height)p.vy*=-1;
        ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.color},${p.opacity})`;ctx.fill();
      });
      animId=requestAnimationFrame(draw);
    }
    draw();
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
    window.addEventListener('resize',resize);
    return()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,zIndex:0,pointerEvents:'none',opacity:0.6}}/>;
}
