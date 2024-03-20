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


export const scheduleNotifications = async (events: Event[]) => {
    console.log('execution')

  const currentPendings: LocalNotificationSchema[] = (
    await LocalNotifications.getPending()
  ).notifications;


  var toAdd: LocalNotificationSchema[] = [];

  events.forEach((event) => {
    console.log("Traitement : " + event.title)
    console.log('execution2')



    const notificationTime = new Date(
      new Date(event.start.toString()).getTime() - 5 * 60 * 1000
    ); // 5 minutes before the event

    const notification: LocalNotificationSchema = {
      title: "Prochain cours",
      body: `Cours: ${event.title}\nLieu: ${event.extendedProps.location}`,
      id: notificationTime.getTime(),
      channelId: '1',
      schedule: { at: notificationTime, allowWhileIdle : true }, // You can specify a sound file if desired
    };

    // Vérifie que la notification n'est pas dans la liste des currents pending et l'ajoute a toAdd
    if (!currentPendings.some((pending) => pending.id === notification.id)) {
      toAdd.push(notification);
      console.log("event ajoiuté  : " + notification.body)
    }
  });


LocalNotifications.schedule({
    notifications: [...toAdd],
});
};
