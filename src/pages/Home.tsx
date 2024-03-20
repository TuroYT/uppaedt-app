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
  IonButton,
} from "@ionic/react";
import CalendarComponents from "../components/calendarComponents";
import { useState, useCallback, useEffect } from "react";
import { Storage } from "@ionic/storage";


const store = new Storage();

import {
  LocalNotificationSchema,
  LocalNotifications,
} from "@capacitor/local-notifications";

import { Toast } from '@capacitor/toast';


const Home = () => {
  // Verifie si le canal n'existe pass

  const MakeChannel = async () => {
    const currentChannels = await LocalNotifications.listChannels();
    if (!currentChannels.channels.some((channel) => channel.id === '1')) {
      LocalNotifications.createChannel({
        id: '1',
        name: 'events',
        description: 'notif avant les cours',
        importance : 3,
        visibility: 1,
        vibration: true,
        sound: 'sound_name.wav'
      })
    }
  }
  const [groupe, setGroupe] = useState(String);
  
  LocalNotifications.checkPermissions().then((result) => {
    if (result.display !== "granted") {
      LocalNotifications.requestPermissions();
    }})


  // fonction qui emet une notification de test
  const sendTestNotification = async () => {
    Toast.show({
      text: "Notification de test envoyée",
      duration: "short"
    });

    try{
      LocalNotifications.schedule({
        notifications: [
          {
            channelId: '1',
            id: 0,
            title: 'notification_title',
            body: 'notification_body',
            schedule : {at: new Date(Date.now() + 2000), allowWhileIdle: true},
            
          }
        ]
      });
      console.log((await LocalNotifications.getPending()).notifications)
    } catch (e) {
      console.log(e);
      
    }

    
  }


  const preload = async () => {
    await store.create();
    if (await store.get("groupe")) {
      setGroupe(await store.get("groupe"));
    }
  };




  preload();
  MakeChannel();
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
                <IonButton onClick={sendTestNotification}></IonButton>
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
