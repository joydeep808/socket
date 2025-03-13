import express from "express";
import type { Response, Request } from "express";
import admin from "firebase-admin"



const serviceAccount = {
  "type": "service_account",
  "project_id": "socket-4cbe3",
  "private_key_id": "34ffb85ae79734c37dc501e1c62e9c16255a5064",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDam6cI617hXxK+\ntRJ5XdH5XZgoKJM/+moGtRb4tF3IYCRtUumPBjHxlg9YQkzLXm/cZ+ID7xSg3nNR\nK/AVBABzl851uZ8H0wptrk8hR0D7vThUeozB+72Q8xNYSVz6z8aGCJjWVJdEvbzI\nWwaUz4DH8rL1PQ5k6FWCqkNXKXoiZ8NrvoPUwQKxizXDAG4tF4fXAs1JIxqeE2BO\nbF155A2+MBWjEOdLEluWMu8VFiwW/vfIk8OiqcflyhoxU3MP0BUl/eI8j2PEVbJy\nylDVtMgmaxACt1nO+sRSBaLSpTWNu9PoYfEG0AUbFbimBNbHq2Ebfy8HsaFyde0z\nZpOHJ+8vAgMBAAECggEABBpTwjkYqMYuBeJEHH8ER9fX2TkZumOqxcF0Uuqfr/kN\n9fdOZt7I5S3Zz+A+rLpzAwH4HfbIvlQueeGHOf2/PGwm9dKsB2uQkIpq9cbuk0rz\n2bILHkDpR+UoAcouso5fvXg/1hX0WNfuyRvcPcK/OgF2FmA0+vPZVwB3DxW6MxcS\nkjuU/uJ8QcZKMfM3HKHHuWLI3AXTzAS3fLXbG5g6RCHR5DQr7/p+QKoWsZ39o6xY\nPQ5XqQ2eUtUHoZj9YIxzqxrNJQLnbPgNFUu++sKY3jp+gOUuDLLE9J15qlf7Z2ed\ns59rv7JXVUFKu0RqH3xW9PxyCDPVEPH1dEldXE/DwQKBgQD3odiYvokRYz98EvsL\nDi+7OZPjfJkhobMHYbLirLW7QTlam3qEBMZjZ3I1UnbxNsM/ZbDB9HQwzio+f91k\nZe9Rd5J77AhJv4HHwrAc7bnyf9FByDKWCB654PQ14QvO+jB1c9Q5G4g+xuxW6B9q\nEDKvRAT/rj7rUWgXUPWAS6URcQKBgQDh/rs0QF5qzLmf1Fu/j/FMlJX9nIauF1OL\n0+K6L/kR5Jg8ELtn0nyfsc3DZTy7J2rGqfJCU51eYxokaHyDupBhiUZM9jBttq4G\ntpcGAx/1h+4nb3MVzi6IR8TGejS33+yLJ0/Tk25FydVMz/kdpeRp+BHoc0jSReNL\nOAVWUVa6nwKBgQDlWg49MkPLSevzo7TGAYat1l8l1DIUFyq0jIVdMm9DFt7jD5vC\niJWiXZ5GyrEFKh5eKnYyvZGb3mb76fuIUGz+PEv84JiwjWHLPYNV18xgUIfkcGKB\n2NV0fWhSOrRwKAMX1YbauahP1Hfy6hymZIg9Eje7A4yc8JIC/mXTRLyG0QKBgD1J\npKEl97UE8i4rG/qWYbz/6rFNeqTJxKl9+9W8XtKAaNyZOQmN5qg0QvYDhXXH2cgo\nnH9qR5oqTBOllmbu+GrLHJqQhU+rpAREDi7eOBORGn/tVIuMT8g7llyxFYzsGC0g\nqyBYsiYQ91yOZiOpMomecdTVNuF3fI2Qkrn28wtHAoGBAL/GMqgWYAz1X6YIYGrL\nBtkI98Rvv/evHaZw4iPvsx5rHFeU6A+1RGfaZnA85IuoKUlyEVOBm0HaI1XjV1GW\nnaI4KXk5nSz/nq4UDLHqSwUCf4Mf8ry5nSksUA+MdBW1r2FjbgYNIvGY9RqzAuof\n7ed+e5qcAr+kph9WP3SKxD5j\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@socket-4cbe3.iam.gserviceaccount.com",
  "client_id": "103028506908333243901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40socket-4cbe3.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
} /// put the json file here



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as  admin.ServiceAccount),
    databaseURL: "https://socket-4cbe3-default-rtdb.firebaseio.com"  // Replace with your database URL
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
