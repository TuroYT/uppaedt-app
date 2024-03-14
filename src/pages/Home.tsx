import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList, IonItem, IonSelect, IonSelectOption 
} from "@ionic/react";
import CalendarComponents from "../components/calendarComponents";
import { useState } from "react";

const Home = () => {
  const [groupe, setGroupe] = useState(String)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonList >
      <IonItem>
        <IonSelect aria-label="Selection" interface="popover" placeholder="Choisir un Groupe" onIonChange={(e) => setGroupe(e.detail.value)}>
          <IonSelectOption value="but1_g1">BUT1 Groupe 1</IonSelectOption>
          <IonSelectOption value="but1_g2">BUT1 Groupe 2</IonSelectOption>
          <IonSelectOption value="but1_g3">BUT1 Groupe 3</IonSelectOption>
          <IonSelectOption value="but1_g4">BUT1 Groupe 4</IonSelectOption>
        </IonSelect>
      </IonItem>
    </IonList>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div id="main-content">
          <CalendarComponents name = {groupe}></CalendarComponents>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
