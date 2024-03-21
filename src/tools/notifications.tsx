import {
  LocalNotificationSchema,
  LocalNotifications,
} from "@capacitor/local-notifications";

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

// Fonction Principale
export const scheduleNotifications = async (events: Event[]) => {
  LocalNotifications.cancel({
    notifications: (await LocalNotifications.getPending()).notifications,
  });
  const currentPendings: LocalNotificationSchema[] = (
    await LocalNotifications.getPending()
  ).notifications;

  var toAdd: LocalNotificationSchema[] = [];

  events.forEach((event) => {
    const notificationTime = new Date(
      new Date(event.start.toString()).getTime() - 5 * 60 * 1000
    ); // 5 minutes before the event

    const notification: LocalNotificationSchema = {
      title: `Dans 5 min :  ${event.extendedProps.cours}`,
      body: `${event.extendedProps.location}`,
      id: Math.floor(Math.random() * 1000000),
      channelId: "1",
      schedule: { at: notificationTime, allowWhileIdle: true },
    };
    console.log(Math.floor(Math.random() * 1000000));
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
  console.log(toAdd);
  LocalNotifications.schedule({
    notifications: toAdd,
  });
};
