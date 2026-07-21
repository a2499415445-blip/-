import { useEffect, useRef } from 'react'

const noise = `
float random (in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
float noise (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) +
    (c - a) * u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`

const vertexFunctions = `
uniform float time;
uniform float uSpeed;
uniform float uScale;
${noise}

float getPos(vec3 pos) {
  vec3 noisePos = vec3(pos.x * 0.0, pos.y - uv.y, pos.z + time * uSpeed * 3.0) * uScale;
  return cnoise(noisePos);
}
vec3 getCurrentPos(vec3 pos) {
  vec3 newpos = pos;
  newpos.z += getPos(pos);
  return newpos;
}
vec3 getNormal(vec3 pos) {
  vec3 curpos = getCurrentPos(pos);
  vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
  vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
  vec3 tangentX = normalize(nextposX - curpos);
  vec3 tangentZ = normalize(nextposZ - curpos);
  return normalize(cross(tangentZ, tangentX));
}
`

function createStackedPlanes(THREE, count, width, height, heightSegments = 100) {
  const safeCount = Math.max(1, Math.round(count))
  const numVertices = safeCount * (heightSegments + 1) * 2
  const positions = new Float32Array(numVertices * 3)
  const uvs = new Float32Array(numVertices * 2)
  const indices = new Uint32Array(safeCount * heightSegments * 6)
  const totalWidth = safeCount * width
  const xOffsetBase = -totalWidth / 2
  let vertexOffset = 0
  let uvOffset = 0
  let indexOffset = 0

  // A deterministic seed keeps the composition stable between page changes.
  let seed = 9173
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  for (let index = 0; index < safeCount; index += 1) {
    const xOffset = xOffsetBase + index * width
    const uvXOffset = random() * 300
    const uvYOffset = random() * 300

    for (let segment = 0; segment <= heightSegments; segment += 1) {
      const y = height * (segment / heightSegments - .5)
      positions.set([xOffset, y, 0, xOffset + width, y, 0], vertexOffset * 3)
      const uvY = segment / heightSegments + uvYOffset
      uvs.set([uvXOffset, uvY, uvXOffset + 1, uvY], uvOffset)

      if (segment < heightSegments) {
        const a = vertexOffset
        const b = vertexOffset + 1
        const c = vertexOffset + 2
        const d = vertexOffset + 3
        indices.set([a, b, c, c, b, d], indexOffset)
        indexOffset += 6
      }

      vertexOffset += 2
      uvOffset += 4
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))
  geometry.computeVertexNormals()
  return geometry
}

function mountBeams(THREE, root, options) {
  const {
    beamWidth,
    beamHeight,
    beamNumber,
    lightColor,
    speed,
    noiseIntensity,
    scale,
    rotation,
  } = options

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  renderer.setClearColor(0x000000, 1)
  renderer.domElement.className = 'beams-canvas'
  renderer.domElement.setAttribute('aria-hidden', 'true')
  root.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  const camera = new THREE.PerspectiveCamera(30, 1, .1, 1000)
  camera.position.set(0, 0, 20)
  camera.lookAt(0, 0, 0)

  const geometry = createStackedPlanes(THREE, beamNumber, beamWidth, beamHeight)
  const timeUniform = { value: 0 }
  const speedUniform = { value: speed }
  const scaleUniform = { value: scale }
  const noiseUniform = { value: noiseIntensity }

  const material = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: .3,
    metalness: .3,
  })
  material.onBeforeCompile = (shader) => {
    shader.uniforms.time = timeUniform
    shader.uniforms.uSpeed = speedUniform
    shader.uniforms.uScale = scaleUniform
    shader.uniforms.uNoiseIntensity = noiseUniform
    shader.vertexShader = shader.vertexShader
      .replace('void main() {', `${vertexFunctions}\nvoid main() {`)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.z += getPos(transformed.xyz);')
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nobjectNormal = getNormal(position.xyz);')
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', `uniform float uNoiseIntensity;\n${noise}\nvoid main() {`)
      .replace(
        '#include <dithering_fragment>',
        '#include <dithering_fragment>\nfloat randomNoise = noise(gl_FragCoord.xy);\ngl_FragColor.rgb -= randomNoise / 15.0 * uNoiseIntensity;',
      )
  }
  material.customProgramCacheKey = () => `react-bits-beams-${speed}-${noiseIntensity}-${scale}`

  const group = new THREE.Group()
  group.rotation.z = THREE.MathUtils.degToRad(rotation)
  scene.add(group)

  const mesh = new THREE.Mesh(geometry, material)
  group.add(mesh)

  const directionalLight = new THREE.DirectionalLight(new THREE.Color(lightColor), 1)
  directionalLight.position.set(0, 3, 10)
  group.add(directionalLight)
  scene.add(new THREE.AmbientLight(0xffffff, 1))

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let animationFrame = 0
  let lastTime = performance.now()
  let lastRender = 0
  let inView = true
  let pageVisible = !document.hidden
  let destroyed = false

  const render = (now = performance.now()) => {
    const delta = Math.min((now - lastTime) / 1000, .1)
    lastTime = now
    timeUniform.value += .1 * delta
    renderer.render(scene, camera)
  }

  const frame = (now) => {
    if (now - lastRender >= 1000 / 45) {
      render(now)
      lastRender = now
    }
    animationFrame = window.requestAnimationFrame(frame)
  }

  const syncAnimation = () => {
    window.cancelAnimationFrame(animationFrame)
    animationFrame = 0
    lastTime = performance.now()
    if (!destroyed && inView && pageVisible && !reducedMotion) animationFrame = window.requestAnimationFrame(frame)
    else render()
  }

  const resize = () => {
    const bounds = root.getBoundingClientRect()
    const width = Math.max(1, Math.round(bounds.width))
    const height = Math.max(1, Math.round(bounds.height))
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    render()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(root)
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    syncAnimation()
  }, { rootMargin: '160px 0px', threshold: .01 })
  visibilityObserver.observe(root)

  const onVisibilityChange = () => {
    pageVisible = !document.hidden
    syncAnimation()
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  resize()
  syncAnimation()

  return () => {
    destroyed = true
    window.cancelAnimationFrame(animationFrame)
    resizeObserver.disconnect()
    visibilityObserver.disconnect()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }
}

export default function Beams({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = '#ffffff',
  speed = 2,
  noiseIntensity = 1.75,
  scale = .2,
  rotation = 0,
}) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    let disposed = false
    let destroy = () => {}

    import('three')
      .then((THREE) => {
        if (disposed) return
        try {
          destroy = mountBeams(THREE, root, {
            beamWidth,
            beamHeight,
            beamNumber,
            lightColor,
            speed,
            noiseIntensity,
            scale,
            rotation,
          })
        } catch {
          root.classList.add('beams-fallback')
        }
      })
      .catch(() => root.classList.add('beams-fallback'))

    return () => {
      disposed = true
      destroy()
    }
  }, [beamHeight, beamNumber, beamWidth, lightColor, noiseIntensity, rotation, scale, speed])

  return <div className="beams-root" ref={rootRef} aria-hidden="true" />
}
