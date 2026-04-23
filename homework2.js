/*
Program name: homework2.js
Author: YOUR NAME (UH Roster Name)
Date created: MM/DD/YYYY
Date last edited: MM/DD/YYYY
Version: 2.0
Description: External JavaScript file for CarePath Medical homework2.html.
             Contains all validation functions and the review form function.
*/

// =====================================================
// SET DATE LIMITS on the DOB field when page loads
// Min = 120 years ago, Max = today (no future dates)
// =====================================================
function setDateLimits() {
    var today = new Date();

    // Format today as YYYY-MM-DD for the max attribute
    var maxDate = today.toISOString().split('T')[0];

    // Calculate 120 years ago
    var minYear = today.getFullYear() - 120;
    var minDate = minYear + '-' + maxDate.substring(5);

    document.getElementById('dob').setAttribute('max', maxDate);
    document.getElementById('dob').setAttribute('min', minDate);
}

// =====================================================
// UPDATE SLIDER VALUE - shows the number next to bar
// =====================================================
function updateSlider(val) {
    document.getElementById('healthValue').innerHTML = val;
}

// =====================================================
// CHECK USER ID
// 5-30 chars, must start with a letter, no spaces,
// only letters numbers underscore and dash
// Convert to lowercase on blur
// =====================================================
function checkUserID() {
    var userid = document.getElementById('userid').value;
    var err = document.getElementById('err_userid');
    var pattern = /^[A-Za-z][A-Za-z0-9_\-]{4,29}$/;

    if (userid === '') {
        err.innerHTML = 'User ID is required.';
        return false;
    }
    if (!pattern.test(userid)) {
        err.innerHTML = 'User ID: 5-30 characters, must start with a letter, no spaces or special characters.';
        return false;
    }

    // Convert to lowercase and redisplay
    document.getElementById('userid').value = userid.toLowerCase();
    err.innerHTML = '';
    return true;
}

