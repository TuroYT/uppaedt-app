import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonInput, IonButton } from '@ionic/react';
import { Storage } from "@ionic/storage";


const store = new Storage();
await store.create();


const Settings: React.FC = () => {
    const [apiUrl, setApiUrl] = useState('https://edt4rt-api.romain-pinsolle.fr');
    const preload = async () => {
      await store.create();
      if (await store.get("apiUrl")) {
        setApiUrl(await store.get("apiUrl"));
      }
    };

    


    preload();


    const handleApiUrlChange = (event: CustomEvent) => {
        setApiUrl(event.detail.value);
    };

    const saveApiUrl = () => {
        
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem>
                        <IonLabel position="floating" defaultValue={apiUrl}>Custom API URL</IonLabel>
                        <IonInput value={apiUrl} onIonChange={handleApiUrlChange}></IonInput>
                    </IonItem>
                    <IonButton expand="full" onClick={saveApiUrl}>Save</IonButton>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Settings;