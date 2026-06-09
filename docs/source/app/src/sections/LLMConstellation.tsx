import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// ─── LLM Node Data: East vs West GEO Landscape ──────────────────────────

interface LLMNode {
  id: string
  name: string
  company: string
  region: 'EAST' | 'WEST'
  x: number // 0-1 normalized
  y: number // 0-1 normalized
  radius: number
  color: string
  glowColor: string
}

interface Connection {
  from: string
  to: string
  strength: number // 0-1
}

const LLM_NODES: LLMNode[] = [
  // ─── WEST ─────────────────────────────────────────────────
  { id: 'gpt4o', name: 'GPT-4o', company: 'OpenAI', region: 'WEST', x: 0.78, y: 0.22, radius: 18, color: '#10A37F', glowColor: 'rgba(16,163,127,0.4)' },
  { id: 'gemini', name: 'Gemini', company: 'Google', region: 'WEST', x: 0.88, y: 0.38, radius: 17, color: '#4285F4', glowColor: 'rgba(66,133,244,0.4)' },
  { id: 'claude', name: 'Claude', company: 'Anthropic', region: 'WEST', x: 0.72, y: 0.45, radius: 16, color: '#D4A574', glowColor: 'rgba(212,165,116,0.4)' },
  { id: 'llama', name: 'Llama 3', company: 'Meta', region: 'WEST', x: 0.85, y: 0.55, radius: 15, color: '#0668E1', glowColor: 'rgba(6,104,225,0.4)' },
  { id: 'copilot', name: 'Copilot', company: 'Microsoft', region: 'WEST', x: 0.90, y: 0.68, radius: 14, color: '#00A4EF', glowColor: 'rgba(0,164,239,0.4)' },
  { id: 'perplexity', name: 'Perplexity', company: 'Perplexity', region: 'WEST', x: 0.75, y: 0.72, radius: 13, color: '#1DB954', glowColor: 'rgba(29,185,84,0.4)' },
  { id: 'grok', name: 'Grok', company: 'xAI', region: 'WEST', x: 0.82, y: 0.85, radius: 12, color: '#FF6B6B', glowColor: 'rgba(255,107,107,0.4)' },

  // ─── EAST ─────────────────────────────────────────────────
  { id: 'deepseek', name: 'DeepSeek-V3', company: 'DeepSeek', region: 'EAST', x: 0.22, y: 0.18, radius: 18, color: '#4F46E5', glowColor: 'rgba(79,70,229,0.5)' },
  { id: 'kimi', name: 'Kimi K1.5', company: 'Moonshot', region: 'EAST', x: 0.10, y: 0.32, radius: 16, color: '#3B82F6', glowColor: 'rgba(59,130,246,0.5)' },
  { id: 'qwen', name: 'Qwen2.5', company: 'Alibaba', region: 'EAST', x: 0.28, y: 0.40, radius: 17, color: '#FF6A00', glowColor: 'rgba(255,106,0,0.5)' },
  { id: 'ernie', name: 'Ernie 4.0', company: 'Baidu', region: 'EAST', x: 0.12, y: 0.50, radius: 15, color: '#2932E1', glowColor: 'rgba(41,50,225,0.5)' },
  { id: 'doubao', name: 'Doubao', company: 'ByteDance', region: 'EAST', x: 0.25, y: 0.60, radius: 15, color: '#00E5FF', glowColor: 'rgba(0,229,255,0.5)' },
  { id: 'hunyuan', name: 'Hunyuan', company: 'Tencent', region: 'EAST', x: 0.08, y: 0.68, radius: 14, color: '#00C853', glowColor: 'rgba(0,200,83,0.5)' },
  { id: 'glm', name: 'GLM-4', company: 'Zhipu AI', region: 'EAST', x: 0.20, y: 0.78, radius: 13, color: '#E53935', glowColor: 'rgba(229,57,53,0.5)' },
  { id: 'yi', name: 'Yi-Large', company: '01.AI', region: 'EAST', x: 0.35, y: 0.72, radius: 12, color: '#7C4DFF', glowColor: 'rgba(124,77,255,0.5)' },
  { id: 'baichuan', name: 'Baichuan4', company: 'Baichuan', region: 'EAST', x: 0.15, y: 0.88, radius: 12, color: '#FF9800', glowColor: 'rgba(255,152,0,0.5)' },
  { id: 'minimax', name: 'MiniMax', company: 'MiniMax', region: 'EAST', x: 0.32, y: 0.90, radius: 11, color: '#F06292', glowColor: 'rgba(240,98,146,0.5)' },
]

