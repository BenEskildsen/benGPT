const React = require('react');
const Chat = require('./Chat.react');
const {
  createConversation,
  submitConversation,
  addMessage
} = require('../gpt');
const {
  useState,
  useEffect,
  useMemo
} = React;

/**
 *  A thin wrapper around chat threads for the purpose of supporting
 *  multiple threads at once
 */
function Thread(props) {
  const {
    conversation,
    dispatch,
    submitOnEnter,
    apiKey,
    style
  } = props;
  const updateConversation = convo => {
    dispatch({
      type: 'UPDATE_CONVERSATION',
      conversation: convo
    });
  };
  return /*#__PURE__*/React.createElement(Chat, {
    style: {
      height: '100%',
      margin: 'none',
      marginTop: 0,
      flexGrow: 1,
      ...style
    },
    conversation: conversation,
    onSubmit: (message, toAPI) => {
      let nextConversation = conversation;
      if (message.content != '') {
        nextConversation = addMessage(conversation, message);
        updateConversation(nextConversation);
      }
      if (toAPI) {
        dispatch({
          type: 'SET_AWAITING',
          awaitingResponse: true
        });
        submitConversation(nextConversation, apiKey).then(response => {
          // console.log(response.usage, response.finishReason);
          const nextConvo = {
            ...addMessage(nextConversation, response.message),
            tokens: response.tokens
          };
          updateConversation(nextConvo);
          dispatch({
            type: 'SET_AWAITING',
            awaitingResponse: false
          });
        }).catch(ex => {
          console.error(ex);
        });
      }
    },
    submitOnEnter: submitOnEnter,
    onClear: () => {
      const nextConvo = {
        ...conversation,
        messages: conversation.messages.filter(m => m.role == 'system')
      };
      updateConversation(nextConvo);
    },
    onUndo: () => {
      const nextConvo = {
        ...conversation,
        messages: conversation.messages.slice(0, -1)
      };
      updateConversation(nextConvo);
    },
    onEdit: (message, index) => {
      const nextConvo = {
        ...conversation
      };
      nextConvo.messages[index] = message;
      updateConversation(nextConvo);
    },
    showRole: true,
    showClear: true,
    showSystem: true
  });
}
module.exports = Thread;