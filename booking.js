/**
 * This file holds client-side booking functionality to validate and post a booking request.
 * Author: Olaf Wrieden
 */

/**
 * Creates a new booking request.
 */
function createBooking() {
  const request = new XMLHttpRequest();

  // Extract Values
  const customerName = document.getElementById("customer_name").value;
  const contactNumber = document.getElementById("contact_number").value;
  const unitNumber = document.getElementById("unit_number").value;
  const streetNumber = document.getElementById("street_number").value;
  const streetName = document.getElementById("street_name").value;
  const suburb = document.getElementById("suburb").value;
  const destinationSuburb = document.getElementById("destination_suburb").value;
  const pickupDate = document.getElementById("pickup_date").value;
  const pickupTime = document.getElementById("pickup_time").value;

  // Check if valid pickup
  let pickup = new Date(pickupDate);
  pickup.setHours(pickupTime.substring(0, 2), pickupTime.substring(3));

  // Return if invalid date
  if (!isValidDate(pickup)) return false;

  // Format DateTime String
  let formattedDate =
    pickup.getFullYear() +
    "-" +
    prependZeros(pickup.getMonth() + 1) +
    "-" +
    prependZeros(pickup.getDate()) +
    " " +
    prependZeros(pickup.getHours()) +
    ":" +
    prependZeros(pickup.getMinutes()) +
    ":" +
    prependZeros(pickup.getSeconds());

  // Create request body
  const body = `customer_name=${encodeURIComponent(
    customerName
  )}&contact_number=${encodeURIComponent(
    contactNumber
  )}&unit_number=${encodeURIComponent(
    unitNumber
  )}&street_number=${encodeURIComponent(
    streetNumber
  )}&street_name=${encodeURIComponent(streetName)}&suburb=${encodeURIComponent(
    suburb
  )}&destination_suburb=${encodeURIComponent(
    destinationSuburb
  )}&pickup=${encodeURIComponent(formattedDate)}`;

  // Create New Booking
  request.open("POST", "./booking.php");
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.responseText);
      if (response.success === true) {
        alert(
          `Thank you! Your booking reference number is ${response.message}. You will be picked up in front of your provided address at ${pickupTime} on ${pickupDate}.`
        );
        window.location.reload(false);
      } else {
        alert("There was an error booking your ride. Please try again.");
      }
    }
  };
  request.send(body);
}

/**
 * Compares the input date to `new Date()` to check if it is in the future.
 * @param {Date} date a date to compare against
 * @returns true if input date is in the future, else false
 */
function isValidDate(date) {
  let today = new Date();
  let notification = document.getElementById("submissionError");

  if (today > date) {
    notification.innerHTML = "Oops! Please enter a pickup date in the future.";
    notification.classList.remove("is-hidden");
    return false;
  } else {
    notification.innerHTML = "";
    notification.classList.add("is-hidden");
    return true;
  }
}

/**
 * Adds leading 0s to the input number
 * @param {Number} n a number to prepend 0s to
 */
function prependZeros(n) {
  if (n <= 9) {
    return "0" + n;
  }
  return n;
}
