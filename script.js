'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// SRM BANK APP

// Data
const account1 = {
  owner: 'John Doe',
  movements: [200, -100, 3000, -1500, -200, 70],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z'
  ],
  // US Dollar
  currency: 'USD',
  locale: 'en-US'
};

const account2 = {
  owner: 'Mark Anthony',
  movements: [5000, 3000, -1500, -500, -3000, 1000],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2021-08-29T23:51:36.790Z',
  ],
  // Great Britian Pound
  currency: 'GBP',
  locale: 'en-GB'
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [2000, -500, 300, 500, -200, 100],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
  ],
  // Japanese Yen
  currency: 'JPY',
  locale: 'ja-jp'
};

const account4 = {
  owner: 'Kevin Smith',
  movements: [400, 1000, 500, 100, 900],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2021-08-27T10:51:36.790Z',
  ],
  // Germany Euros
  currency: 'EUR',
  locale: 'de-DE'
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelError = document.querySelector('.error');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Not to display simple date format mm/dd/yyyy
const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) => 
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2,0);
    const month = `${date.getMonth() + 1}`.padStart(2,0);
    const fullYear = date.getFullYear();
    return `${month}/${day}/${fullYear}`;
  }
};

// Format currencies
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency
  }).format(value);
}

// Adding the movements for the money for a single person
// Passing in the movements array from the object
const displayMovements = function (currentAccount, sort = false) {
  containerMovements.innerHTML = '';

  // sort
  const sortedMovs = sort ? currentAccount.movements.slice().sort((a, b) => a - b) : currentAccount.movements;
  sortedMovs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // Formatting and display dates
    const date = new Date(currentAccount.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    
    // Displaying currency as per locale
    const formattedMov = formatCur(mov, currentAccount.locale, currentAccount.currency);

    const movementHtml = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type.toUpperCase()}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", movementHtml);
  })
};

// Computing user names - initials of account owner
const computeUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  })
};

computeUserName(accounts);

// Seperating out deposits and summing them
// const accDeposits = account2.movements
//   .filter(function(mov) {
//   return mov > 0;
//   }).reduce(function(acc, cur) {
//   return acc + cur;
//   }, 0);

// labelSumIn.textContent = `$ ${accDeposits}`;

// Seperating out withdrawals and summing them 
// using arrow function this time
// const accWithDrawals = account2.movements
//   .filter(mov => mov < 0)
//   .reduce((acc, cur) => acc + cur, 0);

// labelSumOut.textContent = `$ ${-(accWithDrawals)}`;

// accWithDrawals are already negative
// const remBal = accDeposits + accWithDrawals;

// labelBalance.textContent = `$ ${remBal}`;

const balanceSummary = function (account) {
  // Calculating sum of deposits
  const incomeSummary = account.movements
    .filter(function (mov) {
      return mov > 0;
    }).reduce(function (acc, cur) {
      return acc + cur;
    }, 0).toFixed(2);

  // labelSumIn.textContent = `${incomeSummary}`;
  labelSumIn.textContent = formatCur(incomeSummary, account.locale, account.currency);

  // Calculating sum of expenditures
  const expendituresSummary = Math.abs(account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0)).toFixed(2);

  // labelSumOut.textContent = `${expendituresSummary}`;
  labelSumOut.textContent = formatCur(expendituresSummary, account.locale, account.currency);

  // Calculating interest on deposits
  const interestSummary = account.movements
    .filter(mov => mov > 0)
    .map(newDeposit => newDeposit * (account.interestRate / 100))
    .reduce((acc, cur) => acc + cur, 0).toFixed(2);

  // labelSumInterest.textContent = `${interestSummary}`;
  labelSumInterest.textContent = formatCur(interestSummary, account.locale, account.currency);

  // Calculating the final account balance
  const finalBal = Number(incomeSummary) + Number(interestSummary) - Number(expendituresSummary);
  // Storing as an property on the account object 
  // as we shall need when implementing transfers
  account.finalBalance = finalBal.toFixed(2);
  // labelBalance.textContent = `${account.finalBalance}`;
  labelBalance.textContent = formatCur(account.finalBalance, account.locale, account.currency);
};

// Implementing a logout timer
const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2,0);
    // Each call, print the remaining time
    labelTimer.textContent = `${min}:${sec}`;
    // When timer expires, stop timer and 
    // logout the user
    if (time === 0) {
      clearInterval(bankTimer);
      // Log out the user
      // Set opacity to 0
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    // Decrease the time by 1 second
    time--;
  }
  // Set the time to 5 minutes
  let time = 10;
  // Call the function once
  tick();
  // Call the timer every second
  const bankTimer = setInterval(tick, 1000); 
  return bankTimer;
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Implementing account login

