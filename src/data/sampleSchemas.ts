export interface SampleSchema {
  id: string;
  name: string;
  category: string;
  schemaText: string;
  description: string;
}

export const SAMPLE_SCHEMAS: SampleSchema[] = [
  {
    id: 'orders',
    name: 'Orders & Sales',
    category: 'E-commerce',
    description: 'Order transactions, customer links, dates, and amounts',
    schemaText: `Table: Orders
OrderID (INT, PK)
CustomerID (INT, FK)
OrderDate (DATE)
Region (VARCHAR)
Amount (DECIMAL)
Status (VARCHAR) -- 'Completed', 'Pending', 'Cancelled'`
  },
  {
    id: 'employees',
    name: 'Employees & Salaries',
    category: 'HR',
    description: 'Employee info, departments, hire dates, and compensation',
    schemaText: `Table: Employees
EmpID (INT, PK)
FirstName (VARCHAR)
LastName (VARCHAR)
DepartmentID (INT)
Department (VARCHAR)
Salary (DECIMAL)
HireDate (DATE)
ManagerID (INT)`
  },
  {
    id: 'students',
    name: 'Students & Grades',
    category: 'Education',
    description: 'Student enrollments, courses, GPA, and test scores',
    schemaText: `Table: Students
StudentID (INT, PK)
StudentName (VARCHAR)
Major (VARCHAR)
EnrollmentYear (INT)
GPA (DECIMAL)
CourseID (VARCHAR)
GradeScore (INT)`
  },
  {
    id: 'products',
    name: 'Products Catalog',
    category: 'Inventory',
    description: 'Product catalog with pricing, category, and stock count',
    schemaText: `Table: Products
ProductID (INT, PK)
ProductName (VARCHAR)
Category (VARCHAR)
UnitPrice (DECIMAL)
StockQuantity (INT)
SupplierID (INT)
IsActive (BOOLEAN)`
  },
  {
    id: 'inventory',
    name: 'Inventory Warehouse',
    category: 'Logistics',
    description: 'Warehouse locations, stock levels, and reorder thresholds',
    schemaText: `Table: Inventory
ItemSKU (VARCHAR, PK)
WarehouseID (VARCHAR)
QuantityOnHand (INT)
ReorderPoint (INT)
LastRestockDate (DATE)
UnitCost (DECIMAL)`
  },
  {
    id: 'sales',
    name: 'Retail Sales Reps',
    category: 'Sales',
    description: 'Daily sales rep quotas, deals closed, and commission',
    schemaText: `Table: SalesReps
RepID (INT, PK)
RepName (VARCHAR)
Territory (VARCHAR)
Quarter (VARCHAR)
SalesTarget (DECIMAL)
ActualSales (DECIMAL)
CommissionRate (DECIMAL)`
  },
  {
    id: 'hr',
    name: 'HR Attendance & Time',
    category: 'HR',
    description: 'Employee time logs, overtime, leave days, and performance ratings',
    schemaText: `Table: Attendance
LogID (INT, PK)
EmpID (INT, FK)
LogDate (DATE)
HoursWorked (DECIMAL)
OvertimeHours (DECIMAL)
LeaveType (VARCHAR) -- 'Sick', 'Vacation', 'None'
PerformanceRating (INT)`
  },
  {
    id: 'library',
    name: 'Library Book Loans',
    category: 'Management',
    description: 'Book checkout history, due dates, genres, and late fees',
    schemaText: `Table: BookLoans
LoanID (INT, PK)
BookTitle (VARCHAR)
Author (VARCHAR)
Genre (VARCHAR)
BorrowerName (VARCHAR)
CheckoutDate (DATE)
DueDate (DATE)
ReturnDate (DATE)
LateFee (DECIMAL)`
  },
  {
    id: 'hospital',
    name: 'Hospital Patients & Admissions',
    category: 'Healthcare',
    description: 'Patient admissions, assigned doctors, wards, and treatment costs',
    schemaText: `Table: PatientAdmissions
AdmissionID (INT, PK)
PatientID (INT)
PatientName (VARCHAR)
AdmissionDate (DATE)
DischargeDate (DATE)
Diagnosis (VARCHAR)
AttendingDoctor (VARCHAR)
TotalBill (DECIMAL)`
  },
  {
    id: 'bank',
    name: 'Bank Accounts & Transactions',
    category: 'Finance',
    description: 'Customer bank accounts, transaction types, balances, and locations',
    schemaText: `Table: Transactions
TxnID (INT, PK)
AccountNo (VARCHAR)
TxnDate (TIMESTAMP)
TxnType (VARCHAR) -- 'Deposit', 'Withdrawal', 'Transfer'
Amount (DECIMAL)
BranchLocation (VARCHAR)
BalanceAfterTxn (DECIMAL)`
  },
  {
    id: 'college',
    name: 'College Courses & Faculty',
    category: 'Education',
    description: 'Courses, credits, professor names, and classroom capacity',
    schemaText: `Table: Courses
CourseCode (VARCHAR, PK)
CourseName (VARCHAR)
Department (VARCHAR)
Credits (INT)
ProfessorName (VARCHAR)
MaxCapacity (INT)
EnrolledCount (INT)`
  },
  {
    id: 'movies',
    name: 'Movies & Box Office',
    category: 'Entertainment',
    description: 'Film database with ratings, release year, budget, and revenue',
    schemaText: `Table: Movies
MovieID (INT, PK)
Title (VARCHAR)
Genre (VARCHAR)
ReleaseYear (INT)
Rating (DECIMAL) -- 1.0 to 10.0
BudgetUSD (DECIMAL)
BoxOfficeRevenueUSD (DECIMAL)
Director (VARCHAR)`
  },
  {
    id: 'flights',
    name: 'Flight Bookings',
    category: 'Travel',
    description: 'Flight schedules, airlines, ticket prices, and departure status',
    schemaText: `Table: Flights
FlightNumber (VARCHAR, PK)
Airline (VARCHAR)
OriginAirport (VARCHAR)
DestinationAirport (VARCHAR)
DepartureTime (TIMESTAMP)
TicketPrice (DECIMAL)
AvailableSeats (INT)
Status (VARCHAR) -- 'On Time', 'Delayed', 'Cancelled'`
  },
  {
    id: 'hotel',
    name: 'Hotel Reservations',
    category: 'Hospitality',
    description: 'Guest bookings, room types, nightly rates, and check-in dates',
    schemaText: `Table: HotelBookings
BookingID (INT, PK)
GuestName (VARCHAR)
RoomType (VARCHAR) -- 'Deluxe', 'Suite', 'Standard'
CheckInDate (DATE)
Nights (INT)
PricePerNight (DECIMAL)
IsPaid (BOOLEAN)`
  },
  {
    id: 'retail',
    name: 'Retail Store POS',
    category: 'E-commerce',
    description: 'Point-of-sale items, discount promo codes, and tax rates',
    schemaText: `Table: POS_Transactions
ReceiptID (INT, PK)
StoreLocation (VARCHAR)
ItemDescription (VARCHAR)
QuantitySold (INT)
UnitPrice (DECIMAL)
DiscountPercent (DECIMAL)
PaymentMethod (VARCHAR) -- 'Credit', 'Cash', 'ApplePay'`
  }
];
