let globalPatientsData = [];
let globalAppointmentsData = [];

async function loadDashboardData() {
    try {
        const [patientsResponse, appointmentsResponse, usersResponse] =
            await Promise.all([
                fetch("../data/patients.json"),
                fetch("../data/appointments.json"),
                fetch("../data/users.json")
            ]);

        if (
            !patientsResponse.ok ||
            !appointmentsResponse.ok ||
            !usersResponse.ok
        ) {
            throw new Error("Failed to load data");
        }

        globalPatientsData = await patientsResponse.json();
        globalAppointmentsData = await appointmentsResponse.json();

        // 1. Render Top Statistics Cards
        updateStats();

        // 2. Render Calendar (August 2026)
        renderCalendar(globalAppointmentsData, globalPatientsData);

        // 3. Render Health Tables
        renderCriticalPatients(globalPatientsData);
        renderRecentPatients(globalPatientsData);
        renderOverviewPatients(globalPatientsData);

        // 4. Setup Form submission handler
        setupFormHandler();

    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
}

function updateStats() {
    // 1. Total Patients
    const totalPatients = globalPatientsData.length;

    // 2. Strict Critical cases count
    const criticalCasesCount = globalPatientsData.filter(
        patient => patient.condition === "Critical"
    ).length;

    // 3. Vitals warning/critical count
    const criticalVitalsCount = globalPatientsData.filter(
        patient => patient.condition === "Critical" || 
                   patient.condition === "Needs Follow-up" || 
                   patient.heartRate > 100 || 
                   patient.oxygenLevel < 95
    ).length;

    // 4. Today's appointments (2026-08-17)
    const today = new Date().toLocaleDateString('en-CA');
    const todayAppointmentsCount = globalAppointmentsData.filter(
        appointment => appointment.date === today
    ).length;

    // 5. Reports (patients count possessing diagnoses)
    const totalReportsCount = globalPatientsData.filter(p => p.diagnosis).length;

    // Bind values back to top cards
    const statPatientsEl = document.getElementById("stat-patients");
    const statCriticalEl = document.getElementById("stat-critical");
    const statVitalsEl = document.getElementById("stat-vitals");
    const statAppointmentsEl = document.getElementById("stat-appointments");
    const statReportsEl = document.getElementById("stat-reports");

    if (statPatientsEl) statPatientsEl.textContent = totalPatients;
    if (statCriticalEl) statCriticalEl.textContent = criticalCasesCount;
    if (statVitalsEl) statVitalsEl.textContent = criticalVitalsCount;
    if (statAppointmentsEl) statAppointmentsEl.textContent = todayAppointmentsCount;
    if (statReportsEl) statReportsEl.textContent = totalReportsCount;
}

function renderCalendar(appointments, patients) {
    const calendarGrid = document.getElementById("calendar-days-grid");
    if (!calendarGrid) return;
    calendarGrid.innerHTML = "";

    const year = 2026;
    const month = 7; // August is month 7 in JS Date (0-indexed)
    
    // First day of August 2026 is Saturday (6).
    const firstDayIndex = new Date(year, month, 1).getDay(); // 6
    const totalDays = new Date(year, month + 1, 0).getDate(); // 31

    // Render empty spaces for preceding days (before Saturday)
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "py-2.5 text-gray-300 select-none";
        emptyCell.innerHTML = "&nbsp;";
        calendarGrid.appendChild(emptyCell);
    }

    // Render days of the month
    for (let day = 1; day <= totalDays; day++) {
        const dateString = `2026-08-${String(day).padStart(2, '0')}`;
        
        // Find appointments for this date
        const dayApps = appointments.filter(app => app.date === dateString);
        
        const cell = document.createElement("div");
        cell.className = "py-2.5 rounded-lg flex flex-col items-center justify-center transition-all relative select-none cursor-pointer ";
        
        // Base content
        cell.innerHTML = `<span>${day}</span>`;

        if (dayApps.length > 0) {
            // Highlight date with green background/glow
            cell.className += "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50 ";
            
            // Add a small green dot under the number
            const dot = document.createElement("span");
            dot.className = "w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 block absolute bottom-1.5";
            cell.appendChild(dot);

            // Add tooltip hover events
            cell.addEventListener("mouseenter", () => {
                const detailsBox = document.getElementById("hover-appointment-details");
                if (detailsBox) {
                    detailsBox.innerHTML = dayApps.map(app => {
                        const pt = patients.find(p => p.id === app.patientId);
                        const ptName = pt ? pt.name : `Patient #${app.patientId}`;
                        return `<strong>Patient:</strong> ${ptName} | <strong>Time:</strong> ${app.time} | <strong>Reason:</strong> ${app.reason}`;
                    }).join("<br>");
                    detailsBox.className = "text-[11px] text-emerald-700 font-semibold leading-relaxed";
                }
            });

            cell.addEventListener("mouseleave", () => {
                const detailsBox = document.getElementById("hover-appointment-details");
                if (detailsBox) {
                    detailsBox.innerHTML = "Hover over any highlighted date with a dot to see the patient's appointment details here.";
                    detailsBox.className = "text-[11px] text-emerald-700 font-medium";
                }
            });
        } else {
            // Standard day
            cell.className += "text-gray-700 hover:bg-gray-100 border border-transparent ";
        }
        
        // Highlight today's date if it matches today (17th)
        if (day === 17) {
            cell.className += "ring-2 ring-emerald-600 ring-offset-1 font-bold ";
        }

        calendarGrid.appendChild(cell);
    }
}

