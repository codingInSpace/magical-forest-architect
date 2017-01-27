import * as THREE from 'three';
const TrackballControls = require('three-trackballcontrols');

/**
 * Main class
 */
class App {
  constructor() {
    this.objects = [];

    this.uniforms = {
      u_time: { type: "f", value: 1.0 },
      u_resolution: { type: "v2", value: new THREE.Vector2() },
      u_sunLightColor: new THREE.Uniform(new THREE.Vector3(1, 0.8, 0.1)),
      u_sunLightPos: new THREE.Uniform(new THREE.Vector3(200.0, 1450.0, -3300.0))
    };

    this.createScene();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
    this.camera.position.set(0.0, 0.0, 150.0);
    this.camera.lookAt(0.0, 0.0, 0.0);

    const sunLight = new THREE.PointLight( 0xf4f142, 10.0, 4000.0 );
    sunLight.position.set(200.0, 1450.0, -3300.0);
    let sunBall = new THREE.Mesh( new THREE.SphereGeometry( 128, 32, 32 ), new THREE.MeshBasicMaterial( { color: 0xF4F142 } ) )
    sunLight.add(sunBall);
    this.sun = sunLight;
    this.scene.add( this.sun );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
    this.uniforms.u_resolution.value.y = this.renderer.domElement.height;

    this.controls = new TrackballControls(this.camera, this.renderer.domElement);

    this.render();
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.objects.forEach((object) => {
        object.update();
    });

    this.uniforms.u_time.value += 0.05;

    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  addObject(object) {
    this.objects.push(object);
    this.scene.add(object.getMesh());
    return object;
  }

}

export default App
