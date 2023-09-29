// // DOM elements
const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uil-times");
const downloadImgBtn = document.querySelector(".uil-import");

// API key, pagination, search term variables
const apiKey = "zqYvFpXhfvYj4vB0QdgGor8Zv0HWML8rC2uFvpZbYAXSYlf5KJDxbh9I";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

// Function to download an image
const downloadImg = (imgURL) => {
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download image!"));
};

// Function to show the lightbox
const showLightBox = (name, img) => {
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
};

// Function to hide the lightbox
const hideLightBox = () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
};

// Function to generate HTML for images
const generateHTML = (images) => {
  imagesWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onclick="showLightBox('${img.photographer}','${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}'); event.stopPropagation();">
            <i class="uil uil-import"></i>
            </button>
        </div>
        </li>`
    )
    .join("");
};

// Function to fetch images from the API
const getImages = (apiURL) => {
  // Hide the loading button immediately when the fetch is initiated
  loadMoreBtn.innerHTML = "";
  loadMoreBtn.classList.add("disabled");

  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("No data found or an error occurred.");
      }
      return res.json();
    })
    .then((data) => {
      if (data.photos.length === 0) {
        alert("No data found.");
        return;
      }
      generateHTML(data.photos);
      loadMoreBtn.innerHTML = "Load More";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch((error) => {
      alert(error.message);
      loadMoreBtn.innerHTML = "Load More";
      loadMoreBtn.classList.remove("disabled");
    });
};

// Function to load more images
const loadMoreImages = () => {
  currentPage++; // Increment currentPage by 1

  // If searchTerm has some value, call API with searchTerm; else, call the default API
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

// Function to load search images
const loadSearchImages = (e) => {
  if (e.key === "Enter") {
    if (e.target.value.trim() === "") {
      alert("Please enter a valid search term.");
      return;
    }
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

// Initial loading of images
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

// Event listeners
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightBox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));
