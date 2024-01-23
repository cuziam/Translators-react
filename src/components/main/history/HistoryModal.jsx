import { useState } from "react";
import { TranslateContext } from "../Context";

import { Dialog } from "@headlessui/react";

import HistoryModalItem from "./HistoryModalItem";

export default function HistoryModal({
  shouldModalOpen,
  updateShouldModalOpen,
  historyRef,
}) {
  //TranslateContext에서 history 불러오기

  return (
    <Dialog
      open={shouldModalOpen}
      onClose={() => updateShouldModalOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen scrollable container */}
      <div className="fixed flex inset-0 w-screen m-auto justify-center items-center">
        {/* Container to center the panel */}
        <button
          onClick={() => updateShouldModalOpen(false)}
          className="right-4 bottom-16 text-white bg-icon rounded-2xl py-1 px-3 hover:bg-gray-700 focus:outline-none focus:ring"
        >
          x
        </button>
        <div className="flex-col items-center max-h-96 overflow-y-auto justify-center w-10/12 p-4">
          {/* The actual dialog panel  */}
          <div className="Historymodal w-full overflow-y-auto bg-neutral-100 bg-opacity-80 rounded-lg shadow flex-col justify-start items-start inline-flex">
            {historyRef.current.length !== 0 ? (
              [...historyRef.current].reverse().map((historyItem, index) => {
                //historyRef.current는 history 배열,history 배열을 뒤집어서 출력
                return (
                  <HistoryModalItem
                    key={index}
                    srcText={historyItem.srcText}
                    targetText={historyItem.targetText}
                  />
                );
              })
            ) : (
              <div className="w-full p-2 bg-white bg-opacity-75 border-t-2 border-b-2 border-zinc-300 flex-col justify-start items-start inline-flex">
                번역 기록이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
