import * as THREE from 'three'
import { IPos3D } from './utils/CommonInterfaces'

export interface IAUni {
  type: string,
  value: any
}

// export interface IUniforms {
//   u_time: IAUni,
//   u_resolution: IAUni,
//   u_sunLightColor: IAUni,
//   u_sunLightPos: IAUni,
//   u_sunTexture: IAUni,
//   u_bumpHeight: IAUni,
//   u_height: IAUni,
//   u_hillFactor: IAUni,
//   u_spikyness: IAUni
// }
export interface IUniforms {
  [index: string]: IAUni
}

// Registry of listeners to hill value uniforms.
// Key is the name of the listener as a string
// Value is if they have internally handled an update
// True: Handled update. False: Need to handle update.
export interface IHillValueListeners {
  [index: string]: boolean
}

class UniformSingleton {
  private static instance: UniformSingleton

  public uniforms: IUniforms

  private sunPosition: IPos3D
  private _hillValuesUpdated: boolean
  private _hillValueListeners: IHillValueListeners

  constructor() {
    this._hillValuesUpdated = false
    this._hillValueListeners = {}

    this.sunPosition = { x: 450.0, y: 5000.0, z: 400.0 }
    this.uniforms = {
      u_time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2() },

      u_sunLightColor: { type: 'v3', value: new THREE.Vector3(1.0, 0.7, 0.6) },
      u_sunLightPos: { type: 'v3', value: new THREE.Vector3(this.sunPosition.x, this.sunPosition.y, this.sunPosition.z) },
      u_sunTexture: { type: 't', value: null },

      // hill values
      u_bumpHeight: { type: 'f', value: 50.0 },
      u_height: { type: 'f', value: 5.0 },
      u_hillFactor: { type: 'f', value: 0.0005 },
      u_spikyness: { type: 'f', value: 0.0001 },
    }
  }

  public setHillValuesUpdated(): void {
    this._hillValuesUpdated = true

    // Set all listeners' values to false
    for (const key in this._hillValueListeners) {
      if (this._hillValueListeners.hasOwnProperty(key)) {
        this._hillValueListeners[key] = false
      }
    }
  }

  public hillValuesHaveUpdated(): boolean {
    return this._hillValuesUpdated
  }

  public registerHillValueListener(listenerName: string): void {
    this._hillValueListeners[listenerName] = true
  }

  public hillValueListenerHandledChange(listenerName: string): void {
    if (this._hillValueListeners[listenerName] === undefined) {
      return console.error(`Listener ${listenerName} was not registered before broadcasting change`)
    }

    this._hillValueListeners[listenerName] = true

    // See if there are still listeners that have not handled change
    for (const key in this._hillValueListeners) {
      if (this._hillValueListeners.hasOwnProperty(key)) {
        if (this._hillValueListeners[key] === false) {
          return
        }
      }
    }

    // All listeners handled change, set state back to false
    this._hillValuesUpdated = false
  }

  static get Instance(): UniformSingleton {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new UniformSingleton()
    }
    return this.instance
  }

}

export default UniformSingleton