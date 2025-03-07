import Link from "next/link";
import { FaExpand } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

import { Card } from "../../../common/Card";
import { CopyText } from "../../../common/CopyText";
import { QuestionFragment } from "../../../fragments.generated";
import { cleanText } from "../../../utils";
import { QuestionOptions } from "../QuestionOptions";
import { QuestionFooter } from "./QuestionFooter";

const truncateText = (length: number, text: string): string => {
  if (!text) {
    return "";
  }
  if (text.length <= length) {
    return text;
  }
  const breakpoints = " .!?";
  let lastLetter: string | undefined = undefined;
  let lastIndex: number | undefined = undefined;
  for (let index = length; index > 0; index--) {
    const letter = text[index];
    if (breakpoints.includes(letter)) {
      lastLetter = letter;
      lastIndex = index;
      break;
    }
  }
  let truncatedText =
    text.slice(0, lastIndex) + (lastLetter != "." ? "..." : "..");
  return truncatedText;
};

// Auxiliary components

const DisplayMarkdown: React.FC<{ description: string }> = ({
  description,
}) => {
  const formatted = truncateText(250, cleanText(description));
  // overflow-hidden overflow-ellipsis h-24
  return formatted === "" ? null : (
    <div className="overflow-clip">
      <ReactMarkdown linkTarget="_blank" className="font-normal">
        {formatted}
      </ReactMarkdown>
    </div>
  );
};

const LastUpdated: React.FC<{ timestamp: Date }> = ({ timestamp }) => (
  <div className="flex items-center">
    <svg className="mt-1" height="10" width="16">
      <circle cx="4" cy="4" r="4" fill="rgb(29, 78, 216)" />
    </svg>
    <span className="text-gray-600">
      Last updated:{" "}
      {timestamp ? timestamp.toISOString().slice(0, 10) : "unknown"}
    </span>
  </div>
);

// Main component

interface Props {
  question: QuestionFragment;
  showTimeStamp: boolean;
  expandFooterToFullWidth: boolean;
  showIdToggle?: boolean;
  showExpandButton?: boolean;
}

export const QuestionCard: React.FC<Props> = ({
  question,
  showTimeStamp,
  expandFooterToFullWidth,
  showIdToggle,
  showExpandButton = true,
}) => {
  const { options } = question;
  const lastUpdated = new Date(question.timestamp * 1000);

  const isBinary =
    options.length === 2 &&
    (options[0].name === "Yes" || options[0].name === "No");

  return (
    <Card>
      <div className="h-full flex flex-col space-y-4">
        <div className="flex-grow space-y-4">
          {showIdToggle ? (
            <div className="mx-10">
              <CopyText text={question.id} displayText={`[${question.id}]`} />
            </div>
          ) : null}
          <div>
            {showExpandButton ? (
              <Link href={`/questions/${question.id}`} passHref>
                <a className="float-right block ml-2 mt-1.5">
                  <FaExpand
                    size="18"
                    className="text-gray-400 hover:text-gray-700"
                  />
                </a>
              </Link>
            ) : null}
            <Card.Title>
              <a
                className="text-black no-underline"
                href={question.url}
                target="_blank"
              >
                {question.title}
              </a>
            </Card.Title>
          </div>
          {isBinary ? (
            <div className="flex justify-between">
              <QuestionOptions
                question={question}
                maxNumOptions={5}
                optionTextSize={"text-normal"}
                onlyFirstEstimate={false}
              />
              <div className={`hidden ${showTimeStamp ? "sm:block" : ""}`}>
                <LastUpdated timestamp={lastUpdated} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <QuestionOptions
                question={question}
                maxNumOptions={5}
                optionTextSize={"text-sm"}
                onlyFirstEstimate={false}
              />
              <div className={`hidden ${showTimeStamp ? "sm:block" : ""} ml-6`}>
                <LastUpdated timestamp={lastUpdated} />
              </div>
            </div>
          )}

          {question.platform.id !== "guesstimate" && options.length < 3 && (
            <div className="text-gray-500">
              <DisplayMarkdown description={question.description} />
            </div>
          )}

          {question.platform.id === "guesstimate" && question.visualization && (
            <img
              className="rounded-sm"
              src={question.visualization}
              alt="Guesstimate Screenshot"
            />
          )}
        </div>
        <div
          className={`sm:hidden ${!showTimeStamp ? "hidden" : ""} self-center`}
        >
          {/* This one is exclusively for mobile*/}
          <LastUpdated timestamp={lastUpdated} />
        </div>
        <div className="w-full">
          <QuestionFooter
            question={question}
            expandFooterToFullWidth={expandFooterToFullWidth}
          />
        </div>
      </div>
    </Card>
  );
};
