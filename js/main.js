/**
 * Jnanesh Sharma H. — Personal Website JavaScript
 * jQuery & Vanilla JS Interactivity
 */

$(document).ready(function () {
  'use strict';

  /* ==========================================================================
     1. Active Navigation State Highlighting
     ========================================================================== */
  function highlightActiveNav() {
    var path = window.location.pathname;
    var page = path.split('/').pop();

    if (!page || page === '' || page === 'portfolio' || page === 'web-lab-assignment') {
      page = 'index.html';
    }

    $('.topbar-nav a').each(function () {
      var href = $(this).attr('href');
      if (href) {
        var linkPage = href.split('/').pop();
        if (linkPage === page) {
          $(this).addClass('active').attr('aria-current', 'page');
        } else {
          $(this).removeClass('active').removeAttr('aria-current');
        }
      }
    });
  }

  highlightActiveNav();

  /* ==========================================================================
     2. Category Filter Pills (resume.html top toolbar)
     Smooth jQuery fade transitions
     ========================================================================== */
  $('.filter-pill').on('click', function () {
    var $btn = $(this);
    var filterValue = $btn.attr('data-filter');

    // Update active class
    $('.filter-pill').removeClass('active').attr('aria-pressed', 'false');
    $btn.addClass('active').attr('aria-pressed', 'true');

    var $entries = $('.paper-sheet .entry[data-category]');

    if (filterValue === 'all') {
      $entries.stop(true, true).fadeIn(200);
    } else {
      $entries.each(function () {
        var $entry = $(this);
        var categories = ($entry.attr('data-category') || '').split(' ');
        if (categories.indexOf(filterValue) !== -1) {
          $entry.stop(true, true).fadeIn(200);
        } else {
          $entry.stop(true, true).fadeOut(150);
        }
      });
    }
  });

  /* ==========================================================================
     3. Print / Save PDF Handler
     ========================================================================== */
  $('.btn-print').on('click', function (e) {
    e.preventDefault();
    // Reveal all entries before printing to ensure complete document
    $('.paper-sheet .entry').show();
    $('.filter-pill').removeClass('active');
    $('.filter-pill[data-filter="all"]').addClass('active');
    window.print();
  });

  /* ==========================================================================
     4. Paper Zoom Toggle (100% / Fit Width)
     ========================================================================== */
  $('.btn-zoom').on('click', function (e) {
    e.preventDefault();
    var $sheet = $('.paper-sheet');
    var $btn = $(this);

    if ($sheet.hasClass('fit-width')) {
      $sheet.removeClass('fit-width');
      $btn.text('Fit Width');
    } else {
      $sheet.addClass('fit-width');
      $btn.text('100% View');
    }
  });

  /* ==========================================================================
     5. Date Formatter for Bio-Data Declaration
     ========================================================================== */
  var $dateEl = $('#declaration-date');
  if ($dateEl.length) {
    var today = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    $dateEl.text(today.toLocaleDateString('en-US', options));
  }
});
