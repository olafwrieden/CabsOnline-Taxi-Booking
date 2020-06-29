/**
 * This script is responsible for the opening and closing of the navbar.
 * Author: Olaf Wrieden
 * Source: https://siongui.github.io/2018/01/17/bulma-responsive-navbar-with-javascript/
 */

"use strict";

/** Adds a DOM listener to the page */
document.addEventListener("DOMContentLoaded", function () {
  // Dropdowns in navbar
  let $dropdowns = getAll(".navbar-item.has-dropdown:not(.is-hoverable)");

  if ($dropdowns.length > 0) {
    $dropdowns.forEach(function ($el) {
      $el.addEventListener("click", function (event) {
        event.stopPropagation();
        $el.classList.toggle("is-active");
      });
    });

    // Listen for onClick events
    document.addEventListener("click", function (event) {
      closeDropdowns();
    });
  }

  /**
   * Removes the active state of the navbar
   */
  function closeDropdowns() {
    $dropdowns.forEach(function ($el) {
      $el.classList.remove("is-active");
    });
  }

  // Close dropdowns if ESC pressed
  document.addEventListener("keydown", function (event) {
    let e = event || window.event;
    if (e.keyCode === 27) {
      closeDropdowns();
    }
  });

  // Toggles
  let $burgers = getAll(".burger");

  if ($burgers.length > 0) {
    $burgers.forEach(function ($el) {
      $el.addEventListener("click", function () {
        let target = $el.dataset.target;
        let $target = document.getElementById(target);
        $el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }

  // Functions
  function getAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
  }
});
