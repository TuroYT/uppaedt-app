import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CapacitorHttp } from "@capacitor/core";
import "./calendarComponant.css";
import { useIonAlert, IonProgressBar } from "@ionic/react";

interface Props {
  name?: string;
}

const CalendarComponents: React.FC<Props> = (props) => {
  const [events, setEvents] = useState([]);
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await CapacitorHttp.get({
          url:
            "https://edt4rt-api.romain-pinsolle.fr/api/planning/getPlanningPerName/" +
            props.name,
        });
        console.log(response.data);
        const json = await response.data;
        const formattedEvents = json.map((eventData: any) => ({
          title: `${eventData.summary} - ${eventData.location}${
            eventData.prof !== "NA" ? ` - ${eventData.prof}` : ""
          }`,
          start:
            eventData.start.split(" ")[0] +
            "T" +
            eventData.start.split(" ")[1].split("+")[0], // Simplified date conversion
          end:
            eventData.end.split(" ")[0] +
            "T" +
            eventData.end.split(" ")[1].split("+")[0],
          description: eventData.location,
          id: eventData.uid,
          color: eventData.prof !== "NA" ? "default" : "#005049",
        }));

        setEvents(formattedEvents);
      } catch (error: any) {
        console.error("Error fetching events:", error);
        presentAlert({
          header: "Erreur !",
          message: error.toString(),
          buttons: ["Ok"],
        });
      }
    };

    fetchEvents();
  }, [props.name]);

  return (
    <>
      {events.length ? (
        <>
        <div id="main">
        <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            locale="fr"
            titleFormat={{ month: "long", day: "numeric" }}
            hiddenDays={[6, 0]}
            events={events}
            allDaySlot={false}
            nowIndicator={true}
            height="auto"
            slotMinTime="08:00"
            slotMaxTime="19:00"
          />
        </div>
          
        </>
      ) : (
        // Loading indicator
        <>
        <IonProgressBar type="indeterminate"></IonProgressBar>
        <h1 className="center">Chargement</h1>
        </>
      )}
    </>
  );
};

export default CalendarComponents;
