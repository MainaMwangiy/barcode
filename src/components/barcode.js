import React, { useState, useRef, useEffect } from 'react';
import { BarcodeFormat, BrowserMultiFormatReader, ChecksumException, FormatException, NotFoundException } from '@zxing/library';

const BarCodeScanner = ({ onCodeDecoded }) => {
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [code, setCode] = useState("");
    const [videoInputDevices, setVideoInputDevices] = useState([]);
    const [hideSwipper, setHideSwipper] = useState("hide-swipper");
    const codeReader = new BrowserMultiFormatReader();

    useEffect(() => {
        codeReader
            .listVideoInputDevices()
            .then(videoInputDevices => {
                setupDevices(videoInputDevices);
            })
            .catch(err => {
                console.error(err);
            });
    }, [codeReader]);
    console.log("Hello")
    function setupDevices(videoInputDevices) {
        // get the list of available media devices
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                // find the back-facing camera
                const backCamera = devices.find(device => device.kind === 'videoinput' && device.label.toLowerCase().includes('back'));
                // get the capabilities of the camera
                navigator.mediaDevices.getUserMedia({ video: { deviceId: backCamera ? backCamera.deviceId : devices.deviceId } })
                    .then(stream => {
                        const track = stream.getVideoTracks()[0];
                        const capabilities = track.getCapabilities();
                        const facingMode = capabilities.facingMode[0];
                        // if facing mode is environment, use it as the default camera
                        if (facingMode === 'environment') {
                            setSelectedDeviceId(backCamera.deviceId);
                            setVideoInputDevices(videoInputDevices);
                        }
                        // Otherwise use the first available device
                        // else{
                        //     setSelectedDeviceId(videoInputDevices[0].deviceId);
                        //     setVideoInputDevices(videoInputDevices);
                        // }
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    }

    function decodeContinuously(selectedDeviceId) {
        let decoding = false;
        codeReader.decodeFromInputVideoDeviceContinuously(
            selectedDeviceId,
            "video",
            (result, err) => {
                if (result && !decoding) {
                    // properly decoded qr code or barcode
                    setCode(result.getText());
                    // call the onCodeDecoded function to pass the decoded code to the parent component
                    onCodeDecoded(result.getText());
                    // stop the video after decoding the barcode
                    codeReader.stop();
                    decoding = true;
                }

            },
            [
                BarcodeFormat.CODE_128,
                BarcodeFormat.CODE_39,
                BarcodeFormat.CODE_93,
                BarcodeFormat.CODABAR,
                BarcodeFormat.DATA_MATRIX,
                BarcodeFormat.EAN_13,
                BarcodeFormat.EAN_8,
                BarcodeFormat.ITF,
                BarcodeFormat.QR_CODE,
                BarcodeFormat.UPC_A,
                BarcodeFormat.UPC_E,
                BarcodeFormat.UPC_EAN_EXTENSION
            ],
        );
    }

    useEffect(() => {
        decodeContinuously(selectedDeviceId);
    }, [selectedDeviceId]);

    useEffect(() => {
        setTimeout(() => setHideSwipper(""), 2000)
        return () => {
            setHideSwipper("hide-swipper")
        }
    }, [])

    return (
        <div style={{ position: "absolute", height: "200px", top: "31%", left: "30%", maxWidth: "64%" }} >
            { }
            <div className={`swipper ${hideSwipper}`}></div>
            <video id="video" height="200" />
        </div>
    );
}