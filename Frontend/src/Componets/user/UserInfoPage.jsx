import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Headphones, Shield, User } from "lucide-react";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const pageContent = {
  English: {
    backToDashboard: "Back to Dashboard",
    userArea: "User Area",
    user: "User",
    support: {
      title: "Help & Support",
      description:
        "This page gives users a dedicated place to understand where to get help for bookings, payments, and account questions.",
      sections: [
        {
          heading: "Booking Help",
          body:
            "If a user needs help with show timings, seat selection, cancellations, or ticket confirmation, this page can explain the process clearly.",
        },
        {
          heading: "Payment Support",
          body:
            "If a payment is pending or failed, guide the user to check transaction status, retry the payment, or contact support with the booking details.",
        },
        {
          heading: "Contact Guidance",
          body:
            "You can later replace this text with your real support email, phone number, live chat link, or ticketing workflow.",
        },
      ],
    },
    privacy: {
      title: "Privacy & Security",
      description:
        "This page explains account safety, data visibility, and how the system stores local user preferences such as theme and app language.",
      sections: [
        {
          heading: "Account Protection",
          body:
            "Users should keep their password private, avoid sharing login details, and log out from shared devices after booking tickets.",
        },
        {
          heading: "Data Awareness",
          body:
            "The current frontend stores some preferences in local storage so the user experience remains consistent after refresh.",
        },
        {
          heading: "Security Tips",
          body:
            "Use strong passwords, review booking activity regularly, and reset credentials if there is any suspicious access.",
        },
      ],
    },
    notifications: {
      title: "Notifications",
      description:
        "This page gives users context about what notifications they can expect from the system and how those updates help them manage bookings.",
      sections: [
        {
          heading: "Booking Updates",
          body:
            "Notifications can be used for booking confirmation, show reminders, payment status, and cancellation updates.",
        },
        {
          heading: "Activity Alerts",
          body:
            "The dashboard can surface useful signals such as favourites, upcoming releases, and recent activity that the user may want to revisit.",
        },
        {
          heading: "Future Controls",
          body:
            "You can later extend this page with real notification preferences such as email alerts, push settings, or reminder toggles.",
        },
      ],
    },
  },
  Hindi: {
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    userArea: "यूज़र एरिया",
    user: "यूज़र",
    support: {
      title: "मदद और सहायता",
      description:
        "यह पेज यूज़र को बुकिंग, पेमेंट और अकाउंट से जुड़े सवालों के लिए मदद पाने की स्पष्ट जगह देता है।",
      sections: [
        {
          heading: "बुकिंग सहायता",
          body:
            "अगर यूज़र को शो टाइम, सीट चयन, कैंसलेशन या टिकट कन्फर्मेशन में मदद चाहिए, तो यह पेज प्रक्रिया को साफ़ तरीके से समझा सकता है।",
        },
        {
          heading: "पेमेंट सहायता",
          body:
            "अगर पेमेंट लंबित है या असफल हुआ है, तो यूज़र को ट्रांजैक्शन स्टेटस जांचने, फिर से भुगतान करने या बुकिंग विवरण के साथ सहायता लेने के लिए मार्गदर्शन दें।",
        },
        {
          heading: "संपर्क मार्गदर्शन",
          body:
            "बाद में आप इस टेक्स्ट को अपने असली सपोर्ट ईमेल, फोन नंबर, लाइव चैट लिंक या टिकटिंग वर्कफ़्लो से बदल सकते हैं।",
        },
      ],
    },
    privacy: {
      title: "गोपनीयता और सुरक्षा",
      description:
        "यह पेज अकाउंट सुरक्षा, डेटा दृश्यता और थीम व ऐप भाषा जैसी लोकल यूज़र प्राथमिकताओं की जानकारी देता है।",
      sections: [
        {
          heading: "अकाउंट सुरक्षा",
          body:
            "यूज़र को अपना पासवर्ड निजी रखना चाहिए, लॉगिन विवरण साझा नहीं करना चाहिए और साझा डिवाइस से उपयोग के बाद लॉगआउट करना चाहिए।",
        },
        {
          heading: "डेटा जानकारी",
          body:
            "वर्तमान फ्रंटएंड कुछ प्राथमिकताएँ लोकल स्टोरेज में रखता है ताकि रिफ्रेश के बाद अनुभव एक जैसा रहे।",
        },
        {
          heading: "सुरक्षा सुझाव",
          body:
            "मजबूत पासवर्ड रखें, बुकिंग गतिविधि नियमित रूप से देखें और किसी भी संदिग्ध एक्सेस पर तुरंत पासवर्ड बदलें।",
        },
      ],
    },
    notifications: {
      title: "सूचनाएं",
      description:
        "यह पेज यूज़र को बताता है कि सिस्टम से कौन-कौन सी सूचनाएं मिल सकती हैं और वे बुकिंग प्रबंधन में कैसे मदद करती हैं।",
      sections: [
        {
          heading: "बुकिंग अपडेट",
          body:
            "सूचनाओं का उपयोग बुकिंग कन्फर्मेशन, शो रिमाइंडर, पेमेंट स्टेटस और कैंसलेशन अपडेट के लिए किया जा सकता है।",
        },
        {
          heading: "गतिविधि अलर्ट",
          body:
            "डैशबोर्ड पसंदीदा फिल्में, आने वाली रिलीज़ और हाल की गतिविधि जैसे उपयोगी संकेत दिखा सकता है।",
        },
        {
          heading: "भविष्य के नियंत्रण",
          body:
            "बाद में आप इस पेज में ईमेल अलर्ट, पुश सेटिंग्स या रिमाइंडर टॉगल जैसे वास्तविक नोटिफिकेशन नियंत्रण जोड़ सकते हैं।",
        },
      ],
    },
  },
  Marathi: {
    backToDashboard: "डॅशबोर्डवर परत जा",
    userArea: "युजर एरिया",
    user: "युजर",
    support: {
      title: "मदत आणि सपोर्ट",
      description:
        "हे पेज युजरला बुकिंग, पेमेंट आणि अकाउंटसंबंधी मदत मिळवण्यासाठी वेगळी स्पष्ट जागा देते.",
      sections: [
        {
          heading: "बुकिंग मदत",
          body:
            "जर युजरला शो टाइम, सीट निवड, कॅन्सलेशन किंवा तिकीट पुष्टीकरणाबद्दल मदत हवी असेल तर हे पेज प्रक्रिया स्पष्टपणे समजावू शकते.",
        },
        {
          heading: "पेमेंट मदत",
          body:
            "जर पेमेंट प्रलंबित असेल किंवा अयशस्वी झाले असेल, तर युजरला व्यवहार स्थिती तपासणे, पुन्हा पेमेंट करणे किंवा बुकिंग तपशीलासह मदत घेणे यासाठी मार्गदर्शन देता येईल.",
        },
        {
          heading: "संपर्क मार्गदर्शन",
          body:
            "नंतर तुम्ही हा मजकूर तुमच्या खऱ्या सपोर्ट ईमेल, फोन नंबर, लाईव्ह चॅट लिंक किंवा तिकिटिंग वर्कफ्लोने बदलू शकता.",
        },
      ],
    },
    privacy: {
      title: "गोपनीयता आणि सुरक्षा",
      description:
        "हे पेज अकाउंट सुरक्षितता, डेटा दृश्यता आणि थीम व ऍप भाषा अशा लोकल युजर पसंतींची माहिती देते.",
      sections: [
        {
          heading: "अकाउंट संरक्षण",
          body:
            "युजरने आपला पासवर्ड खाजगी ठेवावा, लॉगिन तपशील शेअर करू नये आणि शेअर्ड डिव्हाइसवरून वापर झाल्यावर लॉगआउट करावे.",
        },
        {
          heading: "डेटा माहिती",
          body:
            "सध्याचा फ्रंटएंड काही पसंती लोकल स्टोरेजमध्ये ठेवतो, त्यामुळे रिफ्रेशनंतरही अनुभव तसाच राहतो.",
        },
        {
          heading: "सुरक्षा टिप्स",
          body:
            "मजबूत पासवर्ड वापरा, बुकिंग अ‍ॅक्टिव्हिटी नियमित तपासा आणि संशयास्पद प्रवेश दिसल्यास लगेच पासवर्ड बदला.",
        },
      ],
    },
    notifications: {
      title: "सूचना",
      description:
        "हे पेज युजरला सिस्टममधून कोणत्या सूचना मिळू शकतात आणि त्या बुकिंग व्यवस्थापनात कशा मदत करतात हे सांगते.",
      sections: [
        {
          heading: "बुकिंग अपडेट्स",
          body:
            "सूचना बुकिंग पुष्टीकरण, शो रिमाइंडर, पेमेंट स्टेटस आणि कॅन्सलेशन अपडेटसाठी वापरता येतात.",
        },
        {
          heading: "अ‍ॅक्टिव्हिटी अलर्ट्स",
          body:
            "डॅशबोर्ड आवडते चित्रपट, येऊ घातलेल्या रिलीज आणि अलीकडील अ‍ॅक्टिव्हिटीसारखे उपयुक्त संकेत दाखवू शकतो.",
        },
        {
          heading: "भविष्यातील नियंत्रण",
          body:
            "नंतर तुम्ही या पेजमध्ये ईमेल अलर्ट, पुश सेटिंग्स किंवा रिमाइंडर टॉगलसारखी खरी सूचना नियंत्रणं जोडू शकता.",
        },
      ],
    },
  },
};

