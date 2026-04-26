const weatherData = {
    london: {
        city: "Pune",
        currentTemp: 18,
        currentCondition: "Cloudy",
        currentHumidity: 78,
        currentWind: 14,
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        temperatures: [17, 18, 16, 19, 20, 18, 17],
        humidity: [80, 78, 82, 75, 77, 79, 81],
        conditions: ["Cloudy", "Rainy", "Cloudy", "Sunny", "Sunny", "Cloudy", "Rainy"],
        high: [18, 19, 17, 20, 21, 19, 18],
        low: [12, 13, 11, 14, 15, 13, 12]
    },
    tokyo: {
        city: "Mumbai",
        currentTemp: 24,
        currentCondition: "Sunny",
        currentHumidity: 65,
        currentWind: 10,
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        temperatures: [22, 24, 25, 23, 26, 24, 25],
        humidity: [68, 65, 70, 62, 60, 66, 64],
        conditions: ["Sunny", "Sunny", "Cloudy", "Rainy", "Sunny", "Sunny", "Cloudy"],
        high: [23, 25, 26, 24, 27, 25, 26],
        low: [18, 19, 20, 18, 21, 19, 20]
    },
    newyork: {
        city: "Delhi",
        currentTemp: 22,
        currentCondition: "Partly Cloudy",
        currentHumidity: 70,
        currentWind: 18,
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        temperatures: [20, 22, 21, 23, 24, 22, 21],
        humidity: [72, 70, 75, 68, 65, 71, 73],
        conditions: ["Cloudy", "Partly Cloudy", "Rainy", "Sunny", "Sunny", "Cloudy", "Rainy"],
        high: [21, 23, 22, 24, 25, 23, 22],
        low: [15, 16, 14, 17, 18, 16, 15]
    }
};

let lineChartInstance = null;
let barChartInstance = null;
let doughnutChartInstance = null;

function getConditionCounts(conditions) {
    const counts = { Sunny: 0, Cloudy: 0, Rainy: 0, "Partly Cloudy": 0 };
    conditions.forEach(c => {
        if (counts[c] !== undefined) counts[c]++;
    });
    return counts;
}

function updateCurrentWeather(cityData) {
    document.getElementById("currentTemp").textContent = `${cityData.currentTemp}°C`;
    document.getElementById("currentCondition").textContent = cityData.currentCondition;
    document.getElementById("currentHumidity").textContent = `Humidity: ${cityData.currentHumidity}%`;
    document.getElementById("currentWind").textContent = `Wind: ${cityData.currentWind} km/h`;
}

function updateWeeklyTable(cityData) {
    const tableBody = document.getElementById("weeklyTable");
    tableBody.innerHTML = "";
    for (let i = 0; i < 7; i++) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cityData.days[i]}</td>
            <td>${cityData.high[i]}°C</td>
            <td>${cityData.low[i]}°C</td>
            <td>${cityData.conditions[i]}</td>
        `;
        tableBody.appendChild(row);
    }
}

function updateLineChart(cityData) {
    const ctx = document.getElementById("lineChart").getContext("2d");
    if (lineChartInstance) lineChartInstance.destroy();
    lineChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: cityData.days,
            datasets: [{
                label: "Temperature (°C)",
                data: cityData.temperatures,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: "Temperature (°C)"
                    }
                }
            }
        }
    });
}

function updateBarChart(cityData) {
    const ctx = document.getElementById("barChart").getContext("2d");
    if (barChartInstance) barChartInstance.destroy();
    barChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: cityData.days,
            datasets: [{
                label: "Humidity (%)",
                data: cityData.humidity,
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "rgb(54, 162, 235)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: "Humidity (%)"
                    }
                }
            }
        }
    });
}

function updateDoughnutChart(cityData) {
    const counts = getConditionCounts(cityData.conditions);
    const labels = Object.keys(counts).filter(k => counts[k] > 0);
    const data = labels.map(l => counts[l]);
    const ctx = document.getElementById("doughnutChart").getContext("2d");
    if (doughnutChartInstance) doughnutChartInstance.destroy();
    doughnutChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    "rgb(255, 205, 86)",
                    "rgb(75, 192, 192)",
                    "rgb(255, 99, 132)",
                    "rgb(153, 102, 255)"
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

function updateDashboard() {
    const selectedCity = document.getElementById("citySelect").value;
    const cityData = weatherData[selectedCity];
    updateCurrentWeather(cityData);
    updateWeeklyTable(cityData);
    updateLineChart(cityData);
    updateBarChart(cityData);
    updateDoughnutChart(cityData);
}

document.getElementById("citySelect").addEventListener("change", updateDashboard);

window.onload = function() {
    updateDashboard();
};