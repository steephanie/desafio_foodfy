const data1 = document.querySelector('.data1');
const button1 = document.querySelector('.button1');

const data2 = document.querySelector('.data2');
const button2 = document.querySelector('.button2');

const data3 = document.querySelector('.data3');
const button3 = document.querySelector('.button3');

const show = "MOSTRAR";
const hide = "ESCONDER";

button1.addEventListener("click", function () {

    if (!(data1.classList.contains("active"))) {
        data1.classList.add("active");
        button1.innerText = show;
    } else {
        data1.classList.remove("active");
        button1.innerText = hide;
    }
});

button2.addEventListener("click", function () {

    if (!(data2.classList.contains("active"))) {
        data2.classList.add("active");
        button2.innerText = show;
    } else {
        data2.classList.remove("active");
        button2.innerText = hide;

    }
});

button3.addEventListener("click", function () {

    if (!(data3.classList.contains("active"))) {
        data3.classList.add("active");
        button3.innerText = show;
    } else {
        data3.classList.remove("active");
        button3.innerText = hide;

    }
});


