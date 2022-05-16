const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browse-btn");
const fileInput = document.querySelector("#file-input");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const progressBar = document.querySelector(".progress-bar");
const percentDiv = document.querySelector("#percent");

const sharingContainer = document.querySelector(".sharing-container");
const fileURLInput = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copy-btn");

const emailForm = document.querySelector("#email-form");

const host = "https://innshare.herokuapp.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  console.log("dragging");
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
  }
});

fileInput.addEventListener("change", () => {
  uploadFile();
});

browseBtn.addEventListener("click", () => {
  fileInput.click();
});

copyBtn.addEventListener("click", () => {
  fileURLInput.select();
  document.execCommand("copy");
});

const uploadFile = () => {
  progressContainer.style.display = "block";
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("myfile", file);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      onUploadSuccess(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgress = (e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  bgProgress.style.width = `${percent}%`;
  percentDiv.innerText = percent;
  progressBar.style.transform = `scaleX(${percent / 100})`;
};

const onUploadSuccess = ({ file: url }) => {
  console.log(url);
  fileInput.value = "";
  emailForm[2].removeAttribute("disabled");
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  fileURLInput.value = url;
};

emailForm.addEventListener("submit", () => {
  e.preventDefault();
  const url = fileURLInput.value;
  const formData = {
    uuid: "url.split(" / ").splice(-1,1)[0]",
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };
  emailForm[2].setAttribute("disabled", "true");
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ success }) => {
      if (success) {
        sharingContainer.style.display = "none";
      }
    });
});
