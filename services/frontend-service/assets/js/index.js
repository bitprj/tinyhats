let spinner = document.getElementById("spinner");
let exampleImage = document.getElementById("exampleImage");

let fileInput = document.getElementById("file-upload");
let numberInput = document.getElementById("numberHats");
let typeInput = document.getElementById("typeInput");
let numberHats = document.getElementById("numberHats")

function getImage(event) {
    event.preventDefault();

    // let baseUrl = "https://api.tinyhat.me/";
    var formData = new FormData();
    let baseUrl = "/api/hat";

    let method = "GET";
    let options = {}
    // show spinner and hide the person
    spinner.classList.remove("hidden");
    exampleImage.classList.add('hidden');


    if (typeInput) {
        formData.append("type", typeInput.value);
        console.log(typeInput.value);
        options = {
            method,
            headers: {
                type: typeInput.value
            }
        }
    }

    if (numberHats.value != "") {
        baseUrl += `?number=${numberHats.value}`
    }

    if (fileInput.files.length > 0) {
        console.log("file has been added")
        method = "POST"


        console.log(fileInput.files[0]);
        formData.append("file", fileInput.files[0]);

        options["body"] = formData;
        options["method"] = method;
    }

    console.log("Making fetch")
    console.log(baseUrl)
    console.log(options)
    fetch(baseUrl, options)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            exampleImage.src = data.result.finalBaby
            console.log(exampleImage)
            exampleImage.classList.remove("hidden")
            spinner.classList.add("hidden")
        })

}

window.onload = async function getHats(event) {
    event.preventDefault();

    console.log("Getting hats")
    let baseUrl = "/api/list";

    // get description and image links
    let hats = await fetch(baseUrl, {
        method: "GET"
    })
    console.log(hats)
    let hatList = await hats.json()
    console.log(hatList)
    let wrapper = document.querySelector(".swiper-wrapper");
    // loop through to populate options and image

    var temp = []
    hatList_mod = hatList.filter((item) => {
        if (!temp.includes(item.description)) {
            temp.push(item.description)
            return true;
        }
    })

    for (var i = 0; i < hatList_mod.length; i++) {
        $('#HATSelect').find('select[id="typeInput"]').append($('<option/>', {
            value: hatList_mod[i].description,
            text: hatList_mod[i].description,
        }));
    }

    for (var i = 0; i < hatList.length; i++) {
        $('.swiper-wrapper').append(`<div class="swiper-slide d-flex align-items-center justify-content-center"><img class="img-fluid swiper-pic" width="100px" src="${hatList[i].url}" alt=""></div>`)
    }

    const swiper = new Swiper('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        slidesPerView: 4,
        slidesPerColumn: 3,
        slidesPerColumnFill: 'row',
        spaceBetween: 10,
        speed: 1000,
        breakpoints: {
            // when window width is >= 320px
            576: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window width is >= 480px
            768: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            // when window width is >= 640px
            992: {
                slidesPerView: 6,
                spaceBetween: 20
            },
            1200: {
                slidesPerView: 8,
                spaceBetween: 20
            }
        }
    });

    // set the number of hats there are
    document.getElementById("numHats").innerHTML = hatList.length + " hats."
}
