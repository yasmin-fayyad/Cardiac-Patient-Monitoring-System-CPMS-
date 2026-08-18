// ===============================
// Appointment Management
// ===============================

let allAppointments = [];
let patients = [];
let editingAppointmentId = null;

async function loadPatientsForAppointments() {
    try {
        const response = await fetch("../data/patients.json");
        if (!response.ok) throw new Error("Failed to load patients");

        patients = await response.json();
        const select = document.getElementById("appointmentPatient");

        if (!select) return;

        select.innerHTML = `<option value="">Select Patient</option>`;

        patients.forEach(function (patient) {
            const option = document.createElement("option");
            option.value = patient.id;
            option.textContent = patient.name;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading patients:", error);
    }
}

function getLocalAppointments() {
    return JSON.parse(localStorage.getItem("cardiacAppointments")) || [];
}

function saveLocalAppointments(data) {
    localStorage.setItem("cardiacAppointments", JSON.stringify(data));
}

function renderAppointmentManagement() {
    const tableBody = document.getElementById("appointments-table-body");
    if (!tableBody) return;

    const searchInput = document.getElementById("appointmentSearch");
    const statusInput = document.getElementById("statusFilter");
    const dateInput = document.getElementById("dateFilter");

    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const status = statusInput ? statusInput.value : "All";
    const date = dateInput ? dateInput.value : "";

    const filteredAppointments = allAppointments.filter(function (appointment) {
        const patientName = appointment.patientName || "";
        const matchesSearch = patientName.toLowerCase().includes(search);
        const matchesStatus = status === "All" || appointment.status === status;
        const matchesDate = !date || appointment.date === date;

        return matchesSearch && matchesStatus && matchesDate;
    });

    tableBody.innerHTML = "";

    if (filteredAppointments.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-400 font-medium">
                    No appointments found matching your criteria.
                </td>
            </tr>
        `;
        return;
    }

    filteredAppointments.forEach(function (appointment) {
        const row = document.createElement("tr");
        row.className = "hover:bg-gray-50/50 transition-colors";

        let statusBadge = "";
        if (appointment.status === "Scheduled") {
            statusBadge = `<span class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">Scheduled</span>`;
        } else if (appointment.status === "Urgent") {
            statusBadge = `<span class="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">Urgent</span>`;
        } else if (appointment.status === "Completed") {
            statusBadge = `<span class="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">Completed</span>`;
        } else {
            statusBadge = `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">${appointment.status}</span>`;
        }

        row.innerHTML = `
            <td class="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">${appointment.patientName}</td>
            <td class="px-6 py-4 text-gray-600 whitespace-nowrap font-medium" dir="ltr">${appointment.date}</td>
            <td class="px-6 py-4 text-gray-600 whitespace-nowrap font-semibold">${appointment.time}</td>
            <td class="px-6 py-4 text-gray-500 whitespace-nowrap">${appointment.reason || "-"}</td>
            <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                    onclick="editAppointment('${appointment.id}')"
                    class="mr-2 rounded-lg bg-blue-50 text-blue-600 px-3 py-1 font-semibold border border-blue-200 hover:bg-blue-100 transition">
                    <i class="fa-solid fa-pen-to-square mr-1"></i>Edit
                </button>
                <button
                    onclick="deleteAppointment('${appointment.id}')"
                    class="rounded-lg bg-red-50 text-red-600 px-3 py-1 font-semibold border border-red-200 hover:bg-red-100 transition">
                    <i class="fa-solid fa-trash-can mr-1"></i>Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("appointmentForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const patientId = document.getElementById("appointmentPatient").value;
        const patient = patients.find(item => item.id == patientId);

        if (!patientId || !patient) {
            alert("Please select a patient");
            return;
        }

        const appointmentData = {
            id: editingAppointmentId || Date.now(),
            patientId: patientId,
            patientName: patient.name,
            date: document.getElementById("appointmentDate").value,
            time: document.getElementById("appointmentTime").value,
            status: document.getElementById("appointmentStatus").value,
            reason: document.getElementById("appointmentReason").value
        };

        if (editingAppointmentId) {
            allAppointments = allAppointments.map(function (appointment) {
                if (String(appointment.id) === String(editingAppointmentId)) {
                    return appointmentData;
                }
                return appointment;
            });
        } else {
            allAppointments.unshift(appointmentData);
        }

        saveLocalAppointments(allAppointments);
        resetFormState();
        renderAppointmentManagement();
    });

    const searchEl = document.getElementById("appointmentSearch");
    if (searchEl) searchEl.addEventListener("input", renderAppointmentManagement);

    const statusEl = document.getElementById("statusFilter");
    if (statusEl) statusEl.addEventListener("change", renderAppointmentManagement);

    const dateEl = document.getElementById("dateFilter");
    if (dateEl) dateEl.addEventListener("change", renderAppointmentManagement);
    const cancelBtn = document.getElementById("cancelEdit");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            resetFormState();
        });
    }
});

function editAppointment(id) {
    const appointment = allAppointments.find(item => String(item.id) === String(id));
    if (!appointment) return;

    editingAppointmentId = appointment.id;

    document.getElementById("appointmentPatient").value = appointment.patientId;
    document.getElementById("appointmentDate").value = appointment.date;
    document.getElementById("appointmentTime").value = appointment.time;
    document.getElementById("appointmentStatus").value = appointment.status;
    document.getElementById("appointmentReason").value = appointment.reason;

    document.getElementById("cancelEdit").classList.remove("hidden");
    const modeBadge = document.querySelector(".relative .absolute span");
    if (modeBadge) {
        modeBadge.textContent = "Edit Mode";
        modeBadge.className = "bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-xs font-bold";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetFormState() {
    const form = document.getElementById("appointmentForm");
    if (form) form.reset();

    editingAppointmentId = null;

    const cancelBtn = document.getElementById("cancelEdit");
    if (cancelBtn) cancelBtn.classList.add("hidden");

    const modeBadge = document.querySelector(".relative .absolute span");
    if (modeBadge) {
        modeBadge.textContent = "Add Mode";
        modeBadge.className = "bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-bold";
    }
}

function deleteAppointment(id) {
    const confirmDelete = confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    allAppointments = allAppointments.filter(appointment => String(appointment.id) !== String(id));

    saveLocalAppointments(allAppointments);
    renderAppointmentManagement();
}

async function initializeAppointmentManagement() {
    await loadPatientsForAppointments();

    try {
        const response = await fetch("../data/appointments.json");
        if (response.ok) {
            const initialAppointments = await response.json();
            const mappedInitial = initialAppointments.map(app => {
                const patient = patients.find(p => p.id === app.patientId);
                return {
                    ...app,
                    patientName: patient ? patient.name : `Patient #${app.patientId}`
                };
            });
            const localAppointments = getLocalAppointments();
            allAppointments = [...localAppointments, ...mappedInitial];
        } else {
            allAppointments = getLocalAppointments();
        }
    } catch (e) {
        console.error("Error fetching initial appointments JSON:", e);
        allAppointments = getLocalAppointments();
    }

    renderAppointmentManagement();
}
initializeAppointmentManagement();