// Variable for storing the useraccount, timer state
// We have other implementations like transfer/ close 
// so needs to be outside of btnLogin function.
let currentAcc, timer;

// Displaying the Date as they logged in
const now = new Date();
// const day = `${now.getDate()}`.padStart(2,0);
// const month = `${now.getMonth() + 1}`.padStart(2,0);
// const fullYear = now.getFullYear();
// const hour = `${now.getHours()}`.padStart(2, 0);
// const minutes = `${now.getMinutes()}`.padStart(2, 0);
// labelDate.textContent = `${month}/${day}/${fullYear}, ${hour}:${minutes}`;

// List of options
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long'
};

// Event handler for login button and enter key
// Enter key - automatically triggers the click when
// we have a form based html
btnLogin.addEventListener('click', function (e) {
  // Button on a form element does a page reload
  // Prevent form from submitting
  e.preventDefault();
  // Verify if it is existing user from the entered user value
  currentAcc = accounts.find(acc => acc.userName ===
    inputLoginUsername.value);
  // Check the pin for the user trying to login
  // We need to verify only if currentAcc is actually valid
  // For non-existing users, it returns undefined
  // and undefined.pin gives us an error, 
  // so we can use optional chaining
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    // if user exists, provide a welcome message 
    // to the user and display their balance summary
    // Removing the error message
    labelError.style.display = "none";
    // clearing the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // removing the focus from pin field
    inputLoginPin.blur();
    // Clear previous timer if another
    // user logs in
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    // change the opacity to display the dashboard
    containerApp.style.opacity = 100;
    // Welcome message with their first word in their name
    labelWelcome.textContent = `Welcome back! ${currentAcc.owner.split(" ")[0]}`;
    // Displaying date as per locale
    labelDate.textContent = new Intl.DateTimeFormat(currentAcc.locale, options).format(now);
    // loading the dashboard for the logged in user
    displayMovements(currentAcc);
    balanceSummary(currentAcc);
  } else {
    // for non-existing users
    // clearing the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // removing the focus from pin field
    inputLoginPin.blur();
    // change the opacity to hide
    containerApp.style.opacity = 0;
    // unhide the error message
    labelError.style.display = "block";
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Implementing transfers

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // Getting the receiver account and amount
  const amountToBeTransferred = Number(inputTransferAmount.value);
  // Need to find the account so that we can move the 
  // amount to their movements array
  const recAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
  // clearing out the transfer user and input values
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  // Before we actually transfer, we need to check if sender has the required amount or not
  // if sender is from the existing list or undefined
  if (amountToBeTransferred > 0 && amountToBeTransferred <= currentAcc.finalBalance && recAcc && recAcc?.userName !== currentAcc.userName) {
    // Add a negative amount to sender
    // Add a positive amount to the receiver
    currentAcc.movements.push(-(amountToBeTransferred));
    recAcc.movements.push(amountToBeTransferred);
    // Add date when amount was transferred
    currentAcc.movementsDates.push(new Date().toISOString());
    recAcc.movementsDates.push(new Date().toISOString());
    // Dashboard needs to be updated
    displayMovements(currentAcc);
    balanceSummary(currentAcc);
  } else {
    console.log("no");
  }
  // Reset timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Implementing closing of an account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.userName === currentAcc.userName &&
    Number(inputClosePin.value) === currentAcc.pin) {
    const arrIndex = accounts.findIndex(acc => acc.userName === closeUserName);
    // splice mutates the original array
    accounts.splice(arrIndex, 1);
    // change the opacity to hide the dashboard
    containerApp.style.opacity = 0;
  }
  // clearing out the input values
  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// Implementing requests for loan
// Loan gets approved only if we have any deposits
// greater than or equal to 10% of the loan amount requested

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanReqAmount = Math.round(Number(inputLoanAmount.value));
  if (loanReqAmount > 0 && currentAcc.movements.some(mov => mov >= (loanReqAmount * 0.1))) {
    currentAcc.movements.push(loanReqAmount);
     // Add date when a loan amount is requested
    currentAcc.movementsDates.push(new Date().toISOString());
    // Dashboard needs to be updated
    displayMovements(currentAcc);
    balanceSummary(currentAcc);
  }
  // clearing out the input values
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  // Reset timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

// Variable for maintaing the sorting state
let sortedState = false;
// Sorting arrays, we add an extra parameter
// in displayMovements to check and apply the sort
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcc, !sortedState);
  sortedState = !sortedState;
});