import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonInput,
  IonButtons,
  IonMenuButton,
  IonAccordion,
  IonAccordionGroup,
} from "@ionic/react";
import { Storage } from "@ionic/storage";
import MenuComponents from "../components/menuComponant";
import { Method } from "ionicons/dist/types/stencil-public-runtime";

const store = new Storage();
store.create();

const Formations: React.FC = () => {
  const [Selected, setSelected] = useState<any>();
  const [CurrentFormations, setCurrentFormations] = useState<any>([]);
  const [CurrentGroups, setCurrentGroups] = useState<any>({});

  const getApiUrl = async () => {
    await store.create();
    let apiUrl = await store.get("apiUrl");
    if (!apiUrl) {
      apiUrl = "https://uppaedt-api.romain-pinsolle.fr";
      await store.set("apiUrl", apiUrl);
    }
    return apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
  };



  const getSelectedFromStorage = () => {
    store.get("Selected").then((value) => {
      if (value && value.type === "Array") {
        setSelected(value);
      } else {
        saveSelectedToStorage([]);
        setSelected([]);
      }
    });
  };

  const saveSelectedToStorage = (value: any) => {
    store.set("Selected", value);
  };

  const getFormations = async () => {
    const response = await fetch(
      await getApiUrl() +"/api/formations/getall"
    );
    const data = await response.json();
    return data;
  };

  const getGroupFromFormation = async (id: number) => {
    const response = await fetch(
      await getApiUrl() +"/api/groupes/getFromFormation",{
          method: "POST",
          headers: {
            "Content-Type": "application/json" // Add this line to specify the request body format
          },
          body: JSON.stringify({ formation_id: id }) // Update the property name to match the server's expected format
        }
    );
    const data = await response.json();
    return data;
  };

  const isSelected = (id: number) => {
    return Selected.includes(id);
  };

  useEffect(() => {
    getSelectedFromStorage();
    getFormations().then((formations: any) => {
      setCurrentFormations(formations);
      formations.forEach((formation: any) => {
        getGroupFromFormation(formation.id).then((groupes: any) => {
          setCurrentGroups({
            ...CurrentGroups,
            [formation.id]: groupes,
          });
        });
      });
    });
  }, []);

  return (
    <>
      <MenuComponents></MenuComponents>

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Formations</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <h1>Selection des formations</h1>

          <IonAccordionGroup>
            {CurrentFormations.map((formation: any) => {
              return (
                <IonAccordion value={formation.nom} key={formation.id}>
                  <IonItem slot="header" color="light">
                    <IonLabel>{formation.nom}</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    test
                  </div>
                  {
            
                  }
                </IonAccordion>
              );
            })}
          </IonAccordionGroup>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Formations;
