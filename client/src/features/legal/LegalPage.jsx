import { useNavigate } from "react-router-dom";
import BigButton from "../../components/BigButton";

const pages = {
  about: {
    title: "About PLU Mobi",
    content: `PLU Mobi is the official digital platform of the Patriotic League of Uganda.

Our mission is to make membership open, verifiable, and accountable for every Ugandan at home and abroad.

The app was built under the open participation model — anyone can join at any time, verify a membership, endorse, help others register, and report corruption. No Patriotic Officer gate exists anywhere.`,
  },
  privacy: {
    title: "Privacy Policy",
    content: `What we collect:
- Your name, phone number, and district when you register.
- Your email (optional) for self-service PIN recovery.
- Optional photo for your digital membership card.

How we use it:
- To create and verify your membership.
- To allow you to sign in with your phone number and 6-digit PIN.

What we never do:
- Sell your data.
- Share it with third parties without your consent.
- Store your PIN in plain text (we hash it).

You can request deletion of your data at any time by contacting support@plu-mobi.ug.`,
  },
  terms: {
    title: "Terms of Service",
    content: `By using PLU Mobi you agree to:

1. Provide accurate information about yourself or the person you are helping.
2. Never impersonate another person.
3. Use the corruption reporting channel honestly — false reports are a breach of these terms.

Registration is free and open to all Ugandans and members of the diaspora.`,
  },
  faq: {
    title: "Frequently Asked Questions",
    content: `Q: Is registration free?
A: Yes, always.

Q: Do I need a Patriotic Officer to join?
A: No. Anyone can register themselves or help a friend.

Q: How do I reset my PIN?
A: Click "Forgot PIN" on the sign-in page. A reset token will be emailed if you have an email on file.

Q: Can I help someone else register?
A: Yes. Sign in and click "Help register" on your dashboard.

Q: How do I verify a membership?
A: Open the Verify page and enter a PC number, or scan the QR code on any digital card.

Q: How do I install PLU Mobi on my phone?
A: Open the site in your browser and tap "Add to Home Screen" (iPhone) or "Install app" (Android).`,
  },
};

export default function LegalPage({ type }) {
  const nav = useNavigate();
  const page = pages[type] || pages.about;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-black/5">
            <img
              src="/plu-logo-circle.png"
              alt="PLU"
              className="h-10 w-10 rounded-full object-cover border-2 border-plu-yellow"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-extrabold text-plu-black">PLU Mobi</span>
              <span className="text-[10px] text-plu-yellow font-semibold">Patriotic League of Uganda</span>
            </div>
          </div>
      <BigButton variant="outline" onClick={() => nav(-1)}>⬅️ Back</BigButton>
      <div className="bg-white rounded-card p-6 space-y-3">
        <h1 className="text-2xl font-bold">{page.title}</h1>
        <p className="text-sm text-plu-slate whitespace-pre-line leading-relaxed">{page.content}</p>
      </div>
    </div>
  );
}

