import { useMount, useSetState } from 'ahooks';
import 'echarts-gl';
import { useRef } from 'react';
import vvv from '@/assets/images/vvv.mp4';

export default () => {
    const chartsref = useRef<any>();

    const [state, setState] = useSetState({
        metadataTree: [] as any[],
        fileTree: [] as any[],
        record: {},
        canvasWidth: 0,
        canvasHeight: 0,
        imgsrc: '',
    });

    const changeBlob = (url) => {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                }
            };
            xhr.send();
        });
    }

    const getCurPic = () => {
        console.log(123)
        let vdo = document.getElementById("myPlayer1"); //获取标签
        let width = vdo?.clientWidth; //获取屏幕尺寸
        let height = vdo?.clientHeight;
        setState({
            canvasWidth: width,
            canvasHeight: height,
        })

        let canvas = document.getElementById("myCanvas");
        let ctx = canvas?.getContext("2d");

        ctx.drawImage(vdo, 0, 0, width, height)
        var img = document.createElement("img");
        console.log(ctx, 'canvas',)
        img.src = ctx?.canvas?.toDataURL('image/png');


        changeBlob(img.src).then((res) => {
            var na = img.src.split("/");
            const files = new File([res], na[na.length - 1], {
                type: res.type,
            });
            console.log(files,'files')
        })


        setState({
            imgsrc: img?.src
        })
    }

    useMount(() => {

    });

    return (
        <>
            <div>
                <div>
                    <div>
                        <video src={vvv} id="myPlayer1" width="70%" height="70%" controls>
                            <source src={vvv} type="video/mp4" />
                        </video>
                    </div>
                    <div onClick={() => getCurPic()}>截屏</div>
                </div>
                <div className="cur_canvas_container">
                    <canvas
                        id="myCanvas"
                        width={state.canvasWidth}
                        height={state.canvasHeight}
                        className="cur_canvas"
                    ></canvas>
                    <div></div>

                </div >
                <div>
                    <img src={state.imgsrc} style={{ width: state.canvasWidth, height: state.canvasHeight }} alt="" />
                </div>
            </div >
        </>
    );
};
