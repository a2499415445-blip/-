import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './portfolio.css'
import VariableProximity from './components/VariableProximity'
import Beams from './components/Beams'
import usePortfolioMotion from './usePortfolioMotion'

const projects = [
  {
    number: '01', title: '白玫驯野', label: 'AIGC 真人短剧', year: '2026',
    description: '从剧本策划、角色与场景生成，到视频制作与发布运营，独立完成完整的 AI 短剧生产流程。',
    result: '127.8 万播放', source: '/videos/web/white-rose.mp4', cover: '/images/white-rose-cover.jpg', layout: 'landscape-preview', mediaVariant: 'portrait-preview', vertical: true,
  },
  {
    number: '02', title: '太荒寰宇', label: 'AI 3D 国漫', year: '2026',
    description: '以修仙动画的视觉体系为锚点，探索角色、场景与战斗特效的 AI 3D 国漫生成流程。',
    result: '风格流程验证', source: '/videos/web/taihuang-huanyu.mp4', cover: '/images/taihuang-cover.jpg', layout: 'landscape-preview',
  },
  {
    number: '03', title: '反骇为主', label: '赛博 2D 动画', year: '2026',
    description: '研究日式赛博朋克与昭和动画色彩，探索更稳定的二维动画风格控制方法。',
    result: 'AI 2D 风格控制', source: '/videos/web/fan-hai-wei-zhu.mp4', cover: '/images/fan-hai-cover.jpg', layout: 'landscape-preview',
  },
  {
    number: '04', title: '余烬', label: 'AI 商业电影', year: '2026',
    description: '以商业电影镜头语言构建废土世界观，探索电影级画面与特效的低成本生成路径。',
    result: '30 天完成验证', source: '/videos/web/ashes.mp4', layout: 'landscape-preview',
  },
]

const skills = [
  ['创意与叙事', '从爆款结构拆解、剧本开发到分镜设计，让画面始终服务故事。'],
  ['AIGC 制作', '提示词设计、角色场景资产、视频生成和 AI 配音的一体化工作流。'],
  ['视觉风格', '覆盖 3D 国漫、赛博 2D、真人短剧与商业电影等多种影像类型。'],
  ['模型能力', '具备场景、硬表面与武器资产制作经验，理解画面背后的结构。'],
]

const modelAssets = {
  hero: '/images/models/corner-lane-hero-cutout.png',
  colorViews: '/images/models/corner-lane-2.png',
  wireViews: '/images/models/corner-lane-3.png',
  uv: '/images/models/corner-lane-4.png',
  names: '/images/models/corner-lane-5.png',
  topology: '/images/models/corner-lane-6.png',
  coordinates: '/images/models/corner-lane-7.png',
  materials: '/images/models/corner-lane-8.png',
  folders: '/images/models/corner-lane-9.png',
}

const burstGunAssets = {
  hero: '/images/models/burst-gun-hero-cutout.png',
  colorViews: '/images/models/burst-gun-2.png',
  wireViews: '/images/models/burst-gun-3.png',
  uvPrimary: '/images/models/burst-gun-4.png',
  uvSecondary: '/images/models/burst-gun-5.png',
  names: '/images/models/burst-gun-6.png',
  topology: '/images/models/burst-gun-7.png',
  coordinates: '/images/models/burst-gun-8.png',
  materials: '/images/models/burst-gun-9.png',
  folders: '/images/models/burst-gun-10.png',
}

const gaz66Assets = {
  hero: '/images/models/gaz66-hero-cutout.png',
  colorViews: '/images/models/gaz66-2.png',
  wireViews: '/images/models/gaz66-3.png',
  uv: [
    '/images/models/gaz66-4.png',
    '/images/models/gaz66-6.png',
    '/images/models/gaz66-7.png',
    '/images/models/gaz66-8.png',
    '/images/models/gaz66-14.png',
  ],
  names: '/images/models/gaz66-9.png',
  topology: '/images/models/gaz66-10.png',
  coordinates: '/images/models/gaz66-11.png',
  materials: '/images/models/gaz66-12.png',
  folders: '/images/models/gaz66-13.png',
}

