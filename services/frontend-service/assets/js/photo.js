navigator.permissions.query({ name: 'camera' })
    .then((permission) => {
        console.log("camera state", permission.state);
    }).catch((error) => {
        console.log('Got error :', error);
    })

Webcam.set({
    height: 450,
    width: 800,
    image_format: 'jpeg',
    jpeg_quality: 100
});

Webcam.attach('#my_camera');

let audio = new Audio('../assets/audio/pop.mp3');


let hatCount = document.getElementById("hat-count");
let hatCountList = [
    1, 5, 10, 15, 20
];
let hatCountIndex = 0;

let hatContainer = document.getElementById("hat-type");
let hatIndex = 0;
let hatList;
let overlay = document.getElementById("overlay");
let loadingGif = document.getElementById("loading");
let camera = document.getElementById("my_camera");
let buttonControls = document.getElementById("button-controls");

window.onload = async () => {
    hatCount.innerHTML = hatCountList[hatCountIndex];

    let baseUrl = "/api/list";

    // get description and image links
    let hats = await fetch(baseUrl, {
        method: "GET"
    })
    hatList = await hats.json()
    console.log(hatList)

    setHats(hatList);
}

function setHats(hatList) {

    hatContainer.src = hatList[hatIndex].url;
    hatContainer.alt = hatList[hatIndex].description;
}

document.getElementById("hat-type-container").addEventListener("click", () => {
    audio.play();
    hatIndex += 1;

    if (hatIndex > hatList.length - 1) {
        hatIndex = 0;
    }
    hatContainer.src = hatList[hatIndex].url;
    hatContainer.alt = hatList[hatIndex].description;

});

document.getElementById("count-container").addEventListener("click", () => {
    audio.play();
    hatCountIndex += 1;
    if (hatCountIndex > 4) {
        hatCountIndex = 0;
    }
    hatCount.innerHTML = hatCountList[hatCountIndex];

});

document.getElementById("snap").addEventListener('click', () => {
    audio.play();
    overlay.classList.remove("hidden");
    loadingGif.classList.remove("hidden");
    removeAllChildNodes(camera);

    let spinner = document.getElementById('spinner');
    let result = document.getElementById('result');
    Webcam.snap(async function (data_uri) {
        // display results in page  

        var file = dataURLtoFile(data_uri, 'bruh.jpeg');
        console.log(file);
        // SaveBlobAs(file, "test.jpeg");

        var formData = new FormData();
        let baseUrl = "/api/hat";
        let type = document.getElementById("hat-type").alt

        baseUrl += `?number=${hatCount.innerHTML}`


        let method;
        let options = {}

        method = "POST"

        formData.append("file", file);
        options = {
            method,
            headers: {
                type
            },
            body: formData
        }

        console.log("Making fetch")
        console.log(baseUrl)
        console.log(options)

        let resp = await fetch(baseUrl, options);
        let data = await resp.json();
        console.log(data);

        let img = document.createElement("img");
        img.src = data.result.finalBaby;
        camera.appendChild(img);
        // result.classList.remove("hidden");
        // console.log(document.getElementById("result"));
        loadingGif.classList.add('hidden');
        overlay.classList.add("hidden");
        buttonControls.classList.add("hidden");
        document.getElementById("reset").classList.remove("hidden");
    });


});

document.getElementById("reset").addEventListener("click", () => {
    removeAllChildNodes(camera);
    Webcam.attach('#my_camera');
    buttonControls.classList.remove("hidden");
    document.getElementById("reset").classList.add("hidden");
})

function SaveBlobAs(blob, file_name) {
    if (typeof navigator.msSaveBlob == "function")
        return navigator.msSaveBlob(blob, file_name);

    var saver = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    var blobURL = saver.href = URL.createObjectURL(blob),
        body = document.body;

    saver.download = file_name;

    body.appendChild(saver);
    saver.dispatchEvent(new MouseEvent("click"));
    body.removeChild(saver);
    URL.revokeObjectURL(blobURL);
}

function dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],

        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    console.log(mime)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}






// click event listener
$('body').on('click', function (e) {
    explode(e.pageX, e.pageY);
})

// explosion construction
function explode(x, y) {
    var particles = 15,
        // explosion container and its reference to be able to delete it on animation end
        explosion = $('<div class="explosion"></div>');

    // put the explosion container into the body to be able to get it's size
    $('body').append(explosion);

    // position the container to be centered on click
    explosion.css('left', x - explosion.width() / 2);
    explosion.css('top', y - explosion.height() / 2);

    for (var i = 0; i < particles; i++) {
        // positioning x,y of the particle on the circle (little randomized radius)
        var x = (explosion.width() / 2) + rand(80, 150) * Math.cos(2 * Math.PI * i / rand(particles - 10, particles + 10)),
            y = (explosion.height() / 2) + rand(80, 150) * Math.sin(2 * Math.PI * i / rand(particles - 10, particles + 10)),
            color = rand(0, 255) + ', ' + rand(0, 255) + ', ' + rand(0, 255), // randomize the color rgb
            // particle element creation (could be anything other than div)
            elm = $('<div class="particle" style="' +
                'background-color: rgb(' + color + ') ;' +
                'top: ' + y + 'px; ' +
                'left: ' + x + 'px"></div>');

        if (i == 0) { // no need to add the listener on all generated elements
            // css3 animation end detection
            elm.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
                explosion.remove(); // remove this explosion container when animation ended
            });
        }
        explosion.append(elm);
    }
}

// get random number between min and max value
function rand(min, max) {
    return Math.floor(Math.random() * (max + 1)) + min;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}