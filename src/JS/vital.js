let globalPatients = [];

async function fetchVitals() {
    try {
        const response = await fetch("../data/patients.json");
        if (!response.ok) {
            throw new Error("Failed to load vitals data");
        }

        globalPatients = await response.json();
        populatePatientSelect(globalPatients);
        renderTable(globalPatients);

    } catch (error) {
        console.error("Error loading vitals details:", error);
    }
}

function populatePatientSelect(patients) {
    const patientSelect = document.getElementById("patientSelect");
    if (!patientSelect) return;

    patientSelect.innerHTML = `<option value="" disabled selected>Select Patient</option>` +
        patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

function renderTable(patients) {
    const tableBody = document.getElementById("vitals-table-body");
    if (!tableBody) return;

    const getPatientConditionBadge = (cond) => {
        if (cond === 'Critical') {
            return `<span class="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold inline-block border border-red-200">Critical</span>`;
        }
        if (cond === 'Needs Follow-up') {
            return `<span class="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold inline-block border border-amber-200">Needs Follow-up</span>`;
        }
        return `<span class="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold inline-block border border-emerald-200">Stable</span>`;
    };

    const getReadingStatusBadge = (isWarning) => {
        if (isWarning) {
            return `<span class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold inline-block">Warning</span>`;
        }
        return `<span class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold inline-block">Normal</span>`;
    };

    tableBody.innerHTML = patients.map(p => {
        const isWarning = p.heartRate > 100 || p.heartRate < 60 || p.oxygenLevel < 95;
        const readingStatusText = isWarning ? "Warning" : "Normal";

        return `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors" data-reading-status="${readingStatusText}">
                <td class="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">${p.name}</td>
                <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-700">${p.heartRate} bpm</td>
                <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-700">${p.bloodPressure}</td>
                <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-700">${p.oxygenLevel}%</td>
                <td class="px-6 py-4 whitespace-nowrap">${getPatientConditionBadge(p.condition)}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getReadingStatusBadge(isWarning)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">${p.recordType || 'Primary Record'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-mono">${p.recordedTime || '12 Aug 2026, 08:00 AM'}</td>
            </tr>
        `;
    }).join('');
}
document.addEventListener("DOMContentLoaded", function () {
    fetchVitals();

    const searchInput = document.getElementById("vitalsSearch");
    const readingFilter = document.getElementById("readingFilter");
    const addVitalForm = document.getElementById("addVitalForm");

    if (searchInput) searchInput.addEventListener("input", filterVitals);
    if (readingFilter) readingFilter.addEventListener("change", filterVitals);

    if (addVitalForm) {
        addVitalForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const patientId = document.getElementById("patientSelect").value;
            const heartRate = parseInt(document.getElementById("heartRateInput").value);
            const bloodPressure = document.getElementById("bpInput").value;
            const oxygenLevel = parseInt(document.getElementById("oxygenInput").value);

            const targetPatient = globalPatients.find(p => p.id == patientId);
            if (targetPatient) {
                targetPatient.heartRate = heartRate;
                targetPatient.bloodPressure = bloodPressure;
                targetPatient.oxygenLevel = oxygenLevel;
                targetPatient.recordType = "Manual Entry";
                targetPatient.recordedTime = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

                renderTable(globalPatients);
                addVitalForm.reset();
            }
        });
    }
});

function filterVitals() {
    const searchValue = document.getElementById("vitalsSearch").value.toLowerCase();
    const filterValue = document.getElementById("readingFilter").value;

    const rows = document.querySelectorAll("#vitals-table-body tr");

    rows.forEach(row => {
        const patientName = row.children[0].textContent.toLowerCase();
        const readingStatus = row.dataset.readingStatus || "";

        const matchesSearch = patientName.includes(searchValue);
        const matchesFilter = filterValue === "All" || readingStatus === filterValue;

        row.style.display = matchesSearch && matchesFilter ? "" : "none";
    });
}