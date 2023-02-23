require("dotenv").config();
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const KEYWORDS = "돈마호크";
const STORE = "프레시웰";
const SCROLL_PAUSE_TIME = 1000;

let nextPage = 2;
function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}

async function main() {
  let driver = await new Builder()
    .forBrowser("chrome")
    // size가 모바일 사이즈이면 안됨
    .setChromeOptions(
      new chrome.Options()
      // .headless()
      // .windowSize({
      //   width: 1920,
      //   height: 1080,
      // })
      // .addArguments("--no-sandbox")
      // .addArguments("--single-process")
      // .addArguments("--disable-dev-shm-usage")
    )
    .build();
  try {
    await driver.get("https://shopping.naver.com/home");

    let idInput = await driver.findElement(
      By.xpath(
        "/html/body/div[3]/div/div[1]/div/div/div[2]/div/div[2]/div/div[2]/form/div[1]/div[1]/input"
      )
    );
    idInput.sendKeys(KEYWORDS, Key.RETURN);

    let rank = 1;
    while (true) {
      await driver.wait(
        until.elementLocated(By.className("list_basis")),
        10000
      );

      // await driver.executeScript(
      //   "window.scrollTo(0, document.body.scrollHeight);"
      // );
      let last_height = await driver.executeScript(
        "return document.body.scrollHeight"
      );
      while (true) {
        await driver.executeScript(
          "window.scrollTo(0, document.body.scrollHeight);"
        );

        sleep(SCROLL_PAUSE_TIME);
        await driver.executeScript(
          "window.scrollTo(0, document.body.scrollHeight-50);"
        );
        sleep(SCROLL_PAUSE_TIME);

        const new_height = await driver.executeScript(
          "return document.body.scrollHeight"
        );

        if (new_height == last_height) break;

        last_height = new_height;
      }

      // let reservationNum = await driver.findElements(
      //   By.className("reservation_num")
      // );
      let listElems = await driver.findElements(
        By.className("basicList_item__0T9JD")
      );
      let mallNames = await driver.findElements(
        By.className("basicList_mall__BC5Xu")
      );

      let hit = false;
      let rankInPage = 1;
      let i = 0;
      for (const mallName of mallNames) {
        const classNames = await listElems[i++].getAttribute("class");
        if (classNames.includes("ad")) continue;
        const store = await mallName.getText();
        if (store === STORE) {
          hit = true;
          console.log("KEYWORD: ", KEYWORDS);
          console.log("STORE: ", STORE);
          console.log(`위치: ${nextPage - 1}페이지 ${rankInPage}`);
          console.log(`순위: ${rank}`);
          break;
        }
        rank++;
        rankInPage++;
      }

      if (hit) {
        break;
      }

      const paginationNums = await driver.findElements(
        By.className("pagination_btn_page___ry_S")
      );

      for (const paginationNum of paginationNums) {
        const text = await paginationNum.getText();
        if (text == nextPage) {
          nextPage++;
          await paginationNum.click();
          break;
        }
      }
    }
    // const data = fs.readFileSync("prevReserved.json");
    // const prevReserved = JSON.parse(data.toString());
    // let reserved = [];
    // let reservedSmsNotSent = [];
    // for (let i = 0; i < reservationNum.length; i++) {
    //   reserved.push({
    //     reservationNum: (await reservationNum[i].getText()).replace(/\D/gi, ""),
    //     phoneNum: (await phoneNum[i].getText()).replace(/\D/gi, ""),
    //   });
    //   if (!prevReserved.includes(reserved[i].reservationNum)) {
    //     reservedSmsNotSent.push(reserved[i].phoneNum);
    //   }
    // }
    //*[@id="content"]/div[1]/div[3]/div/a[1]
  } finally {
    driver.quit();
  }
}

main();
