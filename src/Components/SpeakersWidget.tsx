import React from "react";

interface Props {
  speakers: string[];
  heading: string;
  curSpeaker: number;
  mode?: string; // Regular or Voting
}

const SpeakersWidget = ({
  speakers,
  heading,
  curSpeaker,
  mode = "Regular",
}: Props) => {
  const currSpeakerClass = "speaker current-speaker";
  const futrSpeakerClass = "speaker";
  const pastSpeakerClass = "speaker past-speaker";

  if (mode === "Regular") {
    const speakersList: React.JSX.Element[] = [];

    for (let i = 0; i < speakers.length; i++) {
      let speakerClass: string;
      if (i === curSpeaker) {
        speakerClass = currSpeakerClass;
      } else if (i < curSpeaker) {
        speakerClass = pastSpeakerClass;
      } else {
        speakerClass = futrSpeakerClass;
      }

      speakersList.push(
        <li className={speakerClass} key={"speaker" + i} id={"speaker" + i}>
          {i + 1}.&nbsp;&nbsp;{speakers[i]}
        </li>
      );
    }

    return (
      <div>
        <div className="h2 widget-heading speakers-heading">{heading}</div>
        <ul className="speakers-list list-1" key={"SpeakersList"}>
          {speakersList}
        </ul>
      </div>
    );
  }
  if (mode === "Voting") {
    const speakersList1: React.JSX.Element[] = [];
    const speakersList2: React.JSX.Element[] = [];

    for (let i = 0; i < speakers.length; i++) {
      let speakerClass: string;
      if (i === curSpeaker) {
        speakerClass = currSpeakerClass;
      } else if (i < curSpeaker) {
        speakerClass = pastSpeakerClass;
      } else {
        speakerClass = futrSpeakerClass;
      }
      const listItem = (
        <li className={speakerClass} key={"speaker" + i} id={"speaker" + i}>
          {i + 1}.&nbsp;&nbsp;{speakers[i]}
        </li>
      );
      if (i % 2 === 0) {
        speakersList1.push(listItem);
      }
      if (i % 2 === 1) {
        speakersList2.push(listItem);
      }
    }
    return (
      <div>
        <div className="h2 widget-heading speakers-heading">{heading}</div>
        <ul className="speakers-list list-2">
          <ul className="voting-list" key={"SpeakersListL"}>
            <li className="bold-line">For</li>
            {speakersList1}
          </ul>
          <ul className="voting-list" key={"SpeakersListR"}>
            <li className="bold-line">Against</li>
            {speakersList2}
          </ul>
        </ul>
      </div>
    );
  }
};

export default SpeakersWidget;
