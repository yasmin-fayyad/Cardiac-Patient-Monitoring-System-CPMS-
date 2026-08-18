async function fetchReports() {
    try {
        const response = await fetch("../data/patients.json");
        if (!response.ok) {
            throw new Error("Failed to load medical reports");
        }

        const patients = await response.json();
        const tableBody = document.getElementById("reports-table-body");
        
        // Filter patients who actually have a diagnosis
        const patientsWithReports = patients.filter(p => p.diagnosis && p.diagnosis.trim() !== "");

        tableBody.innerHTML = patientsWithReports.map(p => {
            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            
            return `
                <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-gray-500 whitespace-nowrap">#${p.id}</td>
                    <td class="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                        <div class="flex items-center gap-3">
                            <i class="fa-solid fa-file-medical text-emerald-600"></i>
                            ${p.name}
                        </div>
                    </td>
                    <td class="px-6 py-4 font-bold text-emerald-700 whitespace-nowrap">${p.diagnosis}</td>
                    <td class="px-6 py-4 text-gray-500 whitespace-nowrap"><i class="fa-regular fa-clock mr-1 text-xs"></i> ${date}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center gap-2">
                            <button class="bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
                                <i class="fa-solid fa-eye"></i> View
                            </button>
                            <button class="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
                                <i class="fa-solid fa-download"></i> PDF
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if(patientsWithReports.length === 0){
             tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500 font-medium whitespace-nowrap">No medical reports available currently.</td></tr>`;
        }

    } catch (error) {
        console.error("Error loading reports details:", error);
    }
}

fetchReports();
