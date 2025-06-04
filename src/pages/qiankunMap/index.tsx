import { useMount } from 'ahooks';
import { loadMicroApp } from 'qiankun';
import { useRef } from 'react';
import { useModel } from 'umi';

export default ({ match }: { match: { path: string } }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { initialState, setInitialState } = useModel('@@initialState');
  useMount(async () => {
    setInitialState({
      ...initialState!,
      microApp: {
        path: match.path.replace(/\*$/, ''),
        app: loadMicroApp(
          {
            name: 'data_map',
            entry: '/proxy-data-map/index.html',
            container: containerRef.current!,
            props: {
              isDark: !!initialState?.isDark,
              isAi: true,
              // userId: initialState!.currentUser!.userInfo.id,
              userId: '123',
              baseRouter: match.path.match(/.*\/data-map\//)?.[0],
            },
          },
          {
            singular: true,
          },
        ),
      },
    });
  });

  return <div className='12312' ref={containerRef} style={{ position: 'relative' }} />;
};
