import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./Home.css";
import { CapacitorHttp } from '@capacitor/core';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await CapacitorHttp.get({url : "https://cors-anywhere.herokuapp.com/https://edt4rt-api.romain-pinsolle.fr/api/planning/getPlanningPerName/but1_g3", headers:{'Access-Control-Allow-Origin':'*', "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.95 Safari/537.36"}});
        console.log(response.data)
        const json = await response.data;
        const formattedEvents = json.map((eventData: any) => ({
          title: `${eventData.summary} - ${eventData.location}${eventData.prof !== "NA" ? ` - ${eventData.prof}` : ""}`,
          start: eventData.start.split(" ")[0] + "T" + eventData.start.split(" ")[1].split("+")[0], // Simplified date conversion
          end: eventData.end.split(" ")[0] + "T" + eventData.end.split(" ")[1].split("+")[0],
          description: eventData.location,
          id: eventData.uid,
          color: eventData.prof !== "NA" ? "default" : "#005049",
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <IonPage>
      {events.length ? (
        <>
          <IonHeader>
            <IonToolbar>
              <IonTitle>EDT 4 RT</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            
            <div id="main-content">
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridDay"
              locale="fr"
              titleFormat={{ month: "long", day: "numeric" }}
              hiddenDays={[6, 0]}
              events={events}
              allDaySlot={false}
              height="auto"
              slotMinTime="08:00"
              slotMaxTime="19:00"
            />
            </div>
          </IonContent>
        </>
      ) : (
        // Loading indicator
        <IonContent fullscreen>
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </IonContent>
      )}
    </IonPage>
  );
};

export default Home;
