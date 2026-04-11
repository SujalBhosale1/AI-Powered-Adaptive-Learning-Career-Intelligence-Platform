// Dummy data for One Stop Application grouped by engineering branch

export const branchData = {
    "Computer Science": {
        skills: {
            required: ["React.js", "JavaScript", "Data Structures", "Python", "Database Management"],
            missing: ["Data Structures", "Database Management"],
            completed: ["React.js", "JavaScript", "Python"],
            recommendation: "Focus on Data Structures and backend algorithms to improve FAANG placement chances."
        },
        internships: [
            { id: 1, title: "Frontend Developer Intern", company: "TechSolutions Inc.", domain: "Web Development", mode: "Remote", duration: "3 Months", icon: "💻" },
            { id: 2, title: "Python Trainee", company: "DataCorp", domain: "Data Science", mode: "Hybrid", duration: "6 Months", icon: "🐍" },
            { id: 3, title: "Backend Engineer Intern", company: "CloudScale", domain: "Systems", mode: "Remote", duration: "2 Months", icon: "⚙️" }
        ],
        roadmap: [
            { month: "Month 1", title: "Foundation & Basics", status: "completed", description: "Master HTML, CSS, JavaScript and learn Git basics.", resources: ["MDN Web Docs", "FreeCodeCamp"] },
            { month: "Month 2", title: "Advanced React & State", status: "in-progress", description: "Deep dive into React, Hooks, Context API and Redux.", resources: ["React Official Docs", "Frontend Masters"] },
            { month: "Month 3", title: "Projects & Portfolio", status: "pending", description: "Build 3 major projects and deploy them. Update resume.", resources: ["Youtube Tutorials", "GitHub"] }
        ]
    },
    "Electronics": {
        skills: {
            required: ["Embedded C", "Microcontrollers", "VLSI Basics", "Python", "IoT Protocols"],
            missing: ["VLSI Basics", "IoT Protocols"],
            completed: ["Embedded C", "Python", "Microcontrollers"],
            recommendation: "Dive into IoT network protocols to bridge the gap between hardware and software."
        },
        internships: [
            { id: 1, title: "IoT Research Intern", company: "SmartSystems", domain: "IoT & Electronics", mode: "On-site", duration: "2 Months", icon: "📡" },
            { id: 2, title: "Embedded Firmware Dev", company: "RoboTech", domain: "Hardware", mode: "Hybrid", duration: "4 Months", icon: "🔌" },
            { id: 3, title: "VLSI Testing Trainee", company: "SiliconWorks", domain: "Semiconductor", mode: "On-site", duration: "6 Months", icon: "🔬" }
        ],
        roadmap: [
            { month: "Month 1", title: "Circuit Theory & MCU", status: "completed", description: "Master basic circuit theorems and Arduino basics.", resources: ["NPTEL", "Arduino Docs"] },
            { month: "Month 2", title: "Embedded C & Sensors", status: "in-progress", description: "Interface physical sensors over I2C/SPI.", resources: ["Texas Instruments", "Udemy"] },
            { month: "Month 3", title: "IoT Cloud Integration", status: "pending", description: "Send sensor data to AWS IoT or Firebase.", resources: ["AWS IoT Docs", "Hackaday"] }
        ]
    },
    "Mechanical": {
        skills: {
            required: ["CAD/CAM", "Thermodynamics", "SolidWorks", "FEA Analysis", "Python"],
            missing: ["FEA Analysis", "Python"],
            completed: ["CAD/CAM", "Thermodynamics", "SolidWorks"],
            recommendation: "Learn Python to automate design generation and parametric optimization."
        },
        internships: [
            { id: 1, title: "Design Engineer Intern", company: "AutoMakers", domain: "Automotive", mode: "On-site", duration: "6 Months", icon: "🚗" },
            { id: 2, title: "Manufacturing Trainee", company: "SteelFab", domain: "Production", mode: "On-site", duration: "3 Months", icon: "⚙️" },
            { id: 3, title: "HVAC Consultant Intern", company: "AeroCool", domain: "Thermal", mode: "Hybrid", duration: "2 Months", icon: "❄️" }
        ],
        roadmap: [
            { month: "Month 1", title: "Drafting & Modeling", status: "completed", description: "Master 2D drafting and basic 3D CAD.", resources: ["AutoDesk Academy", "Coursera"] },
            { month: "Month 2", title: "SolidWorks & Simulation", status: "in-progress", description: "Learn assembly and basic stress testing.", resources: ["SolidWorks Tutorials", "EdX"] },
            { month: "Month 3", title: "Finite Element Analysis", status: "pending", description: "Advanced mesh models and thermal stress testing.", resources: ["Ansys Courses", "Youtube"] }
        ]
    }
};

// Original structure preserved for compatibility, but generated dynamically based on branch
export const getEngineeredData = (branch = "Computer Science") => {
    // Attempt to match branch, fallback to CS if unknown
    const normalizedBranch = Object.keys(branchData).find(b => branch.toLowerCase().includes(b.toLowerCase())) || "Computer Science";
    const data = branchData[normalizedBranch];

    return {
        branches: [
            { branch: "Computer Science", percentage: 92, reason: "Strong performance in Maths (95%) and high interest in Coding and Logic." },
            { branch: "Electronics & Communication", percentage: 78, reason: "Good grasp of Physics and interest in Electronics, but Coding preference dominates." },
            { branch: "Mechanical Engineering", percentage: 45, reason: "Physics score is decent, but low interest in Mechanics and heavy machinery." }
        ],
        skills: data.skills,
        internships: data.internships,
        roadmap: data.roadmap,
        student: {
            name: "Aditya Kumar",
            education: { marks10: "92%", marks12: "89%", board12: "CBSE" },
            examScores: { cet: "98.5 percentile", jee: "95.2 percentile" },
            interests: ["Robotics", "AI/ML", "Web Development"]
        }
    };
};

export const engineeredData = getEngineeredData("Computer Science"); // Default export for isolated modules
