import * as THREE from 'three'
import UniformSingleton from '../../UniformsSingleton'

/**
 * Sun with procedurally animated texture, main light source
 */
class Sun {
  private mesh: THREE.Mesh

  /**
   * Constructor
   * @param {number} size - Size of the sphere geometries
   * @param {number} widthSegments - Width segments of the sphere geometries
   * @param {number} heightSegments - Height segments of the sphere geometries
   * @param {any} position - Object of x, y, z components for sphere position in world space
   * @param {number} lightColor - Color of light source
   */
  constructor(size: number, widthSegments: number, heightSegments: number, position: any, lightColor: number) {
    const uniforms: any = UniformSingleton.Instance.uniforms

    const geometry = new THREE.SphereGeometry(size,  widthSegments, heightSegments)
    const material = new THREE.ShaderMaterial({
      vertexShader: require('./shaders/texture_vert.glsl'),
      fragmentShader: require('./shaders/texture_frag.glsl'),
      uniforms,
      defines: {
        USE_MAP: ''
      },
      side: THREE.FrontSide,
      transparent: true
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(position.x, position.y, position.z)
    this.mesh.rotation.y += Math.PI / 2
    this.mesh.rotation.z -= Math.PI / 2

    // Light source
    this.mesh.add( new THREE.PointLight(lightColor, 1, 3700.0) )

    // Glow object
    this.mesh.add( this.addGlow(size, widthSegments, heightSegments) )
  }

  public getMesh(): THREE.Mesh {
    return this.mesh
  }

  private addGlow(size: number, width: number, height: number): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(2 * size, width, height)
    const material = new THREE.ShaderMaterial({
      vertexShader: require('./shaders/glow_vert.glsl'),
      fragmentShader: require('./shaders/glow_frag.glsl'),
      defines: {
        USE_MAP: ''
      },
      side: THREE.BackSide,
      transparent: true
    })

    return new THREE.Mesh(geometry, material)
  }
}

export default Sun
