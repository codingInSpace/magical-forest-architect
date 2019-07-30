import * as THREE from 'three'
const TrackballControls = require('three-trackballcontrols')
import * as TWEEN from '@tweenjs/tween.js'
// import TrackballControls from 'three-trackballcontrols'

import Sun from './components/Sun'
import Uniforms from './UniformsSingleton'
import AppControls from './utils/Controls.ts'

/**
 * Main class
 */
class AppScene {
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer
  public frameCounter: number = 0

  private components: any
  private controls: AppControls
  private clock: THREE.Clock
  private sun: Sun

  constructor() {
    this.components = {}
    this.createScene()
  }

  createScene() {

    // Scene, camera
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('rgb(0,23,23)')

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000)
    this.camera.position.set(-512, -794.0, 208.0)
    this.camera.up = new THREE.Vector3(0.0, 0.0, 1.0)
    this.camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0))

    const uniforms = Uniforms.Instance.uniforms

    // Renderer
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.autoClear = false
    document.body.appendChild(this.renderer.domElement)

    uniforms.u_resolution.value.x = this.renderer.domElement.width
    uniforms.u_resolution.value.y = this.renderer.domElement.height
    this.controls = new AppControls(this.camera, this.renderer.domElement)
    this.clock = new THREE.Clock(true)

    this.render()
  }

  /**
   * Add a component to the components list and render it in scene
   * @param {string} key - The key to set the component as a corresponding value
   * @param component - The instantiated component of the given component class
   * @returns The component that was added
   */
  addComponent(key: string, component: any) {
    this.components[key] = component
    this.scene.add(component)
    return component
  }

  /**
   * Remove an component from the components list and the scene
   * @param {string} key - The key whose value is the component to remove
   * @returns The component that was removed
   */
  removeComponent(key: string) {
    const component = this.components[key]
    this.scene.remove(component)
    delete this.components[key]
    return component
  }

  /**
   * @param key - Name of the component
   */
  getComponent(key: string) {
    return this.components[key]
  }

  render() {
    requestAnimationFrame(() => {
      TWEEN.update()
      this.render()
    })

    this.frameCounter++

    this.renderer.clear()

    Uniforms.Instance.uniforms.u_time.value += 0.05

    for (const key in this.components) {
      if (this.components.hasOwnProperty(key)) {
        this.components[key].update()
      }
    }

    this.renderer.render(this.scene, this.camera)
    this.controls.update(this.clock.getDelta())

    if (this.frameCounter === 120) {
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000)
      this.controls.switchToPlayerView(this.camera, this.renderer.domElement)
      this.camera.position.set(0.0, 0.0, 208.0)
    }
  }
}

export default AppScene
