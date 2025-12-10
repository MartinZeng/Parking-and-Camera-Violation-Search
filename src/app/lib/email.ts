// lib/email.ts
type TicketRow = {
  summonsNumber: string;
  plate: string;
  state: string;
  issueDate: string;
  violation: string;
  fineAmount: number;
};

export async function sendNewTicketEmail(args: {
  email: string;
  plate: string;
  state: string;
  ticket: TicketRow;
}) {
  const { email, plate, state, ticket } = args;

  // For now, just log – replace with real email provider later
  console.log('--- EMAIL (FAKE) ---');
  console.log(`To: ${email}`);
  console.log(`Subject: New NYC ticket for ${plate} (${state})`);
  console.log(
    `Body: A new ticket appeared. Summons: ${ticket.summonsNumber}, Date: ${ticket.issueDate}, Violation: ${ticket.violation}, Amount: $${ticket.fineAmount.toFixed(
      2,
    )}`,
  );
  console.log('--------------------');
}