const eyeBladeAssets = {
  hero: '/images/models/eye-blade-hero-cutout.png',
  colorViews: '/images/models/eye-blade-2.png',
  wireViews: '/images/models/eye-blade-3.png',
  uvPrimary: '/images/models/eye-blade-4.png',
  uvSecondary: '/images/models/eye-blade-10.png',
  names: '/images/models/eye-blade-5.png',
  topology: '/images/models/eye-blade-6.png',
  coordinates: '/images/models/eye-blade-7.png',
  materials: '/images/models/eye-blade-8.png',
  folders: '/images/models/eye-blade-9.png',
}

function Arrow() { return <span aria-hidden="true">↗</span> }

function ProjectMedia({ project, isActive }) {
  const videoRef = useRef(null)
  const controlsTimer = useRef(null)
  const volumeTimer = useRef(null)
  const [showControls, setShowControls] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(1)
  const [showVolumeControl, setShowVolumeControl] = useState(false)

  const clearControlsTimer = () => {
    if (controlsTimer.current) window.clearTimeout(controlsTimer.current)
  }

  const clearVolumeTimer = () => {
    if (volumeTimer.current) window.clearTimeout(volumeTimer.current)
  }

  const revealControls = () => {
    if (project.layout !== 'landscape-preview' || !isActive) return
    clearControlsTimer()
    setShowControls(true)
    controlsTimer.current = window.setTimeout(() => setShowControls(false), 2000)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video || project.layout !== 'landscape-preview') return undefined

    if (!isActive) {
      clearControlsTimer()
      clearVolumeTimer()
      setShowControls(false)
      setShowVolumeControl(false)
      video.pause()
      video.currentTime = 0
      return undefined
    }

    const timer = window.setTimeout(() => {
      video.play().catch(() => {})
    }, project.layout === 'landscape-preview' ? 520 : 0)

    return () => window.clearTimeout(timer)
  }, [isActive, project.cover, project.layout])

  useEffect(() => () => {
    clearControlsTimer()
    clearVolumeTimer()
  }, [])

  const hasInteractivePreview = Boolean(project.cover || project.layout === 'landscape-preview')

  if (!hasInteractivePreview) {
    return <div className="project-video"><video src={project.source} preload="none" playsInline controls aria-label={`${project.title}视频`} /></div>
  }

  const prepareCoverFrame = (event) => {
    const video = event.currentTarget
    if (video.currentTime === 0 && Number.isFinite(video.duration)) {
      video.currentTime = Math.min(1, video.duration * .04)
    }
  }

  const updateProgress = () => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration === 0) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  const togglePlayback = () => {
    if (project.layout !== 'landscape-preview' || !isActive) return
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
    revealControls()
  }

  const seekPlayback = (event) => {
    event.stopPropagation()
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration === 0) return
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    video.currentTime = video.duration * ratio
    setProgress(ratio * 100)
    revealControls()
  }

  const toggleMute = (event) => {
    event.stopPropagation()
    const video = videoRef.current
    if (!video) return
    const nextMuted = !isMuted
    if (!nextMuted && video.volume === 0) {
      video.volume = .6
      setVolume(.6)
    }
    video.muted = nextMuted
    setIsMuted(nextMuted)
    if (nextMuted) {
      clearVolumeTimer()
      setShowVolumeControl(false)
    } else {
      clearVolumeTimer()
      setShowVolumeControl(true)
      volumeTimer.current = window.setTimeout(() => setShowVolumeControl(false), 2000)
    }
    revealControls()
  }

  const showVolumeSlider = (event) => {
    event.stopPropagation()
    if (isMuted) return
    clearVolumeTimer()
    clearControlsTimer()
    setShowControls(true)
    setShowVolumeControl(true)
    volumeTimer.current = window.setTimeout(() => setShowVolumeControl(false), 2000)
  }

  const keepVolumeSlider = (event) => {
    event.stopPropagation()
    clearVolumeTimer()
    clearControlsTimer()
    setShowControls(true)
    setShowVolumeControl(true)
  }

  const hideVolumeSlider = (event) => {
    event.stopPropagation()
    clearVolumeTimer()
    setShowVolumeControl(false)
    revealControls()
  }

  const changeVolume = (event) => {
    event.stopPropagation()
    const video = videoRef.current
    const nextVolume = Number(event.target.value)
    if (!video) return
    video.volume = nextVolume
    video.muted = nextVolume === 0
    setVolume(nextVolume)
    setIsMuted(nextVolume === 0)
    keepVolumeSlider(event)
  }

  return <div className={`project-video project-preview ${project.layout ?? ''} ${project.mediaVariant ?? ''}`} onMouseMove={revealControls} onClick={togglePlayback}>
    {project.cover ? <img className="project-cover" src={project.cover} alt={`${project.title}横屏封面`} loading="lazy" decoding="async" /> : <video className="project-cover project-cover-video" src={project.source} preload="metadata" muted playsInline aria-label={`${project.title}视频封面`} onLoadedData={prepareCoverFrame} />}
    <video ref={videoRef} className="project-hover-video" src={project.source} preload="none" muted={isMuted} playsInline loop aria-label={`${project.title}视频预览`} onTimeUpdate={updateProgress} onPlay={() => setIsPaused(false)} onPause={() => setIsPaused(true)} />
    {project.layout === 'landscape-preview' && <div className={`preview-progress ${showControls && isActive ? 'is-visible' : ''}`}><span className="preview-progress-icon" aria-hidden="true">{isPaused ? '▶' : 'Ⅱ'}</span><div className="preview-progress-track" role="slider" tabIndex="0" aria-label="视频播放进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)} onClick={seekPlayback}><i style={{ width: `${progress}%` }} /></div><div className="preview-volume-wrap"><button className="preview-volume" type="button" onClick={toggleMute} onMouseEnter={showVolumeSlider} aria-label={isMuted ? '开启声音' : '静音'}>{isMuted ? '🔇' : '🔊'}</button><div className={`preview-volume-control ${showVolumeControl && !isMuted ? 'is-visible' : ''}`} onMouseEnter={keepVolumeSlider} onMouseMove={keepVolumeSlider} onMouseLeave={hideVolumeSlider} onClick={(event) => event.stopPropagation()}><input type="range" min="0" max="1" step="0.01" value={volume} onChange={changeVolume} onClick={(event) => event.stopPropagation()} aria-label="调节音量" /><span>{Math.round(volume * 100)}</span></div></div></div>}
  </div>
}

