"use client"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeOrders, setActiveOrders] = useState([
    {
      id: 1,
      customer: "Acme Inc.",
      product: "Widget",
      quantity: 100,
      price: 10.99,
      status: "Active",
      createdAt: "2023-06-01",
    },
    {
      id: 2,
      customer: "Globex Corp.",
      product: "Gadget",
      quantity: 50,
      price: 15.99,
      status: "Active",
      createdAt: "2023-05-15",
    },
    {
      id: 3,
      customer: "Stark Industries",
      product: "Doohickey",
      quantity: 75,
      price: 12.99,
      status: "Active",
      createdAt: "2023-04-30",
    },
  ])
  const [completedOrders, setCompletedOrders] = useState([
    {
      id: 4,
      customer: "Wayne Enterprises",
      product: "Thingamajig",
      quantity: 25,
      price: 20.99,
      status: "Completed",
      createdAt: "2023-03-01",
    },
    {
      id: 5,
      customer: "Stark Industries",
      product: "Whatchamacallit",
      quantity: 30,
      price: 18.99,
      status: "Completed",
      createdAt: "2023-02-15",
    },
  ])
  const [newOrder, setNewOrder] = useState({
    id: 0,
    customer: "",
    product: "",
    quantity: 0,
    price: 0,
    status: "Active",
    createdAt: "",
  })
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    setIsLoggedIn(!!storedToken)
    const storedTheme = localStorage.getItem("theme")
    setIsDarkMode(storedTheme === "dark")
  }, [])
  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark"
    setIsDarkMode(newTheme === "dark")
    localStorage.setItem("theme", newTheme)
  }
  const handleLogin = (username, password) => {
    if (username === "admin" && password === "password") {
      localStorage.setItem("authToken", "valid_token")
      setIsLoggedIn(true)
    } else {
      alert("Invalid username or password")
    }
  }
  const handleNewOrder = (order) => {
    if (order.id === 0) {
      const newOrder = {
        id: activeOrders.length + 1,
        customer: order.customer,
        product: order.product,
        quantity: order.quantity,
        price: order.price,
        status: "Active",
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setActiveOrders([...activeOrders, newOrder])
    } else {
      const updatedActiveOrders = activeOrders.map((o) => (o.id === order.id ? order : o))
      setActiveOrders(updatedActiveOrders)
      const updatedCompletedOrders = completedOrders.map((o) => (o.id === order.id ? order : o))
      setCompletedOrders(updatedCompletedOrders)
    }
    setShowNewOrderModal(false)
  }
  const handleOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowOrderDetailsModal(true)
  }
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6 w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleLogin("admin", "password")
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="admin" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="password" />
              </div>
              <Button type="submit">Sign In</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div
      className={`flex flex-col min-h-screen ${
        isDarkMode ? "dark bg-gray-950 text-gray-50" : "bg-white text-gray-900"
      }`}
    >
      <header className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 shadow-md">
        <div className="flex items-center gap-4">
          <Link href="#" className="text-xl font-bold" prefetch={false}>
            Sale Order Management
          </Link>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead className="w-[200px]">Customer</TableHead>
                      <TableHead className="w-[200px]">Product</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                      <TableHead className="w-[100px]">Price</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[150px]">Created At</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>${order.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "Active"
                                ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                                : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                            }`}
                          >
                            {order.status}
                          </div>
                        </TableCell>
                        <TableCell>{order.createdAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoveHorizontalIcon className="w-4 h-4" />
                                <span className="sr-only">Order actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOrderDetails(order)}>
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead className="w-[200px]">Customer</TableHead>
                      <TableHead className="w-[200px]">Product</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                      <TableHead className="w-[100px]">Price</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[150px]">Created At</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>${order.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                                : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                            }`}
                          >
                            {order.status}
                          </div>
                        </TableCell>
                        <TableCell>{order.createdAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoveHorizontalIcon className="w-4 h-4" />
                                <span className="sr-only">Order actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOrderDetails(order)}>
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNewOrderModal(true)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="sr-only">New Order</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className={`${
              isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-50" : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            <span className="sr-only">Toggle Dark Mode</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Dialog open={showNewOrderModal} onOpenChange={setShowNewOrderModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{newOrder.id === 0 ? "Create New Order" : "Edit Order"}</DialogTitle>
              <DialogDescription>
                Fill in the details for the {newOrder.id === 0 ? "new" : "updated"}
                sale order.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleNewOrder(newOrder)
              }}
              className="grid gap-4 py-4"
            >
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="customer" className="text-right">
                  Customer
                </Label>
                <Input
                  id="customer"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="product" className="text-right">
                  Product
                </Label>
                <Input
                  id="product"
                  value={newOrder.product}
                  onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newOrder.price}
                  onChange={(e) => setNewOrder({ ...newOrder, price: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  {newOrder.id === 0 ? "Create Order" : "Update Order"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={showOrderDetailsModal} onOpenChange={setShowOrderDetailsModal}>
          <DialogContent className="sm:max-w-[425px]" />
        </Dialog>
      </main>
    </div>
  )
}

function MoonIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}


function MoveHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  )
}


function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function SunIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}