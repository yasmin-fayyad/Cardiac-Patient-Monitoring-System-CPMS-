CardioCare - Cardiac Patient Monitoring System
CardioCare is a front-end medical dashboard designed for monitoring cardiac patients. The application simulates real-world clinic workflows by customizing views and actions based on user roles (Doctor, Nurse, and Receptionist), relying purely on modern Front-End web technologies and local JSON datasets.
## Features
- **Role-Based Access Simulation**: Dynamic UI rendering based on the selected role (Doctor, Nurse, Receptionist) saved via browser storage.
- **Interactive Dashboard**: Real-time overview of total patients, critical cases, and upcoming appointments.
- **Patient Management & Details**: Patient listing with search and filter functionality, leading to dedicated detail views.
- **Vital Signs Tracking**: Visual history and indicators for Heart Rate, Blood Pressure, and Oxygen levels.
- **Appointment Scheduling**: Interactive interface for viewing and managing patient appointment slots.
- **Asynchronous Data Handling**: Uses Fetch API and `async/await` to load local mock JSON files with clear loading, empty, success, and error states.

## Tech Stack
- **HTML5**: Semantic markup for structured, accessible pages.
- **Tailwind CSS**: Utility-first styling for clean, modern, and responsive UI layout.
- **JavaScript** : Modular code, DOM manipulation, and custom event handling without external libraries.

## Folder Structure
├── index.html
├── src/
│   ├── data/          # Local JSON mock datasets
│   ├── features/      # Feature-specific scripts (Dashboard, Patients, Vitals, Appointments)
│   ├── js/            # DOM and Event management
│   ├── styles/        # Tailwind CSS 
│   └── utils/         # Helper functions
└── assets/            #  images and icons