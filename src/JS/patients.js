async function FetchPatients() {
    try {
        const response = await fetch("../data/patients.json");
        if (!response.ok) {
            throw new Error("Failed to load patient data");
        }
        const patients = await response.json();

        const getConditionBadge = (cond) => {
            if (cond === 'Critical') {
                return `<span class="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold inline-block border border-red-200">Critical</span>`;
            }
            if (cond === 'Needs Follow-up') {
                return `<span class="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold inline-block border border-amber-200">Needs Follow-up</span>`;
            }
            return `<span class="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold inline-block border border-emerald-200">Stable</span>`;
        };

        const tableContent = document.getElementById("patients-table-body");
        if (!tableContent) return;

        tableContent.innerHTML = patients.map(patient => `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors" data-condition="${patient.condition}">
                
                <td class="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                    ${patient.name}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                    ${patient.age}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-slate-600">
                    ${patient.gender}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-slate-600 font-mono">
                    ${patient.phone}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-slate-600 font-bold">
                    ${patient.bloodType || 'N/A'}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                    ${getConditionBadge(patient.condition)}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                        onclick="viewPatientDetails('${patient.id}')"
                        class="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition">
                        <i class="fa-regular fa-eye"></i>
                        View Details
                    </button>
                </td>
                
            </tr>
        `).join('');

    } catch (error) {
        console.error("Error loading patients:", error);
    }
}

// Search and Filter Logic
document.addEventListener("DOMContentLoaded", function () {
    FetchPatients();

    const searchInput = document.getElementById("patientSearch");
    const conditionFilter = document.getElementById("conditionFilter");

    if (searchInput) {
        searchInput.addEventListener("input", filterPatients);
    }

    if (conditionFilter) {
        conditionFilter.addEventListener("change", filterPatients);
    }
});

function filterPatients() {
    const searchValue = document.getElementById("patientSearch").value.toLowerCase();
    const conditionValue = document.getElementById("conditionFilter").value;

    const rows = document.querySelectorAll("#patients-table-body tr");

    rows.forEach(function (row) {
        const patientName = row.children[0].textContent.toLowerCase();
        const patientCondition = row.dataset.condition || "";

        const matchesSearch = patientName.includes(searchValue);
        const matchesCondition = conditionValue === "All" || patientCondition === conditionValue;

        row.style.display = matchesSearch && matchesCondition ? "" : "none";
    });
}
function viewPatientDetails(patientId) {
    window.location.href = `patient-details.html?id=${patientId}`;
}