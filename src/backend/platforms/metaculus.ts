/* Imports */
import axios from "axios";

import { average } from "../../utils";
import { sleep } from "../utils/sleep";
import toMarkdown from "../utils/toMarkdown";
import { FetchedQuestion, Platform } from "./";

/* Definitions */
const platformName = "metaculus";
let now = new Date().toISOString();
let DEBUG_MODE = "off";
let SLEEP_TIME = 5000;

/* Support functions */
async function fetchMetaculusQuestions(next: string) {
  // Numbers about a given address: how many, how much, at what price, etc.
  let response;
  let data;
  try {
    response = await axios({
      url: next,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    data = response.data;
  } catch (error) {
    console.log(`Error in async function fetchMetaculusQuestions(next)`);
    console.log(error);
    if (axios.isAxiosError(error)) {
      if (error.response?.headers["retry-after"]) {
        const timeout = error.response.headers["retry-after"];
        console.log(`Timeout: ${timeout}`);
        await sleep(Number(timeout) * 1000 + SLEEP_TIME);
      } else {
        await sleep(SLEEP_TIME);
      }
    }
  } finally {
    try {
      response = await axios({
        url: next,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      data = response.data;
    } catch (error) {
      console.log(error);
      return { results: [] };
    }
  }
  // console.log(response)
  return data;
}

async function fetchMetaculusQuestionDescription(slug: string) {
  try {
    let response = await axios({
      method: "get",
      url: "https://www.metaculus.com" + slug,
    }).then((response) => response.data);
    return response;
  } catch (error) {
    console.log(`Error in: fetchMetaculusQuestionDescription`);
    console.log(
      `We encountered some error when attempting to fetch a metaculus page. Trying again`
    );
    if (
      axios.isAxiosError(error) &&
      typeof error.response != "undefined" &&
      typeof error.response.headers != "undefined" &&
      typeof error.response.headers["retry-after"] != "undefined"
    ) {
      const timeout = error.response.headers["retry-after"];
      console.log(`Timeout: ${timeout}`);
      await sleep(Number(timeout) * 1000 + SLEEP_TIME);
    } else {
      await sleep(SLEEP_TIME);
    }
    try {
      let response = await axios({
        method: "get",
        url: "https://www.metaculus.com" + slug,
      }).then((response) => response.data);
      // console.log(response)
      return response;
    } catch (error) {
      console.log(
        `We encountered some error when attempting to fetch a metaculus page.`
      );
      console.log("Error", error);
      throw "Giving up";
    }
  }
}

export const metaculus: Platform = {
  name: platformName,
  label: "Metaculus",
  color: "#006669",
  version: "v1",
  async fetcher() {
    // let metaculusQuestionsInit = await fetchMetaculusQuestions(1)
    // let numQueries = Math.round(Number(metaculusQuestionsInit.count) / 20)
    // console.log(`Downloading... This might take a while. Total number of queries: ${numQueries}`)
    // for (let i = 4; i <= numQueries; i++) { // change numQueries to 10 if one want to just test }
    let all_questions = [];
    let next = "https://www.metaculus.com/api2/questions/";
    let i = 1;
    while (next) {
      if (i % 20 == 0) {
        console.log("Sleeping for 500ms");
        await sleep(SLEEP_TIME);
      }
      console.log(`\nQuery #${i}`);
      let metaculusQuestions = await fetchMetaculusQuestions(next);
      let results = metaculusQuestions.results;
      let j = false;
      for (let result of results) {
        if (result.publish_time < now && now < result.resolve_time) {
          await sleep(SLEEP_TIME / 2);
          let questionPage = await fetchMetaculusQuestionDescription(
            result.page_url
          );
          if (!questionPage.includes("A public prediction by")) {
            // console.log(questionPage)
            let descriptionraw = questionPage.split(
              `<div class="content" ng-bind-html-compile="qctrl.question.description_html">`
            )[1]; //.split(`<div class="question__content">`)[1]
            let descriptionprocessed1 = descriptionraw.split("</div>")[0];
            let descriptionprocessed2 = toMarkdown(descriptionprocessed1);
            let description = descriptionprocessed2;

            let isbinary = result.possibilities.type == "binary";
            let options: FetchedQuestion["options"] = [];
            if (isbinary) {
              let probability = Number(result.community_prediction.full.q2);
              options = [
                {
                  name: "Yes",
                  probability: probability,
                  type: "PROBABILITY",
                },
                {
                  name: "No",
                  probability: 1 - probability,
                  type: "PROBABILITY",
                },
              ];
            }
            let id = `${platformName}-${result.id}`;
            let interestingInfo: FetchedQuestion = {
              id,
              title: result.title,
              url: "https://www.metaculus.com" + result.page_url,
              description,
              options,
              qualityindicators: {
                numforecasts: Number(result.number_of_predictions),
              },
              extra: {
                resolution_data: {
                  publish_time: result.publish_time,
                  resolution: result.resolution,
                  close_time: result.close_time,
                  resolve_time: result.resolve_time,
                },
              },
              //"status": result.status,
              //"publish_time": result.publish_time,
              //"close_time": result.close_time,
              //"type": result.possibilities.type, // We want binary ones here.
              //"last_activity_time": result.last_activity_time,
            };
            if (Number(result.number_of_predictions) >= 10) {
              console.log(`- ${interestingInfo.title}`);
              all_questions.push(interestingInfo);
              if ((!j && i % 20 == 0) || DEBUG_MODE == "on") {
                console.log(interestingInfo);
                j = true;
              }
            }
          } else {
            console.log("- [Skipping public prediction]");
          }
        }
      }
      next = metaculusQuestions.next;
      i = i + 1;
    }

    return all_questions;
  },

  calculateStars(data) {
    const { numforecasts } = data.qualityindicators;
    let nuno = () =>
      (numforecasts || 0) > 300 ? 4 : (numforecasts || 0) > 100 ? 3 : 2;
    let eli = () => 3;
    let misha = () => 3;
    let starsDecimal = average([nuno(), eli(), misha()]);
    let starsInteger = Math.round(starsDecimal);
    return starsInteger;
  },
};
