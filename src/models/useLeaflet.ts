import { useSetState } from 'ahooks';

export default () => {
  const [mapData, setMap] = useSetState({
    map: null,
  });

  return { mapData, setMap };
};
