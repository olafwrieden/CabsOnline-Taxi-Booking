<?php

/**
 * This file contains essential helper functions to aid
 * CabsOnline booking and verification capabilities.
 * Author: Olaf Wrieden
 */

require_once('./settings.php');

/**
 * Checks that a given reference number is unique.
 * @return bool `true` if unique, else `false`
 */
function isUniqueReference($conn, $reference)
{
  $sql = "SELECT * FROM `bookings` WHERE `reference` = '$reference'";
  return $conn->query($sql)->num_rows === 0;
}

/**
 * Inserts booking data into the database.
 * @return bool status of record insertion
 */
function insertData(
  $conn,
  $customer_name,
  $contact_number,
  $unit_number,
  $street_number,
  $street_name,
  $suburb,
  $destination_suburb,
  $pickup,
  $reference
) {
  $sql = "INSERT INTO `bookings` (
    `customer_name`,
    `contact_phone`,
    `unit_number`,
    `street_number`,
    `street_name`,
    `suburb`,
    `destination_suburb`,
    `pickup`,
    `reference`
  ) VALUES (
    '$customer_name',
    '$contact_number',
    '$unit_number',
    '$street_number',
    '$street_name',
    '$suburb',
    '$destination_suburb',
    '$pickup',
    '$reference'
  )";

  return $conn->query($sql);
}

/**
 * Returns unassigned bookings due 2 hours from now
 */
function getBookings($conn)
{
  // Retrieve booking requests
  $sql = "SELECT * FROM `bookings` WHERE `status` = 'unassigned' AND (`pickup` <= NOW() + INTERVAL 2 HOUR AND `pickup` >= NOW())";
  $result = $conn->query($sql);

  // Format Result Set
  $future_bookings = [];
  if ($result->num_rows > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
      $future_bookings[] = $row;
    }
  }

  // Return response
  return json_encode($future_bookings);
}

/**
 * Assigns the specified booking by reference
 */
function assignBooking($conn, $reference)
{
  // Assign booking
  $sql = "UPDATE `bookings` SET `status` = 'assigned' WHERE `reference` = $reference";
  $result = $conn->query($sql);

  // Return response
  if ($result === true) {
    return json_encode(["message" => "Booking $reference assigned.", "success" => true]);
  }
  return json_encode(["message" => mysqli_error($conn), "success" => false]);
}
