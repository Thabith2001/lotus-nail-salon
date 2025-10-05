import axios from "axios";
import {parseTimeTo24} from "@/util/parseTimeTo24";

export const fetchBookingsForDate = async (dateStr) => {
    try {
        const res = await axios.get(`/api/bookings?date=${dateStr}`);
        const data = res.data ?? {};
        let raw = data.bookedTimes ?? data.bookings ?? (Array.isArray(data) ? data : []);

        let times = [];
        if (Array.isArray(raw)) {
            times = raw.map((b) => (typeof b === "object" ? b.time : b)).filter(Boolean);
        }

        return Array.from(
            new Set(times.map((t) => normalizeTime(t)).filter(Boolean))
        );
    } catch (err) {
        console.error("Error fetching bookings:", err);
        return [];
    }
};

export const normalizeTime = (timeString) => {
    return parseTimeTo24(timeString);
};