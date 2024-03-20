import {
  LocalNotificationSchema,
  LocalNotifications,
} from "@capacitor/local-notifications";
import { Toast } from "@capacitor/toast";

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


export const scheduleNotifications = async (events: Event[]) => {
  LocalNotifications.cancel({notifications: (await LocalNotifications.getPending()).notifications})
  console.log((await LocalNotifications.getPending()).notifications)
  console.log(LocalNotifications.listChannels());
    
  const currentPendings: LocalNotificationSchema[] = (
    await LocalNotifications.getPending()
  ).notifications;


  var toAdd: LocalNotificationSchema[] = [];

  events.forEach((event) => {



    const notificationTime = new Date(new Date(event.start.toString()).getTime() - 5 * 60 * 1000); // 5 minutes before the event

    const notification: LocalNotificationSchema = {
      title: "Prochain cours",
      body: `Cours: ${event.title}\nLieu: ${event.extendedProps.location}`,
      id: notificationTime.getTime(),
      channelId: '2',
      schedule: { at: notificationTime, allowWhileIdle : true }, // You can specify a sound file if desired
    };

    // Vérifie que la notification n'est pas dans la liste des currents pending et l'ajoute a toAdd
    if (!currentPendings.some((pending) => pending.id === notification.id)) {


      // Verifie si la date est dans le futur
      if (notificationTime.getTime() > new Date().getTime()) {
        // Vérifie si la date de notification est aujourd'hui ou demain
      if (notificationTime.getDate() === new Date().getDate() || notificationTime.getDate() === new Date().getDate() + 1) {
        toAdd.push(notification);
        console.log(notification);
      } // Add closing parenthesis here
      }
      
      
    }
  });
  console.log(toAdd);
  LocalNotifications.schedule({
    notifications: toAdd,
});
console.log((await LocalNotifications.getPending()).notifications)
};



