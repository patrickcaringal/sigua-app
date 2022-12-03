import React from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";

export default function AlertDialog({ open, onAccept, onClose }) {
  const handleAccept = () => {
    onAccept();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Terms and Conditions</DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ wordBreak: "break-word" }}>
            {terms.map((i, idx) => {
              const titleNode = (
                <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>
                  {i.title}
                </Typography>
              );

              const contentNodes = i.content.map((j, j_idx) => (
                <Typography key={j_idx} variant="body2" sx={{ mb: 1 }}>
                  {j}
                </Typography>
              ));

              return (
                <>
                  {titleNode}
                  {contentNodes}
                  {idx !== terms.length - 1 && <Divider sx={{ my: 3 }} />}
                </>
              );
            })}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAccept} size="small" variant="contained">
          accpet
        </Button>
        <Button onClick={handleClose} size="small">
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const terms = [
  {
    title: "TERMS AND CONDITION OF USE",
    content: [
      `Welcome to Sigua-Medical-Clinic, a website located at
        https://sigua-medical-clinic.vercel.app/ (the "Site"). Sigua
        Medical Clinic provides the Site and services provided through the
        Site (Collectively the "Services") including software that manages
        customer queues. These Terms of Use ("Agreement") set forth the
        legally binding terms for your use of the Services.`,
      `By accessing or using the Services, you are accepting this
        Agreement and you represent and warrant that you have the right,
        authority, and capacity to enter into this Agreement. If you do
        not agree with all of the provisions of this Agreement, do not
        access and/or use the Services.`,
      `By accepting our Privacy Policy and Terms of Use you consent to
        our collection, storage, use and disclosure of your personal and
        other information as described in this Privacy Policy.`,
    ],
  },
  {
    title: "PRIVACY POLICY",
    content: [
      `Sigua Medical Clinic (the "Site") values and respects your right
      to privacy. We are committed to protect the privacy of our website
      visitors. We will only collect, record, store, process, and use
      your personal information in accordance with the Data Privacy Act
      of 2012, its Implementing Rules and Regulations, the issuance by
      the National Privacy Commission, and other pertinent laws.`,
    ],
  },
  {
    title: "TYPES OF DATA WE COLLECT",
    content: [
      `We collect “Non-Personal Information” and “Personal Information.”
      Non-Personal Information includes information that cannot be used to
      personally identify you, such as anonymous usage data, general
      demographic information we may collect, referring/exit pages and
      URLs, platform types, preferences you submit and preferences that
      are generated based on the data you submit and number of clicks.
      “Personal Information” means data that allows someone to identify or
      contact you, including, for example, your name, address, phone
      number, as well as any other non-public information about you that
      is associated with or linked to any of the foregoing data.`,
      `Our collection and processing of your information is based on
      different contexts: our performance of a contract, our obligations
      under law, our legitimate interest in conducting our business,
      protection of a natural person’s vital interests and/or upon your
      consent.`,
    ],
  },
  {
    title: "ACCOUNT CREATION",
    content: [
      `In order to use certain features of the Services, you must register
      for an account with us ("your Account") and provide certain
      information about yourself as prompted by the registration form to
      verified. You represent and warrant that: (a) all required
      registration information you submit is truthful and accurate; (b)
      you will maintain the accuracy of such information. We reserve the
      right to delete your Account at any moment, for any reason, if you
      make a direct request to us. We may suspend or terminate your
      Account in accordance with the Terms and Termination.`,
    ],
  },
  {
    title: "ACCOUNT RESPONSIBILITIES",
    content: [
      `You are responsible for maintaining the confidentiality of your
      Account login information and are fully responsible for all activities
      that occur under your Account. You agree to immediately notify us of
      any unauthorized use, or suspected unauthorized use, of your Account
      or any other breach of security. We cannot and will not be liable for
      any loss or damage arising from your failure to comply with the above
      requirements.`,
      `Information You Provide to Us The information we collect on or through
      the Services and Site may include information you provide to us under
      the following circumstances: `,
      `• We may collect Personal Information
      from you, such as your first and last name, phone number and password
      when you create an account to log in to our Site (“Account”).`,
      `• We retain information on your behalf, such as files and feedbacks that
      you store using your Account.`,
      `• If you provide us feedback or contact
      us via e-mail, we will collect your name and e-mail address, as well
      as any other content included in the e-mail, in order to send you a
      reply and evaluate your inquiry.`,
      `• When you participate in one of our
      surveys, we may collect additional information that you provide.`,
    ],
  },
  {
    title: "USE OF PERSONAL INFORMATION",
    content: [
      `This Privacy Policy describes how we use and process Personal
      Information as a Controller, as defined by the Data Privacy Act of
      2012 In general, Personal Information you submit to us is used either
      to respond to requests that you make, or to aid us in serving you
      better. We use your Personal Information in the following ways:`,
      `• provide the Services you request and fulfill any purpose for which
      you provide it;`,
      `• to facilitate the creation of and secure and enable your use of your Account;`,
      `• identify you as a user in our systems;`,
      `• provide improved administration of our Services;`,
      `• improve the quality of experience when you interact with our Services;`,
      `• to send announcements, surveys, offers, and other promotional materials related to our Services;`,
      `• In any other way we may describe when you provide the information; and`,
      `• For any other purpose with your consent.`,
    ],
  },
  {
    title: "ACCESS, CORRECTION, DELETION",
    content: [
      `Typically, we retain your personal information for the period necessary to provide you with access to the Site and to otherwise fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.  In addition, we may keep your Personal Information as needed to comply with our legal obligations, resolve disputes, and/or enforce our agreements.  The precise periods for which we keep your Personal Information vary depending on the nature of the information and why we need it.  `,
      `We respect your privacy rights and provide you with reasonable access to the Personal Information that you may have provided through your use of the Services. If you wish to request to access or amend any other Personal Information we hold about you, or to request that we delete any information about you that we have obtained from our Services, you may contact us at: Sigua Medical Clinic, Banay-Banay, Lakeside Village, City of Cabuyao, Laguna 4025 (sigua.clinic2022app@gmail.com)`,
      `At your valid request, we will have any reference to you deleted or blocked in our database. You may update and correct your Account information and preferences at any time by accessing your Account settings page on the profile. Please note that while any changes you make will be reflected in active user databases instantly or within a reasonable period of time, we may retain all information you submit for backups, archiving, prevention of fraud and abuse, analytics, satisfaction of legal obligations, and/or where we otherwise reasonably believe that we have a legitimate reason to do so.`,
      `You may decline to share certain Personal Information with us, in which case we may not be able to provide to you some of the features and functionality of the Services and Site. At any time, you may object to the processing of your Personal Information, on legitimate grounds, except if otherwise permitted by applicable law.`,
    ],
  },
  {
    title: "ACCEPTABLE USE POLICY",
    content: [
      `Your permission to use the Services is conditioned upon the following Use Restrictions and Conduct Restrictions: You agree that you will not under any circumstances:`,
      `• post any information that is abusive, threatening, obscene, defamatory, libelous, or racially, sexually, religiously, or otherwise objectionable and offensive;
      `,
      `• use the service for any unlawful purpose or for the promotion of illegal activities;`,
      `• attempt to, or harass, abuse or harm another person or group;`,
      `• use another user's account without permission;`,
      `• provide false or inaccurate information when registering an account;`,
      `• interfere or attempt to interfere with the proper functioning of the Service;`,
      `• make any automated use of the system, or take any action that we deem to impose or to potentially impose an unreasonable or disproportionately large load on our servers or network infrastructure;`,
      `• use the Site or any of its contents to advertise or solicit, for any commercial purpose or to compete, directly or indirectly, with our Service;`,
      `• bypass any robot exclusion headers or other measures we take to restrict access to the Service or use any software, technology, or device to scrape, spider, or crawl the Service or harvest or manipulate data; or`,
      `• publish or link to malicious content intended to damage or disrupt another user's browser or computer`,
    ],
  },
  {
    title: "CONSENT TO RECEIVE SMS MESSAGING",
    content: [
      `When using the Service, User consents to receive customized communications from Business via SMS messaging to notify User concerning wait times. You acknowledge that Sigua Medical Clinic has no involvement, control, or liability for the messages received from the Business. Business is solely responsible for creating custom messaging to its User. Sigua Medical Clinic also has no liability or control over Business contacting User outside of our platform's messaging Service.`,
    ],
  },
  {
    title: "COMPLIANCE WITH APPLICABLE LAWS",
    content: [
      `You must use the Services in a lawful manner, and must obey all laws, rules, and regulations ("Laws") applicable to your use of the Service. As applicable, this may include compliance with domestic and international Laws related to notification and consumer protection, unfair competition, privacy, and false advertising, and any other relevant Laws.`,
    ],
  },
  {
    title: "DISCLAIMERS",
    content: [
      `THE SERVICES, INCLUDING THE SITE, ARE PROVIDED "AS-IS" AND "AS AVAILABLE" AND WE EXPRESSLY DISCLAIM ANY WARRANTIES AND CONDITIONS OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING THE WARRANTIES OR CONDITIONS OF BUSINESSES ABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, OR NON-INFRINGEMENT. WE MAKE NO WARRANTY THAT THE SERVICES: (a) WILL MEET YOUR REQUIREMENTS; (b) WILL BE AVAILABLE ON AN UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS; (c) WILL BE ACCURATE, RELIABLE, FREE OF VIRUSES OR OTHER HARMFUL CODE, COMPLETE, LEGAL, OR SAFE OR (d) THAT THE SERVICES WILL BE TO YOUR SATISFACTION. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES, SO THE ABOVE EXCLUSION MAY NOT APPLY TO YOU.`,
    ],
  },
  {
    title: "TERM AND TERMINATION",
    content: [
      `Subject to this Section, this Agreement will remain in full force and effect while you use the Services. We may (a) suspend your rights to use the Site (including your Account) or (b) terminate this Agreement, at any time for any reason at our sole discretion, including for any use of the Services in violation of this Agreement. Upon termination of this Agreement, your Account and right to access and use the Services will terminate immediately. You understand that any termination of your Account involves deletion of your User Content from our live databases. We will not have any liability whatsoever to you for any termination of this Agreement, including for termination of your Account or deletion of your User Content. Upon termination of this Agreement, all of the provisions will terminate except those that by their nature should survive.`,
    ],
  },
  {
    title: "CHANGES TO AGREEMENT",
    content: [
      `Any significant changes to this Agreement will be effective 30 days after posting such notice. Continued use of our Site  or Services following notice of such changes will indicate your acknowledgement of such changes and agreement to be bound by the terms and conditions of such changes.`,
    ],
  },
  {
    title: "COPYRIGHT/TRADEMARK INFORMATION",
    content: [
      `Copyright © 2022 Sigua Medical Clinic All rights reserved. All trademarks, logos and service marks ("Marks") displayed on the Site are our property. You are not permitted to use these Marks without our prior written consent or the consent of such third party which may own the Marks.`,
      `Contact Information: Sigua Medical Clinic Email: sigua.clinic2022app@gmail.com`,
      `Last Updated: December 2, 2022.`,
    ],
  },
];
