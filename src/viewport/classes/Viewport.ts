//@ts-nocheck

import * as THREE from 'three';
import IViewport from '../interfaces/iViewport';
import { BlurSaberModule, ReeSaber } from '../../reesaberbuilder';
import Color from '../../reesaberbuilder/classes/base/Color';
import IModule from '../../reesaberbuilder/interfaces/iModule';
import IColor from '../../reesaberbuilder/interfaces/base/iColor';

export default class Viewport implements IViewport {
    file: ReeSaber;
    lastModules: IModule[] = [];
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    model = new THREE.Group();
    keys: any[] = [];

    constructor(file: ReeSaber) {
        this.file = file;
        this.lastModules = this.lastModules.concat(this.file.Modules)

        this.resizeWindow();
        window.addEventListener("resize", () => {
            this.resizeWindow();
        });

        this.renderer.setAnimationLoop(() => {
          this.moveCamera();
          if (this.file.Modules != this.lastModules) {
            this.loadModel();
            this.lastModules = this.file.Modules;
          }
          this.renderer.render(this.scene, this.camera);
        })

        document.body.appendChild(this.renderer.domElement);

        this.camera.translateY(0.415);
        this.camera.rotateY(Math.PI);
        this.camera.translateZ(1);

        this.scene.background = new THREE.Color().setRGB(0.5, 0.5, 0.5);
        

        this.createMovementListener();
        this.createDragListener();
        
    }

    createDragListener(): void {
        let elem = this.renderer.domElement;
        
        elem.addEventListener("mousedown", (e) => {

            if (e.button == 1) {
                const move = (event: any) => {
                    this.camera.rotation.order = "YXZ";
                    this.camera.rotateY(-event.movementX / 500);
                    this.camera.rotateX(-event.movementY / 500);
                    this.camera.rotation.z = 0;
                    elem.style.cursor = "move";
                }

                elem.addEventListener("mousemove", move)

                elem.addEventListener("mouseup", (event) => {
                    elem.removeEventListener("mousemove", move);
                    elem.style.cursor = "auto";
                })

                elem.addEventListener("mouseout", (event) => {
                  elem.removeEventListener("mousemove", move);
                  elem.style.cursor = "auto";
              })
            }
        })
    }

    createMovementListener(): void {
      document.addEventListener("keydown", (e) => {
        if (e.repeat) return;
        this.keys.push(e.key);
      })
      document.addEventListener("keyup", (e) => {
        this.keys = this.keys.filter((key) => key != e.key)
      })
    }

    // TODO: fix to dispose better
    clearModel(): void {

        this.scene.remove( this.model );
        this.model = new THREE.Group();
    }

    calculateVertex(value: any, thickness: number, index: number, verticalResolution: number, type: string): number {
      if (typeof value != "number") console.error("calculateVertex: value is not a number");
      
      switch (type) {
        case "cos":
          return value * thickness * Math.cos(((index) / verticalResolution) * 2 * Math.PI);
        case "sin":
          return value * thickness * Math.sin(((index) / verticalResolution) * 2 * Math.PI);
        default:
          return 0;
      }
    }

