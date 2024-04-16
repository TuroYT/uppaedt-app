import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import timeGridPlugin from '@fullcalendar/timegrid'; 
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './styles.css';

import { Pagination, Navigation } from 'swiper/modules';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function App() {
    const swiperRef = useRef<any>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const startDate = useRef(new Date()); // Stocker la date de départ


        const handleSlideChange = (swiper: any) => {
            if (swiper.activeIndex === 0) {
                // User swiped to the left
                console.log("Swiped to the left");
            } else if (swiper.activeIndex === 1) {
                // User swiped to the right
                console.log("Swiped to the right");
            }
        };


    return (
        <>
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                className="mySwiper"
                onSlideChange={handleSlideChange}
                ref={swiperRef}
            >
                <SwiperSlide >
                    <FullCalendar
               
                        plugins={[timeGridPlugin]}
                        initialView="timeGridDay"
                        locale="fr"
                        headerToolbar={{
                          start: "",
                          center: "",
                          end: "",
                        }}
                        titleFormat={{ month: "long", day: "numeric" }}
                        hiddenDays={[6, 0]}
                     
                        allDaySlot={false}
                        nowIndicator={true}
                        height="auto"
                        slotMinTime="08:00"
                        slotMaxTime="19:00"
                        initialDate={currentDate }
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <FullCalendar
               
                        plugins={[timeGridPlugin]}
                        initialView="timeGridDay"
                        locale="fr"
                        headerToolbar={{
                          start: "",
                          center: "",
                          end: "",
                        }}
                        titleFormat={{ month: "long", day: "numeric" }}
                        hiddenDays={[6, 0]}
                     
                        allDaySlot={false}
                        nowIndicator={true}
                        height="auto"
                        slotMinTime="08:00"
                        slotMaxTime="19:00"
                 
                        initialDate={currentDate}
                    />
                </SwiperSlide>
            </Swiper>
        </>
    );
}