// Render Critical Patients (Small Table)
function renderCriticalPatients(patients) {
    const listBody = document.getElementById("critical-patients-small-body");
    if (!listBody) return;
    
    // Filter critical patients
    const criticalList = patients.filter(p => p.condition === "Critical");
    
    if (criticalList.length === 0) {
        listBody.innerHTML = `
            <tr>
                <td colspan="3" class="px-4 py-8 text-center text-gray-400">No critical cases currently</td>
            </tr>
        `;
        return;
    }
    
    listBody.innerHTML = criticalList.map(p => `
        <tr class="hover:bg-red-50/20 transition-colors">
            <td class="px-4 py-3 font-semibold text-gray-800">${p.name}</td>
            <td class="px-4 py-3 text-red-600 font-bold">${p.heartRate} bpm / ${p.oxygenLevel}%</td>
            <td class="px-4 py-3 text-gray-500 font-medium">${p.diagnosis}</td>
        </tr>
    `).join('');
}

// Render Recent Patients (Small Table)
function renderRecentPatients(patients) {
    const listBody = document.getElementById("recent-patients-small-body");
    if (!listBody) return;
    
    // Sort patients descending by id to get newest
    const sorted = [...patients].sort((a,b) => parseInt(b.id) - parseInt(a.id));
    const recent = sorted.slice(0, 4); // show last 4 added patients
    
    listBody.innerHTML = recent.map(p => `
        <tr class="hover:bg-emerald-50/10 transition-colors">
            <td class="px-4 py-3 font-semibold text-gray-800">${p.name}</td>
            <td class="px-4 py-3 text-gray-600 font-medium">${p.age} yrs / ${p.gender}</td>
            <td class="px-4 py-3 text-gray-500 font-medium">${p.diagnosis}</td>
        </tr>
    `).join('');
}

// Render All Patients Summary (Wide Table at the bottom)
function renderOverviewPatients(patients) {
    const tableBody = document.getElementById("overview-patients-table-body");
    if (!tableBody) return;
    
    const getConditionBadge = (cond) => {
        if (cond === 'Critical') {
            return `<span class="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold inline-block border border-red-200">Critical</span>`;
        }
        if (cond === 'Needs Follow-up') {
            return `<span class="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold inline-block border border-amber-200">Needs Follow-up</span>`;
        }
        return `<span class="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold inline-block border border-emerald-200">Stable</span>`;
    };

    tableBody.innerHTML = patients.map(p => `
        <tr class="hover:bg-gray-50/50 transition-colors">
            <td class="px-5 py-3 font-bold text-gray-900 whitespace-nowrap">${p.name}</td>
            <td class="px-5 py-3 text-gray-600 whitespace-nowrap">${p.age} </td>
            <td class="px-5 py-3 text-gray-600 whitespace-nowrap">${p.gender}</td>
            <td class="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">${p.heartRate} bpm</td>
            <td class="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">${p.bloodPressure}</td>
            <td class="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">${p.oxygenLevel}%</td>
            <td class="px-5 py-3 text-gray-500 whitespace-nowrap">${p.diagnosis}</td>
            <td class="px-5 py-3 whitespace-nowrap">${getConditionBadge(p.condition)}</td>
        </tr>
    `).join('');
}

function setupFormHandler() {
    const form = document.getElementById("add-critical-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("patient-name").value;
        const age = parseInt(document.getElementById("patient-age").value);
        const gender = document.getElementById("patient-gender").value;
        const heartRate = parseInt(document.getElementById("patient-heart").value);
        const oxygenLevel = parseInt(document.getElementById("patient-oxygen").value);
        const diagnosis = document.getElementById("patient-diagnosis").value;
        const phone = document.getElementById("patient-phone").value;

        // Generate new critical patient record
        const newPatient = {
            id: String(globalPatientsData.length + 1),
            name,
            age,
            gender,
            phone,
            bloodType: "O+", // Default blood type
            condition: "Critical", // Force critical
            diagnosis,
            heartRate,
            bloodPressure: "120/80", // Default blood pressure
            oxygenLevel,
            isNew: true
        };

        // Prepend to patients list
        globalPatientsData.unshift(newPatient);

        // Update statistics counters
        updateStats();

        // Re-render components
        renderCriticalPatients(globalPatientsData);
        renderRecentPatients(globalPatientsData);
        renderOverviewPatients(globalPatientsData);

        // Reset the form fields
        form.reset();

        // Elegant Toast success feedback
        showSuccessNotification();
    });
}

function showSuccessNotification() {
    let toast = document.getElementById("success-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "success-toast";
        toast.className = "fixed bottom-5 right-5 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-y-10 opacity-0 flex items-center gap-2";
        toast.dir = "ltr";
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-base"></i> <span class="text-sm font-semibold">Critical case added successfully and dashboard updated!</span>`;
        document.body.appendChild(toast);
    }
    
    // Trigger showing animations
    setTimeout(() => {
        toast.classList.remove("translate-y-10", "opacity-0");
        toast.classList.add("translate-y-0", "opacity-100");
    }, 50);

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove("translate-y-0", "opacity-100");
        toast.classList.add("translate-y-10", "opacity-0");
    }, 3000);
}

loadDashboardData();
