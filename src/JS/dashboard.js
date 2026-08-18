document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
    setupNotifications();
    setupLogout();
});

const mockPatients = [
    { name: "Maryam Dawood", age: 60, gender: "Female", heartRate: "78 bpm", bp: "125/80", oxygen: "97%", status: "Stable" },
    { name: "Kareem Oudeh", age: 73, gender: "Male", heartRate: "82 bpm", bp: "130/85", oxygen: "96%", status: "Follow-up" },
    { name: "Huda Sami", age: 45, gender: "Female", heartRate: "75 bpm", bp: "120/80", oxygen: "98%", status: "Stable" },
    { name: "Omar Nabulsi", age: 68, gender: "Male", heartRate: "115 bpm", bp: "155/95", oxygen: "91%", status: "Critical" },
    { name: "Nour Barakat", age: 55, gender: "Female", heartRate: "72 bpm", bp: "118/78", oxygen: "99%", status: "Stable" },
    { name: "Mohammad Saleh", age: 71, gender: "Male", heartRate: "126 bpm", bp: "168/98", oxygen: "89%", status: "Critical" },
    { name: "Rania Mansour", age: 64, gender: "Female", heartRate: "104 bpm", bp: "138/86", oxygen: "95%", status: "Follow-up" },
    { name: "Yousef Hamdan", age: 62, gender: "Male", heartRate: "88 bpm", bp: "135/88", oxygen: "94%", status: "Follow-up" }
];

function initDashboard() {
    renderCriticalCases();
    renderRecentPatients();
    renderFollowupPatients();
    renderVitalsTable();
}

function getBadgeStyle(status) {
    switch (status) {
        case "Critical":
            return "bg-red-50 text-red-600 border-red-100";
        case "Follow-up":
            return "bg-amber-50 text-amber-700 border-amber-100";
        case "Stable":
            return "bg-emerald-50 text-emerald-700 border-emerald-100";
        default:
            return "bg-gray-50 text-gray-600 border-gray-100";
    }
}

function renderCriticalCases() {
    const container = document.getElementById("critical-patients-list");
    if (!container) return;

    const criticals = mockPatients.filter(p => p.status === "Critical");
    container.innerHTML = criticals.map(p => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-red-50/40 border border-red-100/60">
            <div>
                <h4 class="font-bold text-sm text-gray-800">${p.name}</h4>
                <p class="text-xs text-gray-400">${p.age} yrs, ${p.gender}</p>
            </div>
            <span class="px-3 py-1 rounded-lg text-xs font-bold border ${getBadgeStyle(p.status)}">
                ${p.status}
            </span>
        </div>
    `).join('');
}

function renderRecentPatients() {
    const container = document.getElementById("recent-patients-list");
    if (!container) return;

    container.innerHTML = mockPatients.slice(0, 5).map(p => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100">
            <div>
                <h4 class="font-bold text-sm text-gray-800">${p.name}</h4>
                <p class="text-xs text-gray-400">${p.age} yrs, ${p.gender}</p>
            </div>
            <span class="px-3 py-1 rounded-lg text-xs font-bold border ${getBadgeStyle(p.status)}">
                ${p.status}
            </span>
        </div>
    `).join('');
}

function renderFollowupPatients() {
    const container = document.getElementById("followup-patients-list");
    if (!container) return;

    const followups = mockPatients.filter(p => p.status === "Follow-up");
    container.innerHTML = followups.map(p => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50/30 border border-amber-100/50">
            <div>
                <h4 class="font-bold text-sm text-gray-800">${p.name}</h4>
                <p class="text-xs text-gray-400">${p.age} yrs, ${p.gender}</p>
            </div>
            <span class="px-3 py-1 rounded-lg text-xs font-bold border ${getBadgeStyle(p.status)}">
                ${p.status}
            </span>
        </div>
    `).join('');
}

function renderVitalsTable() {
    const tableBody = document.getElementById("vitals-overview-table");
    if (!tableBody) return;

    tableBody.innerHTML = mockPatients.slice(0, 4).map(p => `
        <tr class="hover:bg-gray-50/50 transition-colors">
            <td class="px-5 py-3.5 font-bold text-gray-800">${p.name}</td>
            <td class="px-5 py-3.5 text-gray-600">${p.heartRate}</td>
            <td class="px-5 py-3.5 text-gray-600">${p.bp}</td>
            <td class="px-5 py-3.5 text-gray-600">${p.oxygen}</td>
            <td class="px-5 py-3.5">
                <span class="px-2.5 py-1 rounded-lg text-xs font-bold border ${getBadgeStyle(p.status)}">
                    ${p.status === 'Critical' ? 'Critical' : p.status === 'Follow-up' ? 'Warning' : 'Normal'}
                </span>
            </td>
        </tr>
    `).join('');
}

function setupNotifications() {
    const notifBtn = document.getElementById("notif-btn");
    const notifDropdown = document.getElementById("notif-dropdown");

    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            notifDropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", (event) => {
            if (!notifDropdown.contains(event.target) && !notifBtn.contains(event.target)) {
                notifDropdown.classList.add("hidden");
            }
        });
    }
}