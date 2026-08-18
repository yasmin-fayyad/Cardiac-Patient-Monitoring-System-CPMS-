let allPatientsData = [];

async function fetchReportsData() {
    try {
        const response = await fetch("../data/patients.json");
        if (!response.ok) {
            throw new Error("Failed to load patient records");
        }

        allPatientsData = await response.json();

        updateMetrics(allPatientsData);
        renderReportsTable(allPatientsData);

    } catch (error) {
        console.error("Error loading report metrics:", error);
    }
}

function updateMetrics(patients) {
    const totalCount = patients.length;
    const stableCount = patients.filter(p => p.condition === 'Stable').length;
    const criticalCount = patients.filter(p => p.condition === 'Critical').length;
    const followupCount = patients.filter(p => p.condition === 'Needs Follow-up').length;

    const totalHR = patients.reduce((acc, p) => acc + (p.heartRate || 0), 0);
    const avgHR = totalCount > 0 ? Math.round(totalHR / totalCount) : 0;

    const totalSpo2 = patients.reduce((acc, p) => acc + (p.oxygenLevel || 0), 0);
    const avgSpo2 = totalCount > 0 ? Math.round(totalSpo2 / totalCount) : 0;

    document.getElementById("stat-total-patients").textContent = totalCount;
    document.getElementById("stat-stable-patients").textContent = stableCount;
    document.getElementById("stat-critical-patients").textContent = criticalCount;
    document.getElementById("stat-followup-patients").textContent = followupCount;

    document.getElementById("stat-avg-hr").innerHTML = `${avgHR} <span class="text-sm font-normal text-slate-500">bpm</span>`;
    document.getElementById("stat-avg-spo2").textContent = `${avgSpo2}%`;
}

function renderReportsTable(patients) {
    const tableBody = document.getElementById("reports-table-body");
    if (!tableBody) return;

    const getConditionBadge = (cond) => {
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
        const isWarning = (p.heartRate > 100 || p.heartRate < 60 || p.oxygenLevel < 95);

        return `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors" data-condition="${p.condition}">
                <td class="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">${p.name}</td>
                <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-700">${p.heartRate} bpm</td>
                <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-700">${p.bloodPressure}</td>
                <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-700">${p.oxygenLevel}%</td>
                <td class="px-6 py-4 whitespace-nowrap">${getConditionBadge(p.condition)}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getReadingStatusBadge(isWarning)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">${p.recordType || 'Primary Record'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-mono">${p.recordedTime || '12 Aug 2026, 08:00 AM'}</td>
            </tr>
        `;
    }).join('');
}
document.addEventListener("DOMContentLoaded", function () {
    fetchReportsData();

    const searchInput = document.getElementById("reportSearch");
    const conditionFilter = document.getElementById("conditionFilter");

    if (searchInput) searchInput.addEventListener("input", filterReportsTable);
    if (conditionFilter) conditionFilter.addEventListener("change", filterReportsTable);
});

function filterReportsTable() {
    const searchValue = document.getElementById("reportSearch").value.toLowerCase();
    const conditionValue = document.getElementById("conditionFilter").value;

    const rows = document.querySelectorAll("#reports-table-body tr");

    rows.forEach(row => {
        const patientName = row.children[0].textContent.toLowerCase();
        const patientCondition = row.dataset.condition || "";

        const matchesSearch = patientName.includes(searchValue);
        const matchesCondition = conditionValue === "All" || patientCondition === conditionValue;

        row.style.display = matchesSearch && matchesCondition ? "" : "none";
    });
}