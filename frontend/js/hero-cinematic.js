/**
 * hero-cinematic.js
 * Three.js particles + GSAP entrance animations + video controls
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Three.js Particle Layer ─────────────────────────── */
  (function initParticles() {
    const canvas = document.getElementById('hero-three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    camera.position.z = 5;

    // Particle geometry
    const COUNT = 180;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);

    const palette = [
      new THREE.Color('#e8d87a'), // warm cream-yellow
      new THREE.Color('#ffffff'), // white
      new THREE.Color('#f0e48a'), // soft gold
      new THREE.Color('#c8b85a'), // amber
    ];

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 6 + 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    // Glowing circle texture
    const texCanvas = document.createElement('canvas');
    texCanvas.width = texCanvas.height = 64;
    const ctx = texCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,200,0.8)');
    grad.addColorStop(1, 'rgba(255,255,200,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(texCanvas);

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      map: tex,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Resize handler
    window.addEventListener('resize', () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.3;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
    });

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.0008;

      // Gentle drift
      points.rotation.y = t * 0.4 + mouseX;
      points.rotation.x = t * 0.2 - mouseY;

      // Pulse size
      mat.opacity = 0.6 + Math.sin(t * 3) * 0.15;

      renderer.render(scene, camera);
    }
    animate();
  })();

  /* ── GSAP Entrance Animations ────────────────────────── */
  (function initGSAP() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-cin-content',  { opacity: 1, duration: 0.01 }, 0)
      .from('.hero-video-main', { opacity: 0, scale: 1.06, duration: 1.8, ease: 'power2.out' }, 0)
      .to('#hero-tag',          { opacity: 1, y: 0, duration: 0.7 }, 0.4)
      .from('#hero-tag',        { y: 30 }, 0.4)
      .to('#hero-name',         { opacity: 1, duration: 0.9 }, 0.65)
      .from('#hero-name',       { y: 50, skewY: 3 }, 0.65)
      .to('#hero-role',         { opacity: 1, duration: 0.7 }, 0.9)
      .from('#hero-role',       { y: 20 }, 0.9)
      .to('#hero-sub',          { opacity: 1, duration: 0.7 }, 1.05)
      .from('#hero-sub',        { y: 20 }, 1.05)
      .to('#hero-actions',      { opacity: 1, duration: 0.7 }, 1.2)
      .from('#hero-actions',    { y: 20 }, 1.2)
      .to('#hero-scroll',       { opacity: 1, duration: 0.7 }, 1.5)
      .to('#hero-controls',     { opacity: 1, duration: 0.6 }, 1.6)
      .to('#hero-stats',        { opacity: 1, duration: 0.7 }, 1.35)
      .from('#hero-stats',      { y: 20 }, 1.35);

    // Parallax on scroll (if ScrollTrigger available)
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to('.hero-cin-content', {
        y: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  })();

  /* ── Video Controls ──────────────────────────────────── */
  (function initVideoControls() {
    const videoMain  = document.getElementById('hero-video');
    const videoBlur  = document.getElementById('hero-video-blur');
    const btnPlay    = document.getElementById('btn-playpause');
    const btnMute    = document.getElementById('btn-mute');
    const iconPause  = document.getElementById('icon-pause');
    const iconPlay   = document.getElementById('icon-play');
    const iconMuted  = document.getElementById('icon-muted');
    const iconUnmuted= document.getElementById('icon-unmuted');
    const badge      = document.getElementById('hero-sound-badge');

    if (!videoMain) return;

    // Play/Pause
    btnPlay && btnPlay.addEventListener('click', () => {
      if (videoMain.paused) {
        videoMain.play();
        videoBlur && videoBlur.play();
        iconPause.style.display = '';
        iconPlay.style.display  = 'none';
        btnPlay.setAttribute('aria-label', 'Pause video');
      } else {
        videoMain.pause();
        videoBlur && videoBlur.pause();
        iconPause.style.display = 'none';
        iconPlay.style.display  = '';
        btnPlay.setAttribute('aria-label', 'Play video');
      }
    });

    // Mute/Unmute
    btnMute && btnMute.addEventListener('click', () => {
      videoMain.muted = !videoMain.muted;
      if (videoMain.muted) {
        iconMuted.style.display   = '';
        iconUnmuted.style.display = 'none';
        btnMute.setAttribute('aria-label', 'Unmute video');
      } else {
        iconMuted.style.display   = 'none';
        iconUnmuted.style.display = '';
        btnMute.setAttribute('aria-label', 'Mute video');
        badge && badge.classList.add('hidden');
      }
    });

    // Tap for Sound badge — disappear after 4s
    if (badge) {
      setTimeout(() => badge.classList.add('hidden'), 4000);

      // Also unmute on any tap/click anywhere on hero
      document.getElementById('hero') && document.getElementById('hero').addEventListener('click', () => {
        if (videoMain.muted) {
          videoMain.muted = false;
          iconMuted.style.display   = 'none';
          iconUnmuted.style.display = '';
          badge.classList.add('hidden');
        }
      }, { once: true });
    }
  })();

});
