import {
  LocalNotificationSchema,
  LocalNotifications,
} from "@capacitor/local-notifications";
import { Storage } from "@ionic/storage";
interface Event {
  title: String;
  start: String;
  end: String;
  description: String;
  id: String;
  color: String;
  extendedProps: {
    prof: String;
    cours: String;
    location: String;
  };
}
const store = new Storage();



export const scheduleNotifications = async (events: Event[]) => {
  
  await store.create();
  console.log(await store.get("notification"));
  if (await store.get("notification") === null) {
    store.set("notification", true);
  }


  // a remplacer par await store.get("notification")
  if (true) {
    LocalNotifications.requestPermissions();


    LocalNotifications.cancel({notifications: (await LocalNotifications.getPending()).notifications})

    const currentPendings: LocalNotificationSchema[] = (
      await LocalNotifications.getPending()
    ).notifications;
  
  
    var toAdd: LocalNotificationSchema[] = [];
  
    events.forEach((event) => {
      store.get("notification");
  
  
      const notificationTime = new Date(new Date(event.start.toString()).getTime() - 5 * 60 * 1000); // 5 minutes before the event
  
      const notification: LocalNotificationSchema = {
        title: "Dans 5 minutes : " + event.extendedProps.cours,
        body: `${event.extendedProps.location}`,
        id: Math.floor(Math.random() * 1000000),
        channelId: '1',
        schedule: { at: notificationTime, allowWhileIdle : true }, // You can specify a sound file if desired
      };
  
      // Vérifie que la notification n'est pas dans la liste des currents pending et l'ajoute a toAdd
      if (!currentPendings.some((pending) => pending.id === notification.id)) {
  
  
        // Verifie si la date est dans le futur
        if (notificationTime.getTime() > new Date().getTime()) {
          // Vérifie si la date de notification est aujourd'hui ou demain
        if (notificationTime.getDate() === new Date().getDate() || notificationTime.getDate() === new Date().getDate() + 1) {
          if (event.extendedProps.prof !== "NA") {
            toAdd.push(notification);
            console.log(notification);
          }
  
        } // Add closing parenthesis here
        }
  
  
      }
    });
  
    LocalNotifications.schedule({
      notifications: toAdd,
  });

  }

};
