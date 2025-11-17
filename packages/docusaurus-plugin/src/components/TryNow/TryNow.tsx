import React, { useEffect, useRef, useState } from "react";
import { TryNowButton } from "./TryNowButton";
import { TryNowDialog } from "./TryNowDialog";

type IParams = {
  openrpcDocument: any;
  method: string;
  onClick: () => void;
};

export const TryNow: React.FC<IParams> = (params) => {
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const dlg = dialogRef.current!;
    if (showDialog) {
      dlg.showModal();
    } else {
      dlg.close();
    }
  }, [showDialog]);

  return (
    <>
      <TryNowButton {...params} onClick={() => setShowDialog(true)} />
      <TryNowDialog
        ref={dialogRef}
        {...params}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};
