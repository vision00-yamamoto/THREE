import * as THREE from 'three';
// import 文を使ってstyle.cssファイルを読み込む。
import "./style.css";

window.addEventListener('load', () => {

    const ctx = c.getContext("2d");
    const rAF = requestAnimationFrame;
    const m = {
      x: 0,
      y: 0,
      a: 0,
      e: false
    };
    
    class Letters {
      constructor(x, y, char, font, color, radius) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.font = font;
        this.color = color;
        this.radius = 0;
        this.oriRad = radius;
        this.i = 20;
        this.maxSize = 5;
        this.minSize = 20;
        this.v = 5;
        this.dist = 0;
        this.friction = 0.9
        this.K = 0.2
        this.vel = {
          x: 0,
          y: 0
        };
        this.o = {
          x: 0,
          y: 0,
          a: 0
        };
      }
    
      angleChars() {
        if (this.radius < this.oriRad) this.radius += this.v;
    
        const dx = m.x - this.x;
        const dy = m.y - this.y;
    
        this.dist = Math.hypot(dx, dy);
        m.a = Math.atan2(dy, dx);
    
        const ax = Math.cos(m.a) * this.radius;
        const ay = Math.sin(m.a) * this.radius;
    
        this.o.x = lerp(ax, this.o.x, 0.1);
        this.o.y = lerp(ay, this.o.y, 0.1);
    
        this.dist < this.radius + 10
          ? this.i < this.maxSize
            ? ((this.dist = this.radius),
              (this.i += this.v - 4),
              (this.font = `600 ${this.i}px Arial`))
            : null
          : this.i > this.minSize
            ? ((this.i -= this.v - 4), (this.font = `600 ${this.i}px Arial`))
            : null;
      }
    
      onMouseLeave() {    
        // Hooke's law for linear springs
        const forceX = this.K * (0 - this.o.x)
        const forceY = this.K * (0 - this.o.y)
        
        this.vel.x += forceX;
        this.vel.y += forceY;
        
        this.vel.x *= this.friction
        this.vel.y *= this.friction
        
        this.o.x += this.vel.x;
        this.o.y += this.vel.y;
    
        if (this.i > this.minSize) {
          this.i -= this.v - 4;
          this.font = `600 ${this.i}px Arial`;
        }
      }
    
      update(ctx) {
        m.e ? this.angleChars() : this.onMouseLeave();
    
        this.draw(ctx);
      }
    
      draw(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, this.o.x, this.o.y);
        ctx.fillStyle = this.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = this.font;
        ctx.fillText(this.char, this.x, this.y);
        ctx.restore();
      }
    }
    
    let letters;
    
    const init = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    
      letters = [];
      const chars = ["A", "L", "A", "I", "N"];
      const colors = ["#02d2d6", "#b125d1", "#fea064", "#00a8e8", "#fb89ef"];
      const colorLength = colors.length;
      const charLength = chars.length;
      const gridLength = 5;
      const radius = Math.min(c.width, c.height) / (gridLength + 1) / 2;
      const font = "600 20px Arial";
      for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
          const x = c.width / (gridLength + 1) * (j + 1);
          const y = c.height / (gridLength + 1) * (i + 1);
          const color = randomValue(colors, colorLength);
          const char = randomValue(chars, charLength);
          letters.push(new Letters(x, y, char, font, color, radius));
        }
      }
    };
    
    const lerp = (end, start, p) => p * (end - start) + start;
    
    const randomValue = (array, length) =>
      array[Math.floor(Math.random() * length)];
    
    const animate = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (let letter of letters) {
        letter.update(ctx);
      }
      rAF(animate);
    };
    
    init();
    animate();
    window.addEventListener("resize", init);
    c.addEventListener("mousemove", e => {
      m.x = e.x;
      m.y = e.y;
      m.z = e.z;
    });
    c.addEventListener("mouseenter", () => {
      m.e = true;
    });
    c.addEventListener("mouseleave", () => {
      m.e = false;
    });
    

  
});