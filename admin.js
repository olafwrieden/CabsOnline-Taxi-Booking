/**
 * This file holds client-side admin functionality to fetch and display booking data.
 * Author: Olaf Wrieden
 */

/**
 * Retrieves bookings from the server.
 */
function getBookings() {
  const request = new XMLHttpRequest();
  let bookings = [];

  // Request Bookings
  request.open("GET", "./booking.php");
  request.setRequestHeader("Content-Type", "application/json");
  request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status == 200) {
      bookings = JSON.parse(request.responseText);
      displayData(bookings);
    }
  };
  request.send();
}

/**
 * Formats bookings into table rows for display.
 * @param {Array} bookings Array of bookings
 */
function displayData(bookings) {
  const table = document.getElementById("table_body");
  table.innerHTML = "";

  // Show 'No Results' if no bookings exist
  if (bookings.length === 0) {
    const row = document.createElement("tr");
    row.appendChild(createColumn("No Bookings"));
    table.appendChild(row);
  } else {
    // Create a new table row for each booking
    bookings.forEach((booking) => {
      const row = document.createElement("tr");

      // Add Columns to Row
      row.appendChild(createColumn(booking.reference, true));
      row.appendChild(createColumn(booking.customer_name));
      row.appendChild(createColumn(booking.contact_phone));
      row.appendChild(
        createColumn(
          addressString(
            booking.unit_number,
            booking.street_number,
            booking.street_name,
            booking.suburb
          )
        )
      );
      row.appendChild(createColumn(booking.pickup));
      row.appendChild(createColumn(booking.destination_suburb));
      row.appendChild(createAssignButton(booking.reference));

      // Add Row to Table
      table.appendChild(row);
    });
  }
}

/**
 * Formats pickup details into one address string.
 * @param {String} unit Unit Number
 * @param {String} number Street Number
 * @param {String} street Street Name
 * @param {String} suburb Suburb Name
 */
function addressString(unit, number, street, suburb) {
  return `${unit ? `Unit ${unit},` : ""} ${number} ${street}, ${suburb}`.trim();
}

/**
 * Returms the structure of a column.
 * @param {String} field Text content
 * @param {Boolean} bold Print text in bold (default: false)
 */
function createColumn(field, bold = false) {
  const column = document.createElement(bold ? "th" : "td");
  column.appendChild(document.createTextNode(field));
  return column;
}

/**
 * Returns the structure of the 'Assign' button.
 * @param {String} reference The booking reference
 */
function createAssignButton(reference) {
  const column = document.createElement("td");
  const button = document.createElement("button");
  button.className = "button is-small is-outlined is-danger";
  button.innerHTML = "Assign";
  button.addEventListener("click", () => assignBooking(reference), false);
  column.appendChild(button);
  return column;
}

/**
 * Assigns the booking at the given reference.
 * @param {String} reference The booking reference
 */
function assignBooking(reference) {
  const request = new XMLHttpRequest();

  // Request Bookings
  request.open("PATCH", "./booking.php");
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status == 200) {
      const response = JSON.parse(request.responseText);
      if (response.success === true) {
        alert(`The booking request ${reference} has been properly assigned.`);
      }
      getBookings(); // Re-fetch Booking List
    }
  };
  request.send(`reference=${reference}`);
}
