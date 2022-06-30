export enum PAYMENT_STATUS {
  CREATED = 'created', // Initial status, the payment is created and waiting to be paid
  PENDING = 'pending', // Payment is sent to bank and waiting to be processed
  FAILED = 'failed', // The payment failed
  SUCCEEDED = 'succeeded', // The payment went through successfully
}
