import { useEffect } from 'react';

import { useModel } from 'umi';

import { useUnmount, useSetState } from 'ahooks';
import styles from './index.less';
import * as THREE from 'three';
// 导入控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// 导入lil.gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// 导入加载模型
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export default () => {
    const { mapData, setMap } = useModel('useLeaflet');
    const [state, setState] = useSetState({
        renderer: null,
    });

    useEffect(() => {
        // 创建场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#fff0")
        // scene.environment = new THREE.Color("#ccc")

        // 添加网格地面
        // let gridHelper = new THREE.GridHelper(100, 100); // 创建一个网格帮助器，参数为网格的宽度和高度
        // scene.add(gridHelper);
        // gridHelper.material.transparent = true; // 开启网格帮助器的透明度
        // gridHelper.material.opacity = 0.5; // 设置网格帮助器的透明度


        // 创建相机
        const camera = new THREE.PerspectiveCamera(
            45, // 视角
            window.innerWidth / window.innerHeight, // 宽高比
            0.1, // 近平面
            1000 // 远平面
        )

        // 创建渲染器
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth, window.innerHeight)
        const threeBox = document.querySelector(`.${styles.threeBox}`)
        threeBox.appendChild(renderer.domElement)

        // 创建几何体
        const geometry = new THREE.BoxGeometry(1, 2, 1)

        // 自定义几何体
        const DIYgeometry = new THREE.BufferGeometry()
        // 创建顶点数据
        const vertices = new Float32Array([
            3.0, 1.0, 1.5, 3.0, 0.0, -1.5, 4.0, 0.0, 0.0,
            // -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,
        ])
        DIYgeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))



        // 创建材质
        const material = new THREE.MeshBasicMaterial({ color: 'pink' })
        const parentmaterial = new THREE.MeshBasicMaterial({ color: 'green', name: '绿色立方体' })
        const DIYmaterial = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide })



        // 创建网格
        const cube = new THREE.Mesh(geometry, material)
        const parentcube = new THREE.Mesh(geometry, parentmaterial)
        const DIYcube = new THREE.Mesh(DIYgeometry, DIYmaterial)


        // parentcube.add(cube)

        // 设置*局部*坐标
        parentcube.position.set(-3, 0, 0)
        // 此时父元素是子元素的相对坐标, 所以父元素是相对世界坐标的x轴-3位置 而子元素是世界坐标的 0 原点
        cube.position.set(3, 0, 0)

        // 设置*局部*缩放
        // cube.scale.set(2,2,2)
        // parentcube.scale.set(2,2,2)

        // 绕着x轴旋转
        // cube.rotation.x = Math.PI / 4
        // parentcube.rotation.x = Math.PI / 4


        // 将网格添加进场景中
        scene.add(parentcube)
        scene.add(DIYcube)


        // 设置相机位置
        camera.position.z = 5
        // 相机看向
        camera.lookAt(0, 0, 0)

        // 添加世界坐标辅助器
        // const axesHelper = new THREE.AxesHelper(5)
        // scene.add(axesHelper)

        // 添加控制器
        const controls = new OrbitControls(camera, renderer.domElement)

        // 设置带阻尼的惯性
        controls.enableDamping = true
        controls.dampingFactor = 0.05

        // 加载模型
        const loader = new GLTFLoader()
        loader.load('./model/flying-model/scene.gltf', function (gltf) {
            console.log(gltf, 'gltf')
            gltf.scene.scale.set(0.05, 0.05, 0.05);
            gltf.scene.position.set(1, 1, 1)
            gltf.scene.traverse(function (obj) {
                if (obj.isMesh) {
                    const edges = new THREE.EdgesGeometry(obj.geometry, 1)
                    const edgesMaterial = new THREE.LineBasicMaterial({
                        color: 0x00ffff
                    })
                    const line = new THREE.LineSegments(edges, edgesMaterial)
                    obj.add(line)

                    obj.material = new THREE.MeshBasicMaterial({
                        color: 0x004444,
                        transparent: true,
                        opcity: 0.5,
                        name: '飞机框架'
                    })
                }
            })
            scene.add(gltf.scene)
        })

        // 渲染
        function animate() {
            controls.update()
            requestAnimationFrame(animate)

            // 给子元素一个旋转的动画
            // cube.rotation.x += 0.01
            // cube.rotation.y += 0.01

            renderer.render(scene, camera);
        }
        animate()

        window.addEventListener('resize', () => {
            // 重置渲染器宽高比
            renderer.setSize(window.innerWidth, window.innerHeight)
            // 重置相机宽高比
            camera.aspect = window.innerWidth / window.innerHeight
            // 更新相机投影矩阵
            camera.updateProjectionMatrix()
        })

        setState({
            renderer
        })


        // 创建调试工具Gui
        let eventObj = {
            Fullscreen: function () {
                renderer.domElement.requestFullscreen()
                // 全屏
            },
            ExitFullscreen: function () {
                document.exitFullscreen()
                // 退出全屏
            },
        }
        // 创建gui
        const gui = new GUI()
        //添加按钮
        gui.add(eventObj, 'Fullscreen').name('全屏')
        gui.add(eventObj, 'ExitFullscreen').name('退出全屏')


        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0x0000FF,
            })
        )

        let folder = gui.addFolder('立方体位置')
        folder.add(sphere.position, 'x').min(-10).max(10).step(1).name('x位置调整')
        folder.add(sphere.position, 'y').min(-10).max(10).step(1).name('y位置调整')
        folder.add(sphere.position, 'z').min(-10).max(10).step(1).name('z位置调整')
        folder.add(material, 'wireframe').name('材质切换线框')

        let colorParmas = {
            cubeColor: '#ff0000',
        }
        folder.addColor(colorParmas, 'cubeColor').name('立方体颜色')
            .onChange((val) => {
                cube.material.color.set(val)
            })




        scene.add(sphere)

        threeBox.addEventListener('click', function (e) {
            console.log(e,123, scene)
            // 获取鼠标点击的位置
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
            // mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            // mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
            mouse.x = (e.offsetX / threeBox.offsetWidth) * 2 - 1;
            mouse.y = -((e.offsetY / threeBox.offsetHeight) * 2 - 1)

            // 通过摄像机和鼠标位置更新射线
            raycaster.setFromCamera(mouse, camera);

            // 计算物体和射线的焦点
            // var intersects = raycaster.intersectObjects([sphere, parentcube]);
            var intersects = raycaster.intersectObjects(scene.children);

            console.log('点击', intersects);

            // 通过射线和物体的焦点来判断是否点击到物体
            if (intersects.length > 0) {
                // 获取点击到的物体
                if (!intersects[0].object.isSelect) {
                    intersects[0].object.material.color.set(0xff0000);
                    intersects[0].object.isSelect = true
                } else {
                    intersects[0].object.material.color.set('green');
                    intersects[0].object.isSelect = false
                }
                // let selectedObject = intersects[0].object
                // console.log('点击到物体', selectedObject, scene, intersects);
            } else {
                console.log('未点击到物体')
            }

        })

    }, []);


    // 全屏
    const fullscreen = () => {
        const renderer = state.renderer
        renderer.domElement.requestFullscreen()
    }

    return (
        <div
            className={styles.threeBox}
        >
            <div onClick={() => {
                fullscreen()
            }}>
                全屏按钮
            </div>
        </div>
    );
};
