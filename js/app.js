const $ = (selector, all = false) =>
  !all ? document.querySelector(selector) : document.querySelectorAll(selector);
const handleEvent = (element, ev, handler) =>
  element.addEventListener(ev, handler);

// get dom elems
const body = $("body");
const themeButtons = $(".th-num", true);
const themeSwitchContainer = $(".calc .header .th-switch");
const keyBoardBtns = $(".calc .keyboard span", true);
const outputScreen = $(".calc .screen span");

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

// thn -> th(n+1), n in [1,2,3]
const getNextTh = (currentTh) =>
  currentTh.slice(0, 2) +
  ((parseFloat(currentTh[currentTh.length - 1]) % 3) + 1);

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
  handleEvent(thBtn, "click", () => {
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
handleEvent(document, "keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "backspace") {
    $(`.calc .keyboard span[data-value="del"]`)?.click();
  } else if (key === "enter") {
    $(`.calc .keyboard span[data-value="="]`)?.click();
  } else if (key === "x" || key === "r") {
    $(`.calc .keyboard span[data-value="reset"]`)?.click();
  } else {
    $(`.calc .keyboard span[data-value="${key}"]`)?.click();
  }
});