const CONNECTIONS: Connection[] = [
  // Cross-region bridges (GEO relevance)
  { from: 'deepseek', to: 'gpt4o', strength: 0.9 },
  { from: 'kimi', to: 'claude', strength: 0.7 },
  { from: 'qwen', to: 'gemini', strength: 0.8 },
  { from: 'deepseek', to: 'llama', strength: 0.6 },
  { from: 'gpt4o', to: 'qwen', strength: 0.75 },
  { from: 'claude', to: 'deepseek', strength: 0.85 },
  { from: 'gemini', to: 'kimi', strength: 0.65 },
  { from: 'ernie', to: 'gpt4o', strength: 0.5 },
  { from: 'doubao', to: 'llama', strength: 0.55 },
  { from: 'perplexity', to: 'deepseek', strength: 0.7 },
  { from: 'hunyuan', to: 'copilot', strength: 0.45 },
  { from: 'glm', to: 'claude', strength: 0.5 },
  { from: 'yi', to: 'gemini', strength: 0.4 },
  { from: 'baichuan', to: 'gpt4o', strength: 0.35 },
  { from: 'minimax', to: 'grok', strength: 0.3 },
  // Intra-region connections
  { from: 'gpt4o', to: 'claude', strength: 0.6 },
  { from: 'gemini', to: 'copilot', strength: 0.5 },
  { from: 'deepseek', to: 'kimi', strength: 0.7 },
  { from: 'qwen', to: 'doubao', strength: 0.5 },
  { from: 'ernie', to: 'hunyuan', strength: 0.4 },
  { from: 'glm', to: 'baichuan', strength: 0.35 },
]

// ─── Component ───────────────────────────────────────────────────────────

