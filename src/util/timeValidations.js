
export const isPastTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false;


    const dateObj = new Date(dateStr);

    if (isNaN(dateObj.getTime())) return false;

    const [hours, minutes] = timeStr.split(":").map(Number);

    const bookingDateTime = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        hours,
        minutes,
        0
    );

    return bookingDateTime < new Date();
};


export const getLocalDateStr = (date, userTimezone) =>
    new Intl.DateTimeFormat("sv-SE", {
        timeZone: userTimezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);


export const formatDate = (date, userTimezone = "UTC") => {
    if (!date) return "";

    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

    if (isNaN(d.getTime())) return "";

    return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: userTimezone,
    });
};

export const formatTime = (timeString, userTimezone) => {
    if (!timeString) return "";
    const [h, m] = timeString.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return timeString;
    const d = new Date(2000, 0, 1, h, m);
    return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: userTimezone,
    });
};
