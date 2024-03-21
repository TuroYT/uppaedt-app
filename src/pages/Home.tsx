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
  IonNavLink,
  IonButton,
  IonLabel,
  IonIcon,


} from "@ionic/react";
import CalendarComponents from "../components/calendarComponents";
import { useState, useCallback } from "react";
import { Storage } from "@ionic/storage";

import { homeOutline, settingsOutline } from 'ionicons/icons'
const store = new Storage();


const Home = () => {
  
  const [groupe, setGroupe] = useState(String);

  const preload = async () => {
    await store.create();
    if (await store.get("groupe")) {
      setGroupe(await store.get("groupe"));
    }
  };
  preload();

   

  return (<>
    
    
    <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">


        <IonList>
        <IonItem button={true} routerLink="/home" routerDirection="forward">
        <IonIcon aria-hidden="true" icon={homeOutline} slot="start"></IonIcon>
        <IonLabel>Emploi du temps</IonLabel>
      </IonItem>
      <IonItem button={true} routerLink="/settings" routerDirection="forward">
        <IonIcon aria-hidden="true" icon={settingsOutline} slot="start"></IonIcon>
        <IonLabel>Paramètres</IonLabel>
      </IonItem>
      
      </IonList>

        </IonContent>

      </IonMenu>
  
 
  




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
    </>
  );
};

export default Home;
