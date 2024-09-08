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
  IonMenu,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonLabel,

  

} from "@ionic/react";
import { LocalNotifications } from "@capacitor/local-notifications";
import CalendarComponents from "../components/calendarComponents";
import { useState, useCallback, useEffect } from "react";
import { Storage } from "@ionic/storage";
import Settings from "./Settings";
import { homeOutline, settingsOutline, calendarClearOutline } from "ionicons/icons";
import { Capacitor } from "@capacitor/core";
import MenuComponents from "../components/menuComponant"
import { co } from "@fullcalendar/core/internal-common";
import { CapacitorHttp } from "@capacitor/core";

const store = new Storage();


const Home = () => {
  
  const [groupe, setGroupe] = useState(0);
  const [selectedGroups, setSelectedGroups] = useState<any>([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchGroups = async () => {
      const selected = await store.get("Selected");
      setSelectedGroups([]);
      if (selected) {
        const apiUrl = await store.get("apiUrl");
        const groupPromises = selected.map(async (id: number) => {
          const response = CapacitorHttp.get({
            url: `${apiUrl}/api/groupes/getFromId/${id}`,
          });
          return (await response).data;
        });
        const groups = await Promise.all(groupPromises);

        setSelectedGroups(groups);
      }
    };

    fetchGroups();
    setHasFetched(true);
  }, []);


  const MakeChannel = async () => {
    if (Capacitor.getPlatform() !== 'web') {
      const currentChannels = await LocalNotifications.listChannels();
      if (!currentChannels.channels.some((channel) => channel.id === '1')) {
        LocalNotifications.createChannel({
          id: '1',
          name: 'events',
          description: 'notif avant les cours',
          importance: 3,
          visibility: 1,
          vibration: true,
          sound: 'sound_name.wav'
        });
      }
    } else {
      console.warn("LocalNotifications plugin is not implemented on web.");
    }
  };
  const preload = async () => {
    await store.create();
    if (await store.get("groupe")) {
      setGroupe(await store.get("groupe"));
    }
  };
  preload();
  MakeChannel()

   

  return (<>
    
    
    <MenuComponents></MenuComponents>
  
 
  




    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar>
        
        <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>


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
                {
                  selectedGroups.length ? (
                    selectedGroups.map((group: any) => {
                      return <IonSelectOption value={group.id} key={group.id}>{group.nom}</IonSelectOption>;
                    })
                  ) : (
                    <IonSelectOption value="0">Veuillez selectionner des groupes</IonSelectOption>
                  )
              
                }

              </IonSelect>
            </IonItem>
          </IonList>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

          {groupe === 0 ? (
            console.log(groupe),
              <h1>Entrez un Groupe d'étude</h1>
            ) : (
              <CalendarComponents name={groupe}></CalendarComponents>
            )

          }
        
      </IonContent>
    </IonPage>
    </>
  );
};

export default Home;