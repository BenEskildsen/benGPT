const React = require('react');
const {
  Button, Modal, Divider, TextArea, TextField,
  useHotKeyHandler, hotKeyReducer, useEnhancedReducer,
  Dropdown, Checkbox,
} = require('bens_ui_components');
const Message = require('./Message.react');
const {useState, useMemo, useEffect, useRef} = React;

/**
 *  type Conversation = {
 *    messages: Array<{role: 'system' | 'user' | 'assistant', content: string}>,
 *    name: string, // the name of this conversation
 *    placeholder: ?string, // optional placeholder prompt
 *    roleNames: ?Object, // optional object mapping roles to display names for them
 *    ...params // additional params for GPT API
 *  }
 */

function Chat(props) {
  const {
    conversation,
    onSubmit, // (Message, toAPI) => void,
    // optional
    onClear, // only needed with showClear
    onUndo, // also tied to showClear
    style,
    showRole, showClear, showSystem,
  } = props;

  const messages = [];
  for (let i = 0; i < conversation.messages.length; i++) {
    if (conversation.messages[i].role == 'system' && !showSystem) continue;
    messages.push(<Message
      message={conversation.messages[i]} key={"message_" + i}
      roleNames={conversation.roleNames}
    />);
  }

  const [curPrompt, setCurPrompt] = useState('');
  const [role, setRole] = useState('user');

  // auto scroll on messages received
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  // text input of different sizes
  const [showBigTextBox, setShowBigTextBox] = useState(false);
  const [showTextExpander, setShowTextExpander] = useState(false);
  let textInput = (
    <div
      style={{
        width: 800,
        position: 'relative',
      }}
    >
      {
        showBigTextBox ? (
          <TextArea
            value={curPrompt}
            style={{
              resize: 'none',
              width: '100%',
              marginBottom: -8,
            }}
            rows={10}
            placeholder={conversation.placeholder ?? "ask the assistant anything"}
            onChange={setCurPrompt}
            onFocus={() => setShowTextExpander(true)}
            onBlur={() => {
              setTimeout(() => setShowTextExpander(false), 500);
            }}
          />
        ) : (
          <TextField
            value={curPrompt}
            style={{
              width: '100%',
              height: 25,
            }}
            placeholder={conversation.placeholder ?? "ask the assistant anything"}
            onChange={setCurPrompt}
            onFocus={() => setShowTextExpander(true)}
            onBlur={() => {
              setTimeout(() => setShowTextExpander(false), 500);
            }}
          />
        )
      }
      {showTextExpander ? (
        <Button
          label={showBigTextBox ? 'V' : '^'}
          onClick={() => setShowBigTextBox(!showBigTextBox)}
          style={{
            position: 'absolute',
            height: 25, width: 30,
            top: -25, left: 0,
          }}
        />
      ) : null}
    </div>
  );

  const [submitToAPI, setSubmitToAPI] = useState(true);

  // press enter to submit
  const [hotKeys, hotKeyDispatch, getHotKeyState] = useEnhancedReducer(hotKeyReducer);
  useHotKeyHandler({dispatch: hotKeyDispatch, getState: getHotKeyState});
  useEffect(() => {
    hotKeyDispatch({type: 'SET_HOTKEY', key: 'enter', press: 'onKeyDown', fn: () => {
      if (!showBigTextBox) {
        submitPrompt(role, onSubmit, curPrompt, setCurPrompt, submitToAPI);
      }
    }});
  }, [curPrompt, role, showBigTextBox, submitToAPI, conversation]);

  return (
    <div
      style={{
        width: 800,
        margin: 'auto',
        marginTop: 15,
        ...style,
      }}
    >
      <div
        style={{
          border: '1px solid black',
          width: '100%',
          height: `calc(100% - ${showBigTextBox ? '195px' : '60px'})`,
          overflowY: 'scroll',
          padding: 4,
          paddingBottom: 64,
          boxShadow: 'inset -0.3em -0.3em 0.5em rgba(0,0,0,0.3)',
        }}
      >
        {messages}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          alignItems: 'baseline',
        }}
      >
        {showRole ? (
          <React.Fragment>
            <Dropdown
              style={{
                width: 70,
                height: 25,
              }}
              options={['user', 'system', 'assistant']}
              selected={role}
              onChange={setRole}
            />
            <Checkbox
              label={"Submit"}
              checked={submitToAPI}
              onChange={setSubmitToAPI}
              style={{display: 'inherit'}}
            />
          </React.Fragment>
        ) : null}
        {textInput}
        <Button
          label="Submit"
          onClick={() => {
            submitPrompt(role, onSubmit, curPrompt, setCurPrompt, submitToAPI);
          }}
        />
        {showClear ? (
          <React.Fragment>
            <Button
              label="Undo"
              onClick={onUndo}
            />
            <Button
              label="Clear"
              onClick={onClear}
            />
          </React.Fragment>
        ) : null}
      </div>

    </div>
  );
}

const submitPrompt = (
  role, onSubmit,
  curPrompt, setCurPrompt, submitToAPI,
) => {
  onSubmit({role, content: curPrompt}, submitToAPI);
  setCurPrompt('');
};

module.exports = Chat;
