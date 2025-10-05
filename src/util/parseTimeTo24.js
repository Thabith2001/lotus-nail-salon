export const parseTimeTo24 = (raw) => {
    if (!raw && raw !== 0) return null;
    const s = String(raw).trim();


    const hhmm24 = /^(\d{1,2}):(\d{2})$/;
    const m24 = s.match(hhmm24);
    if (m24) {
        let hh = parseInt(m24[1], 10);
        let mm = parseInt(m24[2], 10);
        if (isNaN(hh) || isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
        return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    }

    const ampm = /^(.*?)(?:\s*)(am|pm|a\.m\.|p\.m\.|AM|PM|A\.M\.|P\.M\.)$/i;
    const foundAmpm = s.match(ampm);
    if (foundAmpm) {
        const timePart = foundAmpm[1].replace(/\./g, "").trim();
        const meridiem = foundAmpm[2].toLowerCase().includes("p") ? "pm" : "am";
        const parts = timePart.split(":").map(p => p.trim());
        let hh = parseInt(parts[0] || "0", 10);
        let mm = parseInt(parts[1] || "0", 10);
        if (isNaN(hh) || isNaN(mm)) return null;
        if (meridiem === "pm" && hh < 12) hh += 12;
        if (meridiem === "am" && hh === 12) hh = 0;
        return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    }


    const digitsOnly = s.replace(/\D/g, "");
    if (digitsOnly.length === 3 || digitsOnly.length === 4) {
        const hh = digitsOnly.length === 3 ? parseInt(digitsOnly.slice(0,1),10) : parseInt(digitsOnly.slice(0,2),10);
        const mm = parseInt(digitsOnly.slice(-2),10);
        if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
            return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`;
        }
    }

    // Fallback: try Date parsing but do not rely on it for correctness
    try {
        const d = new Date(`2000-01-01T${s}`);
        if (!isNaN(d.getTime())) {
            const hh = d.getHours();
            const mm = d.getMinutes();
            return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`;
        }
    } catch (e) {
        /* ignore */
    }

    return null;
};