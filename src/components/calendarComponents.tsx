import React, { useState, useEffect, useRef } from "react";
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

          extendedProps : {
            prof : eventData.prof,
            cours : eventData.summary,
            location : eventData.location

          }

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


  const calendarRef = useRef(null)
  // https://fullcalendar.io/docs/react
  return (
    <>
      {events.length ? (
        <>
        <div id="main">
        <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            locale="fr"
            headerToolbar={{
              start: '', // will normally be on the left. if RTL, will be on the right
              center: '',
              end: 'today prev,next' // will normally be on the right. if RTL, will be on the left
            }}
            titleFormat={{ month: "long", day: "numeric" }}
            buttonText={{'today': "Aujourd'hui"}}
            hiddenDays={[6, 0]}
            events={events}
            allDaySlot={false}
            nowIndicator={true}
            height="auto"
            slotMinTime="08:00"
            slotMaxTime="19:00"
            eventContent={renderEventContent}
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

function renderEventContent(eventInfo: { timeText: any; event: { extendedProps: { cours: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; location: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; prof: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }; }; }) {
  return (
    <>
      <>{eventInfo.timeText}</><br></br>
      <b>{eventInfo.event.extendedProps.cours}</b><br></br>
      <i>{eventInfo.event.extendedProps.location}</i><br></br>
      
      {eventInfo.event.extendedProps.prof != 'NA' ? (<i>{eventInfo.event.extendedProps.prof}</i>):('')}
      
    </>
  )
}


export default CalendarComponents;
