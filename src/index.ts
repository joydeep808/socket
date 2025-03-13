import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv"
import SocketRouter from "./service/Messages.js"
import { handleSocket } from "./service/Socket.js";
dotenv.config()
import admin from "firebase-admin"
import { isExpressionWithTypeArguments } from "typescript";



const serviceAccount = {
    type: "service_account",
    project_id: "socket-4cbe3",
    private_key_id: "86a093c2318ef6f3efff84758d144a0d4c6e6001",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUhza2IV/NjEZP\nQN3hIRo5Uhr2pGtOBgu22l8wdSASRdS2alLO1n3yRTgmgKD0wp4cskmkKpRmRF7X\n4Srn2wbLce4Fovc2CmOddacnA64HWb7OExs30lx8fzvTC4xvDyNg6tW47+enYPfo\nWT6MSKX18kgK69P+MizOQYy47Ux8KXys+mXa9T1oGoZSWYJVlYyjaBkaTcaEeIsd\njrn6XuB4lcqT/J6OWtHTcD1QJzn63HVSL/J1N2yDzrVSENhakKLB+nU0qmRL0/fW\nUq64QAIp6NUyUc5G9YLnE+QgEVSb6m4UNxU2I+N5Xm5apqWDTHu4gAVhYRHRDn29\nRrByLdFBAgMBAAECggEAXT5zvSXYZBTq1iPGFVuSJ1sEFHlf0OwrII8fm2GP8CRu\nJphwe2o0+OHwuEfQFoL6numEEMBTuqi9meajDfWVPhZe0V9GKhIV0YRIkX/2TyhL\nZBuS4gNr631hMH+NHj7cjU2K9mhfURrkua7KF/9ZvRYPEKeWK5009kthI9ONLp2y\nXSs+Ujjn+/gEHc1m1LCCfha7csU/CA8ZeMtx7eT3kGVvXfDS8CPJ7JkgHDT8MqhV\nbmKUrw/4g/Fxw6K36HJYLUXO6UtzeG3uQGdU68vfeX9ubbvNaGoUCmXKGd2ao3on\n3W5fBFhcitLFGBSnIghF8ZbyjTT+IfMcVkwd3HMqZwKBgQDwhohRuArsHuT/BjcS\n/WzH+9oCLKR6hiTnmUnwGMV4qVeKLL2Dv+lkZJlh3lPv0OVpCyjC9XaXM1s9y/OE\nf0pNcK0+LkEtxyJ2Cf4VtZBirTvVbN8pbONt4Xs1ZpvrJkb/plNGdcEpprlvKEFo\nW0jyNUO8mIkQTCkPx89lqIK7ZwKBgQDiM5BJmvFQS1v2kCfA4lSWoxn1onQmjE5P\nUuss3V3dhDBMPcX9gGv4HZwjaUS6HwbvXv24g7kFG5V1LDbJOzNhruSSwAAxMNfk\nT09hxyf72uZdDcM1VQLwJQ6/q6FKqZPSJkUZN2s+Kw9fsRdWf2+QrA2wFVKJ3T26\nw4BT2cdNFwKBgQDOvhS2iUd6JiQXwTPdss+qJiUB8XV/i4Z1PCF9qw0x5f1E26ga\ncv8eOApPQVdMr3ZBkEH9Mhg5Zv9qYsByhydK4StIY2HLA3vvki9AYcw1xUnE7cv0\nQ5BJhqLtB8HFoiUs4b56tgTO1GxXy3ZNSQmuh3Itzb8irxQsaEcwzmNwyQKBgA5A\nU2nfwi5d4Rhisq57U/r9oagRKSI4msJypfB4re5D4ssa5Tt4eNT0AJ9WhYb4Z3Zz\nVKboXaLNvxfXxkfdW/pei3YXdKukuSVgPc8aPhGnE/Zu5IqapYm9u/Uleg77Kh4G\nXToefLo4+kn8HU1M0BmcTWx3m3CmKLp4kMA3q0/XAoGAbBTprWsc9Kjm1Q27yotf\nLyIVeUcTOhG5Ly1aF1/CjE4T9qkmQJKg6FZv3oEZjEjvztH0f52iE28X38g9ZNIh\n1tKmkBhrMFAobbYBCmUeSiPhiVeid0FGJVx8c9Zn8/EICi9boKinTrr7KMYq8g2T\nrRrw0U5CaMfmUwcdPN31wyo=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-fbsvc@socket-4cbe3.iam.gserviceaccount.com",
    client_id: "103028506908333243901",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40socket-4cbe3.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://socket-4cbe3-default-rtdb.firebaseio.com", // Replace with your database URL
  });


export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, { cors: { origin: "*" } });


handleSocket(io)


export function getAppRefrence(){
  return admin.database().ref('messages');
}

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});


app.use("/socket"  , SocketRouter)
