import { useEffect } from 'react';
import { ESObjectsManager } from 'earthsdk3'
import { ESCesiumViewer } from 'earthsdk3-cesium'
import { ESUeViewer } from 'earthsdk3-ue'


import styles from './index.less';
import { useUnmount, useSetState, useMount } from 'ahooks';

interface PropsType {
  handleAction: Function;
  state: any;
}

let g_objm
// window.CESIUM_BASE_URL = 'cesiumStatic'

export default (props: PropsType) => {
  const [state, setState] = useSetState({
  });

  useMount(() => {

    const objm = new ESObjectsManager(ESCesiumViewer);
    g_objm = objm;

    const container = document.getElementById("app");
    // 创建Cesium视口
    const viewer = objm.createCesiumViewer(container);

    viewer.ionAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NWNkNmNmNi0xNWMyLTQ3NGYtYjI4Ny01Mjc2ZGE4NGQxNWMiLCJpZCI6Mzg3NTMsImlhdCI6MTYwNjc5NDUwOX0.SIxmCg6USCh-b6mRyuSrWnxqMvUMbVwYrsSVTpi0H0k"
    // 监听视口状态
    viewer.statusChanged.don(status => {
      switch (status) {
        case "Creating":
          console.log("视口正在创建");
          break;
        case "Created":
          console.log("视口已创建");
          break;
      }
    })
    // 通过json创建一个影像图层
    const imageryLayer = objm.createSceneObjectFromJson({
      "id": "9812a65f-0de0-4f7b-b234-809c0c2fb8ef",
      "type": "ESImageryLayer",
      "url": "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    });
  })
  useEffect(() => {

  }, []);

  useUnmount(() => {
  });

  return (
    <>
      <div
        id="app"
        className={styles.Earthsdk3Box}
      />
    </>

  );
};
