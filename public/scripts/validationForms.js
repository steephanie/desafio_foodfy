function filteringErrorInput(input) {
  let field = document.querySelectorAll(`input[name="${input}"]`);

  let cssRules = `
  <style>
    .item .error input{
      border-color: red;

      transition: 200ms;
    }
  </style>
  `;

  if (input === "chef_id") {
    field = document.querySelectorAll(`select[name="${input}"]`);

    cssRules = `
    <style>
      .item .error #chefs{
        border-color: red;

        transition: 200ms;
      }
    </style>
    `;
  }

  if (input === "ingredients" || input === "preparation") {
    field = document.querySelectorAll(`input[name="${input}[]"]`);
  }

  const upperDiv = field[0].parentElement;
  upperDiv.classList.add("error");

  upperDiv.insertAdjacentHTML("beforeend", cssRules);
  field[0].focus();
}

const input = document.querySelector(".inputBack-end");

//console.log(input.innerHTML);
filteringErrorInput(input.innerHTML);
