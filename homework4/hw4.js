/*
Program name: homework4.js
Author: Yasir Akhter
Date created: 05/08/2026
Date last edited: 05/12/2026
Version: 4.0
Description: External JavaScript for CarePath Medical homework4.html.
             Includes:
             - Fetch API to load states from external file
             - Cookie functions to remember returning user
             - Local Storage to save and reload form data
             - All on-the-fly validation from homework3
             - Submit button hidden until all fields pass
*/

// =====================================================
// ERROR COUNTER
// =====================================================
var errorCount = 0;

// =====================================================
// SETUP - runs on page load
// Handles: date, cookie check, load local storage,
//          fetch states dropdown
// =====================================================
function setup() {
    // Display current date in header
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').innerHTML = today.toLocaleDateString('en-US', options);

    // Set date limits on DOB field
    setDateLimits();

    // Hide submit button on load
    document.getElementById('submitBtn').style.display = 'none';

    // Load the states dropdown via Fetch API
    loadStates();

    // Check cookie for returning user
    checkCookie();
}

// =====================================================
// FETCH API - load states from external states.html file
// =====================================================
function loadStates() {
    fetch('states.html')
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            document.getElementById('state').innerHTML = data;

            // After states load, reload local storage value for state
            var savedState = localStorage.getItem('cp_state');
            if (savedState) {
                document.getElementById('state').value = savedState;
            }
        })
        .catch(function(error) {
            // If fetch fails, show a basic fallback message
            document.getElementById('state').innerHTML =
                '<option value="">Could not load states</option>';
            console.log('Fetch error: ' + error);
        });
}

