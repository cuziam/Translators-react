import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  Fragment,
} from "react";
import ClientMessage from "./ClientMessage";
import ServerMessage from "./ServerMessage";
import { Dialog, Transition } from "@headlessui/react";
const AiChat = ({ webSocketRef }) => {
  /**
   * 상위컴포넌트가 전달한 webSocketRef를 이용하여 서버로 메시지를 전송합니다.
   * 서버로 전송할 메세지는 문자열이어야 하며 clientMessage라는 이벤트명으로 전송합니다.
   * 응답 메세지는 문자열이며 서버에서 serverMessage라는 이벤트를 통해 전달받습니다.
   */

  const cancelButtonRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const textareaRef = useRef(null);

  const [history, setHistory] = useState([
    { role: "server", message: "Hi, I'm AI chatbot. How can I help you?" },
  ]);
  const [open, setOpen] = useState(true);

  const updateHistory = useCallback((role, message) => {
    if (role !== "user" && role !== "server") {
      console.log("role is not user or server");
      return;
    }
    if (typeof message !== "string") {
      console.log("message is not string");
      return;
    }
    const record = {
      role: role,
      message: message,
    };
    setHistory((prev) => [...prev, record]);
  }, []);

  const sendMessage = useCallback(
    (message) => {
      updateHistory("user", message);
      textareaRef.current.value = "";
      webSocketRef.current.emit("clientMessage", message, (response) => {
        console.log("server Message:", response);
        updateHistory("server", response);
      });
    },
    [webSocketRef, updateHistory]
  );

  useEffect(() => {
    const chatContainer = chatHistoryRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [history]);

  return (
    <Transition.Root show={open} as={Fragment}>
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
              <Dialog.Panel className="relative transform overflow-hidden max-h-screen rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-2 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base align-middle content-center font-bold leading-10 text-gray-900"
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
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="cancel inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
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
