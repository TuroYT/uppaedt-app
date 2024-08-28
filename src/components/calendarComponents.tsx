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
} from "@ionic/react";
import { useSwipeable } from "react-swipeable";
import {
  useIonAlert,
  IonProgressBar,
  IonButton,
  IonDatetime,
  IonModal,
  IonIcon,
} from "@ionic/react";
import { scheduleNotifications } from "../tools/notifications";
import { Swiper, SwiperSlide } from "swiper/react";
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

const store = new Storage();


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
    isLastCours: boolean;
    start: String;
    end: String;
  };
}
interface Props {
  name?: string;
}

const CalendarComponents: React.FC<Props> = (props) => {
  const modal = useRef<any>(null);
  const [eventInfo, setEventInfo] = useState({
    cours: "",
    location: "",
    prof: "",
    start: "",
    end: "",
    isLastCours: false,
  });
  const [events, setEvents] = useState([]);
  const [presentAlert] = useIonAlert();
  const calendarRef: any = useRef(null);
  const modalRef = useRef<null | any>(null);
  const datetimeRef = useRef<null | any>(null);
  const swiperRef = useRef<null | any>(null);
  const todaydate = new Date();

  // affichache de la date
  const [currentDate, setCurrentDate] = useState(
    todaydate.getDate() + " " + mois[todaydate.getMonth()]
  );

  // Récuperation de l'API URL

  // Api sauvegardé dans le storafe
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
        const apiUrl = api.endsWith("/") ? api.slice(0, -1) : api; // enleve le /
        const response = await CapacitorHttp.get({
          url: apiUrl + "/api/planning/getPlanningPerName/" + props.name,
        });
  
        // Vérifiez le statut de la réponse
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        // Loggez la réponse pour inspection
        console.log("API Response:", response);
  
        // Assurez-vous que la réponse est bien du JSON
        const json = await response.data;
        if (typeof json !== 'object') {
          throw new Error("La réponse de l'API n'est pas un JSON valide.");
        }
        const formattedEvents: never[] = [];
        if (json.length !== 0) {

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
          color:
            eventData.prof !== "NA"
              ? json.filter(
                  (e: any) =>
                    e.summary === eventData.summary && e.start > eventData.start
                ).length === 0
                ? "#ff9966" // dernier cours
                : "default" // default
              : "#005049", // Sae sans prof
          extendedProps: {
            prof: eventData.prof,
            cours: eventData.summary,
            location: eventData.location,
            start: eventData.start.split(" ")[1].split("+")[0].slice(0, -3),
            end: eventData.end.split(" ")[1].split("+")[0].slice(0, -3),
            isLastCours:
              json.filter(
                (e: any) =>
                  e.summary === eventData.summary && e.start > eventData.start
              ).length === 0, // dernier cours
          },
        }))};
        setEvents(formattedEvents);
        console.log(events)
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

  const onSwipe = () => {
    if (swiperRef.current.activeIndex === 0) {
      goBack();
    } else {
      goNext;
    }
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(1);
    }
  }
  const handlers = useSwipeable({
    onSwipedLeft: () => goNext(),
    onSwipedRight: () => goBack(),
  });



  function renderEventContent(eventInfo: {
    timeText: any;
    event: {
      extendedProps: {
        cours: string;
        location: string;
        prof: string;
        start: string;
        end: string;
        isLastCours: boolean;
      };
    };
  }) { // Evevent Render
    return (

      
      <>
        <>{eventInfo.timeText}</>
        <br />
        {eventInfo.event.extendedProps.cours.length > 33
          ? eventInfo.event.extendedProps.cours.slice(0, 30) + " ..."
          : eventInfo.event.extendedProps.cours} 
        <br />
        <i>{eventInfo.event.extendedProps.location}</i>
        <br />


        {eventInfo.event.extendedProps.prof != "NA" ? (
          <i>{eventInfo.event.extendedProps.prof}</i>
        ) : (
          ""
        )}
      </>
    );
  } return (
    <>
      {(
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
              </IonButton>
              <br />
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
                    <IonButton onClick={() => modal.current?.dismiss()}>
                      ok
                    </IonButton>
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
                {eventInfo.isLastCours ? (
                  <IonItem>
                    <IonLabel>
                      <h2>⚠️ Dernier cours du module, risque de contrôle ⚠️</h2>
                    </IonLabel>
                  </IonItem>
                ) : (
                  ""
                )}
              </IonList>
            </IonModal>


            <Swiper ref={swiperRef} onSlideChange={onSwipe} initialSlide={1}>
            <SwiperSlide>

  </SwiperSlide>
  <SwiperSlide>

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
  </SwiperSlide>
  <SwiperSlide>


</SwiperSlide>
</Swiper>

            
          </div>
        </>
      )}
    </>
  );
};

export default CalendarComponents;
