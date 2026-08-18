import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BarcodeScanner = ({ onScan, onCancel }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a local variable for the scanner
    let html5QrcodeScanner = null;

    const onScanSuccess = (decodedText) => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(e => console.error("Failed to clear", e));
      }
      if (onScan) onScan(decodedText);
    };

    const onScanFailure = (error) => {
      // ignore
    };

    // Small delay to ensure the DOM element #reader is fully mounted
    const timeoutId = setTimeout(() => {
      html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-sm">
        <div id="reader" className="w-full bg-white rounded shadow-sm border border-gray-200"></div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
        >
          Cancel Scan
        </button>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default BarcodeScanner;
