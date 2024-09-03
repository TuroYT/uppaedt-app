import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonTitle, IonToolbar } from "@ionic/react";
import { homeOutline, settingsOutline, calendarClearOutline } from "ionicons/icons";

const MenuComponents: React.FC = () => {

    return(
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
      <IonItem button={true} routerLink="/formations" routerDirection="forward">
        <IonIcon aria-hidden="true" icon={calendarClearOutline} slot="start"></IonIcon>
        <IonLabel>Formations</IonLabel>
      </IonItem>
      
      </IonList>

        </IonContent>

      </IonMenu>
        </>
    )
}

export default MenuComponents;