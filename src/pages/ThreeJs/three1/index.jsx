import { useEffect } from 'react';

import { useModel } from 'umi';

import { useUnmount, useSetState } from 'ahooks';

import * as Three from "three";
import * as Tween from "@tweenjs/tween.js";
import gsap from 'gsap'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useRef } from 'react';

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from 'three/examples/jsm/libs/stats.module.js'

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import styles from "./index.less";


export default () => {
    const { mapData, setMap } = useModel('useLeaflet');
    const [state, setState] = useSetState({

    });


    // const threeEngine = useRef(null);
    const threeEngine = document.querySelector(`#threeEngine`)

    const gui = new GUI();
    const stats = new Stats();
    const raycaster = new Three.Raycaster();

    let scene, camera, renderer, controls, light, scenelight, light2, spotLight;

    let ball = []
    let door = []

    let isForward = true;
    let index = 0;

    let show1 = false;

    let model1


    const model1ObserverList = [

        {
            position: {
                x: -2.852475004408397,
                y: 1.2853325867219125,
                z: 0.374475219726563,
            },
            target: () => {
                // 返回聚光灯的位置
                return {

                    x: spotLight.target.position.x + 1.5,
                    y: spotLight.target.position.y + 1,
                    z: spotLight.target.position.z + 1.8

                }
            }

        },
        {
            position: {
                x: -3.902475004408397,
                y: 0.50853325867219125,
                z: -0.174475219726563
            },
            target: () => {
                // 返回聚光灯的位置
                return {

                    x: model1.position.x,
                    y: model1.position.y + 0.7,
                    z: model1.position.z + 1.7,

                }
            }

        },
        {
            position: {
                x: -3.152475004408397,
                y: 0.80853325867219125,
                z: -0.974475219726563,
            },

        },
        {
            position: {
                x: -3.152475004408397,
                y: 0.80853325867219125,
                z: -0.974475219726563,
            },

        }
    ]

    const LocationArr = [
        {
            x: 2, //18.8
            y: 1.1,
            z: -4,
        },
        {
            x: 13.4 - 16.4,
            y: 0.8,
            z: -4,
        },
        {
            x: 10 - 16.8,
            y: 0.8,
            z: -4,
        },
        {
            x: 5.8 - 16.8,
            y: 0.8,
            z: -4,
        },

        {
            x: 0.6 - 16.8,
            y: 1.3,
            z: -6,
        },
        {
            x: -4 - 16.8,
            y: 0.8,
            z: -4,
        },
        {
            x: -9.2 - 16.8,
            y: 3,
            z: -4,
        },
    ];

    const init = () => {
        scene = new Three.Scene();
        scene.background = new Three.Color(0xffffff);
        scenelight = new Three.AmbientLight(0xffffff, 0.4);
        scene.add(scenelight);
        console.log(threeEngine,'threeEngine')

        renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = Three.PCFSoftShadowMap;
        renderer.toneMapping = Three.ACESFilmicToneMapping; // 色调映射
        renderer.toneMappingExposure = 1; // 色调映射的曝光值
        threeEngine.appendChild(renderer.domElement);

        const skyloader = new Three.CubeTextureLoader();
        const texture = skyloader.load(["/texture/skyBox4/posx.jpg", "/texture/skyBox4/negx.jpg", "/texture/skyBox4/posy.jpg", "/texture/skyBox4/negy.jpg", "/texture/skyBox4/posz.jpg", "/texture/skyBox4/negz.jpg"]);

        // 相机
        camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
        camera.position.set(LocationArr[0].x, LocationArr[0].y, LocationArr[0].z);
        camera.aspect = window.innerWidth / window.innerHeight;
        scene.add(camera);


        //平行光
        light = new Three.DirectionalLight(0xfeb09a, 20);
        light.position.set(30.3, 45.1, -10.2); //光源位置
        light.castShadow = true;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500;
        light.shadow.camera.left = -50;
        light.shadow.camera.right = 50;
        light.shadow.camera.top = 50;
        light.shadow.camera.bottom = -50;
        light.shadow.mapSize.width = 10240;
        light.shadow.mapSize.height = 10240;
        scene.add(light);

        light2 = new Three.DirectionalLight(0xffffff, 2.3);
        light2.position.set(4.5, 36.5, 42.6);
        light2.shadow.camera.near = 0.1;
        light2.shadow.camera.far = 100;
        light2.shadow.camera.left = -20;
        light2.shadow.camera.right = 20;
        light2.shadow.camera.top = 20;
        light2.shadow.camera.bottom = -20;
        light2.shadow.mapSize.width = 4096;
        light2.shadow.mapSize.height = 4096;
        light2.target.position.set(0, 0, 0);
        scene.add(light2);


        // 创建辅助坐标轴
        const axesHelper = new Three.AxesHelper(100);
        scene.add(axesHelper);

        // 添加聚光灯
        spotLight = new Three.SpotLight(0xffffff, 20);
        spotLight.position.set(2.1, 4.5, -1.6);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // 控制器
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minDistance = 0;
        controls.maxDistance = 200;
        controls.target.set(camera.position.x, camera.position.y - 1, camera.position.z + 10);

        // 鼠标操作变换
        controls.mouseButtons = {
            LEFT: null, //左键旋转Three.MOUSE.ROTATE
            // 禁止中键
            MIDDLE: null,
            // 禁止右键
            RIGHT: null, //Three.MOUSE.PAN
        };



        // showroom，fbx模型
        const fbxLoader = new FBXLoader();
        const fileNameList = []
        for (let i = 1; i <= 8; i++) {
            fileNameList.push(`/model/showroom-all/showroom_${i}.FBX`)
        }


        // 创建整个showroom的group
        const group = new Three.Group();
        group.name = "showroom-group";

        // 纯白色材质带环境贴图
        const whiteMaterial = new Three.MeshStandardMaterial({
            color: new Three.Color(0xffffff),
            metalness: 0.447,//金属度
            roughness: 0.115,//粗糙度
            envMap: texture,
            envMapIntensity: 0.176,

        });

        // 纯白色材质带环境贴图
        const elevatarMaterial = new Three.MeshStandardMaterial({
            color: new Three.Color(0xffffff),
            metalness: 0.447,//金属度
            roughness: 0.115,//粗糙度
            envMap: texture,
            envMapIntensity: 0.3,

        });

        // 银色金属材质
        const sliverMetalMaterial = new Three.MeshStandardMaterial({
            color: new Three.Color(0xf8e2c6),
            metalness: 1,//金属度
            roughness: 0,//粗糙度
            envMap: texture,
            envMapIntensity: 1,
        });


        fileNameList.forEach((item) => {
            fbxLoader.load(item, (object) => {
                object.scale.set(0.003, 0.003, 0.003);
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                object.name = item.split('/')[3].split('.')[0];

                // 地面
                if (object.name == 'showroom_8') {



                    // 加载贴图
                    const floorMat = new Three.MeshStandardMaterial({
                        roughness: 0.8,
                        color: 0xffffff,
                        metalness: 0,
                        bumpScale: 1,

                    });

                    const textureLoader = new Three.TextureLoader();
                    textureLoader.load('/model/showroom-all/floor.png', function (map) {

                        map.wrapS = Three.RepeatWrapping;
                        map.wrapT = Three.RepeatWrapping;
                        map.anisotropy = 4;
                        map.repeat.set(4, 4);
                        map.colorSpace = Three.SRGBColorSpace;
                        floorMat.map = map;
                        floorMat.needsUpdate = true;

                    });

                    // floor_Roughness.png，贴上floor的粗糙度
                    textureLoader.load('/model/showroom-all/floor_Roughness.png', function (map) {
                        map.wrapS = Three.RepeatWrapping;
                        map.wrapT = Three.RepeatWrapping;
                        map.anisotropy = 4;
                        map.repeat.set(4, 4);
                        map.colorSpace = Three.SRGBColorSpace;
                        floorMat.roughnessMap = map;
                        floorMat.needsUpdate = true;
                    });



                    // 给mesh添加贴图
                    object.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material = floorMat;
                        }
                    });
                }

                // 基础墙体
                if (object.name == 'showroom_2') {
                    object.traverse((child) => {
                        if (child.isMesh) {
                            child.material = whiteMaterial
                        }
                    });
                }

                // 一号展台
                if (object.name == 'showroom_1') {

                    // 移除showroom_1
                    object.traverse((child) => {
                        object.remove(child)
                    });


                }




                // 球体3个
                const arr = ['showroom_3', 'showroom_4', 'showroom_5']
                arr.forEach((item) => {
                    if (object.name == item) {
                        object.traverse((child) => {
                            if (child.isMesh) {
                                child.material = sliverMetalMaterial
                                ball.push(object)
                            }
                        });
                    }
                });

                // 电梯
                const elevatorArr = [{
                    name: 'showroom_6',
                    x: 0.26
                }, {
                    name: 'showroom_7',
                    x: -0.199
                }]
                elevatorArr.forEach((item) => {
                    if (object.name == item.name) {
                        object.traverse((child) => {
                            if (child.isMesh) {
                                child.material = elevatarMaterial

                                door.push(object)
                            }
                        });
                        object.position.x = item.x


                    }
                });

                // 给每个模型添加visible的GUI
                // const folder = gui.addFolder(object.name);
                // folder.add(object, "visible").name("是否显示");
                group.add(object);

            });


        });


        const figureTextureLoader = new Three.TextureLoader()
        const figureTexture = figureTextureLoader.load('/figure/room2.png');
        const figureGeometry = new Three.PlaneGeometry(1.3, 0.9);
        const figureMaterial = new Three.MeshLambertMaterial(
            {
                side: Three.DoubleSide,
                map: figureTexture,
                transparent: true,
            }
        );
        const figure = new Three.Mesh(figureGeometry, figureMaterial);
        figure.position.set(-1.098668, 1.1, 0.9479361184149381);
        figure.rotateY(-90 * (Math.PI / 180));
        scene.add(figure);

        // 聚光灯
        const spotLight2 = new Three.SpotLight(0xffffff, 5);
        spotLight2.position.set(-1.6843670113338225, 1.9, 1.2);
        spotLight2.target.position.set(-1.6843670113338225, 0, 1.2);


        spotLight2.angle = 0.5;
        spotLight2.penumbra = 0.7;//边缘软化
        spotLight2.castShadow = true;
        scene.add(spotLight2);


        // 添加聚光灯3
        const spotLight3 = new Three.SpotLight(0xffffff, 9);
        spotLight3.position.set(-6.989796332110297, 1.0427591314401723, 3.2954104003906264);
        // 朝下照射
        spotLight3.target.position.set(-6.989796332110297, 0, 3.2954104003906264);
        spotLight3.castShadow = true;
        scene.add(spotLight3);

        // GUI控制朝向
        const spotLight3Folder = gui.addFolder("spotLight3");
        // 强度
        spotLight3Folder.add(spotLight3, "intensity", 0, 20).name("光照强度");
        // 距离
        spotLight3Folder.add(spotLight3, "distance", 0, 20).name("光照距离");
        // 减弱
        spotLight3Folder.add(spotLight3, "decay", 0, 20).name("减弱");
        // 灯光朝向
        spotLight3Folder.add(spotLight3.target.position, "x", -50, 50).name("x轴朝向");
        spotLight3Folder.add(spotLight3.target.position, "y", -50, 50).name("y轴朝向");
        spotLight3Folder.add(spotLight3.target.position, "z", -50, 50).name("z轴朝向");


        // 添加到场景
        group.rotateX(-Math.PI / 2);
        group.rotateZ(-Math.PI);
        scene.add(group);

        // 创建电视
        createTV();

        // 创建光束
        createLightRay()

        // 一号展台
        No1Showcase(texture)
        // 二号展台
        No2Showcase(texture)



        // 鼠标滚轮控制
        let canScroll = true;
        // 监听鼠标滚轮
        threeEngine.addEventListener('wheel', function (e) {


            if (!canScroll) {
                return;
            }

            canScroll = false;
            show1 = false;

            if (e.deltaY < 0) {
                sceneWheel(false);
            } else {
                sceneWheel(true);
            }

            setTimeout(() => {
                canScroll = true;
            }, 200);
        })

        // 监听按下鼠标左键
        threeEngine.addEventListener('mousedown', function (e) {
            if (e.button === 0) {
                sceneMouseDown();
            }
        })

        // 手机端监听触摸事件
        threeEngine.addEventListener('touchstart', function (e) {
            sceneMouseDown();
        })

        // 监听松开鼠标左键
        threeEngine.addEventListener('mouseup', function (e) {
            if (e.button === 0) {

                // sceneMouseUp(is)
                debounce(sceneMouseUp, 1000, true)()
            }
        })

        // 手机端监听触摸事件
        threeEngine.addEventListener('touchend', function (e) {
            debounce(sceneMouseUp, 1000, true)()
        })

        // 监听鼠标拖动
        threeEngine.addEventListener('mousemove', function (e) {
            if (e.buttons === 1) {
                debounce(sceneMouseMove, 1000, true)(e)
            }
        })

        // 手机端监听触摸事件
        threeEngine.addEventListener('touchmove', function (e) {
            debounce(sceneMouseMove, 1000, true)(e)
        })

        // 监听点击事件
        threeEngine.addEventListener('click', function (e) {
            sceneClick(e)
        })



        const animate = () => {
            controls.update();
            Tween.update();
            stats.update();
            renderer.render(scene, camera);

            requestAnimationFrame(animate);

            ball.forEach((item) => {
                // item.position.z = Math.sin(Date.now() * 0.002) * 0.05
                if (item.name === 'showroom_3') {
                    item.position.z = Math.sin(Date.now() * 0.002) * 0.05
                }

                if (item.name === 'showroom_4') {
                    item.position.z = Math.cos(Date.now() * 0.002) * 0.05
                }

                if (item.name === 'showroom_5') {
                    item.position.z = Math.cos(Date.now() * 0.002) * 0.05
                }

            });


        };

        animate();

        // 监听窗口变化
        window.addEventListener("resize", function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        initGUI();
        initStats();
    };

    const initGUI = async () => {
        gui.domElement.style.position = "absolute";
        gui.domElement.style.top = "0px";
        gui.domElement.style.left = "0px";

        // 光照强度
        const lightFolder = gui.addFolder("Light");
        lightFolder.add(light, "intensity", 0, 20).name("光照强度");

        // 光照2强度
        lightFolder.add(light2, "intensity", 0, 20).name("光照2强度");

        // 光照x轴位置
        lightFolder.add(light.position, "x", -50, 50).name("光照x轴位置");

        // 光照y轴位置
        lightFolder.add(light.position, "y", -50, 50).name("光照y轴位置");

        // 光照z轴位置
        lightFolder.add(light.position, "z", -50, 50).name("光照z轴位置");

        // 光照2x轴位置
        lightFolder.add(light2.position, "x", -50, 50).name("光照2x轴位置");

        // 光照2y轴位置
        lightFolder.add(light2.position, "y", -50, 50).name("光照2y轴位置");

        // 光照2z轴位置
        lightFolder.add(light2.position, "z", -50, 50).name("光照2z轴位置");

        // 光照颜色
        lightFolder.addColor(light, "color").name("光照颜色");

        // 光照2颜色
        lightFolder.addColor(light2, "color").name("光照2颜色");

        // 自然光
        lightFolder.add(scenelight, "intensity", 0, 20).name("自然光强度");

        //在场景中找到模型中 child.userData.originalName === 'polySurface28'

        lightFolder.close();

        // 场景中的模型
        console.log(scene);
        const currentModel = scene.getObjectByName("polySurface28");
        console.log(currentModel);
    };

    const initStats = () => {
        stats.domElement.style.position = "absolute";
        stats.domElement.style.top = "0px";
        stats.domElement.style.left = "245px";
        threeEngine.appendChild(stats.domElement);
    };

    // 鼠标点击事件
    const sceneClick = (e) => {
        // 获取鼠标点击的位置
        const mouse = new Three.Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        // 通过摄像机和鼠标位置更新射线
        raycaster.setFromCamera(mouse, camera);

        // 计算物体和射线的焦点
        const intersects = raycaster.intersectObjects(scene.children, true);

        console.log(intersects);
        const gui = new GUI();
        const folder = gui.addFolder("Visibility");
        intersects.forEach((item) => {
            folder.add(item.object, "visible").name(item.object.name);

        });

        // 通过射线和物体的焦点来判断是否点击到物体
        if (intersects.length > 0) {
            // 获取点击到的物体
            const object = findOutermostGroup(intersects[0].object);
            console.log(object.name);

            sceneClickControl(object);


        }


        function findOutermostGroup(object) {
            let parentGroup = object?.parent;

            const findOutermost = (obj) => {
                if (obj && obj.parent && !(obj.parent instanceof Three.Group)) {
                    return findOutermost(obj.parent);
                }
                return obj;
            };

            return findOutermost(parentGroup) || object; // Return either the outermost Group or the original object
        }
    };

    // 点即可控制物体操作
    const sceneClickControl = (object) => {

        const clickControlList = [
            'Sketchfab_model',
        ]

        // 模型变大
        if (clickControlList.includes('Sketchfab_model')) {
            // object.scale.set(1.5, 1.5, 1.5);
            showModel(object);

        }

        // 观察者模式
        function showModel(object) {
            show1 = true;

            // 视角移动至模型前方
            gsap.to(camera.position, {
                x: -3.152475004408397,
                y: 0.80853325867219125,
                z: -0.1,
                duration: 2,
                ease: "power2.inOut",
                delay: 0.02,
                onUpdate: () => {
                    // 这段代码是为了让controls.target跟随相机的位置
                    controls.target.set(camera.position.x, camera.position.y - 1, camera.position.z + 10);
                },
                onComplete: () => {

                },
            });


        }

    };


    // 鼠标滚轮轮播控制器
    const sceneWheel = (isForward = true) => {
        if (isForward) {
            index.value < 6 && index.value++;
        } else {
            index.value && index.value--;
        }
        openDoor(index.value == 2)

        changeCameraLocation(index.value);


    };

    // 使用tween.js来切换相机位置
    function changeCameraLocation(num) {
        const target = LocationArr[num];
        // 使用gsap来切换相机位置
        gsap.to(camera.position, {
            x: target.x,
            y: target.y,
            z: target.z,
            duration: 2,
            // 由快到慢
            ease: "power4.out",
            onUpdate: () => {

                // controls.target.set(camera.position.x, camera.position.y - 1, camera.position.z + 10);

            },
            onComplete: () => {
            },
        });
        // 使用gsap来切换相机的角度
        gsap.to(controls.target, {
            x: target.x,
            y: target.y - 1,
            z: target.z + 10,
            duration: 2,
            ease: "power4.out",
            onUpdate: () => {
                // controls.target.set(camera.position.x, camera.position.y - 1, camera.position.z + 10);
            },
            onComplete: () => {
                // controls.target.set(camera.position.x, camera.position.y - 1, camera.position.z + 10);
            },
        });

        index.value = num;

    }

    // 鼠标按下事件
    const sceneMouseDown = (e) => {
        // 相机向后做缓冲动画
        gsap.to(camera.position, {
            z: camera.position.z - 0.4,
            duration: 0.5,
            ease: "power4.out",
            onUpdate: () => {
                controls.target.set(camera.position.x, camera.position.y - 1, camera.position.z + 10);
            },
        });


    };

    // 鼠标松开事件
    const sceneMouseUp = (is = isForward) => {
        gsap.to(camera.position, {
            z: camera.position.z + 0.4,
            duration: 0.5,
            ease: "power4.out",
            onUpdate: () => {
                controls.target.set(camera.position.x, camera.position.y - 1, camera.position.z + 10);
            },
        });

        // 判断是往前拖动还是往后拖动
        if (is) {
            sceneWheel(!true);
        } else {
            sceneWheel(!false);
        }
    };

    // 鼠标拖动事件
    const sceneMouseMove = (e) => {
        // 计算出鼠标移动的距离
        const x = e.movementX / 0.5 / 300
        isForward = x > 0 ? true : false;
        // 使用gsap来移动相机
        gsap.to(camera.position, {
            x: camera.position.x + x,
            duration: 0.5,
            ease: "power4.out",
            onUpdate: () => {
                controls.target.set(camera.position.x, camera.position.y - 1, camera.position.z + 10);
            },
            // 结束时保持相机的位置
            onComplete: () => {
                controls.target.set(camera.position.x, camera.position.y - 1, camera.position.z + 10);
            },

        });




    };

    // 拖动防抖
    function debounce(func, wait, immediate) {
        var timeout, result;
        var debounced = function () {
            var context = this;
            var args = arguments;

            // 每次新的尝试调用func，会使抛弃之前等待的func
            if (timeout) clearTimeout(timeout);

            // 如果允许新的调用尝试立即执行
            if (immediate) {
                // 如果之前尚没有调用尝试，那么此次调用可以立马执行，否则就需要等待
                var callNow = !timeout;
                // 刷新timeout
                timeout = setTimeout(function () {
                    timeout = null;
                }, wait);
                // 如果能被立即执行，立即执行
                if (callNow) result = func.apply(context, args);
            } else {
                timeout = setTimeout(function () {
                    func.apply(context, args);
                }, wait);
            }
            return result;
        };

        debounced.cancel = function () {
            clearTimeout(timeout);
            timeout = null;
        };
        return debounced;
    }

    // 创建电视
    const createTV = () => {
        const video = document.createElement("video");
        video.src = "/public/texture/sintel.mp4";
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true;
        video.play();

        const textureVideo = new Three.VideoTexture(video); //视频纹理
        const geometry = new Three.PlaneGeometry(0.52, 0.34); //创建一个矩形平面0.52, 0.34
        const material = new Three.MeshBasicMaterial({ map: textureVideo }); //
        const boxRect = new Three.Mesh(geometry, material);
        boxRect.position.set(-4.77, 0.7725029329972055, -0.05034);
        boxRect.rotateY(180 * (Math.PI / 180));
        scene.add(boxRect);

        // 复制电视
        // const boxRect2 = boxRect.clone();
        // boxRect2.position.set(-4.77, 0.7725029329972055, -7.05034);
        // scene.add(boxRect2);
    };

    // 创建光束
    const createLightRay = () => {
        const textLoader = new Three.TextureLoader()
        const figureTexture = textLoader.load('/figure/lightRay.png');

        // 强光束
        const figureMaterial = new Three.MeshLambertMaterial(
            {
                side: Three.DoubleSide,
                map: figureTexture,
                transparent: true,
                opacity: 0.5,
            }
        );

        // 强光束
        const figureMaterial2 = new Three.MeshLambertMaterial(
            {
                side: Three.DoubleSide,
                map: figureTexture,
                transparent: true,
                // 透明度
                opacity: 0.2,

            }
        );


        // 第一个面的光束
        const geometry = new Three.PlaneGeometry(2, 4);
        const plane = new Three.Mesh(geometry, figureMaterial);


        plane.position.set(1.8843670113338225, 2.6, 1.2);
        plane.rotateZ(-35 * (Math.PI / 180));
        scene.add(plane);

        const plane2 = plane.clone();
        plane2.position.x += 1.8
        scene.add(plane2);

        const plane3 = plane.clone();
        plane3.position.x += 1
        plane3.position.y += 0.5
        scene.add(plane3);

        // 第二个面的光束
        const plane4 = plane.clone();
        plane4.position.x -= 3.4
        plane4.position.y -= 0.5
        scene.add(plane4);

        const plane5 = plane.clone();
        plane5.position.x -= 4.7
        scene.add(plane5);

        const plane6 = plane.clone();
        plane6.position.x -= 5.2
        plane6.position.z -= 2
        scene.add(plane6);

        // GUi
        const lightrayFolder = gui.addFolder("lightray");
        // x
        lightrayFolder.add(plane4.position, "x", -50, 50).name("光束x轴位置");
    };

    // 一号展台
    const No1Showcase = (texture) => {
        const GLBloader = new GLTFLoader();
        GLBloader.load('/model/model-1/electrical_transformer.glb', (gltf) => {
            gltf.scene.scale.set(0.15, 0.15, 0.15);
            gltf.scene.position.set(-2.952475004408397, 0.20853325867219125, 1.874475219726563);
            gltf.scene.rotateY(90 * (Math.PI / 180));

            // shadow
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.envMap = texture;
                    child.material.envMapIntensity = 0.3;
                    // 金属
                    child.material.metalness = 1;
                    // 粗糙度
                    child.material.roughness = 0.5;

                }
            });

            gltf.scene.name = 'model1';
            scene.add(gltf.scene);
            model1 = gltf.scene;

        });
    };

    // 二号展台
    const No2Showcase = (texture) => {
        const GLBloader = new GLTFLoader();

        GLBloader.load('/model/flying-model/scene.gltf', (gltf) => {
            // x: -11.030926282119253  y: 0.1653591769969581  z: 0.5123004915805058

            gltf.scene.scale.set(0.05, 0.05, 0.05);
            gltf.scene.position.set(-10.952475004408397, 0.20853325867219125, 0.674475219726563);
            // gltf.scene.rotateY(90 * (Math.PI / 180));

            scene.add(gltf.scene);

        });

    };

    let doorStatus = false
    // 开门动画
    const openDoor = (isOpen = true) => {


        if (isOpen && !doorStatus) {
            open()
        }

        if (!isOpen && doorStatus) {
            close()
        }

        doorStatus = isOpen


        // 打开
        function open() {
            console.log('open');
            door.forEach((item) => {
                if (item.name === 'showroom_6') {
                    gsap.to(item.position, {
                        x: item.position.x - 0.45,
                        duration: 2,
                        ease: "power4.out",
                        onUpdate: () => {
                        },
                    });
                }

                if (item.name === 'showroom_7') {
                    gsap.to(item.position, {
                        x: item.position.x + 0.45,
                        duration: 2,
                        ease: "power4.out",
                        onUpdate: () => {
                        },
                    });
                }
            });
        }

        // 关门
        function close() {
            console.log('close');
            door.forEach((item) => {
                if (item.name === 'showroom_6') {
                    gsap.to(item.position, {
                        x: item.position.x + 0.45,
                        duration: 2,
                        ease: "power4.out",
                        onUpdate: () => {
                        },
                    });
                }

                if (item.name === 'showroom_7') {
                    gsap.to(item.position, {
                        x: item.position.x - 0.45,
                        duration: 2,
                        ease: "power4.out",
                        onUpdate: () => {
                        },
                    });
                }
            });
        }




    };

    // 移动相机位置和视角函数，接收两个个参数，参数为相机的位置 ，和视角的位置
    const moveCamera = (cameraPosition, controlsTarget) => {
        gsap.to(camera.position, {
            x: cameraPosition.x,
            y: cameraPosition.y,
            z: cameraPosition.z,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {

            },
        });


        if (controlsTarget) {
            gsap.to(controls.target, {
                x: controlsTarget.x,
                y: controlsTarget.y,
                z: controlsTarget.z,
                duration: 1.5,
                ease: "power2.inOut",
                onUpdate: () => {
                },
            });
        }
    };

    const changeOB = (attribute) => {
        moveCamera(attribute.position, attribute.target());
    };

    useEffect(() => {
        init()
    }, []);



    return (
        <>
            <div className={styles.index}>
                <div id="threeEngine" ref="threeEngine"></div>

                <div className={styles.indicator}>
                    {
                        LocationArr.map((item, idx) => (
                            <div className={styles.indicator_item} style={{ background: index === idx ? '#432eff' : '' }} onClick={() => changeCameraLocation(idx)}>

                            </div>
                        ))
                    }
                </div>

                <div name="fade" mode="out-in">
                    {
                        show1 &&
                        <   div className={styles.model1}  >
                            {
                                model1ObserverList.map((item, index) => (
                                    <div onClick={() => changeOB(item)} className={[`model1_list_${index + 1}`]}
                                    >
                                        视角位置{{ item }}
                                    </div>
                                ))
                            }
                        </div>
                    }

                </div>
            </div >
        </>

    );
};
