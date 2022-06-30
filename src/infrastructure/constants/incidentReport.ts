export enum INCIDENT_REPORT_STATUS {
  CREATED = 'Created', // Incident report is created
  IN_PROGRESS = 'In_progress', // Incident report handling is in process
  CLOSED = 'Closed', // Incident report is handled and closed
  DECLINED = 'Declined', // Room is vacant due to service issues
}
