function initAutocomplete() {
  var addressInput = document.getElementById("fullAddress");
  var autocomplete = new google.maps.places.Autocomplete(addressInput, {
    types: ["geocode"], // only addresses
    componentRestrictions: { country: "ca" }, // optional
  });

  autocomplete.addListener("place_changed", function () {
    var place = autocomplete.getPlace();
    console.log("Selected address:", place.formatted_address);
  });
}
function updateStep(step) {
  $(".form-step").removeClass("active");
  $(`.form-step[data-step="${step}"]`).addClass("active");

  $(".step").removeClass("active");
  $(`.step[data-step="${step}"]`).addClass("active");

  $(".step").each(function () {
    let stepNum = $(this).data("step");
    if (stepNum < step) {
      $(this).addClass("completed");
    } else {
      $(this).removeClass("completed");
    }
  });
}
function validateStep(step) {
  let isValid = true;
  $(
    `.form-step[data-step="${step}"] input, .form-step[data-step="${step}"] select`
  ).each(function () {
    let field = $(this);
    let errorDiv = $(`#error-${field.attr("id")}`);
    errorDiv.text("");
    if (
      field.attr("type") !== "text" ||
      field.attr("type") !== "number" ||
      field.is("select")
    ) {
      if (!field.val()) {
        errorDiv.text("This field is required");
        isValid = false;
      }
    }
  });
  return isValid;
}
$(document).ready(function () {
  initAutocomplete();
  let currentStep = 1;
  const totalSteps = $(".form-step").length;

  $(".next-btn").click(function () {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStep(currentStep);
      }
    }
  });

  $(".prev-btn").click(function () {
    if (currentStep > 1) {
      currentStep--;
      updateStep(currentStep);
    }
  });

  $(".step").click(function () {
    let stepClicked = $(this).data("step");
    if (stepClicked <= currentStep) {
      // allow going back only
      currentStep = stepClicked;
      updateStep(currentStep);
    }
  });

  $("#submitForm").click(function () {
    if (validateStep(currentStep)) {
      const formData = {
        fullAddress: $("#fullAddress").val(),
        projectType: $("#projectType").val(),
        propertySize: Number($("#propertySize").val()),
        scopeOfWork: $("#scopeOfWork").val(),
        timelineNeeded: $("#timelineNeeded").val(),
        fullName: $("#fullName").val(),
        email: $("#email").val(),
        phoneNumber: $("#phoneNumber").val(),
      };
      $.ajax({
        url: "api/quote",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (res) {
          const data = res.data;
          $("#finalQuote").html(
            `"Final Quote:" <span>$${data.finalQuote.toLocaleString()}</span>`
          );
          $("#breakdown")
            .html(`<div><span>Base Price:</span> $${data.breakdown.basePrice.toLocaleString()}</div>
          <div><span>Size Addon (If Any):</span>  $${data.breakdown.sizeAddon.toLocaleString()}</div>
          <div><span>Scope Increase (If Any):</span> $${data.breakdown.scopeIncrease.toLocaleString()}</div>
          <div><span>Location Increase (If Any):</span> $${data.breakdown.locationIncrease.toLocaleString()}</div>
          <div><span>Rush Fee (If Any):</span> $${
            data.breakdown.rushFee
          }</div>`);
          $("#referenceNumber").html(
            `Reference #: <strong>${data.referenceNumber}</strong>`
          );
          $("#thankYouMessage").text(data.message);
          if (currentStep < totalSteps) {
            currentStep++;
            updateStep(currentStep);
          }
        },
        error: function () {
          alert("Error calculating quote");
        },
      });
    }
  });

  updateStep(currentStep);
});
