import React, { useState } from "react";

import dynamic from "next/dynamic";

// import QrReader from "react-qr-reader";

const QrReader = dynamic(() => import("react-qr-reader"), {
  ssr: false,
});
const Test = (props) => {
  const [data, setData] = useState(null);

  const handleErrorFile = (error) => {
    console.error(error);
  };

  const handleScanFile = (result) => {
    if (result) {
      setData(result);
    }
  };

  return (
    <>
      <div style={{ width: 500 }}>
        {/* <QrReader
          onResult={(result, error) => {
            console.log({ result });
            // if (!!result) {
            //   setData(result?.text);
            // }

            // if (!!error) {
            //   //   console.error(error);
            // }
          }}
          scanDelay={1000}
          style={{ width: "100%" }}
        /> */}
        {!data && (
          <QrReader
            // ref={qrRef}
            delay={1000}
            onError={handleErrorFile}
            onScan={handleScanFile}
            style={{ width: "100%" }}
          />
        )}
      </div>
      <p>{data}</p>
    </>
  );
};

export default Test;
