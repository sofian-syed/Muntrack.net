import React, { useState, useCallback, useMemo, useEffect } from "react";
import Title from "./Components/Title";
import InfoWidget from "./Components/InfoWidget";
import SpeakersWidget from "./Components/SpeakersWidget";
import HelpPopup from "./Components/HelpPopup";
import TimerPopup from "./Components/TimerPopup";
import findMatch from "./FuzzyCountries";

enum InputStage {
  None,
  SetQuorum,
  SetTitle,
  SetTime,
  SetExtensions,
  SetExtensionTime,
  addCountry,
  deleteCountry,
  flipFrom,
  flipTo,
  insertCountry,
  insertCountryPos,
  setTimerTime,
}
enum SpeakerListMode {
  Rolling,
  General,
  Voting,
} // If adding a new mode, change the qtyModes const

function App() {
  const qtyModes = 3; // Change if adding a new speaker list mode
  const [formData, setFormData] = useState({
    quorum: 0,
    defaultTime: 0,
    time: 0,
    isRunning: false,
    extensions: 0,
    extensionTime: 0,
    title: "mun.track",
    inputStage: InputStage.None,
    consoleText: "> mun.track ready ",
    countries: [Array<string>(), Array<string>(), Array<string>()],
    // countries: [[], [], []] as string[][], //is the same as above, but the above is more readable
    curr_speaker: 0,
    flipFrom: 0,
    flipTo: 0,
    insertCountry: "",
    insertCountryPos: 0,
    speakerListMode: SpeakerListMode.Rolling,
  });

  useEffect(() => {
    // In order for this type to work, you need to install the @types/node package (npm install @types/node)
    let intervalId: NodeJS.Timeout;
    const timer = document.getElementById("SpeakingParametersTime")!;
    const { isRunning, time } = formData;
    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setFormData((prevData) => {
          const newTime = prevData.time - 1;
          if (newTime <= 10) {
            timer.classList.add("ontime");
          }
          if (newTime === 0) {
            timer.classList.remove("ontime");
            timer.classList.add("overtime");
          }
          return {
            ...prevData,
            time: newTime,
          };
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [formData]);

  const handleKeyPress = (event: KeyboardEvent) => {
    const { inputStage } = formData;
    if (event.code === "Space") {
      setFormData((prevData) => ({
        ...prevData,
        isRunning: !prevData.isRunning,
      }));
    } else if (event.code === "Escape") {
      closeHelpPopup();
      closeTimerPopup();
    }
    if (inputStage === InputStage.addCountry) {
      const element = document.getElementById("command")! as HTMLInputElement;
      const input = element.value.trim();
      const results = findMatch(input);
      if (results.length > 0) {
        const country = results[0].item;
        setFormData((prevData) => ({
          ...prevData,
          consoleText: String("> " + country),
        }));
      } else if (input.length >= 1) {
        setFormData((prevData) => ({
          ...prevData,
          consoleText: "> " + input,
        }));
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [formData.inputStage]);

  const handleInput = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        const element = event.target as HTMLInputElement;
        const input = element.value.trim();
        const timer = document.getElementById("SpeakingParametersTime")!;
        const {
          inputStage,
          time,
          extensions,
          title,
          countries,
          defaultTime,
          speakerListMode,
        } = formData;

        switch (inputStage) {
          case InputStage.None:
            break;
          case InputStage.SetQuorum:
            if (!isNaN(parseInt(input))) {
              setFormData((prevData) => ({
                ...prevData,
                quorum: parseInt(input),
                consoleText: "> mun.track ready",
                inputStage: InputStage.None,
              }));
            } else {
              invalidInput();
            }
            element.value = "";
            return;
          case InputStage.SetTitle:
            setFormData((prevData) => ({
              ...prevData,
              title: input,
              consoleText: "> mun.track ready",
              inputStage: InputStage.None,
            }));
            element.value = "";
            return;
          case InputStage.SetTime:
            if (!isNaN(parseInt(input))) {
              setFormData((prevData) => ({
                ...prevData,
                time: parseInt(input),
                defaultTime: parseInt(input),
                consoleText: "> mun.track ready",
                inputStage: InputStage.None,
              }));
              timer.classList.remove("ontime", "overtime");
            } else {
              invalidInput();
            }
            element.value = "";
            return;
          case InputStage.SetExtensions:
            if (!isNaN(parseInt(input))) {
              setFormData((prevData) => ({
                ...prevData,
                extensions: parseInt(input),
                consoleText: "> set extension time to?",
                inputStage: InputStage.SetExtensionTime,
              }));
            } else {
              invalidInput();
            }
            element.value = "";
            return;
          case InputStage.SetExtensionTime:
            if (!isNaN(parseInt(input))) {
              setFormData((prevData) => ({
                ...prevData,
                extensionTime: parseInt(input),
                consoleText: "> mun.track ready",
                inputStage: InputStage.None,
              }));
            } else {
              invalidInput();
            }
            element.value = "";
            return;
          case InputStage.addCountry:
            if (input.toLowerCase() === "q") {
              setFormData((prevData) => ({
                ...prevData,
                inputStage: InputStage.None,
                consoleText: "> mun.track ready",
              }));
            } else {
              const results = findMatch(input);
              if (results.length > 0) {
                const country = results[0].item;
                setFormData((prevData) => ({
                  ...prevData,
                  countries: prevData.countries.map((arr, index) =>
                    index === speakerListMode ? [...arr, country] : arr
                  ),
                  consoleText: "> add? (q to exit)",
                }));
              } else {
                setFormData((prevData) => ({
                  ...prevData,
                  // This line makes so that the countries are added to the current list of speakers without overwriting the previous ones
                  countries: prevData.countries.map((arr, index) =>
                    index === speakerListMode ? [...arr, input] : arr
                  ),
                  consoleText: "> add? (q to exit)",
                  // countries: [...prevData.countries, input],
                }));
              }
            }
            element.value = "";
            return;
          case InputStage.deleteCountry:
            if (input.toLowerCase() === "q") {
              setFormData((prevData) => ({
                ...prevData,
                inputStage: InputStage.None,
                consoleText: "> mun.track ready",
              }));
              element.value = "";
            } else if (!isNaN(parseInt(input))) {
              if (countries[speakerListMode].length >= parseInt(input) - 1) {
                setFormData((prevData) => ({
                  ...prevData,
                  countries: prevData.countries.map((arr, index) =>
                    index === speakerListMode
                      ? arr.filter((_, index) => index !== parseInt(input) - 1)
                      : arr
                  ),

                  // countries: prevData.countries.filter(
                  // (_, index) => index !== parseInt(input) - 1
                  // ),
                  inputStage: InputStage.deleteCountry,
                }));
              }
            } else {
              invalidInput();
            }
            element.value = "";
            return;
          case InputStage.flipFrom:
            if (!isNaN(parseInt(input))) {
              setFormData((prevData) => ({
                ...prevData,
                flipFrom: parseInt(input),
                consoleText: "> flip to?",
                inputStage: InputStage.flipTo,
              }));
            } else {
              invalidInput("> invalid country");
            }
            element.value = "";
            return;
          case InputStage.flipTo:
            if (!isNaN(parseInt(input))) {
              if (countries.length >= parseInt(input) - 1) {
                swapIndexes(
                  countries[speakerListMode],
                  formData.flipFrom - 1,
                  parseInt(input) - 1
                );
                setFormData((prevData) => ({
                  ...prevData,
                  flipFrom: 0,
                  flipTo: 0,
                  consoleText: "> mun.track ready",
                  inputStage: InputStage.None,
                }));
              } else {
                invalidInput("> invalid country");
              }
            } else {
              invalidInput();
            }
            element.value = "";
            return;
          case InputStage.insertCountry:
            setFormData((prevData) => ({
              ...prevData,
              insertCountry: input,
              inputStage: InputStage.insertCountryPos,
              consoleText: "> insert where?",
            }));
            element.value = "";
            return;
          case InputStage.insertCountryPos:
            if (!isNaN(parseInt(input))) {
              setFormData((prevData) => ({
                ...prevData,
                // countries: [
                // ...prevData.countries.slice(0, parseInt(input) - 1),
                // prevData.insertCountry,
                // ...prevData.countries.slice(parseInt(input) - 1),
                // ],
                countries: prevData.countries.map((arr, index) =>
                  index === speakerListMode
                    ? [
                        ...arr.slice(0, parseInt(input) - 1),
                        prevData.insertCountry,
                        ...arr.slice(parseInt(input) - 1),
                      ]
                    : arr
                ),
                insertCountry: "",
                insertCountryPos: 0,
                consoleText: "> mun.track ready",
                inputStage: InputStage.None,
              }));
            } else {
              invalidInput("> invalid country");
            }
            element.value = "";
            return;
          case InputStage.setTimerTime:
            if (input.match(/^\d{1,2}:[0-9]\d$/)) {
              let timePortions = input
                .split(":")
                .map((portion) => parseInt(portion));
              if (timePortions[1] > 59) {
                timePortions[0] += Math.floor(timePortions[1] / 60);
                timePortions[1] %= 60;
              }
              openTimerPopup(timePortions[0], timePortions[1]);
            } else {
              invalidInput("> invalid time");
            }
            setFormData((prevData) => ({
              ...prevData,
              inputStage: InputStage.None,
              consoleText: "> mun.track ready",
            }));
            element.value = "";
            return;
        }

        if (
          // Here, the quorum command is handled
          input.toLowerCase() === "setquorum" ||
          input.toLowerCase() === "sq"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            inputStage: InputStage.SetQuorum,
            consoleText: "> set quorum to?",
          }));
          element.value = "";
        } else if (input.toLowerCase() === "settitle") {
          // Here, the set title command is handled
          setFormData((prevData) => ({
            ...prevData,
            inputStage: InputStage.SetTitle,
            consoleText: "> set title to?",
          }));
          element.value = title;
          element.select();
        } else if (
          // Here, the set time command is handled
          input.toLowerCase() === "settime" ||
          input.toLowerCase() === "st"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            inputStage: InputStage.SetTime,
            consoleText: "> set time to?",
          }));
          element.value = "";
          replaceAndSelect(element, time);
        } else if (
          // Here, the set extensions command is handled
          input.toLowerCase() === "setexts" ||
          input.toLowerCase() === "se"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            inputStage: InputStage.SetExtensions,
            consoleText: "> set extensions to?",
          }));
          element.value = "";
          replaceAndSelect(element, extensions);
        } else if (
          // Here, the add command is handled
          input.toLowerCase() === "add" ||
          input.toLowerCase() === "a"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            inputStage: InputStage.addCountry,
            consoleText: "> add? (q to exit)",
          }));
          element.value = "";
        } else if (
          // Here, the delete command is handled
          input.toLowerCase() === "delete" ||
          input.toLowerCase() === "d"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            inputStage: InputStage.deleteCountry,
            consoleText: "> delete? (q to exit)",
          }));
          element.value = "";
        } else if (
          // Here, the flip command is handled
          input.toLowerCase() === "flip" ||
          input.toLowerCase() === "f"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            inputStage: InputStage.flipFrom,
            consoleText: "> flip?",
          }));
          element.value = "";
        } else if (
          input.toLowerCase() === "next" ||
          input.toLowerCase() === "n"
        ) {
          if (curr_speaker < countries.length - 1) {
            setFormData((prevData) => ({
              ...prevData,
              curr_speaker: curr_speaker + 1,
              time: defaultTime,
              isRunning: false,
            }));
            timer.classList.remove("ontime", "overtime");
          }
          element.value = "";
        } else if (
          input.toLowerCase() === "prev" ||
          input.toLowerCase() === "p"
        ) {
          if (curr_speaker > 0) {
            setFormData((prevData) => ({
              ...prevData,
              curr_speaker: curr_speaker - 1,
              time: defaultTime,
              isRunning: false,
            }));
            timer.classList.remove("ontime", "overtime");
          }
          element.value = "";
        } else if (
          input.toLowerCase() === "insert" ||
          input.toLowerCase() === "i"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            inputStage: InputStage.insertCountry,
            consoleText: "> insert?",
          }));
          element.value = "";
        } else if (
          input.toLowerCase() === "extend" ||
          input.toLowerCase() === "e"
        ) {
          if (extensions > 0) {
            setFormData((prevData) => ({
              ...prevData,
              time: prevData.time + prevData.extensionTime,
              extensions: prevData.extensions - 1,
            }));
          } else {
            invalidInput("> no remaining extensions");
            document
              .getElementById("SpeakingParametersExtensions")!
              .classList.add("overtime");
          }
          element.value = "";
        } else if (
          input.toLowerCase() === "switch" ||
          input.toLowerCase() === "s"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            speakerListMode: (prevData.speakerListMode + 1) % qtyModes,
          }));
          element.value = "";
        } else if (
          input.toLowerCase() === "help" ||
          input.toLowerCase() === "h"
        ) {
          openHelpPopup();
          element.value = "";
        } else if (
          input.toLowerCase() === "timer" ||
          input.toLowerCase() === "t"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            inputStage: InputStage.setTimerTime,
            consoleText: "> set timer to? (mm:ss)",
          }));
          element.value = "";
          replaceAndSelect(element, "5:00");
        } else {
          invalidInput("> unrecognized command. try again?");
          element.value = "";
        }
        return;
      }
    },
    [formData]
  );

  const replaceAndSelect = (
    element: HTMLInputElement,
    value: number | string
  ) => {
    element.value = "";
    if (value !== 0) {
      element.value = String(value);
      element.select();
    }
  };

  const swapIndexes = (arr: string[], idx1: number, idx2: number) => {
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  };

  const invalidInput = (message = "> not a number") => {
    setFormData((prevData) => ({
      ...prevData,
      consoleText: message,
      inputStage: InputStage.None,
    }));
  };

  const {
    quorum,
    time,
    extensions,
    extensionTime,
    title,
    consoleText,
    countries,
    curr_speaker,
    speakerListMode,
  } = formData;

  const [isHelpPopupOpen, setHelpPopupOpen] = useState(false);
  const [timerPopupData, setTimerPopupData] = useState({
    isOpen: false,
    minutes: 0,
    seconds: 0,
  });

  const modeSpeakersList = (speakerMode: number) => {
    if (speakerMode === SpeakerListMode.Rolling) {
      return (
        <SpeakersWidget
          heading="Rolling Speakers List"
          speakers={countries[SpeakerListMode.Rolling]}
          curSpeaker={curr_speaker}
        ></SpeakersWidget>
      );
    } else if (speakerMode === SpeakerListMode.General) {
      return (
        <SpeakersWidget
          heading="General Speakers List"
          speakers={countries[SpeakerListMode.General]}
          curSpeaker={curr_speaker}
        ></SpeakersWidget>
      );
    } else if (speakerMode === SpeakerListMode.Voting) {
      return (
        <SpeakersWidget
          heading="Voting Speakers List"
          speakers={countries[SpeakerListMode.Voting]}
          curSpeaker={curr_speaker}
          mode="Voting"
        ></SpeakersWidget>
      );
    }
  };

  const openHelpPopup = () => {
    setHelpPopupOpen(true);
  };
  const closeHelpPopup = () => {
    setHelpPopupOpen(false);
  };
  const openTimerPopup = (mins: number, secs: number) => {
    setTimerPopupData(() => ({
      isOpen: true,
      minutes: mins,
      seconds: secs,
    }));
  };
  const closeTimerPopup = () => {
    setTimerPopupData(() => ({
      isOpen: false,
      minutes: 0,
      seconds: 0,
    }));
  };

  const delegateCount = useMemo(
    () =>
      new Map([
        ["Quorum", `${quorum} delegates`],
        ["Majority", `${Math.ceil(quorum / 2)} `],
        ["2/3 Majority", `${Math.ceil((quorum * 2) / 3)} `],
        ["20 Percent", ` ${Math.ceil(quorum * 0.2)} `],
        ["10 Percent", `${Math.ceil(quorum * 0.1)} `],
      ]),
    [quorum]
  );

  const speakingParameters = useMemo(
    () =>
      new Map([
        ["Time", `${time} seconds`],
        ["Extensions", `${extensions}x ${extensionTime}s`],
      ]),
    [time, extensions, extensionTime]
  );
  return (
    <div>
      <HelpPopup
        closePopup={closeHelpPopup}
        isOpen={isHelpPopupOpen}
      ></HelpPopup>
      {timerPopupData.isOpen ? (
        <TimerPopup
          minutes={timerPopupData.minutes}
          seconds={timerPopupData.seconds}
          isOpen={timerPopupData.isOpen}
        ></TimerPopup>
      ) : null}
      <Title>{title}</Title>
      <div className="screen">
        <div className="left-side">
          <div className="widget">
            <InfoWidget
              heading={"Delegate Count"}
              items={delegateCount}
            ></InfoWidget>
          </div>
          <div className="widget">
            <InfoWidget
              heading={"Speaking Parameters"}
              items={speakingParameters}
            ></InfoWidget>
          </div>
        </div>
        <div className="right-side">
          <div className="widget">{modeSpeakersList(speakerListMode)}</div>
        </div>
      </div>
      <div className="controls">
        <div className="console" id="console">
          {consoleText}
        </div>
        <input
          className="command"
          id="command"
          type="text"
          autoFocus={true}
          onBlur={({ target }) => target.focus()}
          onKeyDown={handleInput}
        ></input>
      </div>
    </div>
  );
}

export default App;
