import React, { useState } from "react";
import { RequestBox } from "../RequestBox/RequestBox";
import { ResponseExample } from "../ApiExamples/ResponseExample";

export function InteractiveRequest({ request }: { request: string }) {
  const [response, setResponse] = useState("");
  return (
    <>
      <RequestBox request={request} onResponse={setResponse} />
      {response && <ResponseExample title="Response" code={response} />}
    </>
  );
}