// =====================================================
// COOKIE FUNCTIONS
// setCookie, getCookie, deleteCookie
// =====================================================
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function deleteCookie(cname) {
    // Set expiry to past date to delete the cookie
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// =====================================================
// CHECK COOKIE - runs on page load
// If cookie exists: show welcome back message,
//   show "Not [name]?" option, prefill first name,
//   load local storage data back into form
// If no cookie: show "Welcome New User"
// =====================================================
function checkCookie() {
    var savedName = getCookie('cp_firstname');

    if (savedName !== '') {
        // Returning user
        document.getElementById('welcomeMsg').innerHTML =
            'Welcome back, ' + savedName + '!';

        // Show the "Not [name]?" checkbox
        document.getElementById('notMeDiv').style.display = 'block';
        document.getElementById('cookieName').innerHTML = savedName;

        // Prefill first name field
        document.getElementById('firstname').value = savedName;

        // Load all other saved local storage data back into form
        loadLocalStorage();

    } else {
        // New user
        document.getElementById('welcomeMsg').innerHTML = 'Welcome, New User!';
        document.getElementById('notMeDiv').style.display = 'none';
    }
}

// =====================================================
// NOT ME - called when "Not [name]?" checkbox clicked
// Expires the cookie and clears all local storage
// =====================================================
function notMe() {
    if (document.getElementById('notMeCheck').checked) {
        // Delete the cookie
        deleteCookie('cp_firstname');

        // Remove all local storage for this site
        clearLocalStorage();

        // Reset the form
        document.getElementById('regForm').reset();
        document.getElementById('healthValue').innerHTML = '5';

        // Update header
        document.getElementById('welcomeMsg').innerHTML = 'Welcome, New User!';
        document.getElementById('notMeDiv').style.display = 'none';
        document.getElementById('reviewArea').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'none';

        // Clear all error messages
        var allErrors = document.querySelectorAll('.error');
        allErrors.forEach(function(span) { span.innerHTML = ''; });
        errorCount = 0;
    }
}

// =====================================================
// SAVE TO LOCAL STORAGE
// Saves a single text/select field value
// Called oninput or onchange on each field
// Does NOT save SSN or passwords (sensitive)
// =====================================================
function saveLocal(fieldId) {
    var field = document.getElementById(fieldId);
    if (field) {
        localStorage.setItem('cp_' + fieldId, field.value);

        // If saving firstname, also update the cookie if Remember Me is checked
        if (fieldId === 'firstname') {
            var rememberMe = document.getElementById('rememberMe').checked;
            if (rememberMe && field.value !== '') {
                setCookie('cp_firstname', field.value, 2); // 48 hours = 2 days
            }
        }
    }
}

// =====================================================
// SAVE CHECKBOX TO LOCAL STORAGE
// =====================================================
function saveLocalCheck(fieldId) {
    var field = document.getElementById(fieldId);
    if (field) {
        localStorage.setItem('cp_' + fieldId, field.checked ? '1' : '0');
    }
}

// =====================================================
// LOAD LOCAL STORAGE - reload saved data into form
// Called when returning user is detected
// =====================================================
function loadLocalStorage() {
    var textFields = ['firstname','mi','lastname','dob','email',
                      'phone','address1','address2','city','zip',
                      'userid','symptoms'];

    textFields.forEach(function(id) {
        var saved = localStorage.getItem('cp_' + id);
        if (saved !== null) {
            var el = document.getElementById(id);
            if (el) el.value = saved;
        }
    });

    // Load checkboxes
    var checkIds = ['chk_chickenpox','chk_measles','chk_covid','chk_smallpox','chk_tetanus'];
    checkIds.forEach(function(id) {
        var saved = localStorage.getItem('cp_' + id);
        var el = document.getElementById(id);
        if (el && saved !== null) {
            el.checked = (saved === '1');
        }
    });

    // Load radio buttons
    var radioGroups = ['gender','vaccinated','insurance'];
    radioGroups.forEach(function(name) {
        var saved = localStorage.getItem('cp_' + name);
        if (saved !== null) {
            var radios = document.querySelectorAll('input[name="' + name + '"]');
            radios.forEach(function(r) {
                if (r.value === saved) r.checked = true;
            });
        }
    });

    // Load slider
    var savedHealth = localStorage.getItem('cp_health');
    if (savedHealth !== null) {
        document.getElementById('health').value = savedHealth;
        document.getElementById('healthValue').innerHTML = savedHealth;
    }
}

// =====================================================
// CLEAR LOCAL STORAGE
// =====================================================
function clearLocalStorage() {
    var keys = ['firstname','mi','lastname','dob','email','phone',
                'address1','address2','city','state','zip','userid',
                'symptoms','health','gender','vaccinated','insurance',
                'chk_chickenpox','chk_measles','chk_covid',
                'chk_smallpox','chk_tetanus'];
    keys.forEach(function(k) {
        localStorage.removeItem('cp_' + k);
    });
}

// =====================================================
// SET DATE LIMITS on DOB field
// =====================================================
function setDateLimits() {
    var today = new Date();
    var maxDate = today.toISOString().split('T')[0];
    var minYear = today.getFullYear() - 120;
    var minDate = minYear + '-' + maxDate.substring(5);
    document.getElementById('dob').setAttribute('max', maxDate);
    document.getElementById('dob').setAttribute('min', minDate);
}

// =====================================================
// UPDATE SLIDER VALUE
// =====================================================
function updateSlider(val) {
    document.getElementById('healthValue').innerHTML = val;
}

// =====================================================
// SET ERROR / CLEAR ERROR helpers
// =====================================================
function setError(fieldId, message) {
    var errSpan = document.getElementById('err_' + fieldId);
    if (errSpan) {
        if (errSpan.innerHTML === '') errorCount++;
        errSpan.innerHTML = message;
    }
    document.getElementById('submitBtn').style.display = 'none';
}

function clearError(fieldId) {
    var errSpan = document.getElementById('err_' + fieldId);
    if (errSpan) {
        if (errSpan.innerHTML !== '') {
            errorCount--;
            if (errorCount < 0) errorCount = 0;
        }
        errSpan.innerHTML = '';
    }
    if (errorCount === 0) {
        document.getElementById('submitBtn').style.display = 'inline';
    }
}

// =====================================================
// FIELD VALIDATION FUNCTIONS (same as homework3)
// =====================================================

function checkFirstName() {
    var val = document.getElementById('firstname').value;
    if (val === '') { setError('firstname', 'First name is required.'); return false; }
    if (!/^[A-Za-z'\-]{1,30}$/.test(val)) { setError('firstname', 'Letters, apostrophes and dashes only.'); return false; }
    clearError('firstname');
    return true;
}

function checkMI() {
    var val = document.getElementById('mi').value;
    if (val === '') { clearError('mi'); return true; }
    if (!/^[A-Za-z]$/.test(val)) { setError('mi', 'One letter only.'); return false; }
    clearError('mi');
    return true;
}

function checkLastName() {
    var val = document.getElementById('lastname').value;
    if (val === '') { setError('lastname', 'Last name is required.'); return false; }
    if (!/^[A-Za-z'\-]{1,30}$/.test(val)) { setError('lastname', 'Letters, apostrophes and dashes only.'); return false; }
    clearError('lastname');
    return true;
}

function checkDOB() {
    var val = document.getElementById('dob').value;
    if (val === '') { setError('dob', 'Date of birth is required.'); return false; }
    var entered = new Date(val);
    var today = new Date();
    var minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);
    if (entered > today) { setError('dob', 'Cannot be in the future.'); return false; }
    if (entered < minDate) { setError('dob', 'Cannot be more than 120 years ago.'); return false; }
    clearError('dob');
    return true;
}

function formatSSN() {
    var field = document.getElementById('ssn');
    var digits = field.value.replace(/\D/g, '');
    if (digits.length > 5) {
        field.value = digits.substring(0,3) + '-' + digits.substring(3,5) + '-' + digits.substring(5,9);
    } else if (digits.length > 3) {
        field.value = digits.substring(0,3) + '-' + digits.substring(3);
    } else {
        field.value = digits;
    }
}

function checkSSN() {
    var val = document.getElementById('ssn').value;
    var digits = val.replace(/\D/g, '');
    if (val === '') { clearError('ssn'); return true; }
    if (digits.length !== 9) { setError('ssn', 'Must be exactly 9 digits.'); return false; }
    clearError('ssn');
    return true;
}

function checkEmail() {
    var field = document.getElementById('email');
    field.value = field.value.toLowerCase();
    var val = field.value;
    if (val === '') { setError('email', 'Email is required.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setError('email', 'Must be in format name@domain.com'); return false; }
    clearError('email');
    return true;
}

function checkPhone() {
    var val = document.getElementById('phone').value;
    if (val === '') { clearError('phone'); return true; }
    if (!/^\d{3}-\d{3}-\d{4}$/.test(val)) { setError('phone', 'Format must be 000-000-0000'); return false; }
    clearError('phone');
    return true;
}

function checkAddress1() {
    var val = document.getElementById('address1').value;
    if (val === '') { setError('address1', 'Address line 1 is required.'); return false; }
    if (val.length < 2) { setError('address1', 'Must be at least 2 characters.'); return false; }
    clearError('address1');
    return true;
}

function checkAddress2() {
    var val = document.getElementById('address2').value;
    if (val === '') { clearError('address2'); return true; }
    if (val.length < 2) { setError('address2', 'If entered, must be at least 2 characters.'); return false; }
    clearError('address2');
    return true;
}

function checkCity() {
    var val = document.getElementById('city').value;
    if (val === '') { setError('city', 'City is required.'); return false; }
    if (val.length < 2) { setError('city', 'Must be at least 2 characters.'); return false; }
    clearError('city');
    return true;
}

function checkState() {
    var val = document.getElementById('state').value;
    if (val === '') { setError('state', 'Please select a state.'); return false; }
    clearError('state');
    return true;
}

function checkZip() {
    var val = document.getElementById('zip').value;
    if (val === '') { setError('zip', 'Zip code is required.'); return false; }
    if (!/^\d{5}$/.test(val)) { setError('zip', 'Must be exactly 5 digits.'); return false; }
    clearError('zip');
    return true;
}

function checkUserID() {
    var field = document.getElementById('userid');
    var val = field.value;
    if (val === '') { setError('userid', 'User ID is required.'); return false; }
    if (val.length < 5 || val.length > 20) { setError('userid', 'Must be 5 to 20 characters.'); return false; }
    if (/^[0-9]/.test(val)) { setError('userid', 'Cannot start with a number.'); return false; }
    if (/[^A-Za-z0-9_\-]/.test(val)) { setError('userid', 'Letters, numbers, dash or underscore only. No spaces.'); return false; }
    field.value = val.toLowerCase();
    clearError('userid');
    return true;
}

function checkPassword() {
    var pw = document.getElementById('password').value;
    var userid = document.getElementById('userid').value;
    if (pw === '') { setError('password', 'Password is required.'); return false; }
    if (pw.length < 8) { setError('password', 'Must be at least 8 characters.'); return false; }
    if (pw.length > 30) { setError('password', 'Cannot be more than 30 characters.'); return false; }
    if (!/[A-Z]/.test(pw)) { setError('password', 'Must have 1 uppercase letter.'); return false; }
    if (!/[a-z]/.test(pw)) { setError('password', 'Must have 1 lowercase letter.'); return false; }
    if (!/[0-9]/.test(pw)) { setError('password', 'Must have 1 number.'); return false; }
    if (/["]/.test(pw)) { setError('password', 'Cannot contain double quotes.'); return false; }
    if (userid !== '' && pw.toLowerCase() === userid.toLowerCase()) { setError('password', 'Cannot match your User ID.'); return false; }
    clearError('password');
    checkPasswordMatch();
    return true;
}

function checkPasswordMatch() {
    var pw  = document.getElementById('password').value;
    var rpw = document.getElementById('repassword').value;
    if (rpw === '') { setError('repassword', 'Please re-enter your password.'); return false; }
    if (pw !== rpw) { setError('repassword', 'Passwords do not match.'); return false; }
    clearError('repassword');
    return true;
}

// =====================================================
// VALIDATE ALL - runs all checks, shows submit if pass
// Also saves cookie if Remember Me is checked
// =====================================================
function validateAll() {
    errorCount = 0;
    document.getElementById('submitBtn').style.display = 'none';

    var allErrors = document.querySelectorAll('.error');
    allErrors.forEach(function(span) { span.innerHTML = ''; });

    var results = [];
    results.push(checkFirstName());
    results.push(checkMI());
    results.push(checkLastName());
    results.push(checkDOB());
    results.push(checkSSN());
    results.push(checkEmail());
    results.push(checkPhone());
    results.push(checkAddress1());
    results.push(checkAddress2());
    results.push(checkCity());
    results.push(checkState());
    results.push(checkZip());
    results.push(checkUserID());
    results.push(checkPassword());
    results.push(checkPasswordMatch());

    var allGood = results.every(function(r) { return r === true; });

    if (allGood) {
        // Save cookie if Remember Me is checked
        var rememberMe = document.getElementById('rememberMe').checked;
        var firstName = document.getElementById('firstname').value;

        if (rememberMe && firstName !== '') {
            setCookie('cp_firstname', firstName, 2); // 48 hours
        } else {
            // If not checked, expire the cookie and clear local storage
            deleteCookie('cp_firstname');
            clearLocalStorage();
        }

        document.getElementById('submitBtn').style.display = 'inline';
        alert('All fields look good! You can now click Submit.');
    } else {
        alert('Please fix the errors shown on the form.');
    }
}

// =====================================================
// REVIEW FORM
// =====================================================
function reviewForm() {
    document.getElementById('reviewArea').style.display = 'block';

    var first = document.getElementById('firstname').value;
    var mi    = document.getElementById('mi').value;
    var last  = document.getElementById('lastname').value;
    document.getElementById('rev_name').innerHTML = first + ' ' + mi + ' ' + last;
    document.getElementById('rev_name_status').innerHTML =
        (first === '' || last === '') ? '<span class="error">ERROR: Name required</span>' : '<span class="pass">pass</span>';

    var dob = document.getElementById('dob').value;
    document.getElementById('rev_dob').innerHTML = dob;
    document.getElementById('rev_dob_status').innerHTML =
        dob === '' ? '<span class="error">ERROR: Required</span>' : '<span class="pass">pass</span>';

    var email = document.getElementById('email').value;
    document.getElementById('rev_email').innerHTML = email;
    document.getElementById('rev_email_status').innerHTML =
        email === '' ? '<span class="error">ERROR: Required</span>' : '<span class="pass">pass</span>';

    var phone = document.getElementById('phone').value;
    document.getElementById('rev_phone').innerHTML = phone === '' ? 'not entered' : phone;
    document.getElementById('rev_phone_status').innerHTML = phone === '' ? '' : '<span class="pass">pass</span>';

    var addr1 = document.getElementById('address1').value;
    var addr2 = document.getElementById('address2').value;
    document.getElementById('rev_address').innerHTML = addr2 !== '' ? addr1 + '<br>' + addr2 : addr1;
    document.getElementById('rev_address_status').innerHTML =
        addr1 === '' ? '<span class="error">ERROR: Required</span>' : '<span class="pass">pass</span>';

    var city  = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var zip   = document.getElementById('zip').value;
    document.getElementById('rev_citystatezip').innerHTML = city + ', ' + state + ' ' + zip;
    document.getElementById('rev_csz_status').innerHTML =
        (city === '' || state === '' || zip === '') ? '<span class="error">ERROR: Required</span>' : '<span class="pass">pass</span>';

    var checkboxes = document.querySelectorAll('input[name="history"]:checked');
    var checked = [];
    checkboxes.forEach(function(cb) { checked.push(cb.value); });
    document.getElementById('rev_history').innerHTML = checked.length === 0 ? 'None selected' : checked.join(', ');

    var gender = document.querySelector('input[name="gender"]:checked');
    document.getElementById('rev_gender').innerHTML = gender ? gender.value : 'not selected';

    var vaccinated = document.querySelector('input[name="vaccinated"]:checked');
    document.getElementById('rev_vaccinated').innerHTML = vaccinated ? vaccinated.value : 'not selected';

    var insurance = document.querySelector('input[name="insurance"]:checked');
    document.getElementById('rev_insurance').innerHTML = insurance ? insurance.value : 'not selected';

    document.getElementById('rev_health').innerHTML = document.getElementById('health').value + ' out of 10';

    var symptoms = document.getElementById('symptoms').value;
    document.getElementById('rev_symptoms').innerHTML = symptoms === '' ? 'none entered' : symptoms;

    var userid = document.getElementById('userid').value;
    document.getElementById('rev_userid').innerHTML = userid;
    document.getElementById('rev_userid_status').innerHTML =
        userid === '' ? '<span class="error">ERROR: Required</span>' : '<span class="pass">pass</span>';

    var pw  = document.getElementById('password').value;
    var rpw = document.getElementById('repassword').value;
    document.getElementById('rev_password').innerHTML = '********';
    if (pw === '') {
        document.getElementById('rev_password_status').innerHTML = '<span class="error">ERROR: Required</span>';
    } else if (pw !== rpw) {
        document.getElementById('rev_password_status').innerHTML = '<span class="error">ERROR: Do not match</span>';
    } else {
        document.getElementById('rev_password_status').innerHTML = '<span class="pass">pass</span>';
    }

    document.getElementById('reviewArea').scrollIntoView();
}

// =====================================================
// CLEAR ALL - reset button handler
// Clears form, hides review, resets error count
// Also clears local storage and cookie if Remember Me unchecked
// =====================================================
function clearAll() {
    document.getElementById('reviewArea').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
    errorCount = 0;

    var allErrors = document.querySelectorAll('.error');
    allErrors.forEach(function(span) { span.innerHTML = ''; });

    document.getElementById('healthValue').innerHTML = '5';

    // If Remember Me is NOT checked, clear cookie and local storage
    var rememberMe = document.getElementById('rememberMe').checked;
    if (!rememberMe) {
        deleteCookie('cp_firstname');
        clearLocalStorage();
    }
}

// =====================================================
// END OF FILE: homework4.js
// =====================================================
