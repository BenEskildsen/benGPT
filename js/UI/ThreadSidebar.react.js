const React = require('react');
const {createConversation} = require('../gpt');
const {
  Button
} = require('bens_ui_components');
const ThreadTitle = require('./ThreadTitle.react');


const ThreadSidebar = (props) => {
  const {state, dispatch} = props

  const convoHeaders = [];
  let i = 0;
  for (const name in state.conversations) {
    const conversation = state.conversations[name];
    convoHeaders.push(<ThreadTitle
      key={"convo_" + i}
      state={state} dispatch={dispatch}
      conversation={conversation} name={name}
    />);
    i++;
  }

  return (
    <div
      style={{
        width: 250,
        height: '100%',
        overflowY: 'scroll',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginLeft: 5,
        gap: 15,
        paddingTop: 15,
      }}
    >
      {convoHeaders}
      <Button
        label="New Conversation"
        style={{
          display: 'block',
          marginTop: 15,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 20,
          paddingRight: 20,
        }}
        onClick={() => {
          dispatch({type: 'ADD_CONVERSATION',
            conversation: createConversation({
              name: 'conversation ' + (Object.keys(state.conversations).length + 1),
              placeholder: 'Type anything...', tokens: 0,
            }),
            shouldSelect: true,
          });
        }}
      />


    </div>
  );
}

module.exports = ThreadSidebar;
