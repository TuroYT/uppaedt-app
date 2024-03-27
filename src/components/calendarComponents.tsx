import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CapacitorHttp } from "@capacitor/core";
import { caretBackOutline, caretForwardOutline, star } from "ionicons/icons";
import "./calendarComponant.css";
import { Storage } from "@ionic/storage";
import {
  IonButtons,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonInput,
  IonList,
  IonLabel,
} from '@ionic/react';
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


interface Event {
  title: String;
  start: String;
  end: String;
  description: String;
  id: String;
  color: String;
  extendedProps: {
    prof: String;
    cours: String;
    location: String;
    isLastCours : boolean;
    start : String;
    end : String;
  };
}
interface Props {
  name?: string;
}

const CalendarComponents: React.FC<Props> = (props) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [eventInfo, setEventInfo] = useState({cours : "", location : "", prof : "", start : "", end : "", isLastCours : false});
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
          color: eventData.prof !== "NA" ? ((json.filter((e: any) => e.summary === eventData.summary && e.start > eventData.start).length === 0) ? "#ff9966" : "default") : "#005049",

          extendedProps: {
            prof: eventData.prof,
            cours: eventData.summary,
            location: eventData.location,
            start : eventData.start.split(" ")[1].split("+")[0].slice(0, -3),
            end : eventData.end.split(" ")[1].split("+")[0].slice(0, -3),
            isLastCours : json.filter((e: any) => e.summary === eventData.summary && e.start > eventData.start).length === 0,
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
        start : string
        end : string
        isLastCours : boolean

      };
    };
  }) {
    return (
      <>
        <>{eventInfo.timeText}</>
        <br></br>
        <b>{eventInfo.event.extendedProps.cours}</b>
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
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
<IonContent className="ion-padding">
    






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


            <IonModal ref={modal} id="modalevent">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="end">
                <IonButton onClick={() => modal.current?.dismiss()}>ok</IonButton>
              </IonButtons>
              <IonTitle>{eventInfo.cours}</IonTitle>
            </IonToolbar>
          </IonHeader>
          
           <IonList>
            <IonItem>
              <IonLabel>
                <p>Cours</p>
                {eventInfo.cours}
              </IonLabel>
            </IonItem>
            <IonItem>

              <IonLabel>
                <p>Professeur</p>
                {eventInfo.prof.replace("\n", " ")}
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <p>Lieu</p>
                {eventInfo.location}
              </IonLabel>
              </IonItem>
            <IonItem>
              <IonLabel>
                <p>Heure</p>
                {eventInfo.start} - {eventInfo.end}
              </IonLabel>
            </IonItem>
            {eventInfo.isLastCours ? <IonItem>
              <IonLabel>
                <h2>⚠️ Dernier cours du module, risque de contrôle ⚠️</h2>
              </IonLabel>
            </IonItem> : ""}
           </IonList>
          
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
                eventClick={(event) => {
                  console.log(event);
                  setEventInfo({
                    cours: event.event.extendedProps.cours,
                    location: event.event.extendedProps.location,
                    prof: event.event.extendedProps.prof,
                    start: event.event.extendedProps.start,
                    end: event.event.extendedProps.end,
                    isLastCours: event.event.extendedProps.isLastCours,
                  });
                  modal.current?.present();
                }}
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

      </IonContent>
    </>
  );
};

export default CalendarComponents;
