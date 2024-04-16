import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import timeGridPlugin from '@fullcalendar/timegrid'; 
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Carousel } from 'react-responsive-carousel';
import './styles.css';


import FullCalendar from '@fullcalendar/react';

export default function App() {
    const [currentDate, setCurrentDate] = useState(new Date());

    return (
        <Swiper loop={true}>
            <SwiperSlide>
                <FullCalendar
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay'
                    }}
                    events={[
                        { title: 'event 1', date: '2021-08-01' },
                        { title: 'event 2', date: '2021-08-02' }
                    ]}
                    eventClick={(info) => {
                        alert('Event: ' + info.event.title);
                    }}
                />
            </SwiperSlide>
            <SwiperSlide>
                <FullCalendar
                    plugins={[timeGridPlugin]}
                    
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay'
                    }}
                    events={[
                        { title: 'event 1', date: '2021-08-01' },
                        { title: 'event 2', date: '2021-08-02' }
                    ]}
                    eventClick={(info) => {
                        alert('Event: ' + info.event.title);
                    }}
                />
            </SwiperSlide>
        </Swiper>
    );
}