const pageIcons = {
  support: Headphones,
  privacy: Shield,
  notifications: Bell,
};

export default function UserInfoPage({ pageKey }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const dark = localStorage.getItem("appTheme") === "dark";
  const { appLanguage } = useAppLanguage();
  const languageContent = pageContent[appLanguage] || pageContent.English;
  const content = languageContent[pageKey] || languageContent.support;
  const Icon = pageIcons[pageKey] || Headphones;

  return (
    <div className={dark ? "min-h-screen bg-gray-950 text-white" : "min-h-screen bg-gray-100 text-black"}>
      <header
        className={`border-b px-6 py-4 ${
          dark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/user")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              dark ? "bg-gray-900 hover:bg-gray-800" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <ArrowLeft size={16} />
            {languageContent.backToDashboard}
          </button>

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white">
              <User size={18} />
            </span>
            <div className="text-right">
              <p className={`text-xs uppercase tracking-[0.25em] ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {languageContent.userArea}
              </p>
              <p className="font-semibold">{user?.name || languageContent.user}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section
          className={`mb-8 rounded-3xl border p-8 shadow-sm ${
            dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
          }`}
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white">
            <Icon size={26} />
          </div>
          <h1 className="text-3xl font-bold">{content.title}</h1>
          <p className={`mt-4 max-w-3xl text-sm leading-6 ${dark ? "text-gray-300" : "text-gray-600"}`}>
            {content.description}
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {content.sections.map((section) => (
            <article
              key={section.heading}
              className={`rounded-3xl border p-6 shadow-sm ${
                dark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
              }`}
            >
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              <p className={`mt-3 text-sm leading-6 ${dark ? "text-gray-300" : "text-gray-600"}`}>
                {section.body}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
