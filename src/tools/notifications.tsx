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

//export const currentPendings: LocalNotificationSchema[] = (
  //  await LocalNotifications.getPending()
  //).notifications;
/* 
export const scheduleNotifications = async (events: Event[]) => {
    console.log('execution')
  const currentPendings: LocalNotificationSchema[] = (
    await LocalNotifications.getPending()
  ).notifications;
  console.log('execution2')
  var toAdd: LocalNotificationSchema[] = [];

  events.forEach((event) => {
    console.log("Traitement : " + event.title)
    const notificationTime = new Date(
      new Date(event.start.toString()).getTime() - 5 * 60 * 1000
    ); // 5 minutes before the event

    const notifications: LocalNotificationSchema = {
      title: "Prochain cours",
      body: `Cours: ${event.title}\nLieu: ${event.extendedProps.location}`,
      id: notificationTime.getTime(), // Use a unique ID for each notification
      schedule: { at: notificationTime }, // You can specify a sound file if desired
    };

    // verifie si la notification n'existe pas
    if (!(currentPendings.indexOf(notifications) > -1)) {
      toAdd.push(notifications);
      console.log("notif ajouté   " + notifications.body);
    }
  });
LocalNotifications.schedule({
    notifications: [...toAdd],
});
};


*/