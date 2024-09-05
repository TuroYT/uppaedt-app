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
import { co } from "@fullcalendar/core/internal-common";

const store = new Storage();
store.create();

const Formations: React.FC = () => {
  const [Selected, setSelected] = useState<any>();
  const [CurrentFormations, setCurrentFormations] = useState<any>([]);

  const getApiUrl = async () => {
    await store.create();
    let apiUrl = await store.get("apiUrl");
    if (!apiUrl) {
      apiUrl = "https://uppaedt-api.romain-pinsolle.fr";
      await store.set("apiUrl", apiUrl);
    }
    return apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
  };



  const getSelectedFromStorage = async () => {
    await store.get("Selected").then(async (value) => {
      if (value) {
        setSelected(value);
      } else {
        await store.set("Selected", []);
        setSelected([]);
      }
    });
  };

  const addselected = async (id: number) => {
    const toselect = [...Selected, id]
    setSelected(toselect);
    let test = await store.set("Selected", toselect);

  }

  const removeselected = async (id: number) => {
    const toselect = Selected.filter((selected: number) => selected !== id);
    setSelected(toselect);
    await store.set("Selected", toselect);
  }

  const isSelected = (id: number) => {
    return Selected.includes(id);
  };


  const getFormations = async () => {
    const apiurl = await getApiUrl();
    const response = await fetch(
      apiurl +"/api/groupes/getallwithformations",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    const data = await response.json();

    return data;
  };

  

  useEffect(() => {
    getSelectedFromStorage();
    
    getFormations().then((formations: any) => {
      setCurrentFormations(formations);
      
    })
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
            {
            CurrentFormations.map((formationgroup: any) => {
              return (
                <IonAccordion value={formationgroup.formation.nom} key={formationgroup.formation.id}>
                  <IonItem slot="header" color="light">
                    <IonLabel>{formationgroup.formation.nom}</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    
                  
                  {
                    formationgroup.groupes.map((groupe: any) => {
                      return (
                        <IonItem key={groupe.id}>
                          <IonLabel>{groupe.nom} </IonLabel>
                          <IonToggle
                            checked={isSelected(groupe.id)}
                            onIonChange={(e) => {
                              if (e.detail.checked) {
                                addselected(groupe.id);
                              } else {
                                removeselected(groupe.id);
                              }
                              
                        
                            }}
                          />
                        </IonItem>
                      );
                    })
                  }
                  </div>
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
