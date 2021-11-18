const addingLinksToCards = {
  cards: document.querySelectorAll(".card"),
  linking() {
    for (const card of addingLinksToCards.cards) {
      card.addEventListener("click", () => {
        const id = card.getAttribute("id");

        window.location.href = `/recipes/${id}`;
      });
    }
  },
};

const addingFilterSearchH1 = {
  h1() {
    let filter = document.querySelector("#filter");
    //console.log(filter);
    if (filter != null && filter.dataset.filter !== "") {
      filter = filter.dataset.filter;
      const element = document.createElement("h1");
      const wrapperGrid = document.querySelector(".wrapper-grid");

      element.innerHTML = `Buscando por "${filter}"`;
      wrapperGrid.insertBefore(element, wrapperGrid.firstChild);
    }
  },
};

const filteringFunctions = {
  commonFiltering(keyWords, functionCalled) {
    const url = window.location.href;

    for (const keyWord of keyWords) {
      if (url.includes(keyWord)) {
        functionCalled();
      }
    }
  },

  removingWhiteSpacesInBeginningOfInputs() {
    const textInputs = document.querySelectorAll("form .item input[type=text]");
    // const emailInputs = document.querySelectorAll(
    //   "form .item input[type=email]"
    // );
    const passwordInputs = document.querySelectorAll(
      "form .item input[type=password]"
    );

    const inputs = {
      textInputs: textInputs.length > 0 ? textInputs : undefined,
      // emailInputs: emailInputs.length > 0 ? emailInputs : undefined,
      passwordInputs: passwordInputs.length > 0 ? passwordInputs : undefined,
    };

    //console.log(Object.values(inputs));

    const arrOfAllInputs = [];

    Object.values(inputs).forEach((nodeList) => {
      if (nodeList !== undefined) {
        for (let i = 0; i < nodeList.length; i++) {
          arrOfAllInputs.push(nodeList[i]);
        }
      }
    });

    //console.log(arrOfAllInputs);
    if (arrOfAllInputs) {
      for (let i = 0; i < arrOfAllInputs.length; i++) {
        const element = arrOfAllInputs[i];
        //console.log(element);
        element.addEventListener("keydown", () => {
          setTimeout(() => {
            element.value = element.value.replace(/^\s+/g, "");
          }, 1);
        });
      }
    }
  },

  //   filteringErrorEmailInput() {
  //     const email = document.querySelector("input[name='email']");
  // email.firs
  //     if (email.value !== "") {
  //       const filterRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  //       let passed = null;

  //       email.addEventListener("blur", (e) => {
  //         //console.log(e.target.value);

  //         passed = filterRegex.test(String(e.target.value).toLocaleLowerCase());

  //         //console.log(passed);
  //         const upperDiv = email.parentElement;
  //         if (!passed) {
  //           upperDiv.classList.add("error");
  //           email.focus();
  //         } else {
  //           upperDiv.classList.remove("error");
  //         }
  //       });
  //     }
  //   },
};

const controllingFieldsInput = {
  addIngredient() {
    const ingredients = document.querySelector(".ingredients");
    const ingredient = document.querySelectorAll(".ingredient");

    const newField = ingredient[ingredient.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "")
      return alert("Preencha campo vazio antes de adicionar novo!");

    newField.children[0].value = "";
    ingredients.appendChild(newField);
  },

  addStep() {
    const steps = document.querySelector(".steps");
    const step = document.querySelectorAll(".step");

    const newField = step[step.length - 1].cloneNode(true);

    if (newField.children[0].value == "")
      return alert("Preencha campo vazio antes de adicionar novo!");

    newField.children[0].value = "";
    steps.appendChild(newField);
  },
};

