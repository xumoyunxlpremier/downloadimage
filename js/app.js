//url func
function urlOrnati(url) {
  document.getElementById("urlInput").value = url;
}

// screenshot function
async function yuklaOl() {
  //  Input qiymatini olish
  const urlInput = document.getElementById("urlInput");
  const url = urlInput.value.trim();

  //url tekshirish
  if (!url) {
    alert(" URL kiriting!");
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    alert(" http:// yoki https:// bilan boshlanishi shart!");
    return;
  }

  //loadong
  const loading = document.getElementById("loading");
  const btn = document.getElementById("downloadBtn");

  // Loading show
  loading.classList.add("active");
  btn.disabled = true;
  btn.textContent = "Sabr qiling brodar.";

  try {
    //  Backend starts
    const response = await fetch("/api/screenshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (data.success) {
      const link = document.createElement("a");
      link.href = data.filePath;
      link.download = data.fileName;
      document.body.append(link);
      link.click();
      document.body.remove(link);

      alert(" Screenshot yuklab olindi!");
    } else {
      alert(" Xatolik: " + data.error);
    }
  } catch (error) {
    alert(" Server bilan bog'lanishda xatolik: " + error.message);
  } finally {
    loading.classList.remove("active");
    btn.disabled = false;
    btn.textContent = "Download";
  }
}