function ProjectCard({ project }) {
  const [isActive, setIsActive] = useState(false)

  return <article className={`project ${project.vertical ? 'vertical' : ''} ${project.layout ?? ''} ${project.mediaVariant ?? ''}`} onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
    <div className="project-copy"><span className="project-no">{project.number}</span><p>{project.label} · {project.year}</p><h3>{project.title}</h3><p className="project-desc">{project.description}</p><strong>{project.result}</strong></div>
    <ProjectMedia project={project} isActive={isActive} />
  </article>
}

function ModelImage(props) {
  return <img loading="lazy" decoding="async" {...props} />
}

function ProximityText({ label, className = '', radius = 180, falloff = 'gaussian' }) {
  const textRef = useRef(null)
  return <span className={`proximity-text ${className}`} ref={textRef}><VariableProximity label={label} containerRef={textRef} radius={radius} falloff={falloff} fromFontVariationSettings="'wght' 500, 'opsz' 14" toFontVariationSettings="'wght' 900, 'opsz' 56" /></span>
}

function App() {
  const readPage = () => window.location.hash === '#models' ? 'models' : 'aigc'
  const [activePage, setActivePage] = useState(readPage)
  const [wechatOpen, setWechatOpen] = useState(false)
  const heroTypeRef = useRef(null)
  const appRef = useRef(null)

  usePortfolioMotion(appRef, activePage)

  useEffect(() => {
    const syncPage = () => setActivePage(readPage())
    window.addEventListener('hashchange', syncPage)
    window.addEventListener('popstate', syncPage)
    return () => {
      window.removeEventListener('hashchange', syncPage)
      window.removeEventListener('popstate', syncPage)
    }
  }, [])

  const navigateTo = (page, targetId) => {
    const hash = page === 'models' ? '#models' : '#aigc'
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
    setActivePage(page)
    requestAnimationFrame(() => {
      if (targetId) {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  const handleNavigation = (event) => {
    const link = event.target.closest('a')
    const href = link?.getAttribute('href')
    const aigcTargets = ['#top', '#about', '#work', '#skills', '#contact']
    if (href === '#models') {
      event.preventDefault()
      navigateTo('models')
    } else if (aigcTargets.includes(href)) {
      event.preventDefault()
      navigateTo('aigc', href === '#top' ? undefined : href.slice(1))
    }
  }

  return <main ref={appRef} className={`app-shell is-${activePage}`} onClick={handleNavigation}>
    <nav className="site-nav wrap">
      <a className="wordmark" href="#top">周琪淦 <small>作品集</small></a>
      <div className="nav-links"><a href="#about">关于我</a><a href="#work">AIGC 作品</a><a href="#models">模型作品</a><a href="#skills">能力</a><a href="#contact">联系</a></div>
      <button className="nav-action" type="button" onClick={(event) => { event.stopPropagation(); setWechatOpen(true) }}>联系合作 <Arrow /></button>
    </nav>
    {wechatOpen && <div className="wechat-modal" role="dialog" aria-modal="true" aria-label="微信二维码" onClick={() => setWechatOpen(false)}><div className="wechat-modal-card" onClick={(event) => event.stopPropagation()}><button className="wechat-modal-close" type="button" aria-label="关闭" onClick={() => setWechatOpen(false)}>×</button><img src="/images/contact/wechat-qr.jpg" alt="微信添加好友二维码" /></div></div>}

    <div className="aigc-page" hidden={activePage !== 'aigc'}>
    <section className="hero" id="top">
      <div className="hero-beams" aria-hidden="true">
        <Beams beamWidth={2} beamHeight={19} beamNumber={10} lightColor="#ffffff" speed={2} noiseIntensity={1.75} scale={.2} rotation={-8} />
      </div>
      <div className="hero-opening-curtain" aria-hidden="true" />
      <div className="hero-orb one" /><div className="hero-orb two" />
      <div className="wrap hero-content">
        <p className="overline hero-overline" ref={heroTypeRef}><VariableProximity label="AIGC VIDEO DESIGNER" containerRef={heroTypeRef} radius={150} /><span> · 编导</span></p>
        <h1><ProximityText label="将想象，" radius={230} /><br /><em><ProximityText label="落入画面。" radius={230} /></em></h1>
        <p className="hero-lead">我将生成式技术转化为完整的影像生产能力：从概念、叙事，到可被观看与传播的故事。</p>
        <div className="hero-actions"><a className="primary-button" href="#work">浏览作品 <span>↓</span></a></div>
        <div className="hero-video"><video src="/videos/web/white-rose.mp4" poster="/images/white-rose-home.jpg" preload="none" playsInline aria-label="白玫驯野竖屏作品封面" /></div>
        <div className="hero-view-count" aria-label="125W+ 浏览量"><strong>125W<em>+</em></strong><p>浏览量</p></div>
      </div>
    </section>

    <section className="intro section" id="about">
      <div className="intro-inner wrap">
        <div className="section-label">个人简介</div>
        <div className="intro-grid">
          <div className="intro-identity">
            <p className="intro-role">AIGC 视频设计师 / 编导</p>
            <h2><ProximityText label="周琪淦" radius={190} /></h2>
            <p className="intro-note">技术不是目的，感受才是。</p>
          </div>
          <div className="intro-focus">
            <div className="intro-focus-block">
              <span className="intro-focus-label">我想做什么</span>
              <p className="large-copy">把生成式技术转化成真正能讲故事、能被观看与传播的影像。</p>
            </div>
            <div className="intro-focus-block">
              <span className="intro-focus-label">我能做什么</span>
              <p className="body-copy">从创意策略、脚本与分镜，到角色与场景资产、视频生成、剪辑和后期成片，独立完成端到端的 AIGC 影像制作。</p>
            </div>
            <div className="contact-inline"><a href="mailto:tlfejl@outlook.com">tlfejl@outlook.com</a><a href="tel:18011830103">180 1183 0103</a></div>
          </div>
        </div>
        <div className="stats"><div><strong>1.278M</strong><span>短剧单项目播放量</span></div><div><strong>04</strong><span>已完成 AIGC 影像项目</span></div><div><strong>端到端</strong><span>完整影像制作工作流</span></div></div>
      </div>
    </section>

    <section className="work section" id="work">
      <div className="wrap"><div className="work-head"><div className="section-label">精选 AIGC 作品</div><h2><ProximityText label="让作品，" radius={190} /><br /><em><ProximityText label="自己说话。" radius={190} /></em></h2><p>将鼠标移入画面即可播放，点击可暂停或跳转进度。</p></div>
        <div className="project-list">{projects.map((project) => <ProjectCard project={project} key={project.number} />)}</div>
      </div>
    </section>

    <section className="skills section wrap" id="skills"><div className="section-label">核心能力</div><h2><ProximityText label="从灵感，" radius={190} /><br /><em><ProximityText label="到成片。" radius={190} /></em></h2><div className="skill-grid">{skills.map(([title, detail], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{detail}</p></article>)}</div></section>

    </div>

    <section className="models" id="models" hidden={activePage !== 'models'}>
      <div className="model-page model-landing wrap">
        <div className="model-landing-copy">
          <p className="section-label">模型作品</p>
          <p className="model-kicker">场景建模 · UV · 材质制作</p>
          <h2>巷口小集<span><ProximityText label="Corner Lane" radius={150} /><br /><ProximityText label="Bazaar" radius={150} /></span></h2>
          <p className="model-summary">一组低多边形风格的中式街角市集场景。围绕生活化摊位、建筑层级与色彩节奏完成建模、UV 拆分与材质整理。</p>
          <div className="model-facts"><span>场景资产</span><span>38,342 三角面</span><span>4 组 UV 图集</span></div>
        </div>
        <figure className="model-hero-art"><ModelImage src={modelAssets.hero} alt="巷口小集完整场景模型" /></figure>
      </div>

      <div className="model-page model-views-page wrap">
        <header className="model-page-head"><div><p className="section-label">多视图展示</p><h3>完整形体，<em>逐面可读。</em></h3></div><p>从整体视角、前后侧面到线框结构，保持模型比例、层级关系与细节密度的一致性。</p></header>
        <div className="model-view-comparison"><figure><figcaption>彩色视图 / 四视角</figcaption><ModelImage src={modelAssets.colorViews} alt="巷口小集彩色四视图" /></figure><figure><figcaption>白模视图 / 结构检查</figcaption><ModelImage src={modelAssets.wireViews} alt="巷口小集白模四视图" /></figure></div>
      </div>

      <div className="model-page model-tech-page wrap">
        <header className="model-page-head"><div><p className="section-label">资产与交付</p><h3>从纹理到命名，<em>保持可交付。</em></h3></div><p>以规范的 UV 图集、模型命名、材质与文件结构组织场景资产，便于后续调用、检查与迭代。</p></header>
        <div className="model-tech-grid">
        <figure className="tech-uv"><figcaption><span>UV / 贴图图集</span><small>4 Sets · Albedo / Normal</small></figcaption><ModelImage src={modelAssets.uv} alt="巷口小集 UV 贴图图集" /></figure>
          <div className="tech-details">
          <figure><figcaption>模型命名</figcaption><ModelImage src={modelAssets.names} alt="模型命名列表" /></figure>
          <figure><figcaption>坐标归零</figcaption><ModelImage src={modelAssets.coordinates} alt="模型坐标设置" /></figure>
          <figure><figcaption>面数统计</figcaption><ModelImage src={modelAssets.topology} alt="模型三角面统计" /></figure>
          <figure><figcaption>材质整理</figcaption><ModelImage src={modelAssets.materials} alt="模型材质面板" /></figure>
          <figure className="tech-folders"><figcaption>文件结构</figcaption><ModelImage src={modelAssets.folders} alt="项目文件夹结构" /></figure>
          </div>
        </div>
      </div>

      <div className="model-page model-landing wrap">
        <div className="model-landing-copy">
          <p className="section-label">模型作品</p>
          <p className="model-kicker">硬表面建模 · 武器资产 · PBR 材质</p>
          <h2>爆裂枪<span><ProximityText label="Burst" radius={150} /><br /><ProximityText label="Cannon" radius={150} /></span></h2>
          <p className="model-summary">一件未来感硬表面武器资产。围绕主体结构、机械细节、UV 拆分与材质制作完成完整的游戏资产制作流程。</p>
          <div className="model-facts"><span>硬表面资产</span><span>9,942 三角面</span><span>2 组 UV 图集</span></div>
        </div>
        <figure className="model-hero-art model-weapon-art"><ModelImage src={burstGunAssets.hero} alt="爆裂枪完整武器模型" /></figure>
      </div>

      <div className="model-page model-views-page wrap">
        <header className="model-page-head"><div><p className="section-label">多视图展示</p><h3>硬表面结构，<em>清晰可读。</em></h3></div><p>通过彩色四视图与线框检查，呈现武器主体、机械关节与局部细节的完整结构关系。</p></header>
        <div className="model-view-comparison"><figure><figcaption>彩色视图 / 四视角</figcaption><ModelImage src={burstGunAssets.colorViews} alt="爆裂枪彩色四视图" /></figure><figure><figcaption>线框视图 / 结构检查</figcaption><ModelImage src={burstGunAssets.wireViews} alt="爆裂枪线框四视图" /></figure></div>
      </div>

      <div className="model-page model-tech-page wrap">
        <header className="model-page-head"><div><p className="section-label">资产与交付</p><h3>从结构到交付，<em>保持可追溯。</em></h3></div><p>以双组 UV、命名规范、坐标归零、材质整理与目录结构完成可复用的硬表面资产交付。</p></header>
        <div className="model-tech-grid">
        <figure className="tech-uv"><figcaption><span>UV / 贴图图集</span><small>2 Sets · Albedo / Normal</small></figcaption><div className="tech-uv-stack"><ModelImage src={burstGunAssets.uvPrimary} alt="爆裂枪第一组 UV 贴图" /><ModelImage src={burstGunAssets.uvSecondary} alt="爆裂枪第二组 UV 贴图" /></div></figure>
          <div className="tech-details">
          <figure><figcaption>模型命名</figcaption><ModelImage src={burstGunAssets.names} alt="爆裂枪模型命名列表" /></figure>
          <figure><figcaption>坐标归零</figcaption><ModelImage src={burstGunAssets.coordinates} alt="爆裂枪坐标设置" /></figure>
          <figure><figcaption>面数统计</figcaption><ModelImage src={burstGunAssets.topology} alt="爆裂枪三角面统计" /></figure>
          <figure><figcaption>材质整理</figcaption><ModelImage src={burstGunAssets.materials} alt="爆裂枪材质面板" /></figure>
          <figure className="tech-folders"><figcaption>文件结构</figcaption><ModelImage src={burstGunAssets.folders} alt="爆裂枪项目文件夹结构" /></figure>
          </div>
        </div>
      </div>

      <div className="model-page model-landing wrap">
        <div className="model-landing-copy">
          <p className="section-label">模型作品</p>
          <p className="model-kicker">车辆建模 · 旧化材质 · PBR 资产</p>
          <h2>GAZ-66<span><ProximityText label="Military" radius={150} /><br /><ProximityText label="Truck" radius={150} /></span></h2>
          <p className="model-summary">一辆带有使用痕迹的 GAZ-66 军用卡车资产。围绕车体结构、底盘细节、贴图拆分与旧化材质完成完整制作与交付。</p>
          <div className="model-facts"><span>车辆资产</span><span>49,800 三角面</span><span>5 组 UV 图集</span></div>
        </div>
        <figure className="model-hero-art model-vehicle-art"><ModelImage src={gaz66Assets.hero} alt="GAZ-66 军用卡车完整模型" /></figure>
      </div>

      <div className="model-page model-views-page wrap">
        <header className="model-page-head"><div><p className="section-label">多视图展示</p><h3>车体结构，<em>完整可检。</em></h3></div><p>通过彩色四视图与白模结构检查，呈现驾驶舱、货斗、底盘与车轮等车辆组件的完整关系。</p></header>
        <div className="model-view-comparison"><figure><figcaption>彩色视图 / 四视角</figcaption><ModelImage src={gaz66Assets.colorViews} alt="GAZ-66 彩色四视图" /></figure><figure><figcaption>白模视图 / 结构检查</figcaption><ModelImage src={gaz66Assets.wireViews} alt="GAZ-66 白模四视图" /></figure></div>
      </div>

      <div className="model-page model-tech-page wrap">
        <header className="model-page-head"><div><p className="section-label">资产与交付</p><h3>从车体到贴图，<em>保持可交付。</em></h3></div><p>以五组 UV 图集、命名规则、归零检查、材质面板与项目目录组织车辆资产，便于后续使用与维护。</p></header>
        <div className="model-tech-grid">
        <figure className="tech-uv"><figcaption><span>UV / 贴图图集</span><small>5 Sets · Albedo / Normal</small></figcaption><div className="tech-uv-stack tech-uv-stack-five">{gaz66Assets.uv.map((source, index) => <ModelImage src={source} alt={`GAZ-66 第 ${index + 1} 组 UV 贴图`} key={source} />)}</div></figure>
          <div className="tech-details">
          <figure><figcaption>模型命名</figcaption><ModelImage src={gaz66Assets.names} alt="GAZ-66 模型命名列表" /></figure>
          <figure><figcaption>坐标归零</figcaption><ModelImage src={gaz66Assets.coordinates} alt="GAZ-66 坐标设置" /></figure>
          <figure><figcaption>面数统计</figcaption><ModelImage src={gaz66Assets.topology} alt="GAZ-66 三角面统计" /></figure>
          <figure><figcaption>材质整理</figcaption><ModelImage src={gaz66Assets.materials} alt="GAZ-66 材质面板" /></figure>
          <figure className="tech-folders"><figcaption>文件结构</figcaption><ModelImage src={gaz66Assets.folders} alt="GAZ-66 项目文件夹结构" /></figure>
          </div>
        </div>
      </div>

      <div className="model-page model-landing wrap">
        <div className="model-landing-copy">
          <p className="section-label">模型作品</p>
          <p className="model-kicker">奇幻武器 · 生物结构 · 材质制作</p>
          <h2>蚀心妖瞳刃<span><ProximityText label="Corrupted" radius={150} /><br /><ProximityText label="Eye Blade" radius={150} /></span></h2>
          <p className="model-summary">一件融合异化生物结构与石质刀刃的奇幻武器资产。围绕轮廓塑造、局部细节、UV 拆分与材质表现完成完整制作。</p>
          <div className="model-facts"><span>奇幻武器资产</span><span>14,619 三角面</span><span>2 组 UV 图集</span></div>
        </div>
        <figure className="model-hero-art model-weapon-art model-eye-blade-art"><ModelImage src={eyeBladeAssets.hero} alt="蚀心妖瞳刃完整模型" /></figure>
      </div>

      <div className="model-page model-views-page wrap">
        <header className="model-page-head"><div><p className="section-label">多视图展示</p><h3>异化轮廓，<em>结构可读。</em></h3></div><p>通过彩色四视图与白模结构检查，展示刀刃、瞳目主体与寄生触须等造型层次。</p></header>
        <div className="model-view-comparison"><figure><figcaption>彩色视图 / 四视角</figcaption><ModelImage src={eyeBladeAssets.colorViews} alt="蚀心妖瞳刃彩色四视图" /></figure><figure><figcaption>白模视图 / 结构检查</figcaption><ModelImage src={eyeBladeAssets.wireViews} alt="蚀心妖瞳刃白模四视图" /></figure></div>
      </div>

      <div className="model-page model-tech-page wrap">
        <header className="model-page-head"><div><p className="section-label">资产与交付</p><h3>从材质到结构，<em>保持可追溯。</em></h3></div><p>以双组 UV 图集、命名规范、归零检查、材质整理与目录结构组织武器资产，便于后续调用与维护。</p></header>
        <div className="model-tech-grid">
        <figure className="tech-uv"><figcaption><span>UV / 贴图图集</span><small>2 Sets · Albedo / Normal</small></figcaption><div className="tech-uv-stack"><ModelImage src={eyeBladeAssets.uvPrimary} alt="蚀心妖瞳刃第一组 UV 贴图" /><ModelImage src={eyeBladeAssets.uvSecondary} alt="蚀心妖瞳刃第二组 UV 贴图" /></div></figure>
          <div className="tech-details">
          <figure><figcaption>模型命名</figcaption><ModelImage src={eyeBladeAssets.names} alt="蚀心妖瞳刃模型命名列表" /></figure>
          <figure><figcaption>坐标归零</figcaption><ModelImage src={eyeBladeAssets.coordinates} alt="蚀心妖瞳刃坐标设置" /></figure>
          <figure><figcaption>面数统计</figcaption><ModelImage src={eyeBladeAssets.topology} alt="蚀心妖瞳刃三角面统计" /></figure>
          <figure><figcaption>材质整理</figcaption><ModelImage src={eyeBladeAssets.materials} alt="蚀心妖瞳刃材质面板" /></figure>
          <figure className="tech-folders"><figcaption>文件结构</figcaption><ModelImage src={eyeBladeAssets.folders} alt="蚀心妖瞳刃项目文件夹结构" /></figure>
          </div>
        </div>
      </div>
    </section>

    <footer className="contact section" id="contact"><div className="wrap"><p className="overline">开放精选合作</p><h2><ProximityText label="下一个画面，" radius={210} /><br /><em><ProximityText label="从这里开始。" radius={210} /></em></h2><div className="contact-actions"><a className="mail" href="mailto:tlfejl@outlook.com">tlfejl@outlook.com <Arrow /></a><button className="wechat-contact-button" type="button" onClick={(event) => { event.stopPropagation(); setWechatOpen(true) }}>添加微信 <Arrow /></button></div><div className="footer-line"><span>周琪淦 · AIGC 视频设计师</span><a href="#top">回到顶部 ↑</a></div></div></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
