"use strict";

//////// BANKIST APP  ///////
//////// DATA //////////////
const account1 = {
  owner: "Mohit Jhankal",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDate: [
    "2023-06-22",
    "2023-07-25",
    "2023-07-28",
    "2023-07-30",
    "2023-07-31",
    "2023-08-01",
    "2023-08-02",
    "2023-08-03",
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Rajkumar Rao",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDate: [
    "2023-06-22",
    "2023-07-25",
    "2023-07-28",
    "2023-07-30",
    "2023-07-31",
    "2023-08-01",
    "2023-08-02",
    "2023-08-03",
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Jessy Pinkman",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDate: [
    "2023-06-22",
    "2023-07-25",
    "2023-07-28",
    "2023-07-30",
    "2023-07-31",
    "2023-08-01",
    "2023-08-02",
    "2023-08-03",
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Heavy God",
  movements: [430, 1000, 700, 50, 90],
  movementsDate: [
    "2023-07-30",
    "2023-07-31",
    "2023-08-01",
    "2023-08-02",
    "2023-08-03",
  ],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////// Elements /////////////
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance_value");
const labelSumIn = document.querySelector(".summary_value--in");
const labelSumOut = document.querySelector(".summary_value--out");
const labelSumInterest = document.querySelector(".summary_value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login_btn");
const btnTransfer = document.querySelector(".form_btn--transfer");
const btnLoan = document.querySelector(".form_btn--loan");
const btnClose = document.querySelector(".form_btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login_input--user");
const inputLoginPin = document.querySelector(".login_input--pin");
const inputTransferTo = document.querySelector(".form_input--to");
const inputTransferAmount = document.querySelector(".form_input--amount");
const inputLoanAmount = document.querySelector(".form_input--loan-amount");
const inputCloseUsername = document.querySelector(".form_input--user");
const inputClosePin = document.querySelector(".form_input--pin");

////// functions //////

const formatMovementDate = function (date) {
  const calcdaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcdaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth()}`.padStart(2, 0);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDate[i]);
    const displayDate = formatMovementDate(date);
    const html = `<div class="movements_row">
    <div class="movements_type movements_type--${type}">${i + 1} ${type}</div>
    <div class="movements_date">${displayDate}</div>
    <div class="movements_value">${mov.toFixed(2)}$</div>
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.innerText = `${acc.balance}$`;
};
calcDisplayBalance(account1);

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const out = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * +account.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.innerText = `${income}$`;
  // to change "-" into + use Math.abs
  labelSumOut.innerText = `${Math.abs(out)}$`;
  labelSumInterest.innerText = `${interest.toFixed(2)}$`;
};
calcDisplaySummary(account1);

const createUserName = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((text) => text[0])
      .join("");
  });
};
createUserName(accounts);

const startLogOutTimer = function () {
  const tick = function () {
    let min = String(Math.floor(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
      clearInterval(timer);
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  // to clear timer it has to be in return otherwise if its not there how will you clear it
  return timer;
};

// Event Handler
let currentAccount, timer;
let pin;

function updateUI(acc) {
  displayMovements(acc);
  // display summary
  calcDisplaySummary(acc);
  // display balance
  calcDisplayBalance(acc);
}

// Fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

//

btnLogin.addEventListener("click", (e) => {
  // it prevent from submitting. if we do not use e.prevemtDefault(), login button will refresh immediatly.
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // optional chaining using "?"
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.innerText = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    // clear inputs
    inputLoginPin.value = inputLoginUsername.value = "";
    // to loose focus on pin
    inputLoginPin.blur();

    containerApp.style.opacity = "1";

    // create current date
    const now = new Date();
    const year1 = now.getFullYear();
    const month1 = `${1 + now.getMonth()}`.padStart(2, 0); // zero based, we have to add one
    const date1 = `${now.getDate()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minute = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${date1}/${month1}/${year1}, ${hour}:${minute}`;
    // timer set
    // first checking if there is any timer, if there clear it and set another
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // display movements
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", (e) => {
  // again to prevent refresh on clicking
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    receiverAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }
  //Add Date
  currentAccount.movementsDate.push(new Date());
  receiverAcc.movementsDate.push(new Date());
  // update UI
  updateUI(currentAccount);

  //reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const loanValue = +inputLoanAmount.value;
  // some will give true or false if there is any value in the array of movements
  const loanApprove = currentAccount.movements.some(
    (mov) => mov > loanValue * 0.1
  );
  if (loanApprove) {
    setTimeout(function () {
      currentAccount.movements.push(loanValue);
      //Add loan Date
      currentAccount.movementsDate.push(new Date());

      // update UI
      updateUI(currentAccount);

      //reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// to find max value in a array
// reduce method gives the value of accumulator ok -- so if acc > mov, acc ko as it is return krdo. agar acc < mov hai to return mov krdo. jisse ki acc ki value mov k barabar hojaye..
// console.log(account1.movements);
// const max = account1.movements.reduce((acc, mov) => {
//   console.log(acc);
//   console.log(mov);
//   if (acc > mov) {
//     return acc;
//   } else return mov;
// }, account1.movements[0]);
// console.log(max);

// loan will be offered if atleast one transection is greter than 10% of loan amount

// to calculate whole addition in all the arrays
// flat will reduce all array in a single array for ex [[1,2],[2,3]]=> [1,2,2,3]
// flat
// const overallBalance = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov);
// console.log(overallBalance);
// flatmap --> combination of map and flat
// const overallBalance2 = accounts
//   .flatMap(acc.movements)
//   .reduce((acc, mov) => acc + mov);
// console.log(overallBalance2);

/////////////////// it will sort the array in ascending order
// movements.sort((a, b) => a - b);
