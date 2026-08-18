document.addEventListener("DOMContentLoaded", function () {
    renderNavbar();
    renderHeader();
    setupHeaderInteractions();
});

function renderNavbar() {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) return;
    const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

    const getLinkClass = (pageName) => {
        const isActive = currentPage === pageName;
        return isActive
            ? "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-teal-50 text-teal-700 transition"
            : "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-teal-700 transition";
    };

    navbarContainer.innerHTML = `
        <aside class="w-full lg:w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-4">
            <div>
                <!-- Brand / Logo -->
                <div class="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-100">
                    <div class="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        <i class="fa-solid fa-heart-pulse"></i>
                    </div>
                    <div>
                        <h2 class="font-extrabold text-slate-800 text-sm leading-tight">Cardiac Care</h2>
                        <span class="text-xs text-gray-400">Monitoring System</span>
                    </div>
                </div>

                <!-- Navigation Links -->
                <nav class="space-y-1">
                    <a href="dashboard.html" class="${getLinkClass('dashboard.html')}">
                        <i class="fa-solid fa-chart-pie w-5 text-center"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="patients.html" class="${getLinkClass('patients.html')}">
                        <i class="fa-solid fa-user-group w-5 text-center"></i>
                        <span>Patients</span>
                    </a>
                    <a href="vitals.html" class="${getLinkClass('vitals.html')}">
                        <i class="fa-solid fa-heart-circle-check w-5 text-center"></i>
                        <span>Vitals</span>
                    </a>
                    <a href="appointments.html" class="${getLinkClass('appointments.html')}">
                        <i class="fa-solid fa-calendar-check w-5 text-center"></i>
                        <span>Appointments</span>
                    </a>
                    <a href="reports.html" class="${getLinkClass('reports.html')}">
                        <i class="fa-solid fa-file-waveform w-5 text-center"></i>
                        <span>Reports</span>
                    </a>
                </nav>
            </div>

            <div>
                <!-- Footer Info & Logout inside Sidebar -->
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3">
                    <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <i class="fa-solid fa-circle-info text-teal-600"></i>
                        <span>Hospital System v2.0</span>
                    </div>
                </div>

                <a href="../../index.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition">
                    <i class="fa-solid fa-right-from-bracket w-5 text-center"></i>
                    <span>Logout</span>
                </a>
            </div>
        </aside>
    `;
}
function renderHeader() {
    const headerContainer = document.getElementById("header");
    if (!headerContainer) return;

    headerContainer.innerHTML = `
        <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <button class="lg:hidden text-slate-600 text-xl focus:outline-none">
                    <i class="fa-solid fa-bars"></i>
                </button>
                <div class="relative hidden sm:block w-64">
                    <input type="text" placeholder="Global Search..." class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-teal-500">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                </div>
            </div>

            <div class="flex items-center gap-4 relative">
                <!-- Notifications Menu -->
                <div class="relative">
                    <button id="notif-btn" class="relative p-2 text-slate-500 hover:text-teal-700 transition rounded-xl hover:bg-slate-50 focus:outline-none">
                        <i class="fa-regular fa-bell text-lg"></i>
                        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div id="notif-dropdown" class="hidden absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-lg p-4 z-50">
                        <h4 class="text-xs font-bold text-slate-700 mb-2 border-b border-slate-100 pb-2">Notifications</h4>
                        <div class="space-y-2 text-xs">
                            <div class="p-2 bg-red-50 rounded-lg text-red-700 font-medium">
                                Critical Vitals Alert: Omar Nabulsi
                            </div>
                            <div class="p-2 bg-slate-50 rounded-lg text-slate-600">
                                New appointment assigned for tomorrow
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-6 w-px bg-slate-200"></div>

                <!-- Doctor Profile -->
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm border border-teal-200">
                        SJ
                    </div>
                    <div class="hidden md:block">
                        <h4 class="text-xs font-bold text-slate-800 leading-tight">Dr. Sarah Jenkins</h4>
                        <span class="text-[10px] text-gray-400">Cardiologist</span>
                    </div>
                </div>

                <!-- Header Logout Button -->
                <a href="../../index.html" class="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold" title="Logout">
                    <i class="fa-solid fa-right-from-bracket text-sm"></i>
                </a>
            </div>
        </header>
    `;
}

function setupHeaderInteractions() {
    const notifBtn = document.getElementById("notif-btn");
    const notifDropdown = document.getElementById("notif-dropdown");

    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", (e) => {
            if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
                notifDropdown.classList.add("hidden");
            }
        });
    }
}