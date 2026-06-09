import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { EffectComposer, RenderPass, EffectPass, BloomEffect, BlendFunction } from 'postprocessing'
import LLMConstellation from './LLMConstellation'
import { useLanguage } from '@/contexts/LanguageContext'

// ─── WebGL Fluid Background ──────────────────────────────────────────────
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_detail;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0, w = 0.5;
  int octaves = int(u_detail);
  for (int i = 0; i < 8; i++) { if (i >= octaves) break; f += w * snoise(p); p *= 2.0; w *= 0.5; }
  return f;
}

vec2 sampleFluid(vec2 coord, float t, float scale, float warpIntensity) {
  vec2 movement = vec2(t * 0.05, t * 0.03);
  vec2 q = vec2(fbm(coord * scale + movement), fbm(coord * scale + movement + vec2(5.2, 1.3)));
  float fluid = fbm(coord * scale + warpIntensity * q);
  return vec2(fluid, length(q) * 0.5);
}

void main() {
  vec2 uv = vUv;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 coord = (uv - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.5;
  vec2 fluid1 = sampleFluid(coord, t, 1.5, 3.0);
  vec2 fluid2 = sampleFluid(coord + vec2(1.7, 9.2), t * 1.2, 2.5, 2.0);
  float finalFluid = (fluid1.x + fluid2.x * 0.5) * 0.5;
  float edgeHighlight = (1.0 - smoothstep(0.3, 0.8, fluid1.y)) * 0.4;
  float fineDetail = snoise(coord * 8.0 + t * 0.1) * 0.04;
  vec3 color = vec3(0.015, 0.02, 0.03);
  color += vec3(0.03, 0.05, 0.1) * finalFluid;
  color += vec3(0.04, 0.1, 0.18) * edgeHighlight;
  color += vec3(0.1, 0.25, 0.4) * fineDetail * smoothstep(0.4, 0.8, finalFluid);
  float vignette = smoothstep(0.65, 0.15, length(vUv - 0.5));
  color *= vignette;
  float alpha = smoothstep(0.2, 0.5, finalFluid) * (0.45 + 0.2 * edgeHighlight);
  gl_FragColor = vec4(color, alpha);
  #include <colorspace_fragment>
}
`

// ─── Terminal Data Keys ──────────────────────────────────────────────────
const TERMINAL_ARTICLE_KEYS = [
  { id: '001', key: 'article.001.title', status: 'READY' as const, category: 'GEO' },
  { id: '002', key: 'article.002.title', status: 'READY' as const, category: 'SEO' },
  { id: '003', key: 'article.003.title', status: 'LIVE' as const, category: 'GEO' },
  { id: '004', key: 'article.004.title', status: 'READY' as const, category: 'SEO' },
  { id: '005', key: 'article.005.title', status: 'NEW' as const, category: 'GEO' },
  { id: '006', key: 'article.006.title', status: 'READY' as const, category: 'Resources' },
  { id: '007', key: 'article.007.title', status: 'LIVE' as const, category: 'GEO' },
  { id: '008', key: 'article.008.title', status: 'READY' as const, category: 'Resources' },
]

// ─── Component ───────────────────────────────────────────────────────────
export default function HeroSection() {
  const { t, lang } = useLanguage()
  const canvasRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const [typedHeader, setTypedHeader] = useState('')
  const [logsVisible, setLogsVisible] = useState(0)
  const [articlesVisible, setArticlesVisible] = useState(0)
  const [cursorOn, setCursorOn] = useState(true)
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null)

  const scrollToNext = useCallback(() => {
    const el = document.querySelector('#core-thesis')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // ─── WebGL ────────────────────────────────────────────────────────────
  useEffect(() => {
    const container = canvasRef.current
    if (!container) return
    const w = window.innerWidth
    const h = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;'
    container.appendChild(renderer.domElement)

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const scene = new THREE.Scene()
    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      transparent: true, depthWrite: false,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(w, h) },
        u_detail: { value: 6.0 },
      },
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new EffectPass(camera, new BloomEffect({
      resolutionScale: 0.5, kernelSize: 4,
      blendFunction: BlendFunction.SCREEN,
      luminanceThreshold: 0.35, luminanceSmoothing: 0.6,
    } as ConstructorParameters<typeof BloomEffect>[0])))

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        renderer.setSize(width, height)
        composer.setSize(width, height)
        material.uniforms.u_resolution.value.set(width, height)
      }
    })
    ro.observe(container)

    const animate = () => {
      material.uniforms.u_time.value = performance.now() * 0.001
      composer.render()
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      composer.dispose()
      renderer.dispose()
      material.dispose()
      mesh.geometry.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  // ─── Terminal Typing Effect ───────────────────────────────────────────
  useEffect(() => {
    const headerText = t('terminal.header') as string
    let idx = 0
    setTypedHeader('')
    setLogsVisible(0)
    setArticlesVisible(0)

    const typeInterval = setInterval(() => {
      if (idx <= headerText.length) {
        setTypedHeader(headerText.slice(0, idx))
        idx++
      } else {
        clearInterval(typeInterval)
      }
    }, 40)

    const logKeys = ['terminal.log1', 'terminal.log2', 'terminal.log3', 'terminal.log4']
    const logTimers = logKeys.map((_, i) =>
      setTimeout(() => setLogsVisible((v) => v + 1), 600 + i * 400)
    )

    const articleTimer = setTimeout(() => {
      let aIdx = 0
      const aInterval = setInterval(() => {
        if (aIdx < TERMINAL_ARTICLE_KEYS.length) {
          setArticlesVisible((v) => v + 1)
          aIdx++
        } else {
          clearInterval(aInterval)
        }
      }, 80)
      return () => clearInterval(aInterval)
    }, 2400)

    const cursorInterval = setInterval(() => setCursorOn((v) => !v), 530)

    return () => {
      clearInterval(typeInterval)
      clearInterval(cursorInterval)
      clearTimeout(articleTimer)
      logTimers.forEach(clearTimeout)
    }
  }, [lang, t])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return '#3B82F6'
      case 'LIVE': return '#10B981'
      case 'NEW': return '#F59E0B'
      default: return '#A0A0A0'
    }
  }

  const logKeys = ['terminal.log1', 'terminal.log2', 'terminal.log3', 'terminal.log4']

  return (
    <section id="hero" className="relative" style={{ width: '100%', height: '100vh', overflow: 'hidden', background: '#050505' }}>
      <div ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      <div className="relative flex items-center" style={{ zIndex: 1, height: '100%', pointerEvents: 'none' }}>
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">

            {/* LEFT: Constellation + Headline */}
            <div className="flex flex-col items-center lg:items-start" style={{ pointerEvents: 'auto' }}>
              <LLMConstellation />
              <div className="mt-4 text-center lg:text-left">
                <h1 className="font-display uppercase text-white" style={{ fontSize: 'clamp(1.8rem, 5vw, 4.2rem)', lineHeight: 1.05, letterSpacing: '-0.04em', textWrap: 'balance' }}>
                  {t('hero.headline.line1') as string}<br />{t('hero.headline.line2') as string}
                </h1>
                <p className="mt-3 font-mono text-xs uppercase tracking-widest" style={{ letterSpacing: '0.15em', color: '#A0A0A0' }}>
                  {t('hero.subtitle') as string}
                </p>
                <button
                  onClick={scrollToNext}
                  className="mt-5 rounded-full border border-white/30 bg-transparent px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-white transition-all duration-200 hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]"
                  style={{ letterSpacing: '0.12em' }}
                >
                  {t('hero.cta') as string}
                </button>
              </div>
            </div>

            {/* RIGHT: Terminal Dashboard */}
            <div className="w-full lg:w-auto" style={{ pointerEvents: 'auto', maxWidth: '520px', width: '100%' }}>
              <div className="relative overflow-hidden" style={{
                background: 'rgba(5, 5, 5, 0.6)',
                backgroundBlendMode: 'luminosity',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(59,130,246,0.06)',
              }}>
                <div className="pointer-events-none absolute inset-0" style={{
                  borderRadius: 'inherit',
                  background: 'radial-gradient(ellipse 90% 40% at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 35% at 65% 10%, rgba(255,255,255,0.04) 0%, transparent 50%)',
                  mixBlendMode: 'overlay',
                }} />

                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#EF4444' }} />
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#F59E0B' }} />
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#10B981' }} />
                  </div>
                  <span className="font-mono text-xs" style={{ color: '#A0A0A0', letterSpacing: '0.08em' }}>
                    {typedHeader}<span style={{ opacity: cursorOn ? 1 : 0, color: '#3B82F6' }}>|</span>
                  </span>
                </div>

                {/* Body */}
                <div className="px-5 py-4" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  <div className="mb-4 flex flex-col gap-1">
                    {logKeys.slice(0, logsVisible).map((key, i) => (
                      <span key={`${lang}-${i}`} className="font-mono text-xs" style={{ color: '#666666', letterSpacing: '0.04em' }}>
                        {t(key) as string}
                      </span>
                    ))}
                  </div>

                  {logsVisible >= logKeys.length && (
                    <div className="mb-3 flex items-center gap-4 font-mono text-xs" style={{ color: '#A0A0A0', letterSpacing: '0.06em' }}>
                      <span>{t('terminal.status.resources') as string}: <span style={{ color: '#3B82F6' }}>{TERMINAL_ARTICLE_KEYS.length}</span></span>
                      <span>{t('terminal.status.live') as string}: <span style={{ color: '#10B981' }}>{TERMINAL_ARTICLE_KEYS.filter((a) => a.status === 'LIVE').length}</span></span>
                      <span>{t('terminal.status.new') as string}: <span style={{ color: '#F59E0B' }}>{TERMINAL_ARTICLE_KEYS.filter((a) => a.status === 'NEW').length}</span></span>
                    </div>
                  )}

                  {logsVisible >= logKeys.length && <div className="mb-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />}

                  <div className="flex flex-col gap-1">
                    {TERMINAL_ARTICLE_KEYS.slice(0, articlesVisible).map((article) => (
                      <div
                        key={`${lang}-${article.id}`}
                        className="group cursor-pointer"
                        onMouseEnter={() => setHoveredArticle(article.id)}
                        onMouseLeave={() => setHoveredArticle(null)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          background: hoveredArticle === article.id ? 'rgba(59,130,246,0.08)' : 'transparent',
                          border: hoveredArticle === article.id ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="shrink-0 font-mono text-xs" style={{ color: '#555555', letterSpacing: '0.06em', minWidth: '28px' }}>
                              {article.id}
                            </span>
                            <span className="truncate font-mono text-xs" style={{
                              color: hoveredArticle === article.id ? '#FFFFFF' : '#EBEBEB',
                              letterSpacing: '0.04em',
                              transition: 'color 0.2s ease',
                            }}>
                              {t(article.key) as string}
                            </span>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="font-mono text-xs" style={{ color: getStatusColor(article.status), letterSpacing: '0.08em', fontWeight: 500 }}>
                              {article.status === 'READY' ? (t('terminal.status.ready') as string) : article.status}
                            </span>
                            <div className="h-1.5 w-1.5 rounded-full" style={{ background: getStatusColor(article.status), opacity: 0.6 }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {articlesVisible >= TERMINAL_ARTICLE_KEYS.length && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="font-mono text-xs" style={{ color: '#3B82F6' }}>&gt;</span>
                      <span className="font-mono text-xs" style={{ color: '#555555' }}>
                        {t('terminal.prompt') as string}
                        <span style={{ opacity: cursorOn ? 1 : 0, color: '#3B82F6' }}>|</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <span className="font-mono text-xs" style={{ color: '#444444', letterSpacing: '0.06em' }}>
                    {t('terminal.footer.version') as string}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#10B981', animation: 'pulse 2s ease-in-out infinite' }} />
                    <span className="font-mono text-xs" style={{ color: '#444444', letterSpacing: '0.06em' }}>
                      {t('terminal.footer.status') as string}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
    </section>
  )
}
