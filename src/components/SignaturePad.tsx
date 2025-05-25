import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  width?: number;
  height?: number;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, width = 5000, height = 200 }) => {
  const sigPad = useRef<SignatureCanvas>(null);

  const clear = () => {
    if (sigPad.current) {
      sigPad.current.clear();
    }
  };

  const save = () => {
    if (sigPad.current) {
      const trimmedDataURL = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
      onSave(trimmedDataURL);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <SignatureCanvas
          ref={sigPad}
          canvasProps={{
            width,
            height,
            className: 'signature-canvas bg-white',
          }}
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={clear}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          クリア
        </button>
        <button
          type="button"
          onClick={save}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800"
        >
          確定
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;