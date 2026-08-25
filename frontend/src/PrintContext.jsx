import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import SchemePrintView from './SchemePrintView';

// Global print context for managing which scheme to print
const PrintContext = createContext(null);

export function PrintProvider({ children }) {
  const [printData, setPrintData] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const printTimeoutRef = useRef(null);

  const printScheme = (schemeData, language) => {
    // Set the scheme data to print
    setPrintData({ ...schemeData, language });

    // Set printing flag immediately
    setIsPrinting(true);

    // Wait for React to commit the render with isPrinting=true
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Verify content exists before printing
        const printRoot = document.getElementById('print-root');
        if (!printRoot || printRoot.children.length === 0) {
          console.error('Print root is empty - print aborted');
          setIsPrinting(false);
          return;
        }

        // Open print dialog - this blocks until dialog closes
        window.print();

        // DO NOT set isPrinting to false here!
        // The afterprint handler will clean up
      });
    });
  };

  // Clean up after print dialog closes
  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
      // Optional: clear print data after a brief delay
      if (printTimeoutRef.current) clearTimeout(printTimeoutRef.current);
      printTimeoutRef.current = setTimeout(() => {
        setPrintData(null);
      }, 100);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
      if (printTimeoutRef.current) clearTimeout(printTimeoutRef.current);
    };
  }, []);

  return (
    <PrintContext.Provider value={{ printScheme }}>
      {children}
      <PrintPortal data={printData} isPrinting={isPrinting} />
    </PrintContext.Provider>
  );
}

export function usePrint() {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error('usePrint must be used within PrintProvider');
  }
  return context;
}

// Portal component that renders into #print-root
function PrintPortal({ data, isPrinting }) {
  const printRoot = document.getElementById('print-root');

  if (!printRoot || !data) return null;

  return createPortal(
    <div className={`print-portal-content ${isPrinting ? 'is-printing' : ''}`}>
      <SchemePrintView
        scheme={data.scheme}
        eligibility_status={data.eligibility_status}
        matched_criteria={data.matched_criteria}
        missing_information={data.missing_information}
        failed_criteria={data.failed_criteria}
        language={data.language || 'en'}
      />
    </div>,
    printRoot
  );
}
