import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonInput, IonButton } from '@ionic/react';
import { Storage } from "@ionic/storage";
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
  import { LocalNotifications } from '@capacitor/local-notifications';
const store = new Storage();

const Settings: React.FC = () => {
    
    const [apiUrl, setApiUrl] = useState('');
    const [notification, setNotification] = useState(true);
    
    const preload = async () => {
        await store.create();
        if (await store.get("apiUrl") && apiUrl === "") {
            setApiUrl(await store.get("apiUrl"));
            setNotification(await store.get("notification"));
        }
    };
    preload();
    const handleApiUrlChange = (event: CustomEvent) => {
        setApiUrl(event.detail.value);
    };

    const saveApiUrl = () => {
        
        store.set("apiUrl", apiUrl);
        
    };

    const handleNotification = async (event: CustomEvent) => {
        await store.create();
        setNotification(event.detail.checked);
        

        if (event.detail.checked) {
            LocalNotifications.requestPermissions();
            await store.set("notification", true);
        } else {
            LocalNotifications.cancel({notifications: (await LocalNotifications.getPending()).notifications})
            await store.set("notification", false);
        }
        console.log(await store.get("notification"))    ;
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

        <IonPage  id="main-content">
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
                        <IonButton expand="full" onClick={saveApiUrl} size='default' shape="round" type='submit'>Valider</IonButton>
                    </IonItem>
                    {/* 

                        A finir

                    <IonItem>   
                        <IonLabel defaultValue={apiUrl}>Activer les notification ?</IonLabel>
                        <IonCheckbox labelPlacement="stacked" alignment="center" checked={notification} onIonChange={handleNotification}></IonCheckbox>
                    </IonItem>

                    */}
                </IonList>
            </IonContent>
        </IonPage>
        </>
    );
};

export default Settings;