const confirmationOfButtons = {
  verifyingBeforeDeleteChef(e) {
    const divDelete = document.querySelector(".delete");

    if (divDelete.dataset.has_recipes === "0") {
      const confirmation = confirm("Deseja excluir esse chef?!");

      if (!confirmation) return e.preventDefault();
    }
    // if (divDelete.dataset.has_recipes != "0") {
    //   alert("Não é permitido excluir chefs que tenham receitas cadastradas!");

    //   return e.preventDefault();
    // }
  },

  verifyingBeforeSavingChef(e) {
    let avatarImage = document.querySelector(".avatar-image");
    avatarImage = Array.from(avatarImage).length;
    const pTag = document.querySelector("#avatar-img");

    // if (avatarImage.length === 0 || pTag.innerHTML === "") {
    //   alert("Send at least one photo for chef!");
    //   return e.preventDefault();
    // }

    const confirmation = confirm("Deseja salvar esse chef?!");

    if (!confirmation) return e.preventDefault();
  },
  verifyingBeforeDeleteRecipe(e) {
    const confirmation = confirm("Deseja excluir essa receita?!");

    if (!confirmation) return e.preventDefault();
  },

  verifyingBeforeSavingRecipe(e) {
    let recipeImages = document.querySelector("#recipe-images");
    recipeImages = Array.from(recipeImages).length;
    const imagesTags = document.querySelectorAll(".preview-images img");

    // if (recipeImages.length === 0 || imagesTags.length === 0) {
    //   alert("Send at least one photo for recipe!");
    //   return e.preventDefault();
    // }

    const confirmation = confirm("Deseja salvar essa receita?!");

    if (!confirmation) return e.preventDefault();
  },

  verifyingBeforeLogout(e) {
    const confirmation = confirm("Tem certeza de que deseja sair?!");

    if (!confirmation) return e.preventDefault();
  },

  verifyingBeforeSavingUser(e) {
    const confirmation = confirm("Deseja cadastrar esse usuário?!");

    if (!confirmation) return e.preventDefault();
  },

  verifyingBeforeUpdateUser(e) {
    // const password = document.querySelector(".item input[type='password']");

    // if (password) {
    //   if (password.value === "" && password) {
    //     alert("Coloque a sua senha para atualizar os dados!");
    //     return e.preventDefault();
    //   }
    // }

    const confirmation = confirm("Deseja atualizar os dados?!");

    if (!confirmation) return e.preventDefault();
  },

  verifyingBeforeDeleteUser(e) {
    const confirmation = confirm("Deseja excluir esse usuário?!");

    if (!confirmation) return e.preventDefault();
  },
};

const controlContentRecipe = {
  showOrHide(e) {
    const button = e.target;
    const divStep = button.parentElement.parentElement.childNodes[3];

    if (divStep.classList.contains("hidden")) {
      divStep.classList.remove("hidden");

      button.innerHTML = "Esconder";
    } else {
      divStep.classList.add("hidden");

      button.innerHTML = "Mostrar";
    }
  },
};

const showingSearchBar = {
  showing() {
    const url = window.location.href;
    const home = document.querySelector(".home");
    if (
      home ||
      (url.includes("recipes") &&
        !url.includes("recipes/") &&
        !url.includes("admin") &&
        !url.includes("edit"))
    ) {
      const filterDiv = document.querySelector(".filter");

      filterDiv.classList.add("show");
    }
  },
};

const menuLinksActivation = {
  activated(filter, content) {
    const url = window.location.href;

    if (url.length === 27 && url.includes(filter)) {
      const menuLinks = document.querySelectorAll(".menu div ul li");

      for (const link of menuLinks) {
        if (link.firstChild.innerHTML == `${content}`) {
          link.firstChild.classList.toggle("activated");
        }
      }
      return;
    }
    if (url.includes(filter) && filter !== "admin") {
      const menuLinks = document.querySelectorAll(".menu div ul li");

      for (const link of menuLinks) {
        if (link.firstChild.innerHTML == `${content}`) {
          link.firstChild.classList.toggle("activated");
        }
      }
    }
  },
};

