import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const InvoiceModal = ({ invoice, onClose }) => {
  const modalRoot = useRef(document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(modalRoot.current);
    return () => {
      document.body.removeChild(modalRoot.current);
    };
  }, []);

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Invoice #{invoice.id}</h2>
        <PDFViewer src="/Resume_New.pdf" />
      </ModalContent>
    </ModalOverlay>,
    modalRoot.current
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2147483647; // Maximum z-index value
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  // Center the modal content
  margin: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
`;

const PDFViewer = styled.iframe`
  width: 100%;
  height: 600px;
  border: none;
`;

export default InvoiceModal;
