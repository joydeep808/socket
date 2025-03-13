import express from "express";
import type { Response, Request } from "express";
import admin from "firebase-admin"



const serviceAccount = {
  
} 


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as  admin.ServiceAccount),
    databaseURL: ""  // Replace with your database URL
});



  
const ref = admin.database().ref("messages");

const router = express.Router();

router.get("/messages", async (req: Request, res: Response) => {
  const { user, toUser } = req.query;

  try {


    const userToUserQuery = ref
      .orderByChild("sender")
      .equalTo((user + "_" + toUser) as string);

    // Query 2: Messages where the sender is 'toUser' and the receiver is 'user'
    const toUserToUserQuery = ref
      .orderByChild("reciver")
      .equalTo((toUser + "_" + user) as string);

    // Get data from both queries
    const userToUser = await userToUserQuery.once("value");
    const toUserToUser = await toUserToUserQuery.once("value");

   
    const currentUserMessages = userToUser.val() || {};
    const otherUser = toUserToUser.val() || {};

    // Combine the messages from both directions
    const combinedMessages = [
      ...Object.values(currentUserMessages),
      ...Object.values(otherUser),
    ];

    // combinedMessages.sort((a: chatMessage, b: chatMessage) => a.time - b.time);

    // Send the sorted messages as the response
    res.status(200).json(combinedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Error fetching messages: " + error);
  }
});

export default router;
