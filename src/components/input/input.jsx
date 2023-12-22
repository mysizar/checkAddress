import "./input.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Input({ list, setter, ph }) {
  const [inputValue, setInputValue] = useState("");

  const addNewItem = () => {
    if (!inputValue.trim()) return;
    setter(inputValue);
    setInputValue(inputValue);
  };

  const addSuggestion = (suggestion) => {
    setter(suggestion);
    setInputValue(suggestion + " ");
  };

  return (
    <>
      <div className="add-item-wrapper">
        <div className="add-item-box">
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className="add-item-input"
            placeholder={ph}
          />
          <FontAwesomeIcon icon={faPlus} onClick={() => addNewItem()} />
        </div>
        <div className="dropdown">
          {list
            .filter((item) => {
              const searchTerm = inputValue.toLowerCase();
              const fullName = item.toLowerCase();

              return (
                searchTerm &&
                fullName.includes(searchTerm) &&
                fullName !== searchTerm
              );
            })
            .slice(0, 10)
            .map((item, index) => (
              <div
                key={index}
                onClick={() => addSuggestion(item)}
                className="dropdown-row"
              >
                {item}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Input;

Input.propTypes = {
  list: PropTypes.array,
  setter: PropTypes.func,
  ph: PropTypes.string,
};
