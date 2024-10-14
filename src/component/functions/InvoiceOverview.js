import React, { useState } from 'react'
import styled from 'styled-components'
import { FaEye, FaDownload } from 'react-icons/fa'

const InvoiceOverview = ({ onInvoiceSelect }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Mock data for invoices
  const invoices = [
    { id: 1, amount: 1000, status: 'sent', dueDate: '2023-05-15' },
    { id: 2, amount: 1500, status: 'unpaid', dueDate: '2023-05-10' },
    { id: 3, amount: 2000, status: 'overdue', dueDate: '2023-05-01' },
    { id: 4, amount: 1200, status: 'paid', dueDate: '2023-05-05' },
    { id: 5, amount: 800, status: 'sent', dueDate: '2023-05-20' },
    { id: 6, amount: 1800, status: 'unpaid', dueDate: '2023-05-12' },
    { id: 7, amount: 2200, status: 'paid', dueDate: '2023-05-03' },
  ];

  // Function to filter invoices by status
  const filterInvoices = (status) => {
    return invoices.filter(invoice => invoice.status === status);
  };

  const handleViewInvoice = (invoice) => {
    // Instead of setting selectedInvoice, we'll send a message to the content script
    window.parent.postMessage({ type: "SHOW_INVOICE_MODAL", invoice }, '*');
  };

  const handleDownloadInvoice = (invoice) => {
    // Implement download logic here
    console.log(`Downloading invoice #${invoice.id}`);
  };

  const renderInvoiceItem = (invoice) => (
    <InvoiceItem key={invoice.id} status={invoice.status}>
      <span>Invoice #{invoice.id} - ₹{invoice.amount.toLocaleString()}</span>
      <div>
        <IconButton onClick={() => handleViewInvoice(invoice)}>
          <FaEye />
        </IconButton>
        <IconButton onClick={() => handleDownloadInvoice(invoice)}>
          <FaDownload />
        </IconButton>
      </div>
    </InvoiceItem>
  );

  return (
    <Container>
      <Title>Invoice Overview</Title>
      
      <Grid>
        <InvoiceSection>
          <SectionTitle color="#4CAF50">Sent Invoices</SectionTitle>
          <InvoiceList>
            {filterInvoices('sent').map(renderInvoiceItem)}
          </InvoiceList>
        </InvoiceSection>

        <InvoiceSection>
          <SectionTitle color="#FFC107">Unpaid Invoices</SectionTitle>
          <InvoiceList>
            {filterInvoices('unpaid').map(renderInvoiceItem)}
          </InvoiceList>
        </InvoiceSection>

        <InvoiceSection>
          <SectionTitle color="#F44336">Overdue Invoices</SectionTitle>
          <InvoiceList>
            {filterInvoices('overdue').map(renderInvoiceItem)}
          </InvoiceList>
        </InvoiceSection>

        <InvoiceSection>
          <SectionTitle color="#2196F3">Paid Invoices</SectionTitle>
          <InvoiceList>
            {filterInvoices('paid').map(renderInvoiceItem)}
          </InvoiceList>
        </InvoiceSection>
      </Grid>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
   /* Scrollbar styles */
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
    border: 2px solid #f1f1f1;
  }
  
  &:hover {
    scrollbar-color: #555 #f1f1f1;
    
    &::-webkit-scrollbar-thumb {
      background-color: #555;
    }
  }
`;

const InvoiceSection = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: ${props => props.color};
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const InvoiceList = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
  
`;

const InvoiceItem = styled.li`
  background-color: white;
  border-left: 4px solid ${props => {
    switch(props.status) {
      case 'sent': return '#4CAF50';
      case 'unpaid': return '#FFC107';
      case 'overdue': return '#F44336';
      case 'paid': return '#2196F3';
      default: return '#333';
    }
  }};
  margin-bottom: 8px;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
  color: #333;
  font-size: 1rem;

  &:hover {
    color: #0056b3;
  }
`;

export default InvoiceOverview;
