const body = document.querySelector("body");
const themeButtons = document.querySelectorAll(".th-num");
const themeSwitchContainer = document.querySelector(".calc .header .th-switch");
const keyBoardBtns = document.querySelectorAll(".calc .keyboard span");
const outputScreen = document.querySelector(".calc .screen span");
let input = "";
let ls = window.localStorage;

// get and set last used theme
window.onload = () => {
  const theme = ls.getItem("theme");
  const themeRx = /^th+[1-3]$/;
  themeRx.test(theme) ? toggleTheme(theme) : toggleTheme("th1");
};

const getCurrTheme = () => {
  if (body.classList.contains("th1")) return "th1";
  if (body.classList.contains("th2")) return "th2";
  if (body.classList.contains("th3")) return "th3";
};

const getNextTh = (currentTh) => {
  if (currentTh === "th1") return "th2";
  if (currentTh === "th2") return "th3";
  if (currentTh === "th3") return "th1";
};

const toggleTheme = (newTh, currentTh) => {
  if (currentTh) {
    body.classList.replace(currentTh, newTh);
  } else {
    let currentTh = getCurrTheme();
    if (newTh != currentTh) {
      body.classList.remove(currentTh);
      body.classList.add(newTh);
    }
  }

  ls.setItem("theme", newTh);
};

const nextTh = () => {
  let currentTh = getCurrTheme();
  let nextTh = getNextTh(currentTh);
  toggleTheme(nextTh, currentTh);
};

// nextTheme onclick
themeSwitchContainer.onclick = () => nextTh();

// theme onclick
themeButtons.forEach((thBtn) => {
  thBtn.addEventListener("click", () => {
    if (thBtn.hasAttribute("data-theme")) {
      const btnTheme = thBtn.attributes.getNamedItem("data-theme").value;
      toggleTheme(btnTheme);
    }
  });
});

// Returns wether or not input is an error
const findError = (inp) => {
  if (inp === "Syntax Error!" || inp === "NaN" || inp === "Infinity")
    return true;
  return false;
};

// handle btns click and calculations
keyBoardBtns.forEach((kbBtn) => {
  kbBtn.onclick = () => {
    kbBtn.classList.add("active");
    // if an error ocurred, err msg will be cleared with any key press
    if (findError(input)) {
      input = "";
      outputScreen.innerText = "0.00";
    }
    if (kbBtn.hasAttribute("data-value")) {
      let btnValue = kbBtn.attributes.getNamedItem("data-value").value;
      if (btnValue === "del") {
        input = input.slice(0, -1);
      } else if (btnValue === "reset") {
        input = "";
      } else if (btnValue === "=") {
        try {
          input = eval(input).toFixed(2);
        } catch (err) {
          input = "Syntax Error!";
        }
      } else {
        input += btnValue;
      }
      input !== ""
        ? (outputScreen.innerText = input)
        : (outputScreen.innerText = "0.00");
    }
    setTimeout(() => {
      kbBtn.classList.remove("active");
    }, 200);
  };
});

// handle typing
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "backspace") {
    document.querySelector(`.calc .keyboard span[data-value="del"]`)?.click();
  } else if (key === "enter") {
    document.querySelector(`.calc .keyboard span[data-value="="]`)?.click();
  } else if (key === "x" || key === "r") {
    document.querySelector(`.calc .keyboard span[data-value="reset"]`)?.click();
  } else {
    document
      .querySelector(`.calc .keyboard span[data-value="${key}"]`)
      ?.click();
  }
});
