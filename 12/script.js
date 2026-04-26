document.addEventListener('DOMContentLoaded', function() {
    const seatGrid = document.getElementById('seat-grid');
    const selectedMovieElement = document.getElementById('selected-movie');
    const selectedPriceElement = document.getElementById('selected-price');
    const selectedSeatsList = document.getElementById('selected-seats-list');
    const totalSeatsElement = document.getElementById('total-seats');
    const totalPriceElement = document.getElementById('total-price');
    const confirmBtn = document.getElementById('confirm-btn');
    const currentMovieElement = document.getElementById('current-movie');
    const currentSeatsElement = document.getElementById('current-seats');
    const currentPriceElement = document.getElementById('current-price');
    const currentTotalElement = document.getElementById('current-total');
    
    let selectedMovie = null;
    let moviePrice = 0;
    let selectedSeats = new Set();
    
    const seatData = [
        { id: 'A1', status: 'available' },
        { id: 'A2', status: 'available' },
        { id: 'A3', status: 'available' },
        { id: 'A4', status: 'available' },
        { id: 'A5', status: 'sold' },
        { id: 'A6', status: 'available' },
        { id: 'A7', status: 'available' },
        { id: 'A8', status: 'available' },
        { id: 'B1', status: 'available' },
        { id: 'B2', status: 'available' },
        { id: 'B3', status: 'sold' },
        { id: 'B4', status: 'sold' },
        { id: 'B5', status: 'available' },
        { id: 'B6', status: 'available' },
        { id: 'B7', status: 'available' },
        { id: 'B8', status: 'available' },
        { id: 'C1', status: 'available' },
        { id: 'C2', status: 'available' },
        { id: 'C3', status: 'available' },
        { id: 'C4', status: 'available' },
        { id: 'C5', status: 'available' },
        { id: 'C6', status: 'available' },
        { id: 'C7', status: 'sold' },
        { id: 'C8', status: 'available' },
        { id: 'D1', status: 'available' },
        { id: 'D2', status: 'available' },
        { id: 'D3', status: 'available' },
        { id: 'D4', status: 'available' },
        { id: 'D5', status: 'available' },
        { id: 'D6', status: 'available' },
        { id: 'D7', status: 'available' },
        { id: 'D8', status: 'available' }
    ];
    
    function renderSeats() {
        seatGrid.innerHTML = '';
        seatData.forEach(seat => {
            const seatElement = document.createElement('div');
            seatElement.className = `seat ${seat.status}`;
            seatElement.textContent = seat.id;
            seatElement.dataset.id = seat.id;
            seatElement.dataset.status = seat.status;
            
            if (selectedSeats.has(seat.id)) {
                seatElement.classList.add('selected');
                seatElement.dataset.status = 'selected';
            }
            
            if (seat.status === 'available' || selectedSeats.has(seat.id)) {
                seatElement.addEventListener('click', handleSeatClick);
            }
            
            seatGrid.appendChild(seatElement);
        });
    }
    
    function handleSeatClick(event) {
        const seatId = event.target.dataset.id;
        const currentStatus = event.target.dataset.status;
        
        if (currentStatus === 'sold') return;
        
        if (selectedSeats.has(seatId)) {
            selectedSeats.delete(seatId);
            event.target.classList.remove('selected');
            event.target.dataset.status = 'available';
        } else {
            selectedSeats.add(seatId);
            event.target.classList.add('selected');
            event.target.dataset.status = 'selected';
        }
        
        updateSelection();
    }
    
    function updateSelection() {
        const seatCount = selectedSeats.size;
        const totalPrice = seatCount * moviePrice;
        
        selectedSeatsList.textContent = seatCount > 0 ? Array.from(selectedSeats).join(', ') : 'No seats selected';
        totalSeatsElement.textContent = seatCount;
        totalPriceElement.textContent = `Rupees${totalPrice}`;
        
        currentSeatsElement.textContent = seatCount;
        currentPriceElement.textContent = `${moviePrice} Rupees`;
        currentTotalElement.textContent = `${totalPrice} Rupees`;
        
        if (selectedMovie && seatCount > 0) {
            confirmBtn.disabled = false;
        } else {
            confirmBtn.disabled = true;
        }
    }
    
    function setupMovieSelection() {
        const movieButtons = document.querySelectorAll('.select-movie');
        
        movieButtons.forEach(button => {
            button.addEventListener('click', function() {
                const movieCard = this.closest('.movie-card');
                const movieTitle = movieCard.dataset.movie;
                const price = parseInt(movieCard.dataset.price);
                
                selectedMovie = movieTitle;
                moviePrice = price;
                
                selectedMovieElement.textContent = movieTitle;
                selectedPriceElement.textContent = `Price per ticket: ${price} Rupees`;
                
                currentMovieElement.textContent = movieTitle;
                currentPriceElement.textContent = `${price} Rupees`;
                currentTotalElement.textContent = `${totalPrice} Rupees`;
                
                movieButtons.forEach(btn => {
                    btn.textContent = 'Select';
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-primary');
                });
                
                this.textContent = 'Selected';
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
                
                updateSelection();
            });
        });
    }
    
    function setupConfirmButton() {
        confirmBtn.addEventListener('click', function() {
            if (!selectedMovie || selectedSeats.size === 0) return;
            
            const seatList = Array.from(selectedSeats).join(', ');
            const total = selectedSeats.size * moviePrice;
            
            alert(`Booking Confirmed!\n\nMovie: ${selectedMovie}\nSeats: ${seatList}\nTotal Price: ${total} Rupees\n\nThank you for your booking!`);
            
            selectedSeats.forEach(seatId => {
                const seatIndex = seatData.findIndex(s => s.id === seatId);
                if (seatIndex !== -1) {
                    seatData[seatIndex].status = 'sold';
                }
            });
            
            selectedSeats.clear();
            renderSeats();
            updateSelection();
        });
    }
    
    function initialize() {
        renderSeats();
        setupMovieSelection();
        setupConfirmButton();
        
        const firstMovieBtn = document.querySelector('.select-movie');
        if (firstMovieBtn) {
            firstMovieBtn.click();
        }
    }
    
    initialize();
});