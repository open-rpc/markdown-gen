import React, { type PropsWithChildren } from "react";
import {
  RequestExample,
  ResponseExample,
  TwoColumnLayout,
} from "../../ApiExamples";
type IParams = {
  openrpcDocument: any;
  method: string;
  ref: React.RefObject<HTMLDialogElement | null>;
  onClose: () => void;
} & PropsWithChildren;

export const TryNowDialog: React.FC<IParams> = (params) => {
  return (
    <dialog ref={params.ref} onClose={params.onClose}>
      <h2>Try It Now Super Dialog</h2>
      <form method="dialog" onSubmit={() => params.ref.current?.close()}>
        <button type="submit" onClick={params.onClose}>
          {/*          <TwoColumnLayout
            sidebar={
              <>
                <RequestExample
                  code={JSON.stringify(params.openrpcDocument.params, null, 2)}
                />
                <ResponseExample
                  code={JSON.stringify(params.openrpcDocument.result, null, 2)}
                />
              </>
            }
          >
            {params.children ?? <div>main</div>}
          </TwoColumnLayout>
          */}
          {params.children ?? <div>main</div>}
        </button>
      </form>
    </dialog>
  );
};