const uploadingImages = {
  previewImages: document.querySelector(".preview-images"),
  uploadLimit: 5,
  files: [],
  input: "",

  handleFilesInput(event) {
    uploadingImages.input = event.target;
    const { files: fileList } = event.target;
    const { loadImageDiv } = uploadingImages;

    if (uploadingImages.hasLimit(event)) return;

    loadImageDiv(fileList);

    event.target.files = uploadingImages.getAllFiles();
  },
  loadImageDiv(list) {
    const { createContainerForImage } = uploadingImages;

    Array.from(list).forEach((file) => {
      uploadingImages.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        createContainerForImage(reader.result);
      };
      reader.readAsDataURL(file);
    });
  },

  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer();

    uploadingImages.files.forEach((file) => dataTransfer.items.add(file));

    return dataTransfer.files;
  },

  hasLimit(event) {
    const { uploadLimit, input } = uploadingImages;

    const imagesTags = document.querySelectorAll(".preview-images img");

    const totalFiles = input.files.length + imagesTags.length;

    if (totalFiles > uploadLimit) {
      alert(`Adicione no máximo ${uploadLimit} imagens!`);
      event.preventDefault();
      return true;
    }

    return false;
  },

  getContainer(img) {
    const container = document.createElement("div");

    container.appendChild(img);

    container.appendChild(uploadingImages.getCloseButton());

    return container;
  },

  getCloseButton() {
    const icon = document.createElement("i");

    icon.classList.add("material-icons");

    icon.innerHTML = "close";

    icon.onclick = uploadingImages.removeImage;

    return icon;
  },

  createContainerForImage(readerResult) {
    const { previewImages, getContainer } = uploadingImages;

    const image = new Image();
    image.src = String(readerResult);

    previewImages.appendChild(getContainer(image));
  },

  removeImage(event) {
    const imgContainer = event.target.parentNode;

    const allContainers = document.querySelectorAll(".preview-images div");

    const index = Array.from(allContainers).indexOf(imgContainer);

    uploadingImages.files.splice(index, 1);

    uploadingImages.input.files = uploadingImages.getAllFiles();

    uploadingImages.addRemovedPhotoIntoInput(event);

    imgContainer.remove();
  },

  addRemovedPhotoIntoInput(event) {
    const file_id = event.target.id; // getting the id from <i>
    let inputRemoved = document.querySelector(".removed-files");

    if (inputRemoved) inputRemoved.value += `${file_id},`;
  },
};

const activatingInputFiles = {
  activate() {
    const inputFile = document.querySelector(".avatar-image");

    inputFile.click();
  },
};

const uploadChefAvatar = {
  handleFile(event) {
    const inputValue = event.target.value;
    const pTag = document.querySelector("#avatar-img");
    const filteredName = Array.from(inputValue).slice(12).join("");

    pTag.innerHTML = filteredName;
  },
};

const shortingTextsOnCards = {
  shortChefsName() {
    let chefsName = document.querySelectorAll(".card-info h2");
    if (chefsName) {
      chefsName.forEach((chef) => {
        const newName = shortingTextsOnCards.restrainingTextSize(
          chef.innerHTML
        );

        chef.innerHTML = newName;
      });
    }
  },

  shortRecipeChefName() {
    let chefsName = document.querySelectorAll(".card span p span");
    let adminRecipes = document.querySelectorAll(".card-content p span");
    if (chefsName) {
      chefsName.forEach((chef) => {
        const newName = shortingTextsOnCards.restrainingTextSize(
          chef.innerHTML
        );

        chef.innerHTML = newName;
      });
    }
    if (adminRecipes) {
      adminRecipes.forEach((chef) => {
        const newName = shortingTextsOnCards.restrainingTextSize(
          chef.innerHTML
        );

        chef.innerHTML = newName;
      });
    }
  },

  restrainingTextSize(text) {
    let count = 0;
    let indexCut = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") count++;

      if (count === 2) {
        indexCut = i;
        break;
      }
    }

    const newName = text.slice(0, indexCut);
    return count == 2 ? newName : text.trim();
  },
};

const changingRecipeImages = {
  toChange(e) {
    const mainImage = document.querySelector("#main-image");
    const previousSelected = document.querySelector(".files-wrapper .selected");

    mainImage.src = e.target.src;
    previousSelected.classList.remove("selected");
    e.target.classList.add("selected");
  },
};

//filteringFunctions.commonFiltering(["filter"], addingFilterSearchH1.h1);
addingFilterSearchH1.h1();

filteringFunctions.removingWhiteSpacesInBeginningOfInputs();
// filteringFunctions.filteringErrorEmailInput();

shortingTextsOnCards.shortChefsName();
shortingTextsOnCards.shortRecipeChefName();
addingLinksToCards.linking();
showingSearchBar.showing();

menuLinksActivation.activated("recipes", "Receitas");
menuLinksActivation.activated("about", "Sobre");
menuLinksActivation.activated("chefs", "Chefs");
menuLinksActivation.activated("profile", "Minha conta");
menuLinksActivation.activated("login", "Minha conta");
menuLinksActivation.activated("users", "Usuários");
menuLinksActivation.activated("admin", "Receitas");
