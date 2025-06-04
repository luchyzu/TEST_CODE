import { useSetState } from 'ahooks';
import { Swiper, SwiperSlide } from 'swiper/react'
import lunbo from '@/assets/images/lunbo.png';
import 'swiper/swiper-bundle.css'

import styles from './lunbo.less';

export default () => {
    const [state] = useSetState({
        list: [
            123,
            234,
            123,
            212,
            123
        ]
    });
    // 文档地址 https://www.swiperjs.net/react/

    return (
        <>
            <div className={styles.container}>
                <Swiper spaceBetween={10} slidesPerView={3} centeredSlides autoplay>
                    {state.list.map((item, k) => {
                        return (
                            <SwiperSlide key={k}>
                                <div className={styles.imgBox}>
                                    <img className="img" src={lunbo} />
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </>
    );
};
