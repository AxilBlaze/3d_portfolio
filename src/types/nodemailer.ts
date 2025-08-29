declare module 'nodemailer' {
  type Transporter = {
    sendMail: (mail: unknown) => Promise<unknown>;
  };

  export function createTransport(config: unknown): Transporter;

  const _default: {
    createTransport: typeof createTransport;
  };
  export default _default;
}
