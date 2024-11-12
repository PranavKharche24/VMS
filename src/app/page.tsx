'use client'

import { useState, useEffect } from 'react'
import { PlusCircle, List, Home, Phone, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function VehicleManagementSystem() {
  const [activeTab, setActiveTab] = useState('home')
  interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    date: string;
    carNumber: string;
    rtoNumber: string;
    userName: string;
  }

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [searchVehicleNumber, setSearchVehicleNumber] = useState('')
  // const { toast } = useToast()

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      if (!searchVehicleNumber) {
        const vehicleNumber = prompt("Enter the vehicle number to search:")
        if (!vehicleNumber) {
          setLoading(false)
          return
        }
        setSearchVehicleNumber(vehicleNumber)
      }

      const vehiclesRef = collection(db, "vehicles")
      const q = query(vehiclesRef, where("carNumber", "==", searchVehicleNumber))
      const querySnapshot = await getDocs(q)
      
      const vehicleData = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          make: data.make,
          model: data.model,
          year: data.year,
          date: data.date,
          carNumber: data.carNumber,
          rtoNumber: data.rtoNumber,
          userName: data.userName
        }
      })
      setVehicles(vehicleData)
    } catch (error) {
      console.error("Error fetching vehicles: ", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch vehicles. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const newVehicle = {
      make: formData.get('make') as string,
      model: formData.get('model') as string,
      year: parseInt(formData.get('year') as string),
      date: new Date().toISOString(), // Use current date
      carNumber: formData.get('carNumber') as string,
      rtoNumber: formData.get('rtoNumber') as string,
      userName: formData.get('userName') as string,
    }

    try {
      await addDoc(collection(db, "vehicles"), newVehicle)
      // toast({
      //   title: "Success",
      //   description: "Vehicle added successfully!",
      // })
      form.reset()
      fetchVehicles()
    } catch (error) {
      console.error("Error adding vehicle: ", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to add vehicle. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 dark:text-white transition-colors duration-500 min-h-screen">
        <header className="bg-gray-100 dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold animate-fade-in">Vehicle Management System</h1>
              <nav className="flex space-x-4">
                <Button variant="ghost" onClick={() => setActiveTab('home')} className={`transition-all duration-300 ease-in-out ${activeTab === 'home' ? 'scale-110' : ''}`}><Home className="mr-2 h-4 w-4" />Home</Button>
                <Button variant="ghost" onClick={() => setActiveTab('add')} className={`transition-all duration-300 ease-in-out ${activeTab === 'add' ? 'scale-110' : ''}`}><PlusCircle className="mr-2 h-4 w-4" />Add Vehicle</Button>
                <Button variant="ghost" onClick={() => setActiveTab('view')} className={`transition-all duration-300 ease-in-out ${activeTab === 'view' ? 'scale-110' : ''}`}><List className="mr-2 h-4 w-4" />View Vehicles</Button>
                <Button variant="ghost" onClick={() => setActiveTab('contact')} className={`transition-all duration-300 ease-in-out ${activeTab === 'contact' ? 'scale-110' : ''}`}><Phone className="mr-2 h-4 w-4" />Contact</Button>
                <Button variant="ghost" onClick={() => setDarkMode(!darkMode)} className="transition-all duration-300 ease-in-out hover:rotate-180">
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {activeTab === 'home' && (
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Welcome to the Vehicle Management System</CardTitle>
                <CardDescription>Manage your vehicles efficiently and effectively with our state-of-the-art system.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
                    <h3 className="text-lg font-semibold mb-2">Efficient Management</h3>
                    <p>Streamline your vehicle inventory with ease.</p>
                  </div>
                  <div className="p-4 border rounded-lg dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
                    <h3 className="text-lg font-semibold mb-2">Insightful Analytics</h3>
                    <p>Gain valuable insights into your vehicle fleet.</p>
                  </div>
                  <div className="p-4 border rounded-lg dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
                    <h3 className="text-lg font-semibold mb-2">Secure Data</h3>
                    <p>Your vehicle information is safe with us.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'add' && (
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Add a New Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
                      <Label htmlFor="make">Make</Label>
                      <Input id="make" name="make" required />
                    </div>
                    <div className="transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
                      <Label htmlFor="model">Model</Label>
                      <Input id="model" name="model" required />
                    </div>
                    <div className="transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
                      <Label htmlFor="year">Year</Label>
                      <Input id="year" name="year" type="number" required />
                    </div>
                    <div className="transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" name="date" type="date" required />
                    </div>
                    <div className="transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
                      <Label htmlFor="carNumber">Car Number</Label>
                      <Input id="carNumber" name="carNumber" required />
                    </div>
                    <div className="transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
                      <Label htmlFor="rtoNumber">RTO Registration Number</Label>
                      <Input id="rtoNumber" name="rtoNumber" required />
                    </div>
                    <div className="transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
                      <Label htmlFor="userName">User Name</Label>
                      <Input id="userName" name="userName" required />
                    </div>
                  </div>
                  <Button type="submit" className="transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">Add Vehicle</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'view' && (
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>View Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => {
                    setSearchVehicleNumber('')
                    fetchVehicles()
                  }} 
                  disabled={loading} 
                  className="mb-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
                >
                  Refresh Vehicle List
                </Button>
                {loading ? (
                  <p className="animate-pulse">Loading vehicles...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Make</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Car Number</TableHead>
                          <TableHead>RTO Number</TableHead>
                          <TableHead>User Name</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehicles.map((vehicle, index) => (
                          <TableRow key={vehicle.id} className={`transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 animate-fade-in`} style={{animationDelay: `${index * 50}ms`}}>
                            <TableCell>{vehicle.make}</TableCell>
                            <TableCell>{vehicle.model}</TableCell>
                            <TableCell>{vehicle.year}</TableCell>
                            <TableCell>{vehicle.date}</TableCell>
                            <TableCell>{vehicle.carNumber}</TableCell>
                            <TableCell>{vehicle.rtoNumber}</TableCell>
                            <TableCell>{vehicle.userName}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'contact' && (
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>If you have any questions or concerns, please don't hesitate to reach out.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="transition-all duration-300 ease-in-out hover:translate-x-2"><strong>Email:</strong> support@vehiclemanagement.com</p>
                  <p className="transition-all duration-300 ease-in-out hover:translate-x-2"><strong>Phone:</strong> (555) 123-4567</p>
                  <p className="transition-all duration-300 ease-in-out hover:translate-x-2"><strong>Address:</strong> 123 Vehicle Street, Autoville, CA 90210</p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 mt-8 py-4 transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2023 Vehicle Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}