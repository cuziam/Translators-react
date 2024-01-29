import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  Fragment,
} from "react";
import { ReactDOM } from "react-dom";
import ClientMessage from "./ClientMessage";
import ServerMessage from "./ServerMessage";
import { Dialog, Transition } from "@headlessui/react";
const AiChat = ({ webSocketRef, shouldAiChatOpen, updateShouldAiChatOpen }) => {
  /**
   * 상위컴포넌트가 전달한 webSocketRef를 이용하여 서버로 메시지를 전송합니다.
   * 서버로 전송할 메세지는 문자열이어야 하며 clientMessage라는 이벤트명으로 전송합니다.
   * 응답 메세지는 문자열이며 서버에서 serverMessage라는 이벤트를 통해 전달받습니다.
   */

  const cancelButtonRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const textareaRef = useRef(null);

  const initialHistory = [
    {
      role: "server",
      isLoading: false,
      message: "Hi, I'm AI chatbot. How can I help you?",
    },
  ];
  const [history, setHistory] = useState(initialHistory);

  //history에 새로운 기록을 추가합니다.
  const addHistory = useCallback((role, message) => {
    if (role !== "user" && role !== "server") {
      console.log("role is not user or server");
      return;
    }
    if (typeof message !== "string") {
      console.log("message is not string");
      return;
    }
    //새로운 기록을 추가합니다. 서버의 경우 로딩 여부도 추가합니다.
    const record = {
      role: role,
      isLoading: role === "server",
      message: message,
    };
    setHistory((prev) => [...prev, record]);
  }, []);

  const updateLastServerMessage = useCallback((message) => {
    setHistory((prev) => {
      const lastRecord = prev[prev.length - 1];
      if (lastRecord.role === "server") {
        lastRecord.isLoading = false;
        lastRecord.message = message;
      }
      return [...prev];
    });
  }, []);

  //서버로 메세지를 전송하고 응답을 받습니다. updateHistory를 이용해 기록도 추가합니다.
  const sendMessage = useCallback(
    (message) => {
      addHistory("user", message);
      textareaRef.current.value = "";
      addHistory("server", "");
      webSocketRef.current.emit("clientMessage", message, (response) => {
        updateLastServerMessage(response);
      });
    },
    [webSocketRef, addHistory]
  );

  //history가 변경될 때마다 스크롤을 맨 아래로 내립니다.
  useEffect(() => {
    const chatContainer = chatHistoryRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [history]);

  return (
    <Transition.Root show={shouldAiChatOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden max-h-screen rounded-lg  bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white dark:bg-disabled text-white px-4 pt-2 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base align-middle content-center font-bold leading-10 text-gray-900 dark:text-white"
                      >
                        Ask to AI assistant
                      </Dialog.Title>
                      <div className="container">
                        <div
                          ref={chatHistoryRef}
                          className="w-full h-96 flex flex-col justify-start overflow-y-auto"
                        >
                          {history.map((record, index) => {
                            if (record.role === "user") {
                              return (
                                <ClientMessage
                                  key={index}
                                  message={record.message}
                                />
                              );
                            } else {
                              return (
                                <ServerMessage
                                  key={index}
                                  isLoading={record.isLoading}
                                  message={record.message}
                                />
                              );
                            }
                          })}
                        </div>
                        <div className="w-full py-2 flex items-end gap-1">
                          <textarea
                            ref={textareaRef}
                            className="w-full font-sans py-2 px-3 rounded-xl focus:ring-primary focus:border-primary text-base"
                            placeholder="type your message here..."
                          />
                          <button
                            className="send w-6 h-6 rounded-xl bg-primary"
                            onClick={() => {
                              sendMessage(textareaRef.current.value);
                            }}
                          >
                            &uarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-disabled px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="cancel inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      updateShouldAiChatOpen(false);
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AiChat;
