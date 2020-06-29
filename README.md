# CabsOnline Taxi Bookings (Web Development Assignment 2)

> A Taxi Booking System with HTML, PHP, MySQL and AJAX

Overall, this assignment received full (40/40) marks as it met all required criteria.

## Actors

- **Passenger:** Book a Taxi
- **Admin:** View Bookings, Assign a Taxi

## Application Flow

### Booking Flow

A passenger shall be able to book a taxi in Auckland and surrounding areas.
They specify:

- Customer Name
- Contact Phone
- Pick-up address (unit number if applicable, street number, street name, and suburb)
- Destination suburb
- Pick-up date/time

We must then generate a unique booking reference number, booking date/time (i.e. the date/time the booking is made) and status with initial value "unassigned" for the request.
Then add the request in a MySQL database.

Once stored, the customer must be presented with the message:

> Thank you! Your booking reference number is [bookingRefNo]. You will be picked up in front of your provided address at [pickupTime] on [pickupDate].

### Admin Flow

- An admin shall be able to view taxi bookings in a table.
- An admin shall be able to assign a taxi to a particular booking.

Admin clicks a button to "Show Pick-up Requests" (within 2 hours from now only).
Enters booking reference into text box and presses "Assign Taxi".

Upon successfully assigning a taxi, the admin is presented with the message:

> The booking request [bookingRefNumber] has been properly assigned

## Out of Scope

- Authentication
- Number of Passengers, Car Type, Building Type etc.
- Address Validation
