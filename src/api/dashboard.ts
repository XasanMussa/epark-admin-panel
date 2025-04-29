import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  hotelBookings: number;
  parkingBookings: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    let totalUsers = 0;
    let activeUsers = 0;
    let totalBookings = 0;
    let activeBookings = 0;
    let totalRevenue = 0;
    let hotelBookings = 0;
    let parkingBookings = 0;

    for (const userDoc of usersSnapshot.docs) {
      totalUsers++;
      const userData = userDoc.data();
      if (userData?.isActive) activeUsers++;

      try {
        const bookingsSnapshot = await getDocs(
          collection(userDoc.ref, "bookings")
        );
        totalBookings += bookingsSnapshot.size;

        for (const bookingDoc of bookingsSnapshot.docs) {
          const booking = bookingDoc.data();
          if (booking?.status === "active") activeBookings++;
          if (booking?.type === "hotel") hotelBookings++;
          if (booking?.type === "parking") parkingBookings++;
          totalRevenue += Number(booking?.totalPrice || 0);
        }
      } catch (err) {
        console.error(`Error fetching bookings for user ${userDoc.id}:`, err);
        // Continue with next user even if one fails
        continue;
      }
    }

    return {
      totalUsers,
      activeUsers,
      totalBookings,
      activeBookings,
      totalRevenue,
      hotelBookings,
      parkingBookings,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}
