import { chatMessage, TMessage } from "../type/types";
import admin from "firebase-admin"
import crypto from "crypto"
import { Server } from "socket.io";
import { server } from "..";


const sessions:{ [id: string]: string } = {}; 

export function handleSocket(io:Server){

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






}