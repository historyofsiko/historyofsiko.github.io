// --- ୧. ବହିର ତଥ୍ୟ (ଏଠାରେ ଆପଣ ନିଜ ଫଟୋ ଓ ଲେଖା ଯୋଡ଼ିବେ) ---
const bookData = {
    1: {
        title: "ସିକୋର ପ୍ରାଚୀନ କଥା",
        image: "siko1.jpg", 
        description: "ସିକୋ ଗ୍ରାମର ଇତିହାସ ବହୁତ ପୁରୁଣା। ଏଠାରେ ବହୁ ପ୍ରାଚୀନ କଳା ଏବଂ ସ୍ଥାପତ୍ୟ ଦେଖିବାକୁ ମିଳେ। ଏହି ମାଟିର ଇତିହାସ ଗୌରବମୟ।"
    },
    2: {
        title: "ବାବା ତାରେଶ୍ୱରଙ୍କ ମହିମା",
        image: "siko2.jpg",
        description: "ବାବା ତାରେଶ୍ୱର ହେଉଛନ୍ତି ସିକୋର ମୁଖ୍ୟ ଆରାଧ୍ୟ ଦେବତା। ତାଙ୍କ ମନ୍ଦିରର ଐତିହ୍ୟ ଅତ୍ୟନ୍ତ ସମୃଦ୍ଧ ଏବଂ ପ୍ରତିବର୍ଷ ଏଠାରେ ଜାଗର ମେଳା ଅନୁଷ୍ଠିତ ହୁଏ।"
    },
    3: {
        title: "ଗ୍ରାମର ପର୍ବପର୍ବାଣୀ",
        image: "siko3.jpg",
        description: "ସିକୋରେ ଶୀତଳ ଷଷ୍ଠୀ ଏବଂ ଦୋଳ ପୂର୍ଣ୍ଣିମା ଅତ୍ୟନ୍ତ ଉତ୍ସାହର ସହିତ ପାଳନ କରାଯାଇଥାଏ। ଗ୍ରାମର ସମସ୍ତ ବାସିନ୍ଦା ଏକାଠି ହୋଇ ଏହାକୁ ପାଳନ କରନ୍ତି।"
    }
};

// --- ୨. ମୁଖ୍ୟ ସେଟିଂସ ---
const TOTAL_PAGES = 300;
const book = document.getElementById("book");
const pageNumDisplay = document.getElementById("pageNum");
const flipSound = document.getElementById("flipSound");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentActivePage = 0;
let pagesArray = [];

const sampleImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600"
];

// --- ୩. ବହିର ପୃଷ୍ଠା ପ୍ରସ୍ତୁତ କରିବା (Full Cover Photo ସହିତ) ---
function initBook() {
    for (let i = 0; i <= TOTAL_PAGES; i++) {
        const page = document.createElement("div");
        page.className = "page";
        page.style.zIndex = TOTAL_PAGES - i;

        const pageContent = bookData[i] || {
            title: `ଅଧ୍ୟାୟ - ${i}`,
            image: sampleImages[i % sampleImages.length],
            description: "ସିକୋ ଗ୍ରାମର ପ୍ରାଚୀନ ପରମ୍ପରା, ସଂସ୍କୃତି ଏବଂ ମନ୍ଦିରମାନଙ୍କର ଗାଥା ଏହି ପୁସ୍ତକରେ ବର୍ଣ୍ଣିତ। ଏହି ମାଟିର ଇତିହାସ ଅତ୍ୟନ୍ତ ଗୌରବମୟ।"
        };

        page.innerHTML = `
            <div class="front ${i === 0 ? 'cover' : ''}">
                ${i === 0 ? 
                    `<div class="full-cover-container">
                        <img src="cover.jpg" class="full-cover-img"> 
                     </div>` : 
                    `<div class="content">
                        <img src="${pageContent.image}" class="page-img" alt="Page image">
                        <h3>${pageContent.title}</h3>
                        <p>${pageContent.description}</p>
                        <div class="page-number">${i}</div>
                    </div>`
                }
            </div>
            <div class="back"></div>
        `;
        book.appendChild(page);
        pagesArray.push(page);
    }
    updateControls();
    optimizePagePerformance();
}

// --- ୪. ପୃଷ୍ଠା ଓଲଟାଇବା ଏବଂ ସାଉଣ୍ଡ ଫଙ୍କସନ୍ ---
function playFlipSound() {
    const sound = document.getElementById("flipSound");
    if (sound) {
        sound.pause();        
        sound.currentTime = 0; 
        
        let playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Success
            }).catch(error => {
                console.log("Sound blocked by browser");
            });
        }
    }
}

