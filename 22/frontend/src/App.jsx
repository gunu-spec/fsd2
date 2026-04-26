import { useState, useEffect } from 'react'

function App() {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({
    vehicleType: 'Car',
    make: '',
    model: '',
    year: '',
    price: '',
    description: ''
  })

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/vehicles')
      const data = await res.json()
      setVehicles(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        const newVehicle = await res.json()
        setVehicles([newVehicle, ...vehicles])
        setForm({
          vehicleType: 'Car',
          make: '',
          model: '',
          year: '',
          price: '',
          description: ''
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Used Vehicles Portal</h1>
          <p className="text-gray-600 mt-2">Browse and list pre-owned cars and bikes</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">List a Vehicle</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select name="vehicleType" value={form.vehicleType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input type="text" name="make" value={form.make} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g., Honda, Toyota" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input type="text" name="model" value={form.model} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g., Civic, Camry" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input type="number" name="year" value={form.year} onChange={handleChange} required min="1900" max="2026" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="2020" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rupees)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="15000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Condition, features, mileage..."></textarea>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300">Submit Listing</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Vehicles ({vehicles.length})</h2>
              <p className="text-gray-600">Browse our curated selection of quality used vehicles</p>
            </div>
            {vehicles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow">
                <p className="text-gray-500 text-lg">No vehicles listed yet. Be the first to add one!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className={`p-1 Rupees{vehicle.vehicleType === 'Car' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      <div className="flex justify-between items-center px-4 py-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold Rupees{vehicle.vehicleType === 'Car' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                          {vehicle.vehicleType}
                        </span>
                        <span className="text-2xl font-bold text-gray-900">₹{vehicle.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900">{vehicle.make} {vehicle.model}</h3>
                      <p className="text-gray-600 mt-1">Year: {vehicle.year}</p>
                      <p className="text-gray-700 mt-4 line-clamp-3">{vehicle.description}</p>
                      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Listed by</p>
                          <p className="font-medium">Seller</p>
                        </div>
                        <button className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition">View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg">made by Atharva Zope(123B1D067)</p>
          <p className="text-gray-400 text-sm mt-2">Used Vehicles Portal &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}

export default App