export const downloadAuditReport = (documentId: number) => {
    const link = document.createElement("a");
    link.href = `http://localhost:8000/api/audit-report/${documentId}/`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };
