const students = [
    {
        name: "Atharva Zope",
        rollNo: "123B1D067",
        class: "TY BTech Computer Engineering(Regional)",
        subjects: ["OS", "DS", "FSD", "DAA", "SE"],
        marks: [85, 92, 78, 88, 80],
        grades: ["A", "A", "B", "A", "B"],
        progress: [78, 82, 85, 88, 85]
    },
    {
        name: "Adwait Kamble",
        rollNo: "123B1D002",
        class: "TY BTech Computer Engineering(Regional)",
        subjects: ["OS", "DS", "FSD", "DAA", "SE"],
        marks: [95, 89, 92, 87, 91],
        grades: ["A", "B", "A", "B", "A"],
        progress: [85, 88, 90, 92, 91]
    },
    {
        name: "Aryan Aradhye",
        rollNo: "121B1D058",
        class: "TY BTech Computer Engineering(Regional)",
        subjects: ["OS", "DS", "FSD", "DAA", "SE"],
        marks: [70, 75, 68, 72, 65],
        grades: ["C", "C", "D", "C", "D"],
        progress: [65, 68, 70, 72, 70]
    }
];

let barChart = null;
let pieChart = null;
let lineChart = null;

function updateStudentInfo(index) {
    const student = students[index];
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('studentInfo').textContent = `PRN: ${student.rollNo} | Class: ${student.class}`;
}

function updateBarChart(index) {
    const ctx = document.getElementById('barChart').getContext('2d');
    const student = students[index];
    
    if (barChart) {
        barChart.destroy();
    }
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: student.subjects,
            datasets: [{
                label: 'Marks',
                data: student.marks,
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'],
                borderColor: ['#0056b3', '#1e7e34', '#d39e00', '#bd2130', '#563d7c'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function updatePieChart(index) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    const student = students[index];
    
    if (pieChart) {
        pieChart.destroy();
    }
    
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: student.subjects,
            datasets: [{
                data: student.marks,
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateLineChart(index) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    const student = students[index];
    const labels = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5'];
    
    if (lineChart) {
        lineChart.destroy();
    }
    
    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Overall Percentage',
                data: student.progress,
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: '#007bff',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function updateCharts() {
    const select = document.getElementById('studentSelect');
    const index = parseInt(select.value);
    updateStudentInfo(index);
    updateBarChart(index);
    updatePieChart(index);
    updateLineChart(index);
}

document.getElementById('studentSelect').addEventListener('change', updateCharts);

window.onload = function() {
    updateCharts();
};