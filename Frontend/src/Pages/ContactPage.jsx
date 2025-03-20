import { PhoneCall, Mail } from 'lucide-react' // Importing icons

const ContactButtons = ({ phoneNumber, email }) => {
  return (
    <div className="mt-5 flex flex-col gap-4 md:flex-row">
      {/* Contact Now - Redirects to Phone Call */}
      <a
        href={`tel:${phoneNumber}`}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 md:w-40"
      >
        <PhoneCall size={18} /> {/* Call Icon */}
        {phoneNumber}
      </a>

      {/* Send Mail - Redirects to Email */}
      <a
        href={`mailto:${email}`}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 py-2 text-blue-600 transition hover:bg-blue-100 md:w-40"
      >
        <Mail size={18} /> {/* Mail Icon */}
        {email}
      </a>
    </div>
  )
}

export default ContactButtons
