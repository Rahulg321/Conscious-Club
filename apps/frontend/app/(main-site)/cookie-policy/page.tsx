import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | ConsciousClubb",
  description:
    "Learn how ConsciousClubb uses cookies and similar technologies, and how you can control them.",
};

export default function Page() {
  return (
    <div className="block-space narrow-container space-y-8 md:space-y-10">
      <h1>Cookie Policy</h1>
      <p className="text-sm text-muted-foreground">
        Last updated: September 24, 2025
      </p>
      <hr className="my-8 border-border" />

      <p>
        This Cookie Policy explains how ConsciousClubb (“we,” “us,” or “our”)
        uses cookies and similar technologies to recognize you when you visit
        our website at{" "}
        <a
          className="underline underline-offset-4"
          href="https://consciousclubb.com"
        >
          consciousclubb.com
        </a>{" "}
        ("Website"). It explains what these technologies are and why we use
        them, as well as your rights to control our use of them.
      </p>

      <p>
        In some cases we may use cookies to collect personal information, or
        that becomes personal information if we combine it with other
        information.
      </p>

      <hr className="my-8 border-border" />

      <h2>What are cookies?</h2>
      <p>
        Cookies are small data files that are placed on your computer or mobile
        device when you visit a website. Cookies are widely used by website
        owners in order to make their websites work, or to work more
        efficiently, as well as to provide reporting information.
      </p>
      <p>
        Cookies set by the website owner (in this case, ConsciousClubb) are
        called **“first-party cookies.”** Cookies set by parties other than the
        website owner are called **“third-party cookies.”** Third-party cookies
        enable third-party features or functionality to be provided on or
        through the website (e.g., advertising, interactive content, and
        analytics).
      </p>

      <hr className="my-8 border-border" />

      <h2>Why do we use cookies?</h2>
      <p>
        We use first- and third-party cookies for several reasons. Some cookies
        are required for technical reasons in order for our Website to operate,
        and we refer to these as **“essential”** or **“strictly necessary”**
        cookies. Other cookies also enable us to track and target the interests
        of our users to enhance the experience on our Online Properties. Third
        parties serve cookies through our Website for advertising, analytics,
        and other purposes.
      </p>

      <hr className="my-8 border-border" />

      <h2>How can I control cookies?</h2>
      <p>
        You have the right to decide whether to accept or reject cookies. You
        can exercise your cookie rights by setting your preferences in the
        **Cookie Consent Manager**. The Cookie Consent Manager allows you to
        select which categories of cookies you accept or reject. Essential
        cookies cannot be rejected as they are strictly necessary to provide you
        with services.
      </p>
      <p>
        If you choose to reject cookies, you may still use our website though
        your access to some functionality and areas may be restricted. You may
        also set or amend your web browser controls to accept or refuse cookies.
      </p>

      <hr className="my-8 border-border" />

      <h2>How can I control cookies on my browser?</h2>
      <p>
        As the means by which you can refuse cookies through your web browser
        controls vary from browser to browser, you should visit your browser's
        help menu for more information. The following is information about how
        to manage cookies on the most popular browsers:
      </p>
      <ul>
        <li>Chrome</li>
        <li>Internet Explorer</li>
        <li>Firefox</li>
        <li>Safari</li>
        <li>Edge</li>
        <li>Opera</li>
      </ul>
      <p>
        In addition, most advertising networks offer you a way to opt out of
        targeted advertising. If you would like to find out more information,
        please visit:
      </p>
      <ul>
        <li>Digital Advertising Alliance</li>
        <li>Digital Advertising Alliance of Canada</li>
        <li>European Interactive Digital Advertising Alliance</li>
      </ul>

      <hr className="my-8 border-border" />

      <h2>What about other tracking technologies, like web beacons?</h2>
      <p>
        Cookies are not the only way to recognize or track visitors to a
        website. We may use other, similar technologies from time to time, like
        **web beacons** (sometimes called "tracking pixels" or "clear gifs").
      </p>

      <hr className="my-8 border-border" />

      <h2>Do you serve targeted advertising?</h2>
      <p>
        Third parties may serve cookies via our Website. These cookies enable
        such third parties to serve ads to you about products and services that
        may interest you.
      </p>

      <hr className="my-8 border-border" />

      <h2>How often will you update this Cookie Policy?</h2>
      <p>
        We may update this Cookie Policy from time to time in order to reflect,
        for example, changes to the cookies we use or for other operational,
        legal, or regulatory reasons. Please therefore revisit this Cookie
        Policy regularly to stay informed about our use of cookies and related
        technologies.
      </p>
      <p>
        The date at the top of this Cookie Policy indicates when it was last
        updated.
      </p>

      <hr className="my-8 border-border" />

      <h2>Where can I get further information?</h2>
      <p>
        If you have any questions about our use of cookies or other
        technologies, please email us at{" "}
        <a
          className="underline underline-offset-4"
          href="mailto:info@ravisi.ms"
        >
          info@ravisi.ms
        </a>
      </p>
    </div>
  );
}
