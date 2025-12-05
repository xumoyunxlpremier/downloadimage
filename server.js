//libs

const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

//express
const app = express();
app.use(express.json());

//static
app.use(express.static(__dirname)); // index.html va frontend fayllari
app.use("/screenshots", express.static(path.join(__dirname, "screenshots")));

// rasm storage
const screenshotDir = path.join(__dirname, "screenshots");
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);//create a path 
}


app.post("/api/screenshot", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json({ success: false, error: "URL kelmadi" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [ "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const fileName = `shot_${Date.now()}.png`;
    const filePath = path.join(screenshotDir, fileName);

    await page.screenshot({ path: filePath, fullPage: true });

    await browser.close();

    return res.json({
      success: true,
      fileName,
      filePath: `/screenshots/${fileName}`,
    });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
});

// start
app.listen(3000, () => {});
