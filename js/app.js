document.querySelectorAll('input[name="theme"]').forEach((elem) => {
  elem.addEventListener("change", function (event) {
    const theme = event.target.value;
    switch (theme) {
      case "light":
        document.body.classList.add("light-theme");
        document.body.classList.remove("colorful-theme");
        localStorage.setItem("theme", "light");
        break;
      case "colorful":
        document.body.classList.add("colorful-theme");
        document.body.classList.remove("light-theme");
        localStorage.setItem("theme", "colorful");
        break;
      default:
        document.body.classList.remove("light-theme", "colorful-theme");
        localStorage.removeItem("theme");
    }
  });
});

const theme = localStorage.getItem("theme");

if (theme) {
  document.body.classList.add(`${theme}-theme`);
  document.querySelector(`input[value="${theme}"]`).checked = true;
}

const btnContainer = document.querySelector(".btn-container");
const result = document.querySelector(".result");

function formatNumberString(str) {
  const parts = str.split(/([+\-x/])/);
  let formattedString = "";

  parts.forEach((part) => {
    if (/[+\-x/]/.test(part)) {
      formattedString += part;
    } else {
      const numberWithoutCommas = part.replace(/,/g, "");

      formattedString += numberWithoutCommas.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );
    }
  });

  return formattedString;
}

function equalButtonClicked() {
  const expression = result.textContent.replace(/x/g, "*").replace(/,/g, "");

  try {
    const evaluatedValue = eval(expression).toString();

    const formattedValue = formatNumberString(evaluatedValue);

    result.textContent =
      formattedValue.length > 18 ? "EXCEEDED LIMIT" : formattedValue;
  } catch (error) {
    result.textContent = "ERROR";
  }
}

btnContainer.addEventListener("click", function (event) {
  if (event.target.tagName !== "BUTTON") return;

  const buttonValue = event.target.textContent;
  let resultValue = result.textContent;

  if (["ERROR", "EXCEEDED LIMIT"].includes(resultValue)) {
    resultValue = "";
  }

  switch (buttonValue) {
    case "DEL":
      result.textContent =
        resultValue.substring(0, resultValue.length - 1) || "0";
      break;
    case "=":
      equalButtonClicked();
      break;
    case "RESET":
      result.textContent = "0";
      break;
    case "+":
    case "-":
    case "x":
    case "/":
      if (resultValue === "0") resultValue = "";
      if (
        resultValue.length <= 18 &&
        !["+", "-", "x", "/"].includes(resultValue.slice(-1))
      ) {
        result.textContent = resultValue + buttonValue;
      }
      break;
    case ".":
      if (resultValue === "0") resultValue = "";
      if (!resultValue.includes(".")) {
        result.textContent = resultValue + buttonValue;
      }
      break;
    default:
      if (resultValue === "0") resultValue = "";
      if (resultValue.length < 18) {
        result.textContent = formatNumberString(resultValue + buttonValue);
      }
  }
});
