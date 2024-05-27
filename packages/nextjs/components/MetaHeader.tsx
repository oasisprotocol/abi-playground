import React from "react";
import Head from "next/head";

type MetaHeaderProps = {
  title?: string;
  description?: string;
  twitterCard?: string;
  children?: React.ReactNode;
};

export const MetaHeader = ({
  title = "ABI Ninja",
  description = "Interact with any contract on Ethereum",
  twitterCard = "summary_large_image",
  children,
}: MetaHeaderProps) => {
  return (
    <Head>
      {title && (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      )}
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
      {children}
    </Head>
  );
};
