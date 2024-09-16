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
    IonRow
  
  } from "@ionic/react";
  import { homeOutline, settingsOutline } from 'ionicons/icons'
  import { LocalNotifications } from '@capacitor/local-notifications';
import MenuComponents from '../components/menuComponant';
const store = new Storage();

const Settings: React.FC = () => {
    
    const [apiUrl, setApiUrl] = useState('');
    const [notification, setNotification] = useState(true);
    
    const preload = async () => {
        await store.create();
        if (await store.get("apiUrl") && apiUrl === "") {
            setApiUrl(await store.get("apiUrl"));
        }

        
    };
    preload();
    const handleApiUrlChange = (event: CustomEvent) => {
        setApiUrl(event.detail.value);
    };

    const saveApiUrl = () => {
        
        store.set("apiUrl", apiUrl);
        
    };

    const resetApiUrl = () => {
        setApiUrl("https://uppaedt-api.romain-pinsolle.fr")
        store.set("apiUrl", apiUrl);
    }

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
        <MenuComponents></MenuComponents>

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
                        <IonLabel position="floating" defaultValue={apiUrl}>Custom API URL</IonLabel>
                        <IonInput value={apiUrl} onIonChange={handleApiUrlChange}></IonInput>
                        
                        
                    </IonItem>
                    <IonRow>
                        <IonButton expand="full" onClick={saveApiUrl} size='default' shape="round" type='submit'>Valider</IonButton>
                        <IonButton expand="full" onClick={resetApiUrl} size='default' shape="round" type='submit'>Reset</IonButton>
                    </IonRow>
                    {/* 

                        A finir

                    <IonItem>   
                        <IonLabel>Activer les notification ?</IonLabel>
                        <IonCheckbox labelPlacement="stacked" alignment="center" checked={notification} onIonChange={handleNotification}></IonCheckbox>
                    </IonItem>

                    */}
                </IonList>


            <p>Fait avec amour par <a href='https://romain-pinsolle.fr/'>@turoyt</a>
            <br/>
            Pour plus d'informations, vous pouvez me contacter par mail à <a href='mailto:contact@romain-pinsolle.fr'>contact@romain-pinsolle.fr </a>
            ou sur discord : <b>turocestmoi</b>
            </p>
            </IonContent>
        </IonPage>
        </>
    );
};

export default Settings;