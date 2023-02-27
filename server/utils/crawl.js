const Rank = require("../models/rank");
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const SCROLL_PAUSE_TIME = 500;

function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}

async function saveRank(keyword, store, title, rank, rankInPage) {
  const existingData = await Rank.findOne({ keyword, store });

  if (existingData) {
    // return res.status(201).json({ msg: "SUCCESS", following: isExist });
    const { rank: prevRank, history } = existingData;
    const differenceInRank = prevRank.rank - rank;
    let newUpOrDown = "";
    if (differenceInRank < 0) {
      newUpOrDown = "-";
    } else if (differenceInRank > 0) {
      newUpOrDown = "+";
    } else {
      newUpOrDown = "";
    }

    history.push({
      ...prevRank,
      timestamp: new Date().getTime(),
    });

    return await Rank.findOneAndUpdate(
      { keyword, store },
      {
        rank: {
          rank,
          position: rankInPage,
          upOrDown: newUpOrDown,
          changeInRank: Math.abs(differenceInRank),
        },
        history,
      }
    );
  }
  return await Rank.create({
    keyword,
    store,
    title,
    rank: {
      rank,
      position: rankInPage,
      upOrDown: "",
      changeInRank: 0,
    },
  });
}

async function crawl(keyword, store) {
  let results;
  let driver = await new Builder()
    .forBrowser("chrome")
    // size가 모바일 사이즈이면 안됨
    .setChromeOptions(
      new chrome.Options()
        .headless()
        .windowSize({
          width: 1920,
          height: 1080,
        })
        .addArguments("--no-sandbox")
        .addArguments("--single-process")
        .addArguments("--disable-dev-shm-usage")
    )
    .build();
  try {
    await driver.get("https://shopping.naver.com/home");

    let idInput = await driver.findElement(
      By.className("_searchInput_search_text_3CUDs")
    );
    await idInput.sendKeys(keyword, Key.RETURN);

    let rank = 1;
    let nextPage = 2;
    while (true) {
      if (nextPage >= 26) {
        console.log("KEYWORD: ", keyword);
        console.log("STORE: ", store);
        console.log(`위치: Not Found`);
        console.log(`순위: Unrank`);
        await saveRank(keyword, store, "", "Unrank", `Not Found`);
        break;
      }
      await driver.wait(
        until.elementLocated(By.className("list_basis")),
        20000
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
      let productElems = await driver.findElements(
        By.className("basicList_item__0T9JD")
      );
      // let listElems = await driver.findElements(
      //   By.className("basicList_item__0T9JD")
      // );
      // let mallNames = await driver.findElements(
      //   By.className("basicList_mall__BC5Xu")
      // );

      let hit = false;
      let rankInPage = 1;
      let i = 0;
      for (const product of productElems) {
        const classNames = await product.getAttribute("class");
        if (classNames.includes("ad")) continue;

        const storeElemExist = await product.findElements(
          By.className("basicList_mall__BC5Xu")
        );
        if (storeElemExist.length) {
          let storeText = await storeElemExist[0].getText();
          if (storeText === store) {
            hit = true;
            const name = await product
              .findElement(By.className("basicList_link__JLQJf"))
              .getText();
            // const thumbnail = await product.findElement(
            //   By.className("thumbnail_thumb__Bxb6Z")
            // );
            // const img = await thumbnail.findElements(By.xpath("./child::img"));
            // console.log(img);
            // const imgUrl = await img[0].getAttribute("src");

            console.log("KEYWORD: ", keyword);
            console.log("STORE: ", store);
            console.log(`위치: ${nextPage - 1} 페이지 ${rankInPage}`);
            console.log(`순위: ${rank}`);
            console.log(name);
            results = await saveRank(
              keyword,
              store,
              name,
              rank,
              `${nextPage - 1} 페이지 ${rankInPage}`
            );
            break;
          }
        } else {
          const storeNamesExist = await product.findElements(
            By.className("basicList_mall_name__XQlSa")
          );
          if (storeNamesExist.length) {
            for (const storeName of storeNamesExist) {
              let storeText = await storeName.getText();
              if (storeText === store) {
                hit = true;
                const name = await product
                  .findElement(By.className("basicList_link__JLQJf"))
                  .getText();
                // const thumbnail = await product.findElement(
                //   By.className("thumbnail_thumb__Bxb6Z")
                // );
                // const img = await thumbnail.findElements(By.xpath("./child::img"));
                // console.log(img);
                // const imgUrl = await img[0].getAttribute("src");

                console.log("KEYWORD: ", keyword);
                console.log("STORE: ", store);
                console.log(
                  `위치: ${nextPage - 1} 페이지 ${rankInPage} (묶음)`
                );
                console.log(`순위: ${rank}`);
                results = await saveRank(
                  keyword,
                  store,
                  name,
                  rank,
                  `${nextPage - 1} 페이지 ${rankInPage} (묶음)`
                );
                break;
              }
            }

            if (hit) {
              break;
            }
          }
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
  } catch (e) {
    console.log(e);
  } finally {
    driver.quit();
    return results;
  }
}

module.exports = {
  crawl,
};
