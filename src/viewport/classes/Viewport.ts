//@ts-nocheck

import * as THREE from 'three';
import IViewport from '../interfaces/iViewport';
import { BlurSaberModule, ReeSaber } from '../../reesaberbuilder';
import Color from '../../reesaberbuilder/classes/Color';
import IModule from '../../reesaberbuilder/interfaces/iModule';

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
            console.log("hi");
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

    calculateVertices(module: BlurSaberModule, interpolationType: number): number[] {
        let v: number[] = [];

        let profile = module.Config.SaberSettings.saberProfile;
        let thickness = module.Config.SaberSettings.thickness * 0.0224 / 2;
        let depth = module.Config.SaberSettings.zOffsetTo - module.Config.SaberSettings.zOffsetFrom;

        // constant
        if (interpolationType == 0) {
          for (let point = 0; point < profile.controlPoints.length; point++) {
            if (point == profile.controlPoints.length - 1 && module.Config.SaberSettings.endCap == false) {

            } else {
              for (let i = 0; i < module.Config.SaberSettings.verticalResolution; i++) {
                if (point == 0 && module.Config.SaberSettings.startCap == true) {
                  v.push(0, module.Config.SaberSettings.zOffsetFrom, 0) 
                  v.push(
                      //@ts-ignore
                      profile.controlPoints[point].value * thickness * Math.cos(((i) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                      module.Config.SaberSettings.zOffsetFrom,
                      //@ts-ignore
                      profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                  )
                  v.push(
                      //@ts-ignore
                      profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                      module.Config.SaberSettings.zOffsetFrom,
                      //@ts-ignore
                      profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                  )
              }
              if (profile.controlPoints[point-1]) {
                v.push(
                  //@ts-ignore
                  profile.controlPoints[point-1].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                  profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                  //@ts-ignore
                  profile.controlPoints[point-1].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
              )
              v.push(
                //@ts-ignore
                profile.controlPoints[point].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                //@ts-ignore
                profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
              )
              v.push(
                //@ts-ignore
                profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                //@ts-ignore
                profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
            )
            v.push(
              //@ts-ignore
              profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
              profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
              //@ts-ignore
              profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
          )
              v.push(
                  //@ts-ignore
                  profile.controlPoints[point-1].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                  profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                  //@ts-ignore
                  profile.controlPoints[point-1].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
              )
              v.push(
                //@ts-ignore
                profile.controlPoints[point-1].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                //@ts-ignore
                profile.controlPoints[point-1].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
            )
              
              }
              v.push(
                //@ts-ignore
                profile.controlPoints[point].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                //@ts-ignore
                profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
              )
              if(profile.controlPoints[point+1]) {
                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    profile.controlPoints[point+1].time * depth + module.Config.SaberSettings.zOffsetFrom,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )
                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    profile.controlPoints[point+1].time * depth + module.Config.SaberSettings.zOffsetFrom,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )

                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    profile.controlPoints[point+1].time * depth + module.Config.SaberSettings.zOffsetFrom,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )
                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )
                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )
            } else {
                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    module.Config.SaberSettings.zOffsetTo,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )
                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    module.Config.SaberSettings.zOffsetTo,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )

                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    module.Config.SaberSettings.zOffsetTo,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )
                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )
                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )


                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    module.Config.SaberSettings.zOffsetTo,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )
                v.push(
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.cos(((i) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                    module.Config.SaberSettings.zOffsetTo,
                    //@ts-ignore
                    profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                )
                v.push(
                    0, module.Config.SaberSettings.zOffsetTo, 0
                )
                
                
            }
              }
            }
          }

        // linear
        } else if (true) {
          for (let point = 0; point < profile.controlPoints.length; point++) {
            if (point == profile.controlPoints.length - 1 && module.Config.SaberSettings.endCap == false) {

            } else {
                for (let i = 0; i < module.Config.SaberSettings.verticalResolution; i++) {
                    if (point == 0 && module.Config.SaberSettings.startCap == true) {
                        v.push(0, module.Config.SaberSettings.zOffsetFrom, 0) 
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos(((i) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                    }
                    v.push(
                        //@ts-ignore
                        profile.controlPoints[point].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                        profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                        //@ts-ignore
                        profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                    )
                    if(profile.controlPoints[point+1]) {
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point+1].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            profile.controlPoints[point+1].time * depth + module.Config.SaberSettings.zOffsetFrom,
                            //@ts-ignore
                            profile.controlPoints[point+1].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point+1].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            profile.controlPoints[point+1].time * depth + module.Config.SaberSettings.zOffsetFrom,
                            //@ts-ignore
                            profile.controlPoints[point+1].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
    
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point+1].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            profile.controlPoints[point+1].time * depth + module.Config.SaberSettings.zOffsetFrom,
                            //@ts-ignore
                            profile.controlPoints[point+1].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                    } else {
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            module.Config.SaberSettings.zOffsetTo,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            module.Config.SaberSettings.zOffsetTo,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
    
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            module.Config.SaberSettings.zOffsetTo,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            profile.controlPoints[point].time * depth + module.Config.SaberSettings.zOffsetFrom,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )


                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            module.Config.SaberSettings.zOffsetTo,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin(((i+1) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                        v.push(
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.cos(((i) / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI),
                            module.Config.SaberSettings.zOffsetTo,
                            //@ts-ignore
                            profile.controlPoints[point].value * thickness * Math.sin((i / module.Config.SaberSettings.verticalResolution) * 2 * Math.PI)
                        )
                        v.push(
                            0, module.Config.SaberSettings.zOffsetTo, 0
                        )
                        
                        
                    }
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