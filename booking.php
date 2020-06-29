<?php

/**
 * This script listens for standard GET / POST / PATCH HTTP Requests
 * to call the appropriate booking functionality.
 * Author: Olaf Wrieden
 */

require_once('./settings.php');
require_once("./helpers.php");

date_default_timezone_set("Pacific/Auckland");

// Establish Database Connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
} else {
  switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
      // Retrieve Upcoming Unassigned Bookings
      echo getBookings($conn);
      break;

    case 'POST':
      // Extract Form Data
      $customer_name = trim($_POST["customer_name"]);
      $contact_number = trim($_POST["contact_number"]);
      $unit_number = trim($_POST["unit_number"]);
      $street_number = trim($_POST["street_number"]);
      $street_name = trim($_POST["street_name"]);
      $suburb = trim($_POST["suburb"]);
      $destination_suburb = trim($_POST["destination_suburb"]);
      $pickup = trim($_POST["pickup"]);

      // Generate Time-Seeded Reference #
      $reference = time() . rand(10 * 45, 100 * 98);

      // Format Pickup Time/Date for MySQL DATETIME
      $pickup = date('Y-m-d H:i:s', strtotime(str_replace('/', '-', $pickup)));

      // Check if reference is unique (should be as it's time-based)
      if (isUniqueReference($conn, $reference) === false) {
        echo json_encode(["message"=>"The the reference number '" . $reference . "' is not unique.","success"=>false]);
      } else {
        // Store the new Booking
        if (insertData(
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
        )) {
          echo json_encode(["message"=>$reference,"success"=>true]);
        } else {
          echo json_encode(["message" => "Oops, the booking could not be saved at this time.","success" => false]);
        }
      }
      break;

    case 'PATCH':
      // Retrive Booking Reference
      parse_str(file_get_contents('php://input'), $_PATCH);
      $reference = $_PATCH["reference"];

      // Check if reference was supplied
      if (!isset($reference)) {
        echo json_encode(["message" => "A reference number is required.","success" => false]);
      } else {
        // Assign Booking
        echo assignBooking($conn, $reference);
      }
      break;

    default:
      // Invalid HTTP Method
      echo json_encode(["message" => "Invalid HTTP Method.","success" => false]);
      break;
  }
}

$conn->close();