function flipNext() {
    if (currentActivePage < TOTAL_PAGES) {
        pagesArray[currentActivePage].classList.add("flipped");
        playFlipSound();
        currentActivePage++;
        updateControls();
        optimizePagePerformance();
    }
}

function flipPrev() {
    if (currentActivePage > 0) {
        currentActivePage--;
        pagesArray[currentActivePage].classList.remove("flipped");
        playFlipSound();
        updateControls();
        optimizePagePerformance();
    }
}

// --- ୫. କଣ୍ଟ୍ରୋଲ୍ ଅପଡେଟ୍ (Page 0 Start) ---
function updateControls() {
    pageNumDisplay.innerText = currentActivePage; 
    prevBtn.disabled = currentActivePage === 0;
    nextBtn.disabled = currentActivePage === TOTAL_PAGES;
}

function optimizePagePerformance() {
    pagesArray.forEach((page, index) => {
        const distance = Math.abs(index - currentActivePage);
        if (distance > 5) {
            page.style.display = "none";
        } else {
            page.style.display = "block";
        }
    });
}

// --- ୬. ଅନ୍ୟାନ୍ୟ ସୁବିଧା ---
function openLightbox(element) {
    const imgsrc = element.querySelector('img').src;
    const captionText = element.querySelector('h3').innerText;
    document.getElementById("lightbox-img").src = imgsrc;
    document.getElementById("caption").innerHTML = captionText;
    document.getElementById("lightbox").style.display = "block";
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

const scrollBtn = document.getElementById("scrollToTop");
window.onscroll = function() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
};

scrollBtn.onclick = function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
};

// --- ୭. ଇଭେଣ୍ଟ ଲିସନର୍ସ ---
nextBtn.addEventListener("click", flipNext);
prevBtn.addEventListener("click", flipPrev);

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") flipNext();
    if (e.key === "ArrowLeft") flipPrev();
});

// ବହି ଚାଲୁ କରିବା
initBook();

// --- ଫଟୋ ସ୍କ୍ରୋଲ୍ ଆନିମେସନ୍ ଫଙ୍କସନ୍ ---
function revealPhotos() {
    const reveals = document.querySelectorAll('.photo-card, .vintage-card, .category-header');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// ପ୍ରଥମେ ଲୋଡ୍ ହେବା ବେଳେ ଏବଂ ସ୍କ୍ରୋଲ୍ କରିବା ବେଳେ ଏହା କାମ କରିବ
window.addEventListener('scroll', revealPhotos);
window.addEventListener('load', () => {
    // Gallery card ଗୁଡ଼ିକରେ reveal କ୍ଲାସ୍ ଯୋଡ଼ିବା
    document.querySelectorAll('.photo-card').forEach(card => card.classList.add('reveal'));
    revealPhotos();
});

// --- Optimized Scroll Reveal Animation ---
function revealOnScroll() {
    const reveals = document.querySelectorAll('.photo-card, .category-header, .vintage-card');
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    reveals.forEach(el => {
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
}

// ୱେବସାଇଟ୍ ଖୋଲିବା ବେଳେ ଏବଂ ସ୍କ୍ରୋଲ୍ କଲାବେଳେ ଚାଲିବ
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', () => {
    // Gallery cards ରେ reveal କ୍ଲାସ୍ ଯୋଡ଼ିବା
    document.querySelectorAll('.photo-card').forEach(card => {
        card.classList.add('reveal');
    });
    // ପ୍ରଥମ ଥର ପାଇଁ ରନ୍ କରିବା
    setTimeout(revealOnScroll, 200); 
});

// Lightbox କୁ ଆହୁରି ପରଫେକ୍ଟ କରିବା (Click Fix)
function openLightbox(element) {
    const img = element.querySelector('img');
    const title = element.querySelector('h3');
    
    if (img && title) {
        document.getElementById("lightbox-img").src = img.src;
        document.getElementById("caption").innerHTML = title.innerText;
        document.getElementById("lightbox").style.display = "flex"; // Flex display for centering
        document.body.style.overflow = "hidden"; // ପଛରେ ସ୍କ୍ରୋଲ୍ ବନ୍ଦ ହେବ
    }
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
    document.body.style.overflow = "auto"; // ସ୍କ୍ରୋଲ୍ ପୁଣି ଚାଲିବ
}

// --- ଡାର୍କ ମୋଡ୍ ଫଙ୍କସନ୍ (Dark Mode Logic) ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// ପୂର୍ବରୁ ସେଭ୍ ହୋଇଥିବା ଥିମ୍ ଚେକ୍ କରିବା
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // ଆଇକନ୍ ବଦଳାଇବା
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark'); // ସେଭ୍ କରିବା
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
});