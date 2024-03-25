import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CapacitorHttp } from "@capacitor/core";
import { caretBackOutline, caretForwardOutline, star } from "ionicons/icons";
import "./calendarComponant.css";
import { Storage } from "@ionic/storage";

import {
  LocalNotificationSchema,
  LocalNotifications,
} from "@capacitor/local-notifications";
import { useSwipeable } from "react-swipeable";
const store = new Storage();

import {
  useIonAlert,
  IonProgressBar,
  IonButton,
  IonDatetime,
  IonModal,
  IonIcon,
} from "@ionic/react";
import { scheduleNotifications } from "../tools/notifications";
import { Toast } from "@capacitor/toast";



interface Props {
  name?: string;
}

const CalendarComponents: React.FC<Props> = (props) => {
  const [events, setEvents] = useState([]);
  const [presentAlert] = useIonAlert();
  const calendarRef: any = useRef(null);
  const modalRef = useRef<null | HTMLIonModalElement>(null);
  const datetimeRef = useRef<null | HTMLIonDatetimeElement>(null);
  const todaydate = new Date();
  const mois: any = {
    "0": "Janvier",
    "1": "Février",
    "2": "Mars",
    "3": "Avril",
    "4": "Mai",
    "5": "Juin",
    "6": "Juillet",
    "7": "Août",
    "8": "Septembre",
    "9": "Octobre",
    "10": "Novembre",
    "11": "Decembre",
  };
  const [currentDate, setCurrentDate] = useState(
    todaydate.getDate() + " " + mois[todaydate.getMonth()]
  );


  // Récuperation de l'API URL

    
  const getApiUrl = async () => {
    await store.create();
    let apiUrl = await store.get("apiUrl");
    if (!apiUrl) {
      apiUrl = "https://edt4rt-api.romain-pinsolle.fr";
      await store.set("apiUrl", apiUrl);
    }
    return apiUrl;
  };


  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const api = await getApiUrl();
        const apiUrl = api.endsWith("/") ? api.slice(0, -1) : api;

        const response = await CapacitorHttp.get({
          url:
            apiUrl+"/api/planning/getPlanningPerName/" +
            props.name,
        });
        
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

          extendedProps: {
            prof: eventData.prof,
            cours: eventData.summary,
            location: eventData.location,
          },
        }));

        setEvents(formattedEvents);
        scheduleNotifications(formattedEvents);
      } catch (error: any) {
       
        presentAlert({
          header: "Erreur !",
          message: error.toString(),
          buttons: ["Ok"],
        });
      }
    };

    fetchEvents();
  }, [props.name]);




  // Boutton de la page
  function goNext() {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    refreshDate();
  }
  function goBack() {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    refreshDate();
  }
  function today() {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    refreshDate();
    
  }



function setNewDate() {
  modalRef.current?.dismiss();
  const calendarApi = calendarRef.current.getApi();
  calendarApi.gotoDate(datetimeRef.current?.value);
  refreshDate();
}

  function refreshDate() {
    const calendarApi = calendarRef.current.getApi();
    setCurrentDate(
      calendarApi.getDate().getDate() +
        " " +
        mois[calendarApi.getDate().getMonth()]
    );
  }

  // verifie si c'est un weekend
  const isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => goNext(),
    onSwipedRight: () => goBack(),
    // Vous pouvez également définir des gestionnaires pour onSwipedUp et onSwipedDown si nécessaire
  });

  function renderEventContent(eventInfo: {
    timeText: any;
    event: {
      extendedProps: {
        cours:
          | string
        location:
          | string
        prof:
          | string
      };
    };
  }) {
    return (
      <>
        <>{eventInfo.timeText}</>
        <br></br>
      {eventInfo.event.extendedProps.cours.length > 33
        ? eventInfo.event.extendedProps.cours.slice(0, 30) + " ..."
        : eventInfo.event.extendedProps.cours}
        <br></br>
        <i>{eventInfo.event.extendedProps.location}</i>
        <br></br>

        {eventInfo.event.extendedProps.prof != "NA" ? (
          <i>{eventInfo.event.extendedProps.prof}</i>
        ) : (
          ""
        )}
      </>
    );
  }

  return (
    <>

      {events.length ? (
        <>
          <div id="main" {...handlers}>
            <div className="center">
              <IonButton
                id="datetime-picker"
                shape="round"
                fill="outline"
                size="large"
              >
                {currentDate}
              </IonButton>{" "}
              <br></br>
              <IonButton onClick={today}>Ajourd'hui</IonButton>
              <IonButton onClick={goBack} slot="icon-only">
                <IonIcon slot="icon-only" icon={caretBackOutline}></IonIcon>
              </IonButton>
              <IonButton onClick={goNext} slot="icon-only">
                <IonIcon slot="icon-only" icon={caretForwardOutline}></IonIcon>
              </IonButton>

            </div>

            <IonModal
              keepContentsMounted={true}
              trigger="datetime-picker"
              ref={modalRef}
            >
              <IonDatetime
                id="datetime"
                presentation="date"
                onIonChange={setNewDate}
                ref={datetimeRef}
                firstDayOfWeek={1}
                isDateEnabled={isWeekday}
              ></IonDatetime>
            </IonModal>

            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin]}
              initialView="timeGridDay"
              locale="fr"
              headerToolbar={{
                start: "",
                center: "",
                end: "",
              }}
              titleFormat={{ month: "long", day: "numeric" }}
              buttonText={{ today: "Aujourd'hui" }}
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

export default CalendarComponents;
