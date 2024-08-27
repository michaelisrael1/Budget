  // Code for log in, Initialization for log in screen
var name = "";
var budget = 0;
//To make a list of expenses 
var expensesName = [];
var expensesDate = [];
var expensesPrice = [];
var wants = 0;
var needs = 0;
var textForTransaction = '';
//On Events for the Help Screens to work
onEvent("buttonHelp", "click", function( ) {
  setScreen("screenHelp1");
});
onEvent("buttonNextHelp1", "click", function( ) {
  setScreen("screenHelp2");
});
onEvent("buttonNextHelp2", "click", function( ) {
  setScreen("screenHelp3");
});
onEvent("buttonGetStarted", "click", function( ) {
  setScreen("screenMain");
});


//On Events for the Income and expenses to work
onEvent("buttonIncome&Expenses", "click", function( ) {
  setScreen("screenIncomeAndExpenses");
});
onEvent("buttonHome", "click", function( ) {
  setScreen("screenMain");
});


//On events for the transaction history to work
onEvent("buttonHistory", "click", function( ) {
  setScreen("screenTransactionHistory");
});
onEvent("buttonReturnHome", "click", function( ) {
  setScreen("screenMain");
});


//On event for Tommorow, Today
onEvent("buttonFuture", "click", function( ) {
  setScreen("screenTomorrowToday");
});
onEvent("buttonHomeAnalyze", "click", function( ) {
  setScreen("screenMain");
});

//On Event for Vis Spending to Home
onEvent("buttonVisualizeHome", "click", function( ) {
  setScreen("screenMain");
});

//on event to return back to login
onEvent("buttonBackloging", "click", function( ) {
  setScreen("screenLogIn");
});


//On Event & code for Tommorrow, Today
onEvent("buttonAnalyze", "click", function( ) {
  var avg = wants / (wants + needs);
  var maxSpent = "";
  for (var i = 0; i < expensesName.length; i++) {
    for (var e = 0; e < expensesName.length; e++) {
      if (expensesPrice[i] > expensesPrice[e]) {
        maxSpent = "$" + expensesPrice[i] + " on " + expensesName[i];
      }
    }
  }
  setText("LabelAnalyzeInfo", ((avg + " of your expenses is spent on wants. ") + "The most you spent was ") + maxSpent);
  //Indicator if youre in or exceeding your budget
  var totalExpenses = calculateTotalExpenses();
  if (totalExpenses > budget) {
    setText("labelBudgetStatus", "You have exceeded your budget.");
    setProperty("labelBudgetStatus", "text-color", "red");
  } else {
    setText("labelBudgetStatus", "You are under your budget. Good job!");
    setProperty("labelBudgetStatus", "text-color", "green");
  }
  //shows budget in Tommorrow Today
  setText("labelTTBudget", "Budget: $" + budget);
});

function calculateTotalExpenses() {
  var total = 0;
  for (var i = 0; i < expensesPrice.length; i++) {
    total += expensesPrice[i];
  }
  return total;
}

// On event for log in to home
onEvent("buttonStart", "click", function() {
  name = getText("textName");
  budget = getText("textBudget");
  // Check if either name or budget is empty
  if (name == "" || budget == "") {
    showElement("labelPleaseCompleteLogin");
  } else {
    // Hide the elements if the labels are empty
    hideElement("labelPleaseCompleteLogin");
    // Proceeds to screen
    setScreen("screenMain");
    setText("labelWelcome", "Welcome, " + name);
    console.log("Budget = " + budget);
    //Adds Name to main screen
    setProperty("labelWelcome", "text", "Welcome, " + name + "!");
  }
});


//Code for Income and expenses
onEvent("buttonSubmit", "click", function( ) {
  if (getText("textExpenseInput") === "" || getText("textPriceInput") === "" || getText("dropdownDates") === "Dates" ) {
    showElement("labelPleaseComplete");
  } else {
    hideElement("labelPleaseComplete");
    showElement("imageCheckmark");
    setTimeout(function() {
      hideElement("imageCheckmark");
    }, 500);
    if (getChecked("radiobuttonWant")) {
      wants = wants + 1;
    }
    if (getChecked("radiobuttonNeed")) {
      needs = needs + 1;
    }
    insertItem(expensesName, expensesName.length + 1, getText("textExpenseInput"));
    insertItem(expensesDate, expensesDate.length + 1, getText("dropdownDates"));
    insertItem(expensesPrice, expensesPrice.length + 1, getNumber("textPriceInput"));
    printTransaction();
    updateTextbox();
  }
});
//Code for quick transaction
onEvent("buttonAddTransaction", "click", function( ) {
  if (getText("dropdownDatesQuick") === "Dates" || getText("textQuickTransaction") === "") {
    showElement("labelMissingQuick");
  } else {
    expensesPrice.push(getNumber("textQuickTransaction"));
    expensesDate.push(getText("dropdownDatesQuick"));
    expensesName.push("Quick Transaction");
    printTransaction();
    hideElement("labelMissingQuick");
    setProperty("textQuickTransaction", "text", "");
    setProperty("dropdownDatesQuick", "text", "Dates");
  }
});
//Code for when Visualize is pressed
onEvent("buttonVisualize", "click", function() {
  setScreen("screenVisualizeSpending");
  var chartData = expensesGraphData();
  drawChart("imageExpenseChart", "bar", chartData);
});
//tips code 
onEvent("textTips", "mouseover", function( ) {
  readRecords("Tips", {}, function(records) {
    for (var i =0; i < records.length; i++) {
      console.log((records[i]).id + ': ' + (records[i]).tip);
    }
    var tipsIndex = randomNumber(0, records.length-1);
    setProperty("textTips", "text", records[tipsIndex].tip);
    setProperty("labelVisSpending", "text", records[tipsIndex].tip);
  });
});
//Function to clear ALL transaction input boxes
function updateTextbox() {
  setProperty("textExpenseInput", "text", "");
  setProperty("textPriceInput", "text", "");
  setProperty("dropdownDates", "text", "Dates");
}
// Function to prepare data for the graph
function expensesGraphData() {
  var chartData = [];
  var expensesDailyTotal = [];
  // Loop through expenses to calculate total for each day and update totals
  for (var i = 0; i < expensesDate.length; i++) {
    var day = expensesDate[i];
    var amount = expensesPrice[i];
    if (expensesDailyTotal[day] == undefined) {
      expensesDailyTotal[day] = amount;
    } else {
      expensesDailyTotal[day] = expensesDailyTotal[day] + amount;
    }
  }
  for (var day in expensesDailyTotal) {
    chartData.push({ Days: day, value: (expensesDailyTotal[day]) });
  }
  return chartData;
}
//Function to print Transaction History
function printTransaction() {
  var count = 0;
  textForTransaction = "";
  for (var i = 0; i < expensesPrice.length; i++) {
    count = i + 1;
    console.log(((i + (":" + expensesName[i])) + " $") + expensesPrice[i] + "  Date:" + expensesDate[i]);
    textForTransaction = textForTransaction + (((((count+ ":  ") + expensesName[i])) + " $" + expensesPrice[i]) + " Date:" + expensesDate[i]);
    textForTransaction = textForTransaction + '\n';
  }
  setText("textTransactionHistory", textForTransaction);
}
