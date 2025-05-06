'use client';
import React from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
        refCallback: (ref: SignatureCanvas | null) => void;
        width: number;
        height: number;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ refCallback, width, height }) => {
return (
<SignatureCanvas
    penColor="black"
    canvasProps={{
    width,
    height,
    className: 'bg-white rounded shadow',
}}
ref={refCallback}
/>
);
};

export default SignaturePad;