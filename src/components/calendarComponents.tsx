import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CapacitorHttp } from "@capacitor/core";
import { caretBackOutline, caretForwardOutline, star } from "ionicons/icons";
import "./calendarComponant.css";
import {
  useIonAlert,
  IonProgressBar,
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonIcon,
} from "@ionic/react";

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

  return (
    <>
      {events.length ? (
        <>
          <div id="main">
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
                start: "", // will normally be on the left. if RTL, will be on the right
                center: "",
                end: "", // will normally be on the right. if RTL, will be on the left
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
