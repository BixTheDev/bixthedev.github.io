const cords = [0, 1];
    let lastRun = 0;
    const delay = 2000;
    window.addEventListener("message", function (e) {
        const d = e.data;
        if (!d || typeof d !== "object" || typeof d.lat !== "number" || typeof d.lng !== "number") return;
        if (d.lat < -90 || d.lat > 90 || d.lng < -180 || d.lng > 180) return;
        const now = Date.now();
        if (now - lastRun < delay) return;
        lastRun = now;
        cords[0] = d.lat;
        cords[1] = d.lng
    });
    async function getCountry(lat, lng) {
        console.log(`Lat:${lat} - Long${lng}`);
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
        const res = await fetch(url);
        const data = await res.json();
        return data.display_name || null
    }
    document.addEventListener("keydown", async function (e) {
        if (e.key === "1") {
            const a = await getCountry(cords[0], cords[1]);
            alert(a)
        }
    });
    alert("Enabled - Press 1")
