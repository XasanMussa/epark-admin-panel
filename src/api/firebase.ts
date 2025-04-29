import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  collectionGroup,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdG6pvphC7Qqt6t-AbUoJ_NFbopmvhpyE",
  authDomain: "hotel-parking-system.firebaseapp.com",
  projectId: "hotel-parking-system",
  storageBucket: "hotel-parking-system.appspot.com",
  messagingSenderId: "314273359365",
  appId: "1:314273359365:android:5b92cabc3f9cd37296de6c",
  databaseURL: "https://hotel-parking-system-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);

export interface Booking {
  id: string;
  userId: string;
  type: "hotel" | "parking";
  status: "pending" | "active" | "completed" | "cancelled";
  startDate: Timestamp;
  endDate: Timestamp;
  totalPrice: number;
  userEmail?: string;
  userName?: string;
  roomNumber?: string;
  parkingSpot?: string;
  createdAt: Timestamp;
}

export async function fetchAllUsers() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  return usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function setUserActiveStatus(userId: string, isActive: boolean) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { isActive });
}

export async function fetchAllBookings(): Promise<Booking[]> {
  try {
    const bookingsQuery = query(
      collectionGroup(db, "bookings"),
      orderBy("createdAt", "desc")
    );

    const bookingsSnapshot = await getDocs(bookingsQuery);
    return bookingsSnapshot.docs.map((doc) => {
      const data = doc.data();
      // Extract userId from the document path
      // Path format: users/{userId}/bookings/{bookingId}
      const pathParts = doc.ref.path.split("/");
      const userId = pathParts[1]; // users/{userId}/bookings/{bookingId}

      if (!userId) {
        console.error("Could not extract userId from path:", doc.ref.path);
      }

      return {
        id: doc.id,
        userId, // Include the userId from the path
        ...data,
        // Ensure timestamps are properly handled
        startDate: data.startDate,
        endDate: data.endDate,
        createdAt: data.createdAt,
      } as Booking;
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

export async function updateBookingStatus(
  userId: string,
  bookingId: string,
  status: Booking["status"]
) {
  try {
    // Validate status
    const validStatuses = ["pending", "active", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status: ${status}. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    // Validate IDs
    if (!userId || !bookingId) {
      throw new Error("userId and bookingId are required");
    }

    const bookingRef = doc(db, `users/${userId}/bookings/${bookingId}`);

    // First check if the document exists
    const bookingDoc = await getDoc(bookingRef);
    if (!bookingDoc.exists()) {
      throw new Error(
        `Booking document not found: users/${userId}/bookings/${bookingId}`
      );
    }

    await updateDoc(bookingRef, { status });
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
}

export async function fetchBookingsByType(
  type: Booking["type"]
): Promise<Booking[]> {
  try {
    const bookingsQuery = query(
      collectionGroup(db, "bookings"),
      where("type", "==", type),
      orderBy("createdAt", "desc")
    );

    const bookingsSnapshot = await getDocs(bookingsQuery);
    return bookingsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure timestamps are properly handled
        startDate: data.startDate,
        endDate: data.endDate,
        createdAt: data.createdAt,
      } as Booking;
    });
  } catch (error) {
    console.error("Error fetching bookings by type:", error);
    throw error;
  }
}
