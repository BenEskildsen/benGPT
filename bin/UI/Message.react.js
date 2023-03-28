const React = require('react');
const {
  TextArea
} = require('bens_ui_components');
const {
  debounce
} = require('bens_utils').helpers;
const {
  useEffect,
  useState,
  useMemo
} = React;
const resetSize = (name, index) => {
  const elem = document.getElementById("text_area_" + name + "_" + index);
  if (!elem) return;
  elem.style.height = 0;
  setTimeout(() => {
    elem.style.height = elem.scrollHeight + 'px';
  }, 0);
};
const debounceResetSize = debounce(resetSize, 300);
const Message = props => {
  const {
    roleNames,
    index,
    onEdit,
    name
  } = props;
  const {
    role,
    content
  } = props.message;
  useEffect(() => {
    resetSize(name, index);
  }, [name]);
  useEffect(() => {
    const elem = document.getElementById("text_area_" + name + "_" + index);
    if (!elem) return;
    elem.style.height = elem.scrollHeight + 'px';
    debounceResetSize(name, index);
  }, [content]);
  let displayContent = content;
  if (onEdit) {
    displayContent = /*#__PURE__*/React.createElement(TextArea, {
      id: "text_area_" + name + "_" + index,
      style: {
        border: 'none',
        font: 'inherit',
        resize: 'none',
        width: '100%',
        height: 'auto',
        flex: 1
      },
      value: content,
      onChange: value => {
        onEdit({
          role,
          content: value
        }, index);
      },
      onFocus: () => {
        setTimeout(() => {
          dispatch({
            type: 'SET_EDITING_PREVIOUS',
            isEditingPreviousMessage: true
          });
        }, 100);
      },
      onBlur: () => {
        dispatch({
          type: 'SET_EDITING_PREVIOUS',
          isEditingPreviousMessage: false
        });
      }
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      whiteSpace: 'pre-wrap',
      display: 'flex',
      // flex: 1,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("b", null, roleNames && roleNames[role] ? roleNames[role] : role), ": ", displayContent);
};
module.exports = Message;