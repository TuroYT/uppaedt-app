import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import CalendarComponents from "../components/calendarComponents";
import { useState, useCallback } from "react";
import { Storage } from "@ionic/storage";


const store = new Storage();

import {
  LocalNotificationSchema,
  LocalNotifications,
} from "@capacitor/local-notifications";



const Home = () => {
  const [groupe, setGroupe] = useState(String);
  LocalNotifications.checkPermissions().then((result) => {
    if (!result.display) {
      LocalNotifications.requestPermissions().then((result) => {
        if (!result.display) {
          console.log("No permission to show notifications");
        }
      });
    }
  }); // Add closing parenthesis here

  // fonction qui emet une notification de test
  const sendTestNotification = async () => {
    const notificationTime = new Date(Date.now() + 3000); // 3 seconds from now
    const notification: LocalNotificationSchema = {
      title: "Test Notification",
      body: "test",
      id: notificationTime.getTime(),
      schedule: { at: notificationTime },
    };
    await LocalNotifications.schedule({
      notifications: [notification],
    });
  }


  const preload = async () => {
    await store.create();
    if (await store.get("groupe")) {
      setGroupe(await store.get("groupe"));
    }
  };
  preload();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonList>
            <IonItem>
              <IonSelect
                value={groupe}
                aria-label="Selection"
                interface="popover"
                placeholder="Choisir un Groupe"
                onIonChange={(e) => {
                  setGroupe(e.detail.value);
                  store.set("groupe", e.detail.value);
                }}
              >
                <IonSelectOption value="but1_g1">BUT1 Groupe 1</IonSelectOption>
                <IonSelectOption value="but1_g2">BUT1 Groupe 2</IonSelectOption>
                <IonSelectOption value="but1_g3">BUT1 Groupe 3</IonSelectOption>
                <IonSelectOption value="but1_g4">BUT1 Groupe 4</IonSelectOption>
                <IonSelectOption value="s4_cyber">BUT2 Cyber</IonSelectOption>
                <IonSelectOption value="s4_rom">BUT2 Rom</IonSelectOption>
                <IonSelectOption value="s4_pilpro">BUT2 PilPro</IonSelectOption>


              </IonSelect>
            </IonItem>
          </IonList>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
          {groupe.length ? (
            <CalendarComponents name={groupe}></CalendarComponents>
          ) : (
            <h1>Entrez un Groupe d'étude</h1>
          )}
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
