import React from "react";

type IParams = {
  openrpcDocument: any;
  method: string;
  onClick: () => void;
};

export const TryNowButton: React.FC<IParams> = (params) => {
  return (
    <button
      className="button button--primary button--lg"
      onClick={params.onClick}
    >
      Try It Now
    </button>
  );
};
