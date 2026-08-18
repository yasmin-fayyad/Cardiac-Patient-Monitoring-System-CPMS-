async function fetchVitals() {
    try {
        const response = await fetch("../data/patients.json");
        if (!response.ok) {
            throw new Error("Failed to load vitals data");
        }

        const patients = await response.json();
        const tableBody = document.getElementById("vitals-table-body");
        
        tableBody.innerHTML = patients.map(p => {
            // Heart Rate styling
            let hrDisplay = `<span class="font-bold text-gray-800">${p.heartRate} <span class="text-xs text-gray-500 font-normal">bpm</span></span>`;
            if (p.heartRate > 100 || p.heartRate < 60) {
                hrDisplay = `<span class="bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold border border-red-200 inline-flex items-center gap-1.5"><i class="fa-solid fa-heart-circle-exclamation text-[10px]"></i> ${p.heartRate} <span class="text-xs font-normal">bpm</span></span>`;
            }

            // Oxygen styling
            let oxDisplay = `<span class="font-bold text-gray-800">${p.oxygenLevel}%</span>`;
            if (p.oxygenLevel < 95) {
                oxDisplay = `<span class="bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-bold border border-amber-200 inline-flex items-center gap-1.5"><i class="fa-solid fa-lungs text-[10px]"></i> ${p.oxygenLevel}%</span>`;
            }

            return `
                <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">${p.name}</td>
                    <td class="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">${p.age} yrs</td>
                    <td class="px-6 py-4 whitespace-nowrap">${hrDisplay}</td>
                    <td class="px-6 py-4 font-bold text-blue-600 whitespace-nowrap" dir="ltr">${p.bloodPressure}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${oxDisplay}</td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error("Error loading vitals details:", error);
    }
}

fetchVitals();
