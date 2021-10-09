// import the Three.js module:
import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
// load in the module:
import Stats from "https://unpkg.com/three@0.126.0/examples/jsm/libs/stats.module";

// add a stats view to the page to monitor performance:
//const stats = new Stats();
//document.body.appendChild(stats.dom);

// create a renderer with better than default quality:
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
// make it fill the page
renderer.setSize(window.innerWidth, window.innerHeight);
// create and add the <canvas>
document.body.appendChild(renderer.domElement); 

// create a perspective camera
const camera = new THREE.PerspectiveCamera( 
    75,  // this camera has a 75 degree field of view in the vertical axis
    window.innerWidth / window.innerHeight, // the aspect ratio matches the size of the window
    //defining the near and far clipping planes (next two lines):
    0.05, // anything less than 5cm from the eye will not be drawn
    100  // anything more than 100m from the eye will not be drawn
);
// position the camera 2m in the Z axis and 1.5m in the Y axis
// the Y axis points up from the ground
// the Z axis point out of the screen toward you
camera.position.y = 1.5; //1.5 as approx average human eye height
camera.position.z = 2; //2 meters stepped back from the simulated world

// create the root of a scene graph
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial();
const cube = new THREE.Mesh( geometry, material );

// position the cube, and add it to the scene:
cube.position.y = 1.5;
scene.add( cube );

let weather = {
  apiKey: "bd06047b22e959f093969434f56d3536",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  
  
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");

		function animate() {

//  		stats.begin()

	// update the scene:  
			cube.rotation.x += (temp/200);
			cube.rotation.y += (temp/200);
      
  // draw the scene:
  		renderer.render( scene, camera );

//  		stats.end()
			};
// start!
		renderer.setAnimationLoop(animate);
  },
  

  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

weather.fetchWeather("Paris");

const light = new THREE.HemisphereLight(0xfff0f0, 0x606066);
scene.add(light);