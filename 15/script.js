document.addEventListener('DOMContentLoaded', function() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports'];
    
    const mockSalesData = [12000, 19000, 15000, 22000, 18000, 25000, 30000, 28000, 32000, 35000, 40000, 38000];
    const mockCategoryData = [45000, 32000, 28000, 15000, 12000];
    const mockRevenueData = [40, 25, 20, 10, 5];
    
    let lineChart, barChart, pieChart;
    
    function initCharts() {
        const lineCtx = document.getElementById('lineChart').getContext('2d');
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Sales ($)',
                    data: mockSalesData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
        
        const barCtx = document.getElementById('barChart').getContext('2d');
        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Sales ($)',
                    data: mockCategoryData,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(75, 192, 192)',
                        'rgb(255, 206, 86)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
        
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        pieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: mockRevenueData,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
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
    
    function updateCharts() {
        const monthFilter = document.getElementById('monthFilter').value;
        const categoryFilter = document.getElementById('categoryFilter').value;
        const yearFilter = document.getElementById('yearFilter').value;
        
        let newSalesData = [...mockSalesData];
        let newCategoryData = [...mockCategoryData];
        let newRevenueData = [...mockRevenueData];
        
        if (monthFilter !== 'all') {
            const monthIndex = ['jan', 'feb', 'mar', 'apr', 'may', 'jun'].indexOf(monthFilter);
            if (monthIndex !== -1) {
                newSalesData = newSalesData.map((val, idx) => idx === monthIndex ? val * 1.2 : val * 0.8);
            }
        }
        
        if (categoryFilter !== 'all') {
            const catIndex = ['electronics', 'clothing', 'home', 'books', 'sports'].indexOf(categoryFilter);
            if (catIndex !== -1) {
                newCategoryData = newCategoryData.map((val, idx) => idx === catIndex ? val * 1.5 : val * 0.9);
                newRevenueData = newRevenueData.map((val, idx) => idx === catIndex ? val * 1.8 : val * 0.8);
            }
        }
        
        if (yearFilter === '2023') {
            newSalesData = newSalesData.map(val => val * 0.85);
            newCategoryData = newCategoryData.map(val => val * 0.9);
        } else if (yearFilter === '2022') {
            newSalesData = newSalesData.map(val => val * 0.7);
            newCategoryData = newCategoryData.map(val => val * 0.75);
        }
        
        lineChart.data.datasets[0].data = newSalesData;
        lineChart.update();
        
        barChart.data.datasets[0].data = newCategoryData;
        barChart.update();
        
        pieChart.data.datasets[0].data = newRevenueData;
        pieChart.update();
        
        const totalSales = newSalesData.reduce((a, b) => a + b, 0);
        const avgOrder = totalSales / 500;
        const growth = monthFilter === 'all' ? '+12.5%' : '+8.2%';
        
        document.getElementById('totalSales').textContent = '$' + totalSales.toLocaleString();
        document.getElementById('avgOrder').textContent = '$' + avgOrder.toFixed(0);
        document.getElementById('growth').textContent = growth;
        
        updateTransactionTable(categoryFilter);
    }
    
    function updateTransactionTable(category) {
        const tableBody = document.getElementById('transactionTable');
        const transactions = [
            { id: '#1001', date: '2024-04-15', amount: 450, status: 'Completed', cat: 'electronics' },
            { id: '#1002', date: '2024-04-14', amount: 320, status: 'Completed', cat: 'clothing' },
            { id: '#1003', date: '2024-04-13', amount: 680, status: 'Pending', cat: 'home' },
            { id: '#1004', date: '2024-04-12', amount: 210, status: 'Completed', cat: 'books' },
            { id: '#1005', date: '2024-04-11', amount: 890, status: 'Cancelled', cat: 'sports' },
            { id: '#1006', date: '2024-04-10', amount: 540, status: 'Completed', cat: 'electronics' },
            { id: '#1007', date: '2024-04-09', amount: 230, status: 'Completed', cat: 'clothing' },
            { id: '#1008', date: '2024-04-08', amount: 760, status: 'Pending', cat: 'home' }
        ];
        
        let filtered = transactions;
        if (category !== 'all') {
            filtered = transactions.filter(t => t.cat === category);
        }
        
        filtered = filtered.slice(0, 5);
        
        tableBody.innerHTML = '';
        filtered.forEach(trans => {
            const row = document.createElement('tr');
            let statusBadge = '';
            if (trans.status === 'Completed') {
                statusBadge = '<span class="badge bg-success">Completed</span>';
            } else if (trans.status === 'Pending') {
                statusBadge = '<span class="badge bg-warning">Pending</span>';
            } else {
                statusBadge = '<span class="badge bg-danger">Cancelled</span>';
            }
            
            row.innerHTML = `
                <td>${trans.id}</td>
                <td>${trans.date}</td>
                <td>$${trans.amount}</td>
                <td>${statusBadge}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    document.getElementById('applyFilter').addEventListener('click', updateCharts);
    
    document.getElementById('monthFilter').addEventListener('change', function() {
        if (this.value === 'all') {
            document.getElementById('categoryFilter').disabled = false;
        }
    });
    
    document.getElementById('categoryFilter').addEventListener('change', function() {
        if (this.value === 'all') {
            document.getElementById('monthFilter').disabled = false;
        }
    });
    
    initCharts();
    updateTransactionTable('all');
});