import express from "express";
import type { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { chatMessage, TMessage } from "./type/types"; // Assuming TMessage is defined elsewhere
import crypto from "crypto";
import dotenv from "dotenv"


dotenv.config()

import admin from "firebase-admin";
// import * as serviceAccount from '../socket_realtime.json' assert { type: "json" }; // Importing JSON as a module in TS
// import * as serviceAccount from '../socket_realtime.json' assert { type: "json" }; // Importing JSON as a module in TS


const serviceAccount = {
    "type": "service_account",
    "project_id": "socket-4cbe3",
    "private_key_id": "86a093c2318ef6f3efff84758d144a0d4c6e6001",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUhza2IV/NjEZP\nQN3hIRo5Uhr2pGtOBgu22l8wdSASRdS2alLO1n3yRTgmgKD0wp4cskmkKpRmRF7X\n4Srn2wbLce4Fovc2CmOddacnA64HWb7OExs30lx8fzvTC4xvDyNg6tW47+enYPfo\nWT6MSKX18kgK69P+MizOQYy47Ux8KXys+mXa9T1oGoZSWYJVlYyjaBkaTcaEeIsd\njrn6XuB4lcqT/J6OWtHTcD1QJzn63HVSL/J1N2yDzrVSENhakKLB+nU0qmRL0/fW\nUq64QAIp6NUyUc5G9YLnE+QgEVSb6m4UNxU2I+N5Xm5apqWDTHu4gAVhYRHRDn29\nRrByLdFBAgMBAAECggEAXT5zvSXYZBTq1iPGFVuSJ1sEFHlf0OwrII8fm2GP8CRu\nJphwe2o0+OHwuEfQFoL6numEEMBTuqi9meajDfWVPhZe0V9GKhIV0YRIkX/2TyhL\nZBuS4gNr631hMH+NHj7cjU2K9mhfURrkua7KF/9ZvRYPEKeWK5009kthI9ONLp2y\nXSs+Ujjn+/gEHc1m1LCCfha7csU/CA8ZeMtx7eT3kGVvXfDS8CPJ7JkgHDT8MqhV\nbmKUrw/4g/Fxw6K36HJYLUXO6UtzeG3uQGdU68vfeX9ubbvNaGoUCmXKGd2ao3on\n3W5fBFhcitLFGBSnIghF8ZbyjTT+IfMcVkwd3HMqZwKBgQDwhohRuArsHuT/BjcS\n/WzH+9oCLKR6hiTnmUnwGMV4qVeKLL2Dv+lkZJlh3lPv0OVpCyjC9XaXM1s9y/OE\nf0pNcK0+LkEtxyJ2Cf4VtZBirTvVbN8pbONt4Xs1ZpvrJkb/plNGdcEpprlvKEFo\nW0jyNUO8mIkQTCkPx89lqIK7ZwKBgQDiM5BJmvFQS1v2kCfA4lSWoxn1onQmjE5P\nUuss3V3dhDBMPcX9gGv4HZwjaUS6HwbvXv24g7kFG5V1LDbJOzNhruSSwAAxMNfk\nT09hxyf72uZdDcM1VQLwJQ6/q6FKqZPSJkUZN2s+Kw9fsRdWf2+QrA2wFVKJ3T26\nw4BT2cdNFwKBgQDOvhS2iUd6JiQXwTPdss+qJiUB8XV/i4Z1PCF9qw0x5f1E26ga\ncv8eOApPQVdMr3ZBkEH9Mhg5Zv9qYsByhydK4StIY2HLA3vvki9AYcw1xUnE7cv0\nQ5BJhqLtB8HFoiUs4b56tgTO1GxXy3ZNSQmuh3Itzb8irxQsaEcwzmNwyQKBgA5A\nU2nfwi5d4Rhisq57U/r9oagRKSI4msJypfB4re5D4ssa5Tt4eNT0AJ9WhYb4Z3Zz\nVKboXaLNvxfXxkfdW/pei3YXdKukuSVgPc8aPhGnE/Zu5IqapYm9u/Uleg77Kh4G\nXToefLo4+kn8HU1M0BmcTWx3m3CmKLp4kMA3q0/XAoGAbBTprWsc9Kjm1Q27yotf\nLyIVeUcTOhG5Ly1aF1/CjE4T9qkmQJKg6FZv3oEZjEjvztH0f52iE28X38g9ZNIh\n1tKmkBhrMFAobbYBCmUeSiPhiVeid0FGJVx8c9Zn8/EICi9boKinTrr7KMYq8g2T\nrRrw0U5CaMfmUwcdPN31wyo=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@socket-4cbe3.iam.gserviceaccount.com",
    "client_id": "103028506908333243901",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40socket-4cbe3.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}
  


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as  admin.ServiceAccount),
  databaseURL: "https://socket-4cbe3-default-rtdb.firebaseio.com"  // Replace with your database URL
});






