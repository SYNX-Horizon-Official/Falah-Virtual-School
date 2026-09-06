(function () {
  "use strict";

  
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

 
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  
  window.addEventListener("load", function () {
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }, 3500);
  });

 
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? "0 12px 30px -20px rgba(0,0,0,0.5)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }


  function setError(field, message) {
    field.classList.add("has-error");
    var small = field.querySelector(".error-text");
    if (small) small.textContent = message;
  }
  function clearError(field) {
    field.classList.remove("has-error");
  }

  function validateForm(form) {
    var valid = true;
    var fields = form.querySelectorAll("[data-field]");
    fields.forEach(function (field) {
      var input = field.querySelector("input, select, textarea");
      if (!input) return;
      clearError(field);

      if (input.hasAttribute("required") && !input.value.trim()) {
        setError(field, "This field is required.");
        valid = false;
        return;
      }
      if (input.type === "email" && input.value.trim()) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(input.value.trim())) {
          setError(field, "Enter a valid email address.");
          valid = false;
        }
      }
      if (input.type === "tel" && input.value.trim()) {
        var digits = input.value.replace(/[^0-9]/g, "");
        if (digits.length < 7) {
          setError(field, "Enter a valid phone number.");
          valid = false;
        }
      }
    });
    return valid;
  }

  function initForm(formId, sentMarker) {
    var form = document.getElementById(formId);
    if (!form) return;

    var submitBtn = form.querySelector("[data-submit]");
    var statusBox = form.querySelector(".form-status");
    var nextField = form.querySelector("[data-next-field]");

    
    if (nextField) {
      var returnUrl = window.location.origin + window.location.pathname + "?sent=" + sentMarker;
      nextField.value = returnUrl;
    }

    
    var params = new URLSearchParams(window.location.search);
    if (params.get("sent") === sentMarker) {
      statusBox.textContent =
        form.getAttribute("data-success-message") ||
        "Thank you — your message has been received. We will get back to you as soon as possible.";
      statusBox.classList.add("show", "success");
      window.history.replaceState({}, "", window.location.pathname);
    }

    form.addEventListener("submit", function (e) {
     
      var honeypot = form.querySelector('input[name="_honey"]');
      if (honeypot && honeypot.value) {
        e.preventDefault();
        return; 
      }

      if (!validateForm(form)) {
        e.preventDefault();
        statusBox.classList.remove("show", "success");
        statusBox.textContent = "Please fix the highlighted fields and try again.";
        statusBox.classList.add("show", "error");
        return;
      }

      
      statusBox.classList.remove("show", "error", "success");
      submitBtn.classList.add("btn-loading");
      submitBtn.setAttribute("disabled", "true");
    });
  }

  initForm("contact-form", "contact");
  initForm("admissions-form", "admission");
})();
