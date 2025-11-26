import React from "react";
type IParams = {
  openrpcDocument: any;
  method: string;
  ref: React.RefObject<HTMLDialogElement | null>;
  onClose: () => void;
};

export const TryNowDialog: React.FC<IParams> = (params) => {
  return (
    <dialog ref={params.ref} onClose={params.onClose}>
      <h2>Try It Now Super Dialog</h2>
      <form method="dialog" onSubmit={() => params.ref.current?.close()}>
        <button type="submit" onClick={params.onClose}>
          Close
        </button>
      </form>
    </dialog>
  );
};
