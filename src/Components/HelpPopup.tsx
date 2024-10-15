import Popup from "reactjs-popup";
// Install it using npm install reactjs-popup

interface Props {
  isOpen: boolean;
  closePopup: () => void;
}
const HelpPopup = ({ isOpen, closePopup }: Props) => {
  const popupItems = (
    <>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">help</li>
        <li className="list-group-popup-explanation">
          Display this help dialog
        </li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">settitle</li>
        <li className="list-group-popup-explanation">Set title</li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">setquorum</li>
        <li className="list-group-popup-explanation">Set quorum</li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">settime</li>
        <li className="list-group-popup-explanation">Set speaking time</li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">setexts</li>
        <li className="list-group-popup-explanation">
          Set speaking extensions
        </li>
      </ul>
      <ul className="list-group-popup">
        <li>&nbsp;</li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">add</li>
        <li className="list-group-popup-explanation">
          Add delegates to current speakers list
        </li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">insert</li>
        <li className="list-group-popup-explanation">
          Insert delegate into current speakers list
        </li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">change</li>
        <li className="list-group-popup-explanation">
          Change delegate in current speakers list
        </li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">flip</li>
        <li className="list-group-popup-explanation">
          Flip delegates in current speakers list
        </li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">delete</li>
        <li className="list-group-popup-explanation">
          Remove delegates from current speakers list
        </li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">next</li>
        <li className="list-group-popup-explanation">Advance speakers list</li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">prev</li>
        <li className="list-group-popup-explanation">
          Return to the previous delegate in speakers list
        </li>
      </ul>
      <ul className="list-group-popup">
        <li>&nbsp;</li>
      </ul>

      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">switch</li>
        <li className="list-group-popup-explanation">
          Switch between rolling/general/voting speakers list
        </li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">vote</li>
        <li className="list-group-popup-explanation">Enter voting procedure</li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">extend</li>
        <li className="list-group-popup-explanation">
          Extend the current delegate's speaking time
        </li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li className="list-group-popup-title">timer</li>
        <li className="list-group-popup-explanation">
          Start a large timer (for caucuses)
        </li>
      </ul>
      <ul className="list-group list-group-horizontal list-group-popup">
        <li style={{ width: "76px" }}>spacebar</li>
        <li className="list-group-popup-explanation">
          Start/stop speaking timer
        </li>
      </ul>
    </>
  );
  return (
    <Popup open={isOpen} position="right center" closeOnDocumentClick={false}>
      <div className="ui-dialog">
        {/* Here, clearfix is a bootstrap class used in a parent class to properly wrap the children elements inside it */}
        <div className="ui-header clearfix">
          <span className="ui-dialog-title">Help</span>
          <a
            className="ui-dialog-close"
            role="button"
            onClick={() => closePopup()}
          >
            <span className="ui-dialog-close-icon"></span>
          </a>
        </div>
        <div className="ui-dialog-content">
          <p className="explanation-p">
            mun.track functions much like a standard command line. Type the
            following commands in the textbox at the bottom of the page, and
            follow the relevant prompts.
          </p>
          <br></br>
          {popupItems}
          <br></br>
          <p className="explanation-p">
            Confused? <a href="//google.com">Get more help!</a>
          </p>
          <br></br>
          <aside>
            mun.track is free software.
            <a href="//google.com">Download source.</a>
          </aside>
        </div>
      </div>
    </Popup>
  );
};
export default HelpPopup;
