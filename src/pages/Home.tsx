import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import CalendarComponents from "../components/calendarComponents";

const Home = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>EDT 4 RT</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div id="main-content">
          <CalendarComponents name="but1_g3"></CalendarComponents>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