export default function LLMConstellation() {
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<LLMNode | null>(null)
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 })

  // Track mouse for hover detection
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    mouseRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 }
    setHoveredNode(null)
  }, [])

  // Resize observer
  useEffect(() => {
    const container = canvasRef.current?.parentElement
    if (!container) return

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        const dpr = Math.min(window.devicePixelRatio, 2)
        const newW = Math.floor(width * dpr)
        const newH = Math.floor(height * dpr)
        setDimensions({ width: newW, height: newH })
      }
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const w = dimensions.width
    const h = dimensions.height

    // Animation particles flowing along connections
    const particles = CONNECTIONS.map((conn) => ({
      conn,
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
    }))

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, w, h)

      // Hover detection
      let foundHover: LLMNode | null = null

      // Draw connections
      CONNECTIONS.forEach((conn) => {
        const fromNode = LLM_NODES.find((n) => n.id === conn.from)
        const toNode = LLM_NODES.find((n) => n.id === conn.to)
        if (!fromNode || !toNode) return

        const fx = fromNode.x * w
        const fy = fromNode.y * h
        const tx = toNode.x * w
        const ty = toNode.y * h

        const isCrossRegion = fromNode.region !== toNode.region
        const lineWidth = isCrossRegion ? 1.5 : 0.8
        const baseAlpha = isCrossRegion ? 0.35 : 0.15

        // Gradient line
        const grad = ctx.createLinearGradient(fx, fy, tx, ty)
        grad.addColorStop(0, fromNode.color + Math.floor(baseAlpha * 255).toString(16).padStart(2, '0'))
        grad.addColorStop(0.5, isCrossRegion ? 'rgba(59,130,246,0.3)' : `rgba(160,160,160,${baseAlpha})`)
        grad.addColorStop(1, toNode.color + Math.floor(baseAlpha * 255).toString(16).padStart(2, '0'))

        ctx.beginPath()
        ctx.moveTo(fx, fy)
        ctx.lineTo(tx, ty)
        ctx.strokeStyle = grad
        ctx.lineWidth = lineWidth
        ctx.stroke()

        // Pulse effect on cross-region lines
        if (isCrossRegion) {
          const pulsePos = (Math.sin(time * 2 + conn.strength * 10) + 1) / 2
          const px = fx + (tx - fx) * pulsePos
          const py = fy + (ty - fy) * pulsePos
          ctx.beginPath()
          ctx.arc(px, py, 2, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(59,130,246,0.6)'
          ctx.fill()
        }
      })

      // Draw flowing particles
      particles.forEach((p) => {
        p.progress += p.speed
        if (p.progress > 1) p.progress = 0

        const fromNode = LLM_NODES.find((n) => n.id === p.conn.from)
        const toNode = LLM_NODES.find((n) => n.id === p.conn.to)
        if (!fromNode || !toNode) return

        const px = fromNode.x * w + (toNode.x * w - fromNode.x * w) * p.progress
        const py = fromNode.y * h + (toNode.y * h - fromNode.y * h) * p.progress

        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(59,130,246,0.8)'
        ctx.shadowBlur = 8
        ctx.shadowColor = '#3B82F6'
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw nodes
      LLM_NODES.forEach((node) => {
        const nx = node.x * w
        const ny = node.y * h
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const dist = Math.sqrt((nx - mx) ** 2 + (ny - my) ** 2)
        const isHovered = dist < node.radius + 8

        if (isHovered && !foundHover) {
          foundHover = node
        }

        const radius = isHovered ? node.radius * 1.3 : node.radius

        // Glow
        ctx.beginPath()
        ctx.arc(nx, ny, radius + 6, 0, Math.PI * 2)
        ctx.fillStyle = node.glowColor
        ctx.shadowBlur = isHovered ? 25 : 15
        ctx.shadowColor = node.color
        ctx.fill()
        ctx.shadowBlur = 0

        // Core
        ctx.beginPath()
        ctx.arc(nx, ny, radius, 0, Math.PI * 2)
        ctx.fillStyle = '#050505'
        ctx.fill()

        // Ring
        ctx.beginPath()
        ctx.arc(nx, ny, radius, 0, Math.PI * 2)
        ctx.strokeStyle = node.color
        ctx.lineWidth = isHovered ? 2.5 : 1.5
        ctx.stroke()

        // Inner dot
        ctx.beginPath()
        ctx.arc(nx, ny, radius * 0.35, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Label (only for larger nodes or hovered)
        if (radius >= 14 || isHovered) {
          ctx.font = `${isHovered ? '600' : '500'} ${isHovered ? 13 : 10}px "JetBrains Mono", monospace`
          ctx.fillStyle = isHovered ? '#FFFFFF' : '#A0A0A0'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.fillText(node.name, nx, ny + radius + 10)
        }
      })

      // Region labels — use translated values
      const labelEast = t('const.east') as string
      const labelWest = t('const.west') as string
      const labelBridge = t('const.bridge') as string

      ctx.font = '700 11px "Inter", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // EAST label
      ctx.fillStyle = 'rgba(59,130,246,0.6)'
      ctx.fillText(labelEast, w * 0.18, h * 0.05)
      ctx.strokeStyle = 'rgba(59,130,246,0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(w * 0.10, h * 0.08)
      ctx.lineTo(w * 0.26, h * 0.08)
      ctx.stroke()

      // WEST label
      ctx.fillStyle = 'rgba(160,160,160,0.5)'
      ctx.fillText(labelWest, w * 0.82, h * 0.05)
      ctx.strokeStyle = 'rgba(160,160,160,0.15)'
      ctx.beginPath()
      ctx.moveTo(w * 0.72, h * 0.08)
      ctx.lineTo(w * 0.92, h * 0.08)
      ctx.stroke()

      // Center bridge label
      ctx.font = '500 9px "JetBrains Mono", monospace'
      ctx.fillStyle = 'rgba(59,130,246,0.4)'
      ctx.fillText(labelBridge, w * 0.50, h * 0.05)

      setHoveredNode(foundHover)
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [dimensions])

  return (
    <div className="relative w-full" style={{ maxWidth: '500px' }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          cursor: 'crosshair',
          display: 'block',
        }}
      />

      {/* Hover tooltip */}
      {hoveredNode && (
        <div
          className="pointer-events-none absolute z-10 rounded px-3 py-2 font-mono text-xs"
          style={{
            left: `${hoveredNode.x * 100}%`,
            top: `${hoveredNode.y * 100 - 18}%`,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(5,5,5,0.9)',
            border: `1px solid ${hoveredNode.color}`,
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            boxShadow: `0 0 20px ${hoveredNode.glowColor}`,
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ color: hoveredNode.color, fontWeight: 600 }}>{hoveredNode.name}</div>
          <div style={{ color: '#A0A0A0', fontSize: '10px', marginTop: '2px' }}>
            {hoveredNode.company} · {hoveredNode.region}
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        className="mt-3 flex items-center justify-center gap-6 font-mono text-xs"
        style={{ color: '#666666', letterSpacing: '0.08em' }}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#3B82F6' }} />
          <span>{t('const.east') as string}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#A0A0A0' }} />
          <span>{t('const.west') as string}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-4 rounded-full" style={{ background: 'rgba(59,130,246,0.4)' }} />
          <span>{t('const.bridge') as string}</span>
        </div>
      </div>
    </div>
  )
}