// =====================================================
// CHECK PASSWORD
// 8-30 chars, 1 upper, 1 lower, 1 number, 1 special
// No double quotes allowed
// =====================================================
function checkPassword() {
    var pw = document.getElementById('password').value;
    var err = document.getElementById('err_password');

    if (pw === '') {
        err.innerHTML = 'Password is required.';
        return false;
    }
    if (pw.length < 8 || pw.length > 30) {
        err.innerHTML = 'Password must be 8 to 30 characters.';
        return false;
    }
    if (!/[A-Z]/.test(pw)) {
        err.innerHTML = 'Password must contain at least 1 uppercase letter.';
        return false;
    }
    if (!/[a-z]/.test(pw)) {
        err.innerHTML = 'Password must contain at least 1 lowercase letter.';
        return false;
    }
    if (!/[0-9]/.test(pw)) {
        err.innerHTML = 'Password must contain at least 1 number.';
        return false;
    }
    if (!/[!@#%^&*()\-_+=\/><.,`~]/.test(pw)) {
        err.innerHTML = 'Password must contain at least 1 special character.';
        return false;
    }
    if (/["]/.test(pw)) {
        err.innerHTML = 'Password cannot contain double quotes.';
        return false;
    }

    err.innerHTML = '';
    return true;
}

// =====================================================
// CHECK PASSWORD MATCH
// Both password fields must be equal
// =====================================================
function checkPasswordMatch() {
    var pw = document.getElementById('password').value;
    var rpw = document.getElementById('repassword').value;
    var err = document.getElementById('err_repassword');

    if (rpw === '') {
        err.innerHTML = 'Please re-enter your password.';
        return false;
    }
    if (pw !== rpw) {
        err.innerHTML = 'Passwords do not match.';
        return false;
    }

    err.innerHTML = '';
    return true;
}

// =====================================================
// VALIDATE ALL - called on Submit button click
// Runs all checks before allowing form to submit
// =====================================================
function validateAll() {
    var valid = true;

    if (!checkUserID()) valid = false;
    if (!checkPassword()) valid = false;
    if (!checkPasswordMatch()) valid = false;

    if (!valid) {
        alert('Please fix the errors on the form before submitting.');
    }

    return valid;
}

// =====================================================
// REVIEW FORM - called when Review button is clicked
// Pulls all data from the form and displays it in
// the review area below the form
// =====================================================
function reviewForm() {

    // Show the review area
    document.getElementById('reviewArea').style.display = 'block';

    // ---- NAME ----
    var first = document.getElementById('firstname').value;
    var mi    = document.getElementById('mi').value;
    var last  = document.getElementById('lastname').value;
    document.getElementById('rev_name').innerHTML = first + ' ' + mi + ' ' + last;
    if (first === '' || last === '') {
        document.getElementById('rev_name_status').innerHTML = '<span class="error">ERROR: First and Last name required</span>';
    } else {
        document.getElementById('rev_name_status').innerHTML = '<span class="pass">pass</span>';
    }

    // ---- DATE OF BIRTH ----
    var dob = document.getElementById('dob').value;
    document.getElementById('rev_dob').innerHTML = dob;
    if (dob === '') {
        document.getElementById('rev_dob_status').innerHTML = '<span class="error">ERROR: Date of birth required</span>';
    } else {
        document.getElementById('rev_dob_status').innerHTML = '<span class="pass">pass</span>';
    }

    // ---- EMAIL ----
    var email = document.getElementById('email').value;
    document.getElementById('rev_email').innerHTML = email;
    if (email === '') {
        document.getElementById('rev_email_status').innerHTML = '<span class="error">ERROR: Email required</span>';
    } else {
        document.getElementById('rev_email_status').innerHTML = '<span class="pass">pass</span>';
    }

    // ---- PHONE ----
    var phone = document.getElementById('phone').value;
    document.getElementById('rev_phone').innerHTML = phone;
    if (phone === '') {
        document.getElementById('rev_phone_status').innerHTML = 'not entered';
    } else {
        document.getElementById('rev_phone_status').innerHTML = '<span class="pass">pass</span>';
    }

    // ---- ADDRESS ----
    var addr1 = document.getElementById('address1').value;
    var addr2 = document.getElementById('address2').value;
    var addrDisplay = addr1;
    if (addr2 !== '') addrDisplay += '<br>' + addr2;
    document.getElementById('rev_address').innerHTML = addrDisplay;
    if (addr1 === '') {
        document.getElementById('rev_address_status').innerHTML = '<span class="error">ERROR: Address required</span>';
    } else {
        document.getElementById('rev_address_status').innerHTML = '<span class="pass">pass</span>';
    }

    // ---- CITY STATE ZIP ----
    var city  = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var zip   = document.getElementById('zip').value;

    // Truncate zip to first 5 digits and redisplay
    if (zip.length > 5) {
        zip = zip.substring(0, 5);
        document.getElementById('zip').value = zip;
    }

    document.getElementById('rev_citystatezip').innerHTML = city + ', ' + state + ' ' + zip;
    if (city === '' || state === '' || zip === '') {
        document.getElementById('rev_csz_status').innerHTML = '<span class="error">ERROR: City, State and Zip required</span>';
    } else {
        document.getElementById('rev_csz_status').innerHTML = '<span class="pass">pass</span>';
    }

    // ---- CHECKBOXES ----
    var checkboxes = document.querySelectorAll('input[name="history"]:checked');
    var checked = [];
    checkboxes.forEach(function(cb) {
        checked.push(cb.value);
    });
    if (checked.length === 0) {
        document.getElementById('rev_history').innerHTML = 'None selected';
    } else {
        document.getElementById('rev_history').innerHTML = checked.join(', ');
    }

    // ---- RADIO BUTTONS ----
    var gender = document.querySelector('input[name="gender"]:checked');
    document.getElementById('rev_gender').innerHTML = gender ? gender.value : 'not selected';

    var vaccinated = document.querySelector('input[name="vaccinated"]:checked');
    document.getElementById('rev_vaccinated').innerHTML = vaccinated ? vaccinated.value : 'not selected';

    var insurance = document.querySelector('input[name="insurance"]:checked');
    document.getElementById('rev_insurance').innerHTML = insurance ? insurance.value : 'not selected';

    // ---- SLIDER ----
    var health = document.getElementById('health').value;
    document.getElementById('rev_health').innerHTML = health + ' out of 10';

    // ---- SYMPTOMS ----
    var symptoms = document.getElementById('symptoms').value;
    document.getElementById('rev_symptoms').innerHTML = symptoms === '' ? 'none entered' : symptoms;

    // ---- USER ID ----
    var userid = document.getElementById('userid').value;
    document.getElementById('rev_userid').innerHTML = userid;
    if (userid === '') {
        document.getElementById('rev_userid_status').innerHTML = '<span class="error">ERROR: User ID required</span>';
    } else {
        document.getElementById('rev_userid_status').innerHTML = '<span class="pass">pass</span>';
    }

    // ---- PASSWORD (show asterisks, not actual password) ----
    var pw = document.getElementById('password').value;
    var rpw = document.getElementById('repassword').value;
    document.getElementById('rev_password').innerHTML = '********';
    if (pw === '') {
        document.getElementById('rev_password_status').innerHTML = '<span class="error">ERROR: Password required</span>';
    } else if (pw !== rpw) {
        document.getElementById('rev_password_status').innerHTML = '<span class="error">ERROR: Passwords do not match</span>';
    } else {
        document.getElementById('rev_password_status').innerHTML = '<span class="pass">pass</span>';
    }

    // Scroll down to review area
    document.getElementById('reviewArea').scrollIntoView();
}

// =====================================================
// CLEAR REVIEW - called when Reset button is clicked
// Hides the review area
// =====================================================
function clearReview() {
    document.getElementById('reviewArea').style.display = 'none';
}

// =====================================================
// END OF FILE: homework2.js
// =====================================================
