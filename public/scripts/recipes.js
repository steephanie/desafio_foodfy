const recipes = document.querySelectorAll('.card');


for (let i = 0; i < recipes.length; i++) {
    const recipeId = i;

    recipes[i].addEventListener("click", function () {
        console.log(`O valor id é ${recipeId}`);
        window.location.href = `/recipe/${recipeId}`;
    });
}