    calculateVertices(module: BlurSaberModule, interpolationType: number): number[] {
        let v: number[] = [];

        const profile = module.Config.SaberSettings.saberProfile;
        const thickness = module.Config.SaberSettings.thickness * 0.0224 / 2;
        const depth = module.Config.SaberSettings.zOffsetTo - module.Config.SaberSettings.zOffsetFrom;

        const startCap = module.Config.SaberSettings.startCap
        const endCap = module.Config.SaberSettings.endCap

        const zOffsetFrom = module.Config.SaberSettings.zOffsetFrom
        const zOffsetTo = module.Config.SaberSettings.zOffsetTo

        const controlPoints = profile.controlPoints
        
        const verticalResolution = module.Config.SaberSettings.verticalResolution
        const horizontalResolution = module.Config.SaberSettings.horizontalResolution

        switch (interpolationType) {

          // Constant
          case 0:
            for (let point = 0; point < controlPoints.length; point++) {

              if (typeof controlPoints[point].value != "number") break;

              // Skip endCap generation if disabled
              if (point == controlPoints.length - 1 && endCap == false) break;

              for (let i = 0; i < verticalResolution; i++) {

                // Generate vertices for startCap (bottom of module)
                if (point == 0 && startCap == true) {
                  v = v.concat([
                    0,
                    zOffsetFrom, 
                    0,

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),
                    
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin")
                  ])
                }

                // Generate vertices from last value to connect faces to current value
                if (controlPoints[point-1]) {
                  v = v.concat([
                    this.calculateVertex(controlPoints[point-1].value, thickness, i, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point-1].value, thickness, i, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point-1].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point-1].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point-1].value, thickness, i, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point-1].value, thickness, i, verticalResolution, "sin")
                  ])
                }

                v = v.concat([
                  this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                  controlPoints[point].time * depth + zOffsetFrom,
                  this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin")
                ]);
                
                // Generate next vertices, if possible
                if(controlPoints[point+1]) {
                  v = v.concat([
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    controlPoints[point+1].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point+1].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point+1].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),
                  ]);

                // Generate connection to endCap
                } else {
                  v = v.concat([
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    module.Config.SaberSettings.zOffsetTo,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    module.Config.SaberSettings.zOffsetTo,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    module.Config.SaberSettings.zOffsetTo,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),

                  ]);

                  // Generate endCap
                  v = v.concat([
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    module.Config.SaberSettings.zOffsetTo,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    module.Config.SaberSettings.zOffsetTo,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),

                    0,
                    zOffsetTo,
                    0
                  ]);
                }
              }
            }
            break;

          // Linear
          default:
            for (let point = 0; point < controlPoints.length; point++) {

              if (typeof controlPoints[point].value != "number") break;

              // Skip endCap generation if disabled
              if (point == controlPoints.length - 1 && endCap == false) break;

              for (let i = 0; i < verticalResolution; i++) {

                // Generate vertices for startCap (bottom of module)
                if (point == 0 && startCap == true) {
                  v = v.concat([
                    0,
                    zOffsetFrom, 
                    0,

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),
                    
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),
                  ])

                  // Generate constant vertices to connect to 1st control point in case time is not at 0
                  v = v.concat([
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin")
                  ])
                }

                v = v.concat([
                  this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                  controlPoints[point].time * depth + zOffsetFrom,
                  this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin")
                ]);
                
                // Generate next vertices, if possible
                if(controlPoints[point+1]) {
                  v = v.concat([
                    this.calculateVertex(controlPoints[point+1].value, thickness, i, verticalResolution, "cos"),
                    controlPoints[point+1].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point+1].value, thickness, i, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point+1].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point+1].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point+1].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point+1].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point+1].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point+1].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),
                  ]);

                // Generate connection to endCap
                } else {
                  v = v.concat([
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    module.Config.SaberSettings.zOffsetTo,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    module.Config.SaberSettings.zOffsetTo,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    module.Config.SaberSettings.zOffsetTo,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    controlPoints[point].time * depth + zOffsetFrom,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),

                  ]);

                  // Generate endCap
                  v = v.concat([
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "cos"),
                    module.Config.SaberSettings.zOffsetTo,
                    this.calculateVertex(controlPoints[point].value, thickness, i+1, verticalResolution, "sin"),

                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "cos"),
                    module.Config.SaberSettings.zOffsetTo,
                    this.calculateVertex(controlPoints[point].value, thickness, i, verticalResolution, "sin"),

                    0,
                    zOffsetTo,
                    0
                  ]);
                }
              }
            }

        }
        
        return v;
    }

    loadModel(): void {
        this.clearModel();
        let flatmodules = this.file.softflatten();
        for (let module in flatmodules) {
            if (flatmodules[module].ModuleId == "reezonate.blur-saber") {
                let saber = flatmodules[module];
                
                let v = this.calculateVertices(saber, flatmodules[module].Config.SaberSettings.saberProfile.interpolationType);
        
                let geometry = new THREE.BufferGeometry();
                geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(v), 3));
                geometry.computeBoundingBox();

                let gradientColors = [];
                let times = []
                for (let point in saber.Config.SaberSettings.maskSettings.bladeMappings.colorOverValue.controlPoints) {
                    //@ts-ignore
                    gradientColors.push(saber.Config.SaberSettings.maskSettings.bladeMappings.colorOverValue.controlPoints[point].value.r,
                        //@ts-ignore
                        saber.Config.SaberSettings.maskSettings.bladeMappings.colorOverValue.controlPoints[point].value.g,
                        //@ts-ignore
                        saber.Config.SaberSettings.maskSettings.bladeMappings.colorOverValue.controlPoints[point].value.b
                    );
                    times.push(saber.Config.SaberSettings.maskSettings.bladeMappings.colorOverValue.controlPoints[point].time)
                }

                let handleTransparencies = [];
                let handleTimes = []
                for (let point in saber.Config.SaberSettings.maskSettings.handleMask.controlPoints) {
                    handleTransparencies.push(saber.Config.SaberSettings.maskSettings.handleMask.controlPoints[point].value);
                    handleTimes.push(saber.Config.SaberSettings.maskSettings.handleMask.controlPoints[point].time);
                }

                var material = new THREE.ShaderMaterial({
                    uniforms: {
                      bladeTimes: {
                        value: times
                      },
                      bladeColors: {
                        value: gradientColors
                      },
                      bladeLength: {
                        value: times.length
                      },
                      handleTimes: {
                        value: handleTimes
                      },
                      handleValues: {
                        value: handleTransparencies
                      },
                      handleLength: {
                        value: handleTimes.length
                      },
                      handleColor: {
                        value: new THREE.Color().setRGB(
                            saber.Config.SaberSettings.handleColor.r,
                            saber.Config.SaberSettings.handleColor.g,
                            saber.Config.SaberSettings.handleColor.b
                        )
                      },
                      bboxMin: {
                        value: geometry.boundingBox?.min
                      },
                      bboxMax: {
                        value: geometry.boundingBox?.max
                      }
                    },
                    vertexShader: `
                      uniform vec3 bboxMin;
                      uniform vec3 bboxMax;
                    
                      varying vec2 vUv;
                  
                      void main() {
                        vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                      }
                    `,
                    fragmentShader: `
                      uniform vec3 bladeColors[100];
                      uniform float bladeTimes[100];
                      uniform int bladeLength;

                      uniform float handleValues[100];
                      uniform float handleTimes[100];
                      uniform int handleLength;
                      uniform vec3 handleColor;
                    
                      varying vec2 vUv;

                      vec4 finalHandleColor = vec4(1.0, 1.0, 1.0, 1.0);
                      vec4 finalBladeColor = vec4(1.0, 1.0, 1.0, 1.0);
                      vec4 finalColor = vec4(1.0, 1.0, 1.0, 1.0);
                      
                      void main() {
                        for (int j = 0; j < handleLength; j++) {
                          if (vUv.y >= handleTimes[j] && vUv.y <= handleTimes[j+1]) {
                            finalHandleColor = vec4(handleColor, handleValues[j]);
                            break;
                          } else {
                           finalHandleColor = vec4(handleColor, handleValues[j]);
                          }
                        }

                        for (int i = 0; i < bladeLength; i++) {
                          if (vUv.y >= bladeTimes[i] && vUv.y <= bladeTimes[i+1]) {
                            finalBladeColor = vec4(mix(bladeColors[i], bladeColors[i+1], vUv.y), 1.0);
                            break;
                          } else {
                           finalBladeColor = vec4(bladeColors[i], 1.0);
                          }
                        }

                        finalColor = vec4(mix(finalBladeColor, finalHandleColor, finalHandleColor.a));
                        gl_FragColor = vec4(finalColor.r, finalColor.g, finalColor.b, 1.0);
                      }
                    `,
                    wireframe: false,
                    transparent: true,
                    depthWrite: Boolean(saber.Config.SaberSettings.depthWrite)
                  });
                //var material = new THREE.MeshBasicMaterial();
                
                const obj = new THREE.Mesh(geometry, material );

                obj.renderOrder = saber.Config.SaberSettings.renderQueue * 2 - saber.Config.SaberSettings.cullMode;
    
                this.scene.add( obj );

                obj.position.set(-saber.Config.LocalTransform.Position.x, saber.Config.LocalTransform.Position.z, -saber.Config.LocalTransform.Position.y);
                obj.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), saber.Config.LocalTransform.Rotation.x * Math.PI / 180);
                obj.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), saber.Config.LocalTransform.Rotation.z * Math.PI / 180);
                obj.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), saber.Config.LocalTransform.Rotation.y * Math.PI / 180);
                obj.scale.set(saber.Config.LocalTransform.Scale.x, saber.Config.LocalTransform.Scale.z, saber.Config.LocalTransform.Scale.y)

                this.model.add( obj );
            }
        }

        this.scene.add( this.model );
    }

    moveCamera(): void {
      for (let key in this.keys) {
        switch (this.keys[key]) {
          case "w":
            this.camera.translateZ(-0.01);
            break;
          case "a":
            this.camera.translateX(-0.01);
            break;
          case "s":
            this.camera.translateZ(0.01);
            break;
          case "d":
            this.camera.translateX(0.01);
            break;
        }
      }
    }

    resizeWindow(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    } 
}