const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const sessions:{ [id: string]: string } = {}; 


io.on("connection", (socket) => {
  console.log("A new user connected with id " + socket.id);
  socket.on("register", (userId) => {
    sessions[userId] = socket.id; 
    console.log(`User ${userId} is connected with socket id ${socket.id}`);
  });

  socket.on("message", (userMessage: TMessage) => {
      console.log(userMessage)
      const { reciver , sender, message } = userMessage; 
      const toUser = sessions[reciver];
      const data = { id: crypto.randomUUID().toString(), message: message, sender: sender+"_"+reciver, reciver: reciver+"_"+sender  , time:Date.now()}
    if (toUser) {
      io.to(toUser).emit("message", data); // Send message to specific user
      saveIntoFirebase(data)
      console.log(`Message sent to user ${reciver}`);
    } else {
      console.log(`User with sender ${reciver} is not connected`);
    }
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("disconnect", () => {
    for (let id in sessions) {
      if (sessions[id] === socket.id) {
        delete sessions[id];
        console.log(`User ${id} disconnected`);
        break;
      }
    }
  });
});



async function saveIntoFirebase(data:chatMessage){
   try {
     const ref = admin.database().ref('messages');
     await ref.push(data)
     console.log("Done")
   } catch (error) {
     console.log("error",error)
   }
   return;

}




app.get("/messages", async(req: Request, res: Response) => {
    const { user , toUser } = req.query;
  
  try {
    // Query 1: Messages where the sender is 'user' and the receiver is 'toUser'

  const ref = admin.database().ref('messages'); // Reference to 'messages' node

    const userToUserQuery = ref
      .orderByChild('sender')
      .equalTo(user+"_"+toUser as string)

    // Query 2: Messages where the sender is 'toUser' and the receiver is 'user'
    const toUserToUserQuery = ref
      .orderByChild('reciver')
      .equalTo(toUser+"_"+user as string)

    // Get data from both queries
    const userToUserSnapshot = await userToUserQuery.once('value');
    const toUserToUserSnapshot = await toUserToUserQuery.once('value');

    // Extract data from snapshots
    const currentUserMessages = userToUserSnapshot.val() || {};
    const otherUser = toUserToUserSnapshot.val() || {};

    // Combine the messages from both directions
    const combinedMessages = [
      ...Object.values(currentUserMessages),
      ...Object.values(otherUser),
    ];

    // Sort messages by time in ascending order (oldest first)
    // combinedMessages.sort((a: chatMessage, b: chatMessage) => a.time - b.time);

    // Send the sorted messages as the response
    res.status(200).json(combinedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Error fetching messages: ' + error);
  }
})
// Start the server on port 4002
server.listen(3000, () => {
  console.log('Server is running on http://localhost:4002');
});



app.get("/users" , (req ,res)=>{
    res.send(Object.keys(sessions))
})





/// 