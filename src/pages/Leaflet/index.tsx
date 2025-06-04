// import styles from './index.less';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.pm';
import 'leaflet.pm/dist/leaflet.pm.css';
import './wmts';

import { useModel } from 'umi';

import { useUnmount, useSetState } from 'ahooks';

interface PropsType {
  handleAction: Function;
  state: any;
}

// let map: number | null | any | undefined = null;
const polylineList: T[] = [];
let tileLayer: any;

export default (props: PropsType) => {
  const { mapData, setMap } = useModel('useLeaflet');
  const [state, setState] = useSetState({
    scale: 1,
    key: 'dc9b6dfbdb5e27e3d5bd621866110aab',
  });

  useEffect(() => {
    const devicewidth = document.documentElement.clientWidth;
    const scale = 1 / (devicewidth / 1920);
    setState({
      scale,
    });
    // let map = mapData?.map;

    // 第一种设置方式，可行
    //限制地图的拖动范围是正负90到正负180，这样才合理。
    var corner1 = L.latLng(-90, -180); //设置左上角经纬度
    var corner2 = L.latLng(90, 180);	//设置右下点经纬度
    var bounds = L.latLngBounds(corner1, corner2); //构建视图限制范
    
    let map = L.map('map', {
      center: [39.91184298474967, 116.39190673828126],
      zoom: 15,
      maxZoom: 15,
      minZoom: 3,
      attributionControl: false,
      zoomControl: true,
      dragging: true,
      closePopupOnClick: false,
      maxBounds: bounds,
    });
    const options = {
      center: ['30.279751', '119.727856'],
      zoom: 5,
      doubleClickZoom: false,
      attributionControl: false,
      attribution: '版权所有@2022-2025',
      minZoom: 2,
      zoomControl: true,
      closePopupOnClick: true,
      noWrap: true,
    };
    // if (map) {
    //   map.setView(['105.279751', '40.727856']);
    //   polylineList.map((e) => {
    //     e.remove();
    //   });
    //   map.removeLayer(tileLayer);
    // } else {
    //   map = L.map('map', options);
    // }

    tileLayer = L.tileLayer(`http://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${state.key}`, {
      subdomains: [1, 2, 3, 4, 5, 6, 7]
    }).addTo(map);

    

    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawRectangle: true,
      drawPolyline: false,
      drawPolygon: false,
      drawMarker: false,
      drawCircleMarker: false,
      dragMode: false,
      removalMode: false,
      cutPolygon: false,
      editMode: false,
    });

    map.on('pm:create', (e) => {
      const data = e.layer.toGeoJSON();
      // e.layer.on('pm:edit', ev => {
      //     let newJson = ev.layer.toGeoJSON()
      //     console.log('new:' + JSON.stringify(newJson))
      // })
      data.geometry.coordinates[0].forEach((v) => {
        if (v[0] > 180 || v[0] < -180) {
          v[0] = v[0] % 180;
        }
      });
      console.log(data, data.geometry.coordinates)
      setMap({ ...mapData!, map: null });
    });

    new L.control.attribution({ prefix: false }).addTo(map);

    setMap({ ...mapData!, map });
  }, []);

  useUnmount(() => {
    setMap({ ...mapData!, map: null });
  });

  return (
    <div
      id="map"
      style={{ zoom: state.scale, width: '100%', height: '80vh', position: 'relative', zIndex: 0 }}
    />
  );
};
