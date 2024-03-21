import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonInput, IonButton } from '@ionic/react';
import { Storage } from "@ionic/storage";
import {
    LocalNotificationSchema,
    LocalNotifications,
  } from "@capacitor/local-notifications";
import {

    IonSelect,
    IonSelectOption,
    IonMenu,
    IonButtons,
    IonMenuButton,
    IonNavLink,
    IonCheckbox,
    IonIcon,
  
  
  } from "@ionic/react";
  import { homeOutline, settingsOutline } from 'ionicons/icons'
const store = new Storage();

const Settings: React.FC = () => {
    const [apiUrl, setApiUrl] = useState('');
    const [notifState, setnotifState] = useState(true);
    
    const preload = async () => {
        await store.create();
        if (await store.get("apiUrl") && apiUrl === "") {
            setApiUrl(await store.get("apiUrl"));
        }
        if (await store.get("notifState")) {
            
            setnotifState(await store.get("notifState"));
        } else {
            setnotifState(true);
            await store.set("notifState", true)
        }
    };
    preload();

    const handleNotifChange = async (event: CustomEvent) => {
        setnotifState(event.detail.checked)
        await store.set("notifState", event.detail.checked)
        if (await store.get("notifState")) {
            LocalNotifications.checkPermissions().then((result) => {
                if (result.display !== "granted") {
                  LocalNotifications.requestPermissions();
                }})
        }
    }
    
    const handleApiUrlChange = (event: CustomEvent) => {
        setApiUrl(event.detail.value);
    };

    const saveApiUrl = () => {
        store.set("apiUrl", apiUrl);
        
    };

    return (
 <>
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

        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">


             
                <IonList inlist={true}>
                    <IonItem>   
                        <IonLabel position="floating" defaultValue={apiUrl}>Custom API URL - default : https://edt4rt-api.romain-pinsolle.fr</IonLabel>
                        <IonInput value={apiUrl} onIonChange={handleApiUrlChange}></IonInput>
                        <IonButton expand="full" onClick={saveApiUrl} slot='end' size='default' shape="round" type='submit'>Valider</IonButton>
                    </IonItem>
                    
                    <IonItem>   
                        <IonLabel defaultValue={apiUrl}>Activer les notification ?</IonLabel>
                        <IonCheckbox labelPlacement="stacked" alignment="center" onIonChange={handleNotifChange}></IonCheckbox>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
        </>
    );
};

export default Settings;