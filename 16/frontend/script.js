document.addEventListener('DOMContentLoaded', function() {
    const weekSelect = document.getElementById('week-select');
    const refreshBtn = document.getElementById('refresh-btn');
    
    let lineChart, pieChart, barChart, doughnutChart;
    
    const mockData = {
        'this-week': {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            steps: [8450, 10200, 12548, 9800, 11050, 13500, 9200],
            activities: {
                labels: ['Walking', 'Running', 'Cycling', 'Swimming', 'Yoga'],
                data: [40, 25, 20, 10, 5],
                colors: ['#ff6b6b', '#51cf66', '#339af0', '#ff922b', '#cc5de8']
            },
            weeklyComparison: {
                thisWeek: [45, 60, 75, 50, 65, 80, 55],
                lastWeek: [40, 55, 70, 45, 60, 75, 50]
            },
            heartRateZones: {
                labels: ['Peak', 'Cardio', 'Fat Burn', 'Warm Up'],
                data: [15, 30, 40, 15],
                colors: ['#ff6b6b', '#ff922b', '#51cf66', '#748ffc']
            }
        },
        'last-week': {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            steps: [7800, 9500, 11200, 8600, 9900, 12000, 8500],
            activities: {
                labels: ['Walking', 'Running', 'Cycling', 'Swimming', 'Yoga'],
                data: [45, 20, 18, 12, 5],
                colors: ['#ff6b6b', '#51cf66', '#339af0', '#ff922b', '#cc5de8']
            },
            weeklyComparison: {
                thisWeek: [40, 55, 70, 45, 60, 75, 50],
                lastWeek: [35, 50, 65, 40, 55, 70, 45]
            },
            heartRateZones: {
                labels: ['Peak', 'Cardio', 'Fat Burn', 'Warm Up'],
                data: [12, 28, 45, 15],
                colors: ['#ff6b6b', '#ff922b', '#51cf66', '#748ffc']
            }
        },
        'two-weeks-ago': {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            steps: [7200, 8800, 10500, 8000, 9200, 11000, 7800],
            activities: {
                labels: ['Walking', 'Running', 'Cycling', 'Swimming', 'Yoga'],
                data: [50, 18, 15, 10, 7],
                colors: ['#ff6b6b', '#51cf66', '#339af0', '#ff922b', '#cc5de8']
            },
            weeklyComparison: {
                thisWeek: [35, 50, 65, 40, 55, 70, 45],
                lastWeek: [30, 45, 60, 35, 50, 65, 40]
            },
            heartRateZones: {
                labels: ['Peak', 'Cardio', 'Fat Burn', 'Warm Up'],
                data: [10, 25, 50, 15],
                colors: ['#ff6b6b', '#ff922b', '#51cf66', '#748ffc']
            }
        }
    };
    
    function updateStatsDisplay(weekKey) {
        const data = mockData[weekKey];
        const steps = data.steps.reduce((a, b) => a + b, 0);
        const avgSteps = Math.round(steps / 7);
        const calories = Math.round(steps * 0.04);
        const activeTime = Math.round(steps * 0.0007);
        
        document.querySelector('.stat-value:nth-child(1)').textContent = avgSteps.toLocaleString();
        document.querySelector('.stat-value:nth-child(2)').textContent = calories.toLocaleString();
        document.querySelector('.stat-value:nth-child(3)').textContent = `${Math.floor(activeTime / 60)}h ${activeTime % 60}m`;
        
        const goalCompletion = Math.min(100, Math.round((avgSteps / 10000) * 100));
        document.querySelector('.stat-value:nth-child(4)').textContent = `${goalCompletion}%`;
    }
    
    function initLineChart(weekKey) {
        const ctx = document.getElementById('lineChart').getContext('2d');
        const data = mockData[weekKey];
        
        if (lineChart) lineChart.destroy();
        
        lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.days,
                datasets: [{
                    label: 'Steps',
                    data: data.steps,
                    borderColor: '#4dabf7',
                    backgroundColor: 'rgba(77, 171, 247, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4dabf7',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }
    
    function initPieChart(weekKey) {
        const ctx = document.getElementById('pieChart').getContext('2d');
        const data = mockData[weekKey].activities;
        
        if (pieChart) pieChart.destroy();
        
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: data.colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function initBarChart(weekKey) {
        const ctx = document.getElementById('barChart').getContext('2d');
        const data = mockData[weekKey].weeklyComparison;
        
        if (barChart) barChart.destroy();
        
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: mockData[weekKey].days,
                datasets: [
                    {
                        label: 'This Week',
                        data: data.thisWeek,
                        backgroundColor: '#ff922b',
                        borderRadius: 8,
                        borderWidth: 0
                    },
                    {
                        label: 'Last Week',
                        data: data.lastWeek,
                        backgroundColor: '#748ffc',
                        borderRadius: 8,
                        borderWidth: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + ' min';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    function initDoughnutChart(weekKey) {
        const ctx = document.getElementById('doughnutChart').getContext('2d');
        const data = mockData[weekKey].heartRateZones;
        
        if (doughnutChart) doughnutChart.destroy();
        
        doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: data.colors,
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function updateCharts(weekKey) {
        initLineChart(weekKey);
        initPieChart(weekKey);
        initBarChart(weekKey);
        initDoughnutChart(weekKey);
        updateStatsDisplay(weekKey);
    }
    
    weekSelect.addEventListener('change', function() {
        updateCharts(this.value);
    });
    
    refreshBtn.addEventListener('click', function() {
        const spinner = this.querySelector('i');
        spinner.style.transform = 'rotate(360deg)';
        spinner.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            spinner.style.transform = 'rotate(0deg)';
            updateCharts(weekSelect.value);
        }, 500);
    });
    
    updateCharts('this-week');
    
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * 3);
        const options = ['this-week', 'last-week', 'two-weeks-ago'];
        if (Math.random() > 0.7) {
            weekSelect.value = options[randomIndex];
            updateCharts(weekSelect.value);
        }
    }, 